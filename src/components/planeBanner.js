import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';


const countryOptions = [
  { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
];

const PlaneBanner = () => {
  const location = useLocation();
  const isLoginPage =
    location.pathname === '/' ||
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
            <h2 style={{ margin: 0 }}>My Profile</h2>
            <p style={{ margin: 0 }}>
              Post Your Listing in just 3 simple steps
            </p>
          </div>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: 125,
          background: '#008ad5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      > 
     <p style={{ fontSize: '14px', color: '#fff', marginTop: '-52px', marginLeft: '-980px' }}>
  <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
    Home
  </Link>
  <span style={{ color: '#fff' }}> &gt; </span>
  New Cars Sale in Dubai
</p>

        <h1
          style={{
            position: 'absolute',
            color: '#fff',
            fontWeight: 700,
            fontSize: 32,
          }}
        >
          {isLoginPage ? 'Welcome To Souq Siyarate' : ''}
        </h1>
      </div>
    </div>
  );
};

export default PlaneBanner;
