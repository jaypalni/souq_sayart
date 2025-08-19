/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
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
