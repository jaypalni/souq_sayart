/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { act } from 'react';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
} from '../actions/authActions';

const initialState = {
  user: null,
  token: null,
  refresh_token: null,
  phone_login: null,
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
        phone_login: action.payload.phoneNumber,
        refresh_token: action.payload.refresh_token,
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
        refresh_token: null,
        phone_login: null,
        isAuthenticated: false,
        error: null,
      };
    case 'SET_PHONE_LOGIN':
      return {
        ...state,
        phone_login: action.payload,
      };
    case 'INITIALIZE_PHONE_LOGIN':
      return {
        ...state,
        phone_login: action.payload,
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
    case 'SET_REFRESH_TOKEN':
      return {
        ...state,
        refresh_token: action.payload,
      };
    case 'NO_OP':
      // No operation - return current state unchanged
      return state;

    default:
      return state;
  }
};

export default authReducer;