// import { createStore, applyMiddleware } from 'redux';
// import {thunk} from 'redux-thunk';
// import rootReducer from './reducers';

// // Create store with rootReducer
// const store = createStore(
//   rootReducer,
//   applyMiddleware(thunk)
// );

// // Subscribe to store changes to persist to localStorage
// store.subscribe(() => {
//   const state = store.getState();
//   if (state.userData && state.userData.userData) {
//     localStorage.setItem('userData', JSON.stringify(state.userData.userData));
//   }
//   if (state.customerDetails && state.customerDetails.customerDetails !== undefined) {
//     try {
//       if (state.customerDetails.customerDetails === null) {
//         localStorage.removeItem('customerDetails');
//       } else {
//         localStorage.setItem('customerDetails', JSON.stringify(state.customerDetails.customerDetails));
//       }
//     } catch (_) {
//       // ignore persistence errors
//     }
//   }
// });

// export default store;


import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // ✅ Correct import
import rootReducer from "./reducers";
import throttle from "lodash/throttle"; // npm install lodash

const store = createStore(rootReducer, applyMiddleware(thunk));

let lastUserData;
let lastCustomerDetails;

if (typeof window !== "undefined") {
  store.subscribe(
    throttle(() => {
      const state = store.getState();

      // Save userData only if it changed
      if (state.userData?.userData !== lastUserData) {
        lastUserData = state.userData?.userData;
        if (lastUserData) {
          localStorage.setItem("userData", JSON.stringify(lastUserData));
        }
      }

      // Save customerDetails only if it changed
      if (state.customerDetails?.customerDetails !== lastCustomerDetails) {
        lastCustomerDetails = state.customerDetails?.customerDetails;
        if (lastCustomerDetails === null) {
          localStorage.removeItem("customerDetails");
        } else if (lastCustomerDetails !== undefined) {
          localStorage.setItem("customerDetails", JSON.stringify(lastCustomerDetails));
        }
      }
    }, 1000) // run max once per second
  );
}

export default store;
