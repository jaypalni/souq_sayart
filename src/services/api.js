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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      console.log('Error News', error.response)
      // Handle authentication errors
      if (status === 401) {
         console.log('No Token');

        // ✅ Dynamically get Redux store to access refresh token
        const store = require('../redux/store').default;
        const state = store.getState();
        const refresh_token = state.auth?.refresh_token;

        if (refresh_token) {
          // Call refresh token API
          refreshtokenapi();
        } else {
          console.error('Refresh token missing in Redux store');
        }
        // Token may be invalid or expired
      } else if (status === 422) {
        // Request data may be invalid or missing required fields
      } else if (status === HTTP_STATUS.FORBIDDEN) {
        // Access forbidden
      } else if (status === HTTP_STATUS.NOT_FOUND) {
        // Resource not found
      } else if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
       //network error
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
    console.log('New RT', refresh_token);

    if (!refresh_token) {
      throw new Error('Refresh token is missing.');
    }

    // ✅ Call refresh token API
    const response = await axios.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refresh_token}`,
      },
    });

    // ✅ Process response
    const data1 = handleApiResponse(response);

    // ✅ Save new access token
    localStorage.setItem('token', data1.access_token);
    console.log('New Token', data1.access_token);

    return data1.access_token;
  } catch (error) {
    const errorData = handleApiError(error);
    console.error('Error refreshing token:', errorData);
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
  createCar: (data) => api.post(API_CONFIG.ENDPOINTS.CARS.CREATE, data),
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
