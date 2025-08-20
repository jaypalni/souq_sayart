/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

const persistedUserDataRaw = localStorage.getItem('userData');
let persistedUserData = { isLogin: false };

if (persistedUserDataRaw) {
  try {
    const parsed = JSON.parse(persistedUserDataRaw);
    if (parsed && typeof parsed === 'object') {
      persistedUserData = { isLogin: false, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse userData from localStorage', e);
  }
}

const initialState = {
  userData: persistedUserData,
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