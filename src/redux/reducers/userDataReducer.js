const persistedUserData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : { isLogin: false };

const initialState = {
  userData: persistedUserData && typeof persistedUserData === 'object' ? { isLogin: false, ...persistedUserData } : { isLogin: false },
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