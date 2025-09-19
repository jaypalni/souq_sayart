/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    CARS: {
      UPLOAD_OPTION_DETAILS: 'api/cars/upload-option-details',
      TRIM_DETAILS: (make, modalName, yearData) =>
        `/api/cars/trims?make_name=${make}&model_name=${modalName}&year=${yearData}`,
       TRIM_DETAILS_FILTERS: (make, modalName) =>
        `/api/cars/trims?make_name=${make}&model_name=${modalName}`,
      GET_ALL: '/api/cars/list',
      GET_BY_ID: (id) => `/api/cars/details/${id}`,
  //    GET_CAR_MYLISTINGS: (filter, page) =>
  // `/api/cars/my-listings?filter=${filter}&page=${page}`,
     GET_CAR_MYLISTINGS: (type, filter, page) => {
  let url = `/api/cars/my-listings?type=${type}&page=${page}`;
  if (type === 'active' && filter) {
    url += `&filter=${filter}`;
  }
  return url;
},

      CREATE: '/api/cars/add',
      SAVE_DRAFT: '/api/cars/draft',
      UPDATE: (id) => `/api/cars/update/${id}`,
      DELETE: (id) => `/api/cars/delete/${id}`,
      UPLOAD_IMAGES: '/cars/upload-images',
      GET_CAR_OPTIONS: '/cars/options',
      GET_CAR_FEATURES: '/api/cars/featured',
      GET_CAR_RECOMMENDED: '/api/cars/recommended',
      GET_CAR_SPECS: '/cars/specs',
      GET_MAKE_CARS: 'api/cars/makes',
      GET_MODEL_CARS: (make) => `/api/cars/models?make_name=${make}`,
      GET_YEAR_CARS: (make, modalName) =>
        `/api/cars/years?make_name=${make}&model_name=${modalName}`,
      GET_BODY_TYPE_CARS: '/api/cars/body-types',
      GET_LOCATION_CARS: '/api/cars/regions',
      POST_SEARCH_CARS: '/api/search/search',
      POST_SAVE_SEARCHES: '/api/users/saved-searches',
      GET_SAVED_SEARCHES: (page, limit) =>
        `/api/users/saved-searches?page=${page}&limit=${limit}`,
      GET_TERM_AND_CONDITIONS: '/api/users/content',
      GET_CARS_TOTALCOUNT: '/api/cars/total_count',
      GET_HORSE_POWER:'/api/cars/horsepower_ranges',
      GET_CAR_IMAGES_UPLOAD: '/api/search/upload-attachment',
    },
    AUTH: {
      LOGIN: '/api/auth/login',
      RESENDOTP: '/api/auth/resend-otp',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_OTP: '/api/auth/verify-otp',
      COUNTRY_CODE: '/api/country-codes',
      UPLOAD_DOCUMENTS: '/api/search/upload-attachment',
      REFRESH_TOKEN: '/api/auth/refresh',
    },
    USER: {
      PROFILE: '/api/users/profile',
      UPDATE_PROFILE: '/api/users/edit-profile',
      CHANGE_PASSWORD: '/users/change-password',
      GET_FAVORITES: (page, limit) =>
        `/api/users/favorites?page=${page}&limit=${limit}`,
      ADD_FAVORITE: (id) => `/api/users/favorites/${id}`,
      REMOVE_FAVORITE: (id) => `/api/users/favorites/${id}`,
      GET_SAVEDSEARCHES: (page, limit) =>
        `/api/users/saved-searches?page=${page}&limit=${limit}`,
      GET_SUBSCRIPTIONS: '/api/subscriptions/packages',
      GET_DELETE: '/api/users/delete',
      POST_DEELETE_OTP: '/api/users/delete/otp_verification',
      POST_CHANGE_PHONENUMBER: '/api/users/send-change-phone-otp',
      POST_VERIFYOTP_CHANGENUMBER: '/api/users/verify-change-phone-otp',
      DELETE_SAVED_SEARCH: (id) => `/api/users/saved-searches/${id}`,
      NOTIFY_SAVED_SEARCH: (id) => `/api/users/saved-searches/${id}`
    },
  },
};

if (!process.env.REACT_APP_API_URL) {
  console.warn('REACT_APP_API_URL is not defined in environment variables');
}

export default API_CONFIG;