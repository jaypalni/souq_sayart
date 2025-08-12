import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import TermsAndConditions from "./pages/termsAndconditions";
import Captcha from "./pages/captcha";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRouterContent = () => {
  const location = useLocation();
  const hidebannerList = [
    "/carDetails",
    "/sell",
    "/allcars",
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
    "/termsAndconditions",
    "/captchatoken",
  ];

  const hidefooterList = ["/captchatoken"];

  
  const hideBanner =
    hidebannerList.includes(location.pathname) ||
    location.pathname.startsWith("/carDetails/");

  const hideFooter = hidefooterList.includes(location.pathname);

  return (
    <>
      {!hideFooter && <Header />}
      {!hideBanner && <Banner />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/verifyOtp" element={<SignupOtp />} />
        <Route path="/createProfile" element={<CreateProfile />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/carDetails/:id" element={<CarDetails />} />
        <Route path="/allcars" element={<AllCars />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route
          path="/termsAndconditions"
          element={<TermsAndConditions />}
        />
        <Route path="/captchatoken" element={<Captcha />} />
        
        {/* Protected Routes */}
        <Route 
          path="/sell" 
          element={
            <ProtectedRoute>
              <Sell />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/myListings" 
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/myProfile/*" 
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
};

const AppRouter = () => (
  <Router>
    <AppRouterContent />
  </Router>
);

export default AppRouter;
