/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import {authAPI} from '../services/api';

export const handleApiResponse = (response) => response?.data ?? null;

export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    console.log('refersh',data)

    return {
      status,
      message: data?.message || data?.error || 'An error occurred',
      errors: data?.errors || [],
    
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
      message: error?.message || 'Request failed',
      errors: [],
    };
  }
};

export const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] != null) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

export const createQueryString = (params) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] != null) {
      queryParams.append(key, params[key]);
    }
  });
  return queryParams.toString();
};

export const DEFAULT_MAKE = 'All';
export const DEFAULT_MODEL = 'All Models';
export const DEFAULT_BODY_TYPE = 'All Body Types';
export const DEFAULT_LOCATION = 'Baghdad';
