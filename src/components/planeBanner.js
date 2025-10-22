/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import '../assets/styles/banner.css';

const PlaneBanner = ({ selectedLocation: propSelectedLocation, selectedNewUsed: propSelectedNewUsed, carDetails, previousPage }) => {
  const location = useLocation();
  console.log('New Or Used', propSelectedNewUsed)

  const [selectedLocation, setSelectedLocation] = useState(propSelectedLocation || 'Dubai');
  const [selectedNewUsed, setSelectedNewUsed] = useState(propSelectedNewUsed || 'All');
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
    if (propSelectedNewUsed && propSelectedNewUsed !== selectedNewUsed) {
      setSelectedNewUsed(propSelectedNewUsed);
    }
  }, [propSelectedLocation, selectedLocation, propSelectedNewUsed]);

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
        label = `${selectedNewUsed} Cars Sale in ${selectedLocation}`;
        console.log('New or used', selectedNewUsed)
      }
      
      // Special handling for car details page
      if (segment === 'carDetails' && carDetails) {
        // Create breadcrumb: Home > Previous Page > Make > Model > Listing
        const make = carDetails.make || 'Car';
        const model = carDetails.model || '';
        const year = carDetails.year || '';
        
        // Add previous page breadcrumb (default to "All Cars" if not provided)
        const prevPage = previousPage || 'All Cars';
        let prevPagePath = '/allcars';
        console.log('Befor Page', previousPage)
        if (previousPage === 'My Listings') {
          prevPagePath = '/myListings';
        } else if (previousPage === 'Seller Profile') {
           const sellerId = carDetails?.seller?.id;
  if (sellerId) {
     prevPagePath = `/userProfile/${sellerId}`;
    
  } else {
    
    prevPagePath = '/'; 
  }
        } else if (previousPage === 'Featured Cars') {
          prevPagePath = '/';
        } else if (previousPage === 'Recommended Cars') {
          prevPagePath = '/';
        } else if (previousPage === 'Favorites') {
          prevPagePath = '/favorites';
        }
        
        breadcrumbItems.push({
          label: prevPage,
          path: prevPagePath,
          isClickable: true
        });
        
        // Add Make breadcrumb (non-clickable)
        breadcrumbItems.push({
          label: make,
          path: `${prevPagePath}?make=${make}`,
          isClickable: false
        });
        
        // Add Model breadcrumb (if model exists, non-clickable)
        if (model) {
          breadcrumbItems.push({
            label: model,
            path: `${prevPagePath}?make=${make}&model=${model}`,
            isClickable: false
          });
        }
        
        // Add Listing breadcrumb (current page - not clickable)
        const listingTitle = year ? `${year} ${make} ${model}` : `${make} ${model}`;
        breadcrumbItems.push({
          label: listingTitle || 'Listing',
          path: currentPath,
          isClickable: false
        });
        
        return breadcrumbItems; // Return early for car details
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

    <div
      className={`plane-banner-main ${
        location.pathname.includes('/carDetails') ? 'car-details-banner' : ''
      }
       ${location.pathname.includes('/tandc') ? 'tandc-banner' : ''}
       ${location.pathname.includes('/privacypolicy') ? 'tandc-banner' : ''}
       ${location.pathname.includes('/faqs') ? 'tandc-banner' : ''}
       ${location.pathname.includes('/contactus') ? 'contactus-banner' : ''}
       `}
    >
      
      {/* Show breadcrumb only if NOT on T&C, Privacy, FAQ, or Contact Us */}
{!(
  location.pathname.includes('/tandc') ||
  location.pathname.includes('/privacypolicy') ||
  location.pathname.includes('/faqs') ||
  location.pathname.includes('/contactus')
) && (
  <div
    className={`breadcrumb-container ${
      location.pathname.includes('/carDetails')
        ? 'car-details-breadcrumb'
        : ''
    }`}
  >
    {breadcrumbItems.map((item, index) => (
      <React.Fragment key={`${item.path}-${index}`}>
        {item.isClickable ? (
          <Link
            to={item.path}
            className="breadcrumb-link"
            onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            {item.label}
          </Link>
        ) : (
          <span className="breadcrumb-text">{item.label}</span>
        )}
        {index < breadcrumbItems.length - 1 && (
          <span className="breadcrumb-separator">&gt;</span>
        )}
      </React.Fragment>
    ))}
  </div>
)}


      {/* Show white title for Terms & Conditions page */}
      {location.pathname.includes('/tandc') && (
        <h1
          className="plane-banner-title"
          style={{ color: '#fff', marginTop: '5px' }}
        >
          Terms & Conditions
        </h1>
      )}

       {/* Show white title for Privacy Policy page */}
      {location.pathname.includes('/privacypolicy') && (
        <h1
          className="plane-banner-title"
          style={{ color: '#fff', marginTop: '5px', fontSize: '32px', fontWeight: '700' }}
        >
          Privacy & Policy
        </h1>
      )}

       {/* Show white title for FAQ'S page */}
      {location.pathname.includes('/faqs') && (
        <h1
          className="plane-banner-title"
          style={{ color: '#fff', marginTop: '5px', fontSize: '32px', fontWeight: '700' }}
        >
          Frequently Asked Questions
        </h1>
      )}

        {/* Show white title for Contact Us page */}
      {location.pathname.includes('/contactus') && (
        <h1
          className="plane-banner-title"
          style={{ color: '#fff', marginTop: '5px' }}
        >
          Contact Us
        </h1>
      )}

      {/* Default title for Login Page */}
      {isLoginPage && (
        <h1 className="plane-banner-title">Welcome To Souq Siyarate</h1>
      )}
    </div>
  </div>
);

};

PlaneBanner.propTypes = {
  selectedLocation: PropTypes.string,
  selectedNewUsed: PropTypes.string,
  carDetails: PropTypes.shape({
    make: PropTypes.string,
    model: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
     seller: PropTypes.shape({
      id: PropTypes.string, // seller id as string
    }),

  }),
  previousPage: PropTypes.string,
};

export default PlaneBanner;



