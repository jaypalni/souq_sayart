/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import axios from 'axios';
import API_CONFIG from '../config/api.config';
import { getValidTokenFromRedux } from '../utils/tokenSync';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useSelector } from 'react-redux';
const HTTP_STATUS = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
  

if (!API_CONFIG.BASE_URL) {
  throw new Error(
    'API base URL is not configured. Please set REACT_APP_API_URL in your .env file',
  );
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const publicApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    let token = null;
    let store = null;
    
    try {
      // Import store dynamically to avoid circular dependency
      store = require('../redux/store').default;
      const state = store.getState();
      
      // Get token directly from Redux state
      token = state.auth?.token;
      
      // Validate token
      if (token && token !== 'undefined' && token !== 'null' && token !== '' && token.trim().length > 0) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
    } catch (error) {
      console.error('Failed to get Redux store:', error);
    }
    
    return config;
  },
  (error) => Promise.reject(new Error(error.message || 'Request error')),
);

// Helper function to show login message and clear all Redux states
const showLoginMessageAndClearStates = (store) => {
  try {
    // Import message dynamically to avoid circular dependency
    const { message } = require('antd');
    message.error('Please try to login');
  } catch (error) {
    console.error('Failed to show message:', error);
  }
  
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('userData');
  localStorage.removeItem('customerDetails');
  
  try {
    // Dispatch logout action to clear auth Redux state
    const { logout } = require('../redux/actions/authActions');
    store.dispatch(logout());
    
    // Clear customer details Redux state
    const { clearCustomerDetails } = require('../redux/actions/authActions');
    store.dispatch(clearCustomerDetails());
  } catch (error) {
    console.error('Failed to clear Redux states:', error);
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        // ✅ Dynamically get Redux store to access refresh token
        const store = require('../redux/store').default;
        const state = store.getState();
        const refresh_token = state.auth?.refresh_token;

        if (refresh_token) {
          try {
            // Call refresh token API directly
            await refreshtokenapi();
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError.message);
            // Show login message and clear all Redux states
            showLoginMessageAndClearStates(store);
          }
        } else {
          // Show login message and clear all Redux states
          showLoginMessageAndClearStates(store);
        }
      }
    }

    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error('API request failed'));
  },
);

