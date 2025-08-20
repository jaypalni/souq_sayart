/**
 * @file index.js
 * @description Root reducer configuration for the ss-frontend Redux store. Combines all individual reducers into a single root reducer.
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

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import customerDetailsReducer from './customerDetailsReducer';
import userDataReducer from './userDataReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  customerDetails: customerDetailsReducer,
  userData: userDataReducer,
});

export default rootReducer;
