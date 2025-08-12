// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    CARS: {
      UPLOAD_OPTION_DETAILS: "api/cars/upload-option-details",
      TRIM_DETAILS: (make, modalName, yearData) =>
        `/api/cars/trims?make_name=${make}&model_name=${modalName}&year=${yearData}`,
      GET_ALL: "/api/cars/list",
      GET_BY_ID: (id) => `/api/cars/details/${id}`,
      GET_CAR_MYLISTINGS: (page, limit, status) =>
        `/api/cars/my-listings?page=${page}&limit=${limit}&status=${status}`,
      CREATE: "/api/cars/add",
      SAVE_DRAFT: "/api/cars/draft",
      UPDATE: (id) => `/cars/${id}`,
      DELETE: (id) => `/cars/${id}`,
      UPLOAD_IMAGES: "/cars/upload-images",
      GET_CAR_OPTIONS: "/cars/options",
      GET_CAR_FEATURES: "/api/cars/featured",
      GET_CAR_RECOMMENDED: "/api/cars/recommended",
      GET_CAR_SPECS: "/cars/specs",
      GET_MAKE_CARS: "api/cars/makes",
      GET_MODEL_CARS: (make) => `/api/cars/models?make_name=${make}`,
      GET_YEAR_CARS: (make, modalName) =>
        `/api/cars/years?make_name=${make}&model_name=${modalName}`,
      GET_BODY_TYPE_CARS: "/api/cars/body-types",
      GET_LOCATION_CARS: "/api/cars/regions",
      // GET_SEARCH_CARS: (params) =>
      //   `/api/search/search?make=${make}&model=${model}`,
      GET_SEARCH_CARS: "/api/search/search"
    },
    AUTH: {
      LOGIN: "/api/auth/login",
      RESENDOTP: "/api/auth/resend-otp",
      REGISTER: "/api/auth/register",
      LOGOUT: "/auth/logout",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      VERIFY_OTP: "/api/auth/verify-otp",
      COUNTRY_CODE: "/api/country-codes",
      UPLOAD_DOCUMENTS: "/api/search/upload-attachment"
    },
    USER: {
      PROFILE: "/api/users/profile",
      UPDATE_PROFILE: "/api/users/edit-profile",
      CHANGE_PASSWORD: "/users/change-password",
      GET_FAVORITES: (page, limit) =>
        `/api/users/favorites?page=${page}&limit=${limit}`,
      ADD_FAVORITE: (id) => `/api/users/favorites/${id}`,
      REMOVE_FAVORITE: (id) => `/api/users/favorites/${id}`,
      GET_SAVEDSEARCHES: (page, limit) =>
        `/api/users/saved-searches?page=${page}&limit=${limit}`,
      GET_SUBSCRIPTIONS: "/api/subscriptions/packages",
    },
  },
};

// Validate environment variables
if (!process.env.REACT_APP_API_URL) {
  console.warn("REACT_APP_API_URL is not defined in environment variables");
}

export default API_CONFIG;
