/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import { Switch, Button,message,Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { carAPI } from '../services/api';
import lamborgini from '../assets/images/lamborghini.png';
import lottie from '../assets/images/lottie_search.gif';
import { useNavigate } from 'react-router-dom';
import deleteIcon from '../assets/images/Delete_icon.png';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

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
  const [page] = useState(DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_LIMIT);
  const [messageApi, contextHolder] = message.useMessage();
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  useEffect(() => {
    Allsavedsearches();
  }, []);

  const Allsavedsearches = async () => {
     try {
          const res = await carAPI.getsavedsearches(page, limit);
          const response = handleApiResponse(res);
    
          if (response?.data?.searches) {
            setSearches(response?.data?.searches);
             messageApi.open({ type: 'success', content: response.data.message });
          } else {
        setSearches([]);
      }
        } catch(error) {
          const errorData = handleApiError(error);
          messageApi.open({ type: 'error', content: errorData.message });
         
        } finally {
          setLoading(false);
        }
  };

  const handleDeleteNotification = async () => {

  }

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

  return (
    <div className="saved-searches-main">
      {contextHolder}
      <div className="saved-searches-header">Saved Searches</div>
      <div className="saved-searches-list">
        {searches.map((search) => {
  const { make, model } = search.search_params;
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
            <div
              className="saved-search-subtitle"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#0A0A0B',
              }}
            >
              {[
                 search.search_params.price_to && `$${search.search_params.price_to}`,
                 search.search_params.price_min && `$${search.search_params.price_min}`,
                 search.search_params.year_min && `From ${search.search_params.year_min}`,
                 search.search_params.max_kilometers && `to ${search.search_params.max_kilometers}`,
                 search.search_params.number_of_seats && `number of seats: ${search.search_params.number_of_seats}`,
                ]
                 .filter(Boolean) 
                 .join(' • ')}
            </div>
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
      <div style={{display:'flex', gap:10}}>
     <Switch
        checked={search.notification === 1}
        onChange={() => handleToggle(search.id)}
        className="saved-search-switch"
      />
      <button
        type="button"
        onClick={() => setDeleteModalOpen(true)}
        style={{ 
          background: 'none', 
          border: 'none', 
          padding: 0, 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Delete saved search"
      >
        <img 
          src={deleteIcon} 
          alt="Delete" 
          style={{ width: 25, height: 25, marginTop: 5 }} 
        />
      </button>
      </div>
     
     <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        title={<div className="brand-modal-title-row"><span style={{textAlign:'center',marginTop:'15px', fontWeight: 700}}>Are you sure you want to delete this saved search?</span></div>}
        width={350}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '2px',marginTop:'25px' }}>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            style={{
              width: 120,
              backgroundColor: '#ffffff',
              color: '#008AD5',
              borderColor: '#008AD5',
              borderWidth: 1,
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '24px',
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setDeleteModalOpen(false);
              handleDeleteNotification();
            }}
            style={{
              width: 120,
              backgroundColor: '#008AD5',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '24px',
            }}
          >
            Yes
          </Button>
        </div>
      </Modal>
    </div>
  );
})}

      </div>
    </div>
  );
};

export default SavedSearches;