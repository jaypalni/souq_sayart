/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { authAPI } from '../../services/api';

export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const CUSTOMER_DETAILS_REQUEST = 'CUSTOMER_DETAILS_REQUEST';
export const CUSTOMER_DETAILS_SUCCESS = 'CUSTOMER_DETAILS_SUCCESS';
export const CUSTOMER_DETAILS_FAILURE = 'CUSTOMER_DETAILS_FAILURE';
export const CUSTOMER_DETAILS_UPDATE = 'CUSTOMER_DETAILS_UPDATE';
export const CUSTOMER_DETAILS_CLEAR = 'CUSTOMER_DETAILS_CLEAR';

export const loginRequest = () => ({
  type: AUTH_LOGIN_REQUEST,
});

export const loginSuccess = (user, token, phoneNumber) => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: { user, token, phoneNumber },
});

export const loginFailure = (error) => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: AUTH_LOGOUT,
});

export const customerDetailsRequest = () => ({
  type: CUSTOMER_DETAILS_REQUEST,
});

export const customerDetailsSuccess = (customerDetails) => ({
  type: CUSTOMER_DETAILS_SUCCESS,
  payload: customerDetails,
});

export const setPhoneLogin = (phone_login) => ({
  type: 'SET_PHONE_LOGIN',
  payload: phone_login,
});

export const initializePhoneLogin = () => ({
  type: 'INITIALIZE_PHONE_LOGIN',
  payload: localStorage.getItem('phone_login'),
});

export const initializeToken = () => {
  const token = localStorage.getItem('token');
  return {
    type: 'INITIALIZE_TOKEN',
    payload: token,
  };
};

export const setToken = (token) => {
  return {
    type: 'SET_TOKEN',
    payload: token,
  };
};

export const customerDetailsFailure = (error) => ({
  type: CUSTOMER_DETAILS_FAILURE,
  payload: error,
});

export const updateCustomerDetails = (customerDetails) => ({
  type: CUSTOMER_DETAILS_UPDATE,
  payload: customerDetails,
});

export const clearCustomerDetails = () => ({
  type: CUSTOMER_DETAILS_CLEAR,
});

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await authAPI.login(credentials);
    const { user, token } = response.data;
    // localStorage.setItem('token', token);

    // Extract phone number from user data or credentials
    const phoneNumber = user?.phone_number || credentials?.phone_number || null;
    dispatch(loginSuccess(user, token, phoneNumber));
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    try {
      await authAPI.logout();
    } catch (apiError) {
      
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear Redux state
    dispatch(logout());
    dispatch({ type: CUSTOMER_DETAILS_CLEAR });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(customerDetailsRequest());
    const response = await authAPI.register(userData);
    const apiData = response.data;
    
    // Store the same data as login/OTP verification
    if (apiData.access_token) {
      dispatch(setToken(apiData.access_token));
    }
    
    // Get user data from response
    const user = apiData.user || apiData;
    const phoneNumber = user.phone_number || userData.phone_number;
    
    // Store user data in both customerDetails and auth
    dispatch(customerDetailsSuccess(user));
    dispatch(loginSuccess(user, apiData.access_token, phoneNumber));
    
    // Store phone number in Redux
    if (phoneNumber) {
      dispatch(setPhoneLogin(phoneNumber));
    }
    
    return { success: true, data: user };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch(customerDetailsFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const verifyOTP = (otpData) => async (dispatch) => {
  try {
    dispatch(customerDetailsRequest());

    const response = await authAPI.verifyOtp(otpData);
    const apiData = response.data;

    // Check if the API response indicates success (status_code 200)
    if (apiData.status_code === 200) {
      // Store token and user data
      dispatch(setToken(apiData.access_token));
      
      // If user data exists, store it; otherwise create a minimal user object
      if (apiData.user) {
        dispatch(customerDetailsSuccess(apiData.user));
        dispatch(loginSuccess(apiData.user, apiData.access_token, apiData.user.phone_number));
        // Store phone number in Redux for resend functionality
        if (apiData.user.phone_number) {
          dispatch(setPhoneLogin(apiData.user.phone_number));
        }
      } else {
        // Create minimal user object for unregistered users
        const phoneNumber = otpData.phone_number || 'unknown';
        
        const minimalUser = {
          phone_number: phoneNumber,
          is_registered: apiData.is_registered || false
        };
        
        dispatch(customerDetailsSuccess(minimalUser));
        dispatch(loginSuccess(minimalUser, apiData.access_token, phoneNumber));
        // Store phone number in Redux for resend functionality
        dispatch(setPhoneLogin(phoneNumber));
      }

      return { success: true, data: apiData, message: apiData.message };
    } else {
      // Handle non-200 status codes
      const errorMessage = apiData.message || 'OTP verification failed';
      dispatch(customerDetailsFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'OTP verification failed';
    dispatch(customerDetailsFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};