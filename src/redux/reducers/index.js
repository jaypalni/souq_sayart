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