/**
 * @file userDataReducer.js
 * @description Redux reducer for user data state management.
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

const persistedUserData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : { isLogin: false };

const initialState = {
  userData:
    persistedUserData && typeof persistedUserData === 'object'
      ? { isLogin: false, ...persistedUserData }
      : { isLogin: false },
};

const userDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: { ...state.userData, ...action.payload },
      };
    case 'CLEAR_USER_DATA':
      return {
        ...state,
        userData: { isLogin: false },
      };
    default:
      return state;
  }
};

export default userDataReducer;
