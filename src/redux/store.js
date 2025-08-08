import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './reducers';

// Create store with rootReducer
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// Subscribe to store changes to persist to localStorage
store.subscribe(() => {
  const state = store.getState();
  if (state.userData && state.userData.userData) {
    localStorage.setItem('userData', JSON.stringify(state.userData.userData));
  }
  if (state.customerDetails && state.customerDetails.customerDetails !== undefined) {
    try {
      if (state.customerDetails.customerDetails === null) {
        localStorage.removeItem('customerDetails');
      } else {
        localStorage.setItem('customerDetails', JSON.stringify(state.customerDetails.customerDetails));
      }
    } catch (_) {
      // ignore persistence errors
    }
  }
});

export default store;
