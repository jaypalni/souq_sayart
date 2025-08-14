// API Response Handler
export const handleApiResponse = (response) => {
  if (response && response.data) {
    return response.data;
  }
  return null;
};

// API Error Handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    return {
      status,
      message: data.message || data.error || 'An error occurred',
      errors: data.errors || [],
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server',
      errors: [],
    };
  } else {
    // Request setup error
    return {
      status: 0,
      message: error.message || 'Request failed',
      errors: [],
    };
  }
};

// Form Data Helper
export const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

// Query String Helper
export const createQueryString = (params) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });
  return queryParams.toString();
}; 