const refreshtokenapi = async () => {
  try {
    // ✅ Dynamically import the Redux store to avoid circular dependency
    const store = require('../redux/store').default;
    const state = store.getState();

    // ✅ Get refresh_token from Redux state
    const refresh_token = state.auth?.refresh_token;

    if (!refresh_token) {
      throw new Error('Refresh token is missing.');
    }
    
    // ✅ Call refresh token API
    const response = await axios.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {}, {
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refresh_token}`,
      },
    });

    // ✅ Process response
    const data1 = handleApiResponse(response);

    if (data1 && data1.access_token) {
      // ✅ Dispatch action to update Redux state with new access token
      const { refreshTokenSuccess } = require('../redux/actions/authActions');
      store.dispatch(refreshTokenSuccess(data1.access_token));
      
      return data1.access_token;
    } else {
      throw new Error('Invalid response from refresh token API');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    
    // Handle 404 specifically - endpoint might not exist
    if (errorData.status === 404) {
      // Show login message and clear all Redux states
      const store = require('../redux/store').default;
      showLoginMessageAndClearStates(store);
      throw new Error('Token refresh not supported. Please login again.');
    }
    
    // Show login message and clear all Redux states
    const store = require('../redux/store').default;
    showLoginMessageAndClearStates(store);
    
    throw errorData;
  }
};



export const authAPI = {
  login: (credentials) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
  resendotp: (credentials) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.RESENDOTP, credentials),
  register: (userData) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
  forgotPassword: (email) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  resetPassword: (data) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data),
  verifyOtp: (otpData) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP, otpData),
  countrycode: () => publicApi.get(API_CONFIG.ENDPOINTS.AUTH.COUNTRY_CODE),
  uploadimages: (formData) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.UPLOAD_DOCUMENTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  refresh: () =>
    api.get(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN),
};

export const carAPI = {
  getAllCars: (params) =>
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_ALL, { params }),
  getCarById: (id) => api.get(API_CONFIG.ENDPOINTS.CARS.GET_BY_ID(id)),
  // getMylistingCars: (filter, page) =>
  //   api.get(API_CONFIG.ENDPOINTS.CARS.GET_CAR_MYLISTINGS(filter, page)),
getMylistingCars: (type, filter, page) =>
  api.get(API_CONFIG.ENDPOINTS.CARS.GET_CAR_MYLISTINGS(type, filter, page)),
  createCar: (data) => {
    console.log('API: createCar called with data:', data);
    if (data && typeof data === 'object' && 'car_id' in data) {
      console.log('API: This is an update request');
      console.log('API: Kilometers field:', data.kilometers);
    } else {
      console.log('API: This is a create request (FormData)');
    }
    return api.post(API_CONFIG.ENDPOINTS.CARS.CREATE, data);
  },
  saveDraftCar: () => api.post(API_CONFIG.ENDPOINTS.CARS.SAVE_DRAFT),
  updateCar: (id, data) => api.post(API_CONFIG.ENDPOINTS.CARS.UPDATE(id), data),
  deleteCar: (id) => api.delete(API_CONFIG.ENDPOINTS.CARS.DELETE(id)),
  uploadOptionDetails: () =>
    api.get(API_CONFIG.ENDPOINTS.CARS.UPLOAD_OPTION_DETAILS),
  trimDetails: (make, modalName, yearData) =>
    api.get(API_CONFIG.ENDPOINTS.CARS.TRIM_DETAILS(make, modalName, yearData)),
  trimDetailsFilter: (make, modalName) =>
    api.get(API_CONFIG.ENDPOINTS.CARS.TRIM_DETAILS_FILTERS(make, modalName)),
  uploadImages: (formData) =>
    api.post(API_CONFIG.ENDPOINTS.CARS.UPLOAD_IMAGES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getCarOptions: () => api.get(API_CONFIG.ENDPOINTS.CARS.GET_CAR_OPTIONS),
  getCarFeatures: () =>
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_CAR_FEATURES),
  getCarRecommended: () =>
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_CAR_RECOMMENDED),
  getCarSpecs: () => api.get(API_CONFIG.ENDPOINTS.CARS.GET_CAR_SPECS),
  getMakeCars: () => publicApi.get(API_CONFIG.ENDPOINTS.CARS.GET_MAKE_CARS),
  getModelCars: (make) =>
    publicApi.get(API_CONFIG.ENDPOINTS.CARS.GET_MODEL_CARS(make)),
  getYearData: (make, modalName) =>
    publicApi.get(API_CONFIG.ENDPOINTS.CARS.GET_YEAR_CARS(make, modalName)),
  getBodyCars: () =>
    publicApi.get(API_CONFIG.ENDPOINTS.CARS.GET_BODY_TYPE_CARS),
  getLocationCars: () =>
    publicApi.get(API_CONFIG.ENDPOINTS.CARS.GET_LOCATION_CARS),
  getSearchCars: async (params) => {
    try {
      return await api.post(API_CONFIG.ENDPOINTS.CARS.POST_SEARCH_CARS, params);
    } catch (error) {
      // If 422 error, try with public API as fallback
      if (error.response?.status === 422) {
        return await publicApi.post(API_CONFIG.ENDPOINTS.CARS.POST_SEARCH_CARS, params);
      }
      throw error;
    }
  },
  searchCars: async (params) => {
    try {
      return await api.post('/api/search/search', params);
    } catch (error) {
      // If 422 error, try with public API as fallback
      if (error.response?.status === 422) {
        return await publicApi.post('/api/search/search', params);
      }
      throw error;
    }
  },
  postsavesearches: async (searchparams) => {
    return await api.post(API_CONFIG.ENDPOINTS.CARS.POST_SAVE_SEARCHES, searchparams);
  },
  getsavedsearches: async (page, limit) => {
    return await api.get(API_CONFIG.ENDPOINTS.CARS.GET_SAVED_SEARCHES(page, limit));
  },
  termsAndConditions: () =>
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_TERM_AND_CONDITIONS),
  totalcarscount: () => 
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_CARS_TOTALCOUNT),
  gethorsepower: () => 
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_HORSE_POWER),
  postuploadcarimages: (formData, type = 'car') =>
  api.post(
    `${API_CONFIG.ENDPOINTS.CARS.GET_CAR_IMAGES_UPLOAD}?type=${type}`,
    formData, // ✅ Sending form data
    {
      headers: {
        'Content-Type': 'multipart/form-data', // ✅ Required for file uploads
      },
    }
  ),

};

export const userAPI = {
  getProfile: () => api.get(API_CONFIG.ENDPOINTS.USER.PROFILE),
  updateProfile: (data) =>
    api.post(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, data),
  changePassword: (data) =>
    api.put(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, data),
  getFavorites: (page, limit) =>
    api.get(API_CONFIG.ENDPOINTS.USER.GET_FAVORITES(page, limit)),
  addFavorite: (carId) =>
  api.post(API_CONFIG.ENDPOINTS.USER.ADD_FAVORITE(carId)), 
  removeFavorite: (carId) =>
    api.delete(API_CONFIG.ENDPOINTS.USER.REMOVE_FAVORITE(carId)),
  savedSearches: async (page, limit) => {
    return await api.get(API_CONFIG.ENDPOINTS.USER.GET_SAVEDSEARCHES(page, limit));
  },
  getsubscriptions: () => api.get(API_CONFIG.ENDPOINTS.USER.GET_SUBSCRIPTIONS),
  getPackageDetails: (packageId) => api.get(`/api/subscriptions/packages/${packageId}`),
  subscribe: (subscriptionData) => api.post(API_CONFIG.ENDPOINTS.USER.SUBSCRIBE, subscriptionData),
  getDelete: () => api.post(API_CONFIG.ENDPOINTS.USER.GET_DELETE),
  getDeleteOtp: (credentials) => api.post(API_CONFIG.ENDPOINTS.USER.POST_DEELETE_OTP, credentials),
  changephonenumber: (credentials) =>
    api.post(API_CONFIG.ENDPOINTS.USER.POST_CHANGE_PHONENUMBER, credentials),
  chnagenumberverifyOtp: (otpData) =>
    api.post(API_CONFIG.ENDPOINTS.USER.POST_VERIFYOTP_CHANGENUMBER, otpData),
  deleteSavedSearch: async (id) => {
    return await api.delete(API_CONFIG.ENDPOINTS.USER.DELETE_SAVED_SEARCH(id));
  },
  notifySavedSearch: async (id, body) => {
    return await api.put(API_CONFIG.ENDPOINTS.USER.NOTIFY_SAVED_SEARCH(id), body);
  },

};

export default api; 
