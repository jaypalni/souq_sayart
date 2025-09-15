/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { setToken, logoutUser } from '../redux/actions/authActions';

/**
 * Synchronizes token between Redux store and localStorage
 * @param {Object} store - Redux store instance
 * @param {string} token - Token to sync
 */
export const syncTokenToRedux = (store, token) => {
  if (token && store) {
    const state = store.getState();
    if (state.auth?.token !== token) {
      store.dispatch(setToken(token));
    }
  }
};

/**
 * Synchronizes token from localStorage to Redux
 * @param {Object} store - Redux store instance
 */
export const syncTokenFromLocalStorage = (store) => {
  if (store) {
    const token = localStorage.getItem('token');
    const state = store.getState();
    
    console.log('Token sync check:', {
      localStorageToken: token ? 'exists' : 'missing',
      reduxToken: state.auth?.token ? 'exists' : 'missing',
      tokenLength: token?.length || 0
    });
    
    if (token && !state.auth?.token) {
      // Token exists in localStorage but not in Redux
      console.log('Syncing token from localStorage to Redux');
      store.dispatch(setToken(token));
    } else if (!token && state.auth?.token) {
      // Token exists in Redux but not in localStorage
      console.warn('Token exists in Redux but not in localStorage - this may cause API failures');
      // Don't automatically logout, just warn
    }
  }
};

/**
 * Clears token from both Redux and localStorage
 * @param {Object} store - Redux store instance
 */
export const clearTokenEverywhere = (store) => {
  if (store) {
    store.dispatch(logoutUser());
  }
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  localStorage.removeItem('customerDetails');
};

/**
 * Gets token from Redux only
 * @param {Object} store - Redux store instance
 * @returns {string|null} Token from Redux only
 */
export const getTokenFromRedux = (store) => {
  if (store) {
    const state = store.getState();
    return state.auth?.token;
  }
  return null;
};

/**
 * Validates if a token exists and is not empty
 * @param {string|null} token - Token to validate
 * @returns {boolean} True if token is valid, false otherwise
 */
export const isValidToken = (token) => {
  return token && typeof token === 'string' && token.trim().length > 0;
};

/**
 * Gets a valid token from Redux only
 * @param {Object} store - Redux store instance
 * @returns {string|null} Valid token from Redux or null
 */
export const getValidTokenFromRedux = (store) => {
  const token = getTokenFromRedux(store);
  return isValidToken(token) ? token : null;
};

/**
 * Retries an API call with token sync if it fails with 422
 * @param {Function} apiCall - The API function to retry
 * @param {Array} args - Arguments to pass to the API function
 * @param {Object} store - Redux store instance
 * @returns {Promise} API response
 */
export const retryWithTokenSync = async (apiCall, args, store) => {
  try {
    return await apiCall(...args);
  } catch (error) {
    if (error.response?.status === 422) {
      console.warn('API call returned 422, attempting token sync and retry');
      try {
        syncTokenFromLocalStorage(store);
        return await apiCall(...args);
      } catch (retryError) {
        console.error('API retry failed:', retryError);
        throw retryError;
      }
    }
    throw error;
  }
};

/**
 * Ensures token persistence by checking Redux state only
 * @param {Object} store - Redux store instance
 */
export const ensureTokenPersistence = (store) => {
  if (store) {
    const state = store.getState();
    const reduxToken = state.auth?.token;
    
    console.log('Token persistence check (Redux only):', {
      reduxToken: reduxToken ? 'exists' : 'missing',
      reduxTokenLength: reduxToken?.length || 0,
      isAuthenticated: state.auth?.isAuthenticated
    });
    
    // Only check Redux state - no localStorage interaction
    if (!reduxToken) {
      console.warn('No token found in Redux state - user may need to login again');
    }
  }
};

/**
 * Monitors token changes and ensures persistence
 * @param {Object} store - Redux store instance
 */
export const startTokenMonitoring = (store) => {
  if (store) {
    // Check token persistence every 5 seconds
    setInterval(() => {
      ensureTokenPersistence(store);
    }, 5000);
    
    // No localStorage event listening - Redux only
    console.log('Token monitoring started (Redux only)');
  }
};
