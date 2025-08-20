/**
 * @file App.js
 * @description Root component for the ss-frontend project. Wraps the application with Redux Provider and initializes routing.
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

import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppRouter from './router';

/**
 * Root App Component
 *
 * @returns {JSX.Element} The wrapped application
 */
function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
