/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import axios from 'axios';
import API_CONFIG from '../config/api.config';

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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      if (status === HTTP_STATUS.FORBIDDEN) {
        console.info('Access forbidden (403)');
      } else if (status === HTTP_STATUS.NOT_FOUND) {
        console.info('Resource not found (404)');
      } else if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        console.info('Internal server error (500)');
      } else {
        console.info(`HTTP error (${status})`);
      }
    } else if (error.request) {
      console.info('No response received from server');
    } else {
      console.info('Request setup failed', error.message);
    }

    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error('API request failed'));
  },
);

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
  refresh: (credentials) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, credentials),
};

export const carAPI = {
  getAllCars: (params) =>
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_ALL, { params }),
  getCarById: (id) => api.get(API_CONFIG.ENDPOINTS.CARS.GET_BY_ID(id)),
  getMylistingCars: (page, limit, status) =>
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_CAR_MYLISTINGS(page, limit, status)),
  createCar: (data) => api.post(API_CONFIG.ENDPOINTS.CARS.CREATE, data),
  saveDraftCar: () => api.post(API_CONFIG.ENDPOINTS.CARS.SAVE_DRAFT),
  updateCar: (id, data) => api.put(API_CONFIG.ENDPOINTS.CARS.UPDATE(id), data),
  deleteCar: (id) => api.delete(API_CONFIG.ENDPOINTS.CARS.DELETE(id)),
  uploadOptionDetails: () =>
    api.get(API_CONFIG.ENDPOINTS.CARS.UPLOAD_OPTION_DETAILS),
  trimDetails: (make, modalName, yearData) =>
    api.get(API_CONFIG.ENDPOINTS.CARS.TRIM_DETAILS(make, modalName, yearData)),
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
  getSearchCars: (params) =>
    api.post(API_CONFIG.ENDPOINTS.CARS.POST_SEARCH_CARS, params),
  postsavesearches: (searchparams) =>
    api.post(API_CONFIG.ENDPOINTS.CARS.POST_SAVE_SEARCHES, searchparams),
  getsavedsearches: (page, limit) =>
    api.get(API_CONFIG.ENDPOINTS.CARS.GET_SAVED_SEARCHES(page, limit)),
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
  savedSearches: (page, limit) =>
    api.get(API_CONFIG.ENDPOINTS.USER.GET_SAVEDSEARCHES(page, limit)),
  getsubscriptions: () => api.get(API_CONFIG.ENDPOINTS.USER.GET_SUBSCRIPTIONS),
  getDelete: () => api.post(API_CONFIG.ENDPOINTS.USER.GET_DELETE),
  getDeleteOtp: () => api.post(API_CONFIG.ENDPOINTS.USER.GET_DEELETE_OTP),
    changephonenumber: (credentials) =>
    api.post(API_CONFIG.ENDPOINTS.USER.POST_CHANGE_PHONENUMBER, credentials),
      chnagenumberverifyOtp: (otpData) =>
    api.post(API_CONFIG.ENDPOINTS.USER.POST_VERIFYOTP_CHANGENUMBER, otpData),
};

export default api;
