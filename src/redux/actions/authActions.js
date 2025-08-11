import { authAPI } from "../../services/api";

// Action Types
export const AUTH_LOGIN_REQUEST = "AUTH_LOGIN_REQUEST";
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

// Customer Details Action Types
export const CUSTOMER_DETAILS_REQUEST = "CUSTOMER_DETAILS_REQUEST";
export const CUSTOMER_DETAILS_SUCCESS = "CUSTOMER_DETAILS_SUCCESS";
export const CUSTOMER_DETAILS_FAILURE = "CUSTOMER_DETAILS_FAILURE";
export const CUSTOMER_DETAILS_UPDATE = "CUSTOMER_DETAILS_UPDATE";
export const CUSTOMER_DETAILS_CLEAR = "CUSTOMER_DETAILS_CLEAR";

// Action Creators
export const loginRequest = () => ({
  type: AUTH_LOGIN_REQUEST,
});

export const loginSuccess = (user, token) => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: { user, token },
});

export const loginFailure = (error) => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: AUTH_LOGOUT,
});

// Customer Details Action Creators
export const customerDetailsRequest = () => ({
  type: CUSTOMER_DETAILS_REQUEST,
});

export const customerDetailsSuccess = (customerDetails) => ({
  type: CUSTOMER_DETAILS_SUCCESS,
  payload: customerDetails,
});

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

// Thunk Actions
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await authAPI.login(credentials);
    const { user, token } = response.data;
    // Store token in localStorage
    localStorage.setItem("token", token);

    dispatch(loginSuccess(user, token));
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    // Call logout API if available
    try {
      await authAPI.logout();
    } catch (apiError) {
     
    }
    
    // Clear all localStorage data
    localStorage.clear();
    
    // Clear auth state
    dispatch(logout());
    
    // Clear customer details
    dispatch({ type: CUSTOMER_DETAILS_CLEAR });
    
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Customer Details Thunk Actions
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(customerDetailsRequest());
    const response = await authAPI.register(userData);
    const customerDetails = response.data.user || response.data;
    
    dispatch(customerDetailsSuccess(customerDetails));
    return { success: true, data: customerDetails };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    dispatch(customerDetailsFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const verifyOTP = (otpData) => async (dispatch) => {
  try {

    dispatch(customerDetailsRequest());
 
    
    const response = await authAPI.verifyOtp(otpData);
    
    const customerDetails = response.data.user || response.data;
    
    dispatch(customerDetailsSuccess(customerDetails));
    
    return { success: true, data: customerDetails };
  } catch (error) {
    console.error("verifyOTP error:", error);
    const errorMessage = error.response?.data?.message || "OTP verification failed";
    dispatch(customerDetailsFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};
