/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useSelector } from 'react-redux';

/**
 * Custom hook to get token from Redux state only
 * @returns {string|null} Token from Redux state only
 */
export const useToken = () => {
  const token = useSelector(state => state.auth?.token);
  return token;
};

/**
 * Custom hook to get token with fallback to localStorage
 * @returns {string|null} Token from Redux state or localStorage fallback
 */
export const useTokenWithFallback = () => {
  const token = useSelector(state => state.auth?.token);
  
  // No localStorage fallback - Redux only
  return token;
};

/**
 * Custom hook to get authentication status
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const useIsAuthenticated = () => {
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  return isAuthenticated;
};

/**
 * Custom hook to get authentication status with fallback
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const useIsAuthenticatedWithFallback = () => {
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  const token = useSelector(state => state.auth?.token);
  
  // Redux only - no localStorage fallback
  return isAuthenticated && !!token;
};
