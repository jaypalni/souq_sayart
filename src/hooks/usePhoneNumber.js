/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useSelector } from 'react-redux';

/**
 * Custom hook to get phone number from Redux state
 * @returns {string|null} Phone number from Redux state or null if not available
 */
export const usePhoneNumber = () => {
  const phoneNumber = useSelector(state => state.auth?.phoneNumber);
  return phoneNumber;
};

/**
 * Custom hook to get phone number with fallback to localStorage
 * @returns {string|null} Phone number from Redux state or localStorage fallback
 */
export const usePhoneNumberWithFallback = () => {
  const phoneNumber = useSelector(state => state.auth?.phoneNumber);
  
  // Fallback to localStorage if Redux state is empty (for backward compatibility)
  if (!phoneNumber) {
    return localStorage.getItem('phone_number') || localStorage.getItem('phonenumber');
  }
  
  return phoneNumber;
};

/**
 * Custom hook to get phone number from Redux only (no localStorage fallback)
 * @returns {string|null} Phone number from Redux state only
 */
export const usePhoneNumberReduxOnly = () => {
  const phoneNumber = useSelector(state => state.auth?.phoneNumber);
  return phoneNumber;
};
