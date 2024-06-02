import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { Subscription } from "@/types/types";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function loadScript(src: any) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | undefined>();

  const [open, setOpen] = useState<boolean>(false);
  const [dialogHeader, setDialogHeader] = useState<string>(
    "Waiting for Confirmation"
  );
  const [dialogData, setDialogData] = useState({
    subscriptionStatus: "hold on",
    paymentStatus: "hold on",
  });
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [plans, setPlans] = useState<any>([]);

  useEffect(() => {
    const getPlans = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/plan/all`,
          { withCredentials: true }
        );
        setPlans(data.plans);
      } catch (error) {
        console.log(error);
      }
    };
    getPlans();
    const fetchSubscription = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/sub/subscription/user`,
          { withCredentials: true }
        );
        setSubscription(data.subscription);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubscription();
  }, []);

  const handlePayment = async (id: string) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const { data }: { data: any } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/sub/new`,
        { id },
        config
      );
      if (!data) {
        toast.error("Failed to Execute Payment");
      }
      const options = {
        key: data.key,
        currency: "INR",
        name: "VCards App",
        description: "just fine",
        subscription_id: data.subscriptions_id,
        handler: async function (response: any) {
          setOpen(true);
          const { data }: { data: any } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/sub/capture`,
            response,
            config
          );
          if (
            data.subscriptionStatus === "active" &&
            data.paymentStatus === "captured"
          ) {
            setDialogHeader("Redirecting to Dashboard...");
            setDialogData({
              subscriptionStatus: "active",
              paymentStatus: "captured",
            });
            toast.success("All set");
            setTimeout(() => {
              setOpen(false);
              navigate("/dashboard");
            }, 3000);
          } else {
            setDialogHeader("An Error Occured");
            setDialogData({
              subscriptionStatus: "pending",
              paymentStatus: "pending",
            });
            toast.error("Error hain bhai, tu baith hum dekh lenge");
            setTimeout(() => {
              setOpen(false);
            }, 3000);
          }
        },
        prefill: {
          email: user?.email,
        },
        timeout: 120,
        readonly: {
          email: user?.email,
          name: user?.name,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razor = new (window as any).Razorpay(options);
      razor.on("payment.failed", function (response: any) {
        console.log(response.error.description);
        console.log(response.error.metadata.order_id);
        console.log(response.error.metadata.payment_id);
        toast.info(response.error.description);
      });
      razor.open();
      console.log("clicked");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div className="flex justify-center mt-[1rem]">
        <h1 className="text-3xl font-semibold font-Philosopher">
          Subscriptions
        </h1>
      </div>
      {!user?.isVerified ? (
        <>
        <div className="flex justify-center">
          <div className="font-Philosopher mt-[2rem] underline text-red-400">
            <Link to="/profile">
              Go to your Profile and verify your Email
            </Link>
          </div>
        </div>
        </>
      ) : (
        <>
        <div className="md:flex md:justify-center">
        <div className="flex flex-col justify-center md:justify-center items-center md:w-[60%] lg:w-[100%]">
          <div className="w-full flex justify-center">
            <div className="pt-4 w-full flex flex-col md:flex-col lg:flex-row justify-center items-center lg:w-[60%] lg:gap-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {dialogHeader}
                    </DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <p>Payment Status: {dialogData.paymentStatus}</p>
                    <p>Subscription Status: {dialogData.subscriptionStatus}</p>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {plans.map((plan: any, index: number) => (
                <div
                  className="border-2 border-blue-500 shadow-xl p-2 py-4 rounded-xl w-[90%] my-2"
                  key={index}
                >
                  {subscription?.planId._id === plan._id && (
                    <>
                      <span className="relative -top-[1.8rem] left-4 bg-blue-300 text-blue-500 font-Philosopher font-bold px-2 py-1 text-sm">
                        active
                      </span>
                    </>
                  )}
                  <div className="flex flex-row py-4">
                    <div className="basis-1/2 flex justify-end lg:justify-start lg:pl-4 font-Kanit ">
                      <div className="">
                        <p className="text-2xl font-bold">{plan?.name}</p>
                        <div className="">
                          <p className="text-blue-400 bg-blue-200 px-1 py-1 rounded-lg">
                            Plan Validity: 30 Days
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="basis-1/2">
                      <div className="">
                        <div className="font-Kanit text-lg flex justify-end pr-4 text-slate-400">
                          Price
                        </div>
                        <div className="font-Kanit text-xl flex justify-end pr-4 text-black">
                          Rs.200
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row font-Kanit pl-3">
                    <div className="basis-2/5 flex justify-start pl-2">
                      Plan ID:
                    </div>
                    <div className="basis-3/5 flex justify-start pl-2">
                      {plan?.razorPlanId}
                    </div>
                  </div>
                  <div className="flex flex-row font-Kanit pl-3">
                    <div className="basis-2/5 flex justify-start pl-2">
                      VCards Allowed:
                    </div>
                    <div className="basis-3/5 flex justify-start pl-2">
                      {plan?.cards}
                    </div>
                  </div>
                  <div className="flex flex-row font-Kanit pl-3">
                    <div className="basis-2/5 flex justify-start pl-2">
                      Period:
                    </div>
                    <div className="basis-3/5 flex justify-start pl-2">
                      {plan?.period}
                    </div>
                  </div>
                  <div className="w-full py-3 flex justify-center">
                    <button
                      className="w-[90%] py-2 bg-blue-500 text-white rounded-sm font-Kanit hover:cursor-pointer hover:bg-blue-400"
                      // onClick={() => handlePayment(plan?.razorPlanId)}
                      onClick={() => {
                        navigate("/checkout");
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
      
    </>
  );
};

export default SubscriptionPage;
