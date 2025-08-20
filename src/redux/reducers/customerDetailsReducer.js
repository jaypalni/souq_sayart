/**
 * @file customerDetailsReducer.js
 * @description Redux reducer for customer details state management.
 * @version 1.0.0
 * @date 2025-08-19
 * @author Palni
 *
 * Copyright (c) 2025 Palni.
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import {
  CUSTOMER_DETAILS_REQUEST,
  CUSTOMER_DETAILS_SUCCESS,
  CUSTOMER_DETAILS_FAILURE,
  CUSTOMER_DETAILS_UPDATE,
  CUSTOMER_DETAILS_CLEAR,
} from '../actions/authActions';

const loadPersistedCustomerDetails = () => {
  try {
    const raw = localStorage.getItem('customerDetails');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_) {
    return null;
  }
};

const initialState = {
  customerDetails: loadPersistedCustomerDetails(),
  customerDetailsLoading: false,
  customerDetailsError: null,
};

const customerDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER_DETAILS_REQUEST:
      return {
        ...state,
        customerDetailsLoading: true,
        customerDetailsError: null,
      };
    case CUSTOMER_DETAILS_SUCCESS:
      return {
        ...state,
        customerDetailsLoading: false,
        customerDetails: action.payload,
        customerDetailsError: null,
      };
    case CUSTOMER_DETAILS_FAILURE:
      return {
        ...state,
        customerDetailsLoading: false,
        customerDetailsError: action.payload,
      };
    case CUSTOMER_DETAILS_UPDATE:
      return {
        ...state,
        customerDetails: {
          ...state.customerDetails,
          ...action.payload,
        },
      };
    case CUSTOMER_DETAILS_CLEAR:
      return {
        ...state,
        customerDetails: null,
        customerDetailsLoading: false,
        customerDetailsError: null,
      };
    default:
      return state;
  }
};

export default customerDetailsReducer;
