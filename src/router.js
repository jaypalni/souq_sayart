/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initializePhoneNumber, initializeToken } from './redux/actions/authActions';
import LoginScreen from './pages/LoginScreen';
import SignupOtp from './pages/signupOtp';
import AllCars from './pages/allcars';
import Header from './components/header';
import MyListings from './pages/mylistings';
import MyProfile from './pages/myProfile';
import Footer from './components/footer';
import Banner from './components/banner';
import CreateProfile from './pages/createProfile';
import Landing from './pages/landing';
import CarDetails from './pages/carDetails';
import NewSell from './pages/newsell';
import UserProfile from './pages/userProfile';
import TermsAndConditions from './pages/termsAndconditions';
import Captcha from './pages/captcha';
import ChangePhoneNumberPage from './pages/changePhoneNumber';
import DeleteAccount from './components/deleteaccount';
import ChangePhoneOtpPage from './pages/changePhoneOtp';
import ProtectedRoute from './components/ProtectedRoute';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRouterContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Initialize token and phone number from localStorage on app startup
  useEffect(() => {
    dispatch(initializeToken());
    dispatch(initializePhoneNumber());
  }, [dispatch]);
  const hidebannerList = [
    '/carDetails',
    '/newsell',
    '/allcars',
    '/myListings',
    '/myProfile',
    '/userProfile',
    '/myProfile/notifications',
    '/myProfile/searches',
    '/myProfile/subscriptions',
    '/myProfile/messages',
    '/myProfile/payments',
    '/myProfile/blocked',
    '/myProfile/dashboard',
    '/myProfile/favorites',
    '/myProfile/change-phone',
    '/myProfile/change-phone-otp',
    '/termsAndconditions',
    '/captchatoken',
    '/deleteaccount-otp',
  ];

  const hidefooterList = ['/captchatoken'];

  
  const hideBanner =
    hidebannerList.includes(location.pathname) ||
    location.pathname.startsWith('/carDetails/');

  const hideFooter = hidefooterList.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!hideFooter && <Header />}
      {!hideBanner && <Banner />}
      <Routes>
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
      
         <Route 
          path="/newsell" 
          element={
            <ProtectedRoute>
              <NewSell />
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
        <Route 
          path="/myProfile/change-phone" 
          element={
            <ProtectedRoute>
              <ChangePhoneNumberPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/myProfile/change-phone-otp" 
          element={
            <ProtectedRoute>
              <ChangePhoneOtpPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/deleteaccount-otp" 
          element={
            <ProtectedRoute>
              <DeleteAccount />
            </ProtectedRoute>
          } 
        />
      
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