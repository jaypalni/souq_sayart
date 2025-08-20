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

let lastUserData;
let lastCustomerDetails;

const syncLocalStorageKey = (key, previousValue, nextValue) => {
  if (nextValue === previousValue) {
    return previousValue;
  }
  if (nextValue === null) {
    localStorage.removeItem(key);
    return nextValue;
  }
  if (typeof nextValue === 'undefined') {
    return nextValue;
  }
  localStorage.setItem(key, JSON.stringify(nextValue));
  return nextValue;
};

if (typeof window !== 'undefined') {
  store.subscribe(
    throttle(() => {
      const state = store.getState();
      const nextUserData = state.userData?.userData;
      const nextCustomerDetails = state.customerDetails?.customerDetails;

      lastUserData = syncLocalStorageKey('userData', lastUserData, nextUserData);
      lastCustomerDetails = syncLocalStorageKey(
        'customerDetails',
        lastCustomerDetails,
        nextCustomerDetails
      );
    }, 1000)
  );
}

export default store;