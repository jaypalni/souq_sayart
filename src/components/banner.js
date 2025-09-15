/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import Car_icon from '../assets/images/Car_icon.png';
import banner_icon from '../assets/images/homecar_icon.png';
import '../assets/styles/banner.css';

const Banner = () => {
  const location = useLocation();
  const isLoginPage =
    location.pathname === '/login' ||
    location.pathname === '/verifyOtp' ||
    location.pathname === '/createProfile';

  let bannerSrc = banner_icon;
  let bannerOpacity = 1;
  let bannerTitle = null;

  if (isLoginPage) {
    bannerSrc = Car_icon;
    bannerOpacity = 0.7;
    bannerTitle = 'Welcome To Souq Sayarat';
  }

  return (
    <div className="banner-container">
      {isLoginPage && (
        <div className="banner-header">
          <div className="banner-header-content">
            <h2 className="banner-header-title">
              My Profile
            </h2>
            <p className="banner-header-subtitle">
              Post Your Listing in just 3 simple steps
            </p>
          </div>
        </div>
      )}
      <div className="banner-main">
        <img
          src={bannerSrc}
          alt="Car"
          className="banner-image"
          style={{ opacity: bannerOpacity }}
        />
        {bannerTitle && (
          <h1 className="banner-title">
            {bannerTitle}
          </h1>
        )}
      </div>
    </div>
  );
};

export default Banner;