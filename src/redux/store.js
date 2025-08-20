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

if (typeof window !== 'undefined') {
  store.subscribe(
    throttle(() => {
      const state = store.getState();

      if (state.userData?.userData !== lastUserData) {
  lastUserData = state.userData?.userData;
  if (lastUserData) {
    localStorage.setItem('userData', JSON.stringify(lastUserData));
  } else {
    localStorage.removeItem('userData');
  }
}

if (state.customerDetails?.customerDetails !== lastCustomerDetails) {
  lastCustomerDetails = state.customerDetails?.customerDetails;
  if (lastCustomerDetails === null) {
    localStorage.removeItem('customerDetails');
  } else {
    if (lastCustomerDetails !== undefined) {
      localStorage.setItem(
        'customerDetails',
        JSON.stringify(lastCustomerDetails)
      );
    }
  }
}
    }, 1000)
  );
}

export default store;