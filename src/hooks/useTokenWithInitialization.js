/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook that works only with Redux state (no localStorage fallback)
 * This ensures consistent authentication state management
 * @returns {Object} { token, isReady, isAuthenticated }
 */
export const useTokenWithInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const reduxToken = useSelector(state => state.auth?.token);
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  
  useEffect(() => {
    // Mark as initialized after Redux state is available
    setIsInitialized(true);
  }, [reduxToken, isAuthenticated]);
  
  const token = reduxToken;
  const isReady = isInitialized;
  
  return {
    token,
    isReady,
    isAuthenticated: isAuthenticated || (!!token && token !== 'undefined' && token !== 'null')
  };
};
