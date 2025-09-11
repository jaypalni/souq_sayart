/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; 
import rootReducer from './reducers';
import throttle from 'lodash/throttle';

const store = createStore(rootReducer, applyMiddleware(thunk));

// Token initialization removed - token is now stored only in Redux state
// No localStorage initialization needed

let lastUserData;
let lastCustomerDetails;
// Removed lastToken and lastPhoneLogin - no longer syncing to localStorage

const syncLocalStorageKey = (key, previousValue, nextValue, isString = false) => {
  if (nextValue === previousValue) {
    return previousValue;
  }
  if (nextValue === null) {
    // Only remove from localStorage if it was explicitly set to null (not on initialization)
    if (previousValue !== undefined) {
      localStorage.removeItem(key);
    }
    return nextValue;
  }
  if (typeof nextValue === 'undefined') {
    return nextValue;
  }
  if (isString) {
    localStorage.setItem(key, nextValue);
  } else {
    localStorage.setItem(key, JSON.stringify(nextValue));
  }
  return nextValue;
};

if (typeof window !== 'undefined') {
  store.subscribe(
    throttle(() => {
      const state = store.getState();
      const nextUserData = state.userData?.userData;
      const nextCustomerDetails = state.customerDetails?.customerDetails;
      // Removed token and phone_login from localStorage sync - keeping only in Redux

      lastUserData = syncLocalStorageKey('userData', lastUserData, nextUserData);
      lastCustomerDetails = syncLocalStorageKey(
        'customerDetails',
        lastCustomerDetails,
        nextCustomerDetails,
      );
      // Token and phone_login are now stored only in Redux state
    }, 1000),
  );
}

export default store;