/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
} from '../actions/authActions';

const initialState = {
  user: null,
  token: null,
  phoneNumber: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        phoneNumber: action.payload.phoneNumber,
        isAuthenticated: true,
        error: null,
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        phoneNumber: null,
        isAuthenticated: false,
        error: null,
      };
    case 'SET_PHONE_NUMBER':
      return {
        ...state,
        phoneNumber: action.payload,
      };
    case 'INITIALIZE_PHONE_NUMBER':
      return {
        ...state,
        phoneNumber: action.payload,
      };
    case 'INITIALIZE_TOKEN':
      return {
        ...state,
        token: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
        isAuthenticated: !!action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;