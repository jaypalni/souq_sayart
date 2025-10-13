/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import { Switch, Button,message,Modal,Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { carAPI,userAPI } from '../services/api';
import lamborgini from '../assets/images/lamborghini.png';
import lottie from '../assets/images/lottie_search.gif';
import { useNavigate } from 'react-router-dom';
import deleteIcon from '../assets/images/Delete_icon.png';
import { useLanguage } from '../contexts/LanguageContext';
import PropTypes from 'prop-types';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const EmptyState = ({ translate }) => {
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
        {translate('savedSearches.NO_SAVED_SEARCHES')}
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
        {translate('savedSearches.RUN_SEARCHES_QUICKLY')}
        <br />
        {translate('savedSearches.GET_NOTIFIED_NEW_CARS')}
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
        {translate('savedSearches.START_SEARCHING')}
      </Button>
    </div>
  );
};

EmptyState.propTypes = {
  translate: PropTypes.func.isRequired,
};

const SavedSearches = () => {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [searches, setSearches] = useState('');
  const [, setDeleteSaved] = useState('');
  const [, setNotifySaved] = useState('');
  const [page] = useState(DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_LIMIT);
  const [messageApi, contextHolder] = message.useMessage();
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSearchId, setSelectedSearchId] = useState(null);


  useEffect(() => {
    Allsavedsearches('3');
  }, []);

  const Allsavedsearches = async (id) => {
     try {
          const res = await carAPI.getsavedsearches(page, limit);
          const response = handleApiResponse(res);
    
          if (response?.data?.searches) {
            if(id === '3'){
              messageApi.open({ type: 'success', content: response.message });
            }
            setSearches(response?.data?.searches);
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

  const handleDeleteNotification = async (id) => {
     try {
          const res = await userAPI.deleteSavedSearch(Number(id));
          const response = handleApiResponse(res);
    
          if (response) {
             messageApi.open({ type: 'success', content: response.message });
            Allsavedsearches('2');
          } else {
        setDeleteSaved([]);
      }
        } catch(error) {
          const errorData = handleApiError(error);
          messageApi.open({ type: 'error', content: errorData.message });
         
        } finally {
          setLoading(false);
        }

  }

  const handleEnableNotification = async (id, enabled) => {
  try {
    const body = { notification: enabled ? 1 : 0 };

    const res = await userAPI.notifySavedSearch(id, body);
    const response = handleApiResponse(res);

    if (response) {
      messageApi.open({ type: 'success', content: response.message });
      Allsavedsearches('1');
    } else {
      setNotifySaved([]);
    }
  } catch (error) {
    const errorData = handleApiError(error);
    messageApi.open({ type: 'error', content: errorData.message });
  } finally {
    setLoading(false);
  }
};


if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
       <Spin size="large" />
      </div>
    );
  }

  if (!loading && searches.length === 0) {
    return <EmptyState translate={translate} />;
  }

  return (
    <div className="saved-searches-main">
      {contextHolder}
      <div className="saved-searches-header">{translate('savedSearches.PAGE_TITLE')}</div>
      <div className="saved-searches-list">
        {searches.map((search) => {
  const { make } = search?.name || {};
  console.log('Make', make)
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
  {search?.name || translate('savedSearches.ALL_MAKE_MODEL')}
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
  // Show price range if both min and max are available
  (search.search_params.price_min && search.search_params.price_max) &&
    `IQD ${search.search_params.price_min} - IQD ${search.search_params.price_max}`,

  // Show only price_to if available and min/max are not set
  (!search.search_params.price_min && search.search_params.price_to) &&
    `IQD ${search.search_params.price_to}`,

  // Year range
  search.search_params.year_min && `${translate('savedSearches.FROM')} ${search.search_params.year_min}`,

  // Max kilometers
  search.search_params.max_kilometers && `${translate('savedSearches.TO')} ${search.search_params.max_kilometers}`,

  // Number of seats
  search.search_params.number_of_seats &&
    `${translate('savedSearches.NUMBER_OF_SEATS')} ${search.search_params.number_of_seats}`,

     // Fuel types (array)
    search.search_params.fuel_types && search.search_params.fuel_types.length > 0 &&
      `${translate('savedSearches.FUEL')} ${search.search_params.fuel_types.join(', ')}`,

    // Transmissions (array)
    search.search_params.transmissions && search.search_params.transmissions.length > 0 &&
      `${translate('savedSearches.TRANSMISSION')} ${search.search_params.transmissions.join(', ')}`,

    // Regional specs (array)
    search.search_params.regional_specs_list && search.search_params.regional_specs_list.length > 0 &&
      `${translate('savedSearches.REGIONAL_SPECS')} ${search.search_params.regional_specs_list.join(', ')}`,

    // Colors (array)
    search.search_params.colors && search.search_params.colors.length > 0 &&
      `${translate('savedSearches.COLOR')} ${search.search_params.colors.join(', ')}`,

    // Owner type
    search.search_params.seller_type && `${translate('savedSearches.OWNER_TYPE')} ${search.search_params.seller_type}`,
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
            {translate('savedSearches.GET_NOTIFIED_NEW_OFFERS')}
          </div>
        </div>
      </div>
      <div style={{display:'flex', gap:10}}>
     <Switch
        checked={search.notification === 1}
        onChange={(checked) => handleEnableNotification(search.id,checked)}
        className="saved-search-switch"
      />
      <button
        type="button"
        onClick={() => {
    setSelectedSearchId(search.id);  
    setDeleteModalOpen(true);
  }}
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
        title={<div className="brand-modal-title-row"><span style={{textAlign:'center',marginTop:'15px', fontWeight: 700}}>{translate('savedSearches.DELETE_SEARCH_CONFIRMATION')}</span></div>}
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
            {translate('savedSearches.CANCEL')}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setDeleteModalOpen(false);
             if (selectedSearchId) {
                handleDeleteNotification(selectedSearchId);
                setSelectedSearchId(null);
              }
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
            {translate('savedSearches.YES')}
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