import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { userExist, userNotExist } from "./redux/reducer/userReducer";

import Header from "./components/rest/header";
import Loader from "./components/rest/loader";
import ProtectedRoute from "./components/rest/protected-route";

const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const NotFound = lazy(() => import("./pages/not-found"));
const Dashboard = lazy(() => import("./pages/dash"));
const Profile = lazy(() => import("./pages/profile"));
const Plans = lazy(() => import("./pages/plans"));
const Verify = lazy(() => import("./pages/verify"));
const ResetPassword = lazy(() => import("./pages/reset-password"));
const Confirm = lazy(() => import("./pages/confirm"));
const Subscription = lazy(() => import("./pages/subscription"));
const AdminPlan = lazy(() => import("./pages/admin-plan"));

const AllCards = lazy(() => import ("./pages/all-cards"));
const ViewCard = lazy(() => import ("./pages/view-card"));
const DisplayCard = lazy(() => import ("./pages/display-card"));

const CreateTree = lazy(() => import("./pages/tree/create-tree"));
const InputVCard = lazy(() => import("./pages/personal/input-vcard"));
const MedicalInput = lazy(() => import("./pages/medical/medical-input"));
const CreatorInput = lazy(() => import("./pages/creator/creator-input"));
const CreateAnimal = lazy(() => import("./pages/animal/create-animal"));

// const Checkout = lazy(() => import ("./pages/checkout"));

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserResponse } from "./types/api-types";
import axios from "axios";
import ErrorBoundary from "./components/rest/error-boundary";

const App = () => {

    let location = useLocation();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );

    const dispatch = useDispatch();

    const gotUser = async () => {
        try {
            const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/me`, { withCredentials: true });
            dispatch(userExist(data.user));
        } catch (error: any) {
            dispatch(userNotExist());
        }
    }

    useEffect(() => {
        gotUser();
    }, [location.pathname]);

    return (
        loading ? (
            <Loader />
        ) : (
            <div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <Header user={user} />
                <ErrorBoundary>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route path="/" element={<Home user={user} />} />
                            <Route path="/sub" element={<Subscription />} />
                            <Route path="/display" element={<DisplayCard />} />
                        
                            {/* Not logged In Route */}
                            <Route
                                path="/login"
                                element={
                                    <ProtectedRoute isAuthenticated={user ? false : true}>
                                        <Login />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <ProtectedRoute isAuthenticated={user ? false : true}>
                                        <Register />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/reset"
                                element={
                                    <ProtectedRoute isAuthenticated={user ? false : true}>
                                        <ResetPassword />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Logged In User Routes */}
                            <Route
                                element={<ProtectedRoute isAuthenticated={user ? true : false} />}
                            >
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/plans" element={<Plans />} />
                                <Route path="/verify" element={<Verify />} />
                                <Route path="/confirm" element={<Confirm />} />
                                <Route path="/admin-plan" element={<AdminPlan />} />

                                <Route path="/dashboard/cards" element={<AllCards />} />
                                <Route path="/dashboard/cards/card" element={<ViewCard />} />

                                <Route path="/dashboard/tree/create" element={<CreateTree />} />
                                <Route path="/dashboard/personal/create" element={<InputVCard />} />
                                <Route path="/dashboard/medical/create" element={<MedicalInput />} /> 
                                <Route path="/dashboard/creator/create" element={<CreatorInput />} />
                                <Route path="/dashboard/animal/create" element={<CreateAnimal />} />

                                {/* <Route path="/pay" element={<Checkout />} /> */}
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
            </div>
        )
    )
}

export default App;