import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import LoginScreen from "./pages/LoginScreen";
import SignupOtp from "./pages/signupOtp";
import AllCars from "./pages/allcars";
import Header from "./components/header";
import MyProfile from "./pages/myProfile";
import MyListings from "./pages/mylistings";
import Footer from "./components/footer";
import Banner from "./components/banner";
import CreateProfile from "./pages/createProfile";
import Landing from "./pages/landing";
import CarDetails from "./pages/carDetails";
import Sell from "./pages/sell";
import UserProfile from "./pages/userProfile";

// Example protected page (replace with your real pages)
const HomePage = () => <div>Home Page (Protected)</div>;

const ProtectedRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.userData?.isLogin);
  return isLogin ? children : <Navigate to="/" replace />;
};

const AppRouterContent = () => {
  const isLogin = useSelector((state) => state.userData?.isLogin);
  const location = useLocation();
  const hidebannerList = [
    "/carDetails",
    "/sell",
    "/allCars",
    "/myListings",
    "/myProfile",
    "/userProfile",
    "/myProfile/notifications",
    "/myProfile/searches",
    "/myProfile/subscriptions",
    "/myProfile/messages",
    "/myProfile/payments",
    "/myProfile/blocked",
    "/myProfile/dashboard",
    "/myProfile/favorites",
  ];

  console.log("s666", location.pathname);
  const hideBanner =
    hidebannerList.includes(location.pathname) ||
    location.pathname.startsWith("/carDetails/");

  return (
    <>
      <Header />
      {!hideBanner && <Banner />}
      <Routes>
        {!isLogin && (
          <>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/verifyOtp" element={<SignupOtp />} />
            <Route path="/createProfile" element={<CreateProfile />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/carDetails/:id" element={<CarDetails />} />
            <Route path="/myProfile/*" element={<MyProfile />} />
            <Route path="/allCars" element={<AllCars />} />
            <Route path="/myListings" element={<MyListings />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/userProfile" element={<UserProfile />} />
          </>
        )}
        {isLogin && (
          <>
            {/* Add your protected routes here */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/createProfile" element={<CreateProfile />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/carDetails" element={<CarDetails />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/allCars" element={<AllCars />} />
            <Route path="/myListings" element={<MyListings />} />
            {/* Example: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/userProfile" element={<UserProfile />} />
          </>
        )}
      </Routes>
      <Footer />
    </>
  );
};

const AppRouter = () => (
  <Router>
    <AppRouterContent />
  </Router>
);

export default AppRouter;
