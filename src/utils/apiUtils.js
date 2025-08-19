/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

export const handleApiResponse = (response) => {
  if (response && response.data) {
    return response.data;
  }
  return null;
};

export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data.message || data.error || 'An error occurred',
      errors: data.errors || [],
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'No response from server',
      errors: [],
    };
  } else {
    return {
      status: 0,
      message: error.message || 'Request failed',
      errors: [],
    };
  }
};

export const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

export const createQueryString = (params) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });
  return queryParams.toString();
};
