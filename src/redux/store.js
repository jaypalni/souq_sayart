/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import throttle from 'lodash/throttle';
import rootReducer from './reducers';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth'], // Only persist auth state (token, phone_login, etc.)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);


let lastUserData;
let lastCustomerDetails;

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
      // Token and phone_login are now persisted by Redux Persist

      lastUserData = syncLocalStorageKey('userData', lastUserData, nextUserData);
      lastCustomerDetails = syncLocalStorageKey(
        'customerDetails',
        lastCustomerDetails,
        nextCustomerDetails,
      );
      // Token and phone_login are persisted by Redux Persist
    }, 1000),
  );
}

export default store;
export { persistor };