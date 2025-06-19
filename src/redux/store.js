import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './reducers';

// Load persisted data from localStorage if available
const persistedUserData = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : { isLogin: false };

// Initial state
const initialState = {
  userData: persistedUserData && typeof persistedUserData === 'object' ? { isLogin: false, ...persistedUserData } : { isLogin: false },
};

// Reducer function
const reducer = (state = initialState, action) => {
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

// Create store
const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

// Subscribe to store changes to persist to localStorage
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('userData', JSON.stringify(state.userData));
});

export default store;
