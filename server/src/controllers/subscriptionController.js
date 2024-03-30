import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { instance } from "../server.js";
import Plan from "../models/planModel.js";
import crypto from "crypto";
import Subscription from "../models/subscriptionModel.js";
import Transaction from "../models/transactionModel.js";
import User, { roleEnum } from "../models/userModel.js";

export const createSubscription = catchAsyncErrors(async (req, res, next) => {
    
    const user = await User.findById(req.user.id);

    if (user.role === roleEnum.ADMIN) {
        return next(new ErrorHandler("Admin don't need to buy Plans", 403))
    }

    if (!user.customerId) {
        const customer = await instance.customers.create({
            name: user.name,
            email: user.email,
            fail_existing: 0,
        });
        await User.findByIdAndUpdate(req.user.id, { customerId: customer.id }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    }
    
    const subscriptions = await instance.subscriptions.create({
        plan_id: req.body.id,
        total_count: 12,
        quantity: 1,
        customer_notify: 0,
    });

    const plan = await Plan.findOne({ razorPlanId: req.body.id });

    await Subscription.create({
        planId: plan._id,
        razorSubscriptionId: subscriptions.id,
        start: 0,
        end: 0,
        nextBilling: 0,
        totalCount: 0,
        paidCount: 0,
        remainingCount: 0,
        shortUrl: subscriptions.short_url,
        status: "created",
        user: req.user.id,
    });

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        subscriptions_id: subscriptions.id,
        customer_id: user.customerId,
    });
});

export const cancelSubscription = catchAsyncErrors( async (req, res, next) => {
    await instance.subscriptions.cancel(req.body.subscriptionId);

    res.status(200).json({
        success: true,
        message: "Subscription Cancelled"
    });
});

export const testSubscription = async (req, res, next) => {
    const secret = "12345678";

    const expectedSigntaure = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex")

    try { 
        if (expectedSigntaure === req.headers['x-razorpay-signature']) {
            const { id, start_at, end_at, charge_at, total_count, paid_count, remaining_count, status, current_start, current_end } = req.body.payload.subscription.entity;
            const subscription = await Subscription.findOne({ razorSubscriptionId: id });
            subscription.start = start_at * 1000;
            subscription.end = end_at * 1000;
            subscription.nextBilling = charge_at * 1000;
            subscription.totalCount = total_count;
            subscription.paidCount = paid_count;
            subscription.remainingCount = remaining_count;
            subscription.status = status;
            await subscription.save();

            if (req.body.event === "subscription.charged") {
                await Transaction.create({
                    amount: Number(req.body.payload.payment.entity.amount / 100),
                    start: current_start * 1000,
                    end: current_end * 1000,
                    status,
                    user: subscription.user,
                });
            }
            // switch (req.body.event) {
            //     case "subscription.authenticated":
            //         break;
            //     case "subscription.activated":
            //         break;
            //     case "subscription.charged":
            //         break;
            //     case "subscription.halted":
            //         break;
            //     case "subscription.completed":
            //         break;
            //     case "subscription.pending":
            //         break;
            //     case "subscription.cancelled":
            //         break;
            //     case "subscription.paused":
            //         break;
            //     case "subscription.resumed":
            //         break;
            //     default:
            //         break;
            // }
        }
    } catch (error) {
        console.log(error.message)
    }

    res.status(200).send('OK');
};

