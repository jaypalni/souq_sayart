/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../assets/styles/banner.css';

const PlaneBanner = ({ selectedLocation: propSelectedLocation }) => {
  const location = useLocation();

  const [selectedLocation, setSelectedLocation] = useState(propSelectedLocation || 'Dubai');
  const isLoginPage =
    location.pathname === '/' ||
    location.pathname === '/verifyOtp' ||
    location.pathname === '/createProfile';

  // Function to get selected location from localStorage
  const getSelectedLocation = () => {
    try {
      const savedSearchData = JSON.parse(localStorage.getItem('searchcardata'));
      const location = savedSearchData?.location;
      // Return 'All Locations' if location is empty, null, or undefined
      return (location && location !== '') ? location : 'All Locations';
    } catch (error) {
      return 'All Locations'; // Default fallback
    }
  };

  // Update selected location when prop changes
  useEffect(() => {
    if (propSelectedLocation && propSelectedLocation !== selectedLocation) {
      setSelectedLocation(propSelectedLocation);
    }
  }, [propSelectedLocation, selectedLocation]);

  // Update selected location when localStorage changes (fallback)
  useEffect(() => {
    const updateLocation = () => {
      const newLocation = getSelectedLocation();
      setSelectedLocation(newLocation);
    };

    // Initial load
    updateLocation();

    // Listen for storage changes (when filters are updated)
    const handleStorageChange = (e) => {
      if (e.key === 'searchcardata') {
        updateLocation();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      updateLocation();
    };

    window.addEventListener('searchDataUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('searchDataUpdated', handleCustomStorageChange);
    };
  }, []);

  // Additional effect to check for location changes periodically (fallback)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const currentLocation = getSelectedLocation();
  //     if (currentLocation !== selectedLocation) {
  //       setSelectedLocation(currentLocation);
  //     }
  //   }, 1000); // Check every second

  //   return () => clearInterval(interval);
  // }, [selectedLocation]);

  // Function to generate breadcrumb from current path
  const generateBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const breadcrumbItems = [];
    
    // Always start with Home
    breadcrumbItems.push({
      label: 'Home',
      path: '/',
      isClickable: true
    });

    // Map path segments to readable labels
    const pathLabels = {
      'myProfile': 'My Profile',
      'change-phone': 'Change Phone',
      'change-phone-otp': 'OTP Verification',
      'notifications': 'Notifications',
      'searches': 'Saved Searches',
      'subscriptions': 'Subscriptions',
      'messages': 'Messages',
      'payments': 'Payments',
      'blocked': 'Blocked Users',
      'dashboard': 'Dashboard',
      'favorites': 'Favorites',
      'allcars': 'All Cars',
      'myListings': 'My Listings',
      'newsell': 'Sell Car',
      'userProfile': 'User Profile',
      'carDetails': 'Car Details',
      'landing': 'Landing',
      'login': 'Login',
      'verifyOtp': 'Verify OTP',
      'createProfile': 'Create Profile',
      'termsAndconditions': 'Terms & Conditions',
      'captchatoken': 'Captcha'
    };

    // Build breadcrumb path
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      let label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Special handling for allcars page to show location
      if (segment === 'allcars') {
        label = `New Cars Sale in ${selectedLocation}`;
      }
      
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbItems.push({
        label: label,
        path: currentPath,
        isClickable: !isLast // Last item is not clickable
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumb();

  return (
    <div className="banner-container">
      {isLoginPage && (
        <div className="banner-header">
          <div className="banner-header-content">
            <h2 className="banner-header-title">My Profile</h2>
            <p className="banner-header-subtitle">
              Post Your Listing in just 3 simple steps
            </p>
          </div>
        </div>
      )}
      <div className="plane-banner-main">
        <div className="breadcrumb-container">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.isClickable ? (
                <Link 
                  to={item.path} 
                  className="breadcrumb-link"
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-text">
                  {item.label}
                </span>
              )}
              {index < breadcrumbItems.length - 1 && (
                <span className="breadcrumb-separator">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <h1 className="plane-banner-title">
          {isLoginPage ? 'Welcome To Souq Siyarate' : undefined}
        </h1>
      </div>
    </div>
  );
};

export default PlaneBanner;