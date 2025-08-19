/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import Car_icon from '../assets/images/Car_icon.png';
import banner_icon from '../assets/images/homecar_icon.png';

const Banner = () => {
  const location = useLocation();
  const isLoginPage =
    location.pathname === '/login' ||
    location.pathname === '/verifyOtp' ||
    location.pathname === '/createProfile';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {isLoginPage && (
        <div
          style={{
            background: '#008ad5',
            color: '#fff',
            padding: '32px 0 16px 0',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 35px' }}>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 25,
                fontFamily: 'Roboto',
              }}
            >
              My Profile
            </h2>
            <p
              style={{
                margin: 0,
                marginTop: 5,
                fontWeight: 400,
                fontSize: 12,
                fontFamily: 'Roboto',
              }}
            >
              Post Your Listing in just 3 simple steps
            </p>
          </div>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: isLoginPage ? 200 : 526,
          background: '#222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src={isLoginPage ? Car_icon : banner_icon}
          alt="Car"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 70%',
            opacity: isLoginPage ? 0.7 : 1,
          }}
        />
        <h1
          style={{
            position: 'absolute',
            color: '#fff',
            fontWeight: 700,
            fontSize: 32,
            fontFamily: 'Roboto',
          }}
        >
          {isLoginPage ? 'Welcome To Souq Sayarat' : ''}
        </h1>
      </div>
    </div>
  );
};

export default Banner;