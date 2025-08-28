/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import { Switch, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { userAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
import { carAPI } from '../services/api';
import lamborgini from '../assets/images/lamborghini.png';
import lottie from '../assets/images/lottie_search.gif';
import { useNavigate } from 'react-router-dom';


const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <img src={lottie} alt="boost" style={{ width: '90px', height: '90px' }} />
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
        No Saved Searches
      </h3>
      <p
        style={{
          margin: '10px 0 24px 0',
          color: '#003958',
          fontSize: '12px',
          maxWidth: '300px',
          background: '#D5F0FF',
          padding: '10px 16px',
          borderRadius: '8px',
          lineHeight: '20px',
          fontWeight: 500,
        }}
      >
        Run your searches again quickly
        <br />
        Get Notified about new cars
      </p>
      <Button
        type="primary"
        size="large"
        icon={<SearchOutlined />}
        style={{
          borderRadius: 20,
          padding: '0 60px',
          height: 30,
          fontSize: 12,
          fontWeight: 600,
        }}
        onClick={() => navigate('/')}
      >
        Start Searching
      </Button>
    </div>
  );
};

const SavedSearches = () => {
  const [searches, setSearches] = useState('');
  const [, setLoading] = useState(false);
 

  useEffect(() => {
    Allsavedsearches();
  }, []);

  const Allsavedsearches = async () => {
     try {
          const res = await carAPI.getsavedsearches(1, 10);
          const response = handleApiResponse(res);
    
          if (response?.data?.searches) {
            setSearches(response?.data?.searches);
          } else {
        setSearches([]);
      }
        } catch {
         
        } finally {
          setLoading(false);
        }
  };

 const handleToggle = (id) => {
   setSearches((prevSearches) =>
     prevSearches.map((s) => {
       if (s.id === id) {
         return {
           ...s,
           notify: !s.notify,
         };
       }
       return s;
     }),
   );
 };



  if (searches.length === 0) {
    return <EmptyState />;
  }
  const BASE_URL = 'http://192.168.2.68:5000';
  return (
    <div className="saved-searches-main">
      <div className="saved-searches-header">Saved Searches</div>
      <div className="saved-searches-list">
        {searches.map((search) => {
  const { make, model } = search.search_params; // extract make and model
  const imageSrc = search.make_image?.trim() ? `${BASE_URL}${search.make_image}` : lamborgini;

  return (
    <div className="saved-search-item" key={search.id}>
      <div className="saved-search-info">
        <img
          src={imageSrc}
          alt="logo"
          className="saved-search-logo"
        />
        <div>
          <div className="saved-search-title">
            {make || 'N/A'} - {model || 'N/A'}
          </div>
          {search.search_params.price_to && (
            <div
              className="saved-search-subtitle"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#0A0A0B',
              }}
            >
              {`$${search.search_params.price_to} . From ${search.search_params.year_min || 'N/A'}`}
            </div>
          )}
          <div className="saved-search-details">{search.details}</div>
          <div
            className="saved-search-notify-label"
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#0A0A0B',
            }}
          >
            Get Notified about new offers.
          </div>
        </div>
      </div>
      <Switch
        checked={search.notification === 1}
        onChange={() => handleToggle(search.id)}
        className="saved-search-switch"
      />
    </div>
  );
})}

      </div>
    </div>
  );
};

export default SavedSearches;