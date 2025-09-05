/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import emptysearch from '../assets/images/emptysearch.gif';
import searchicon from '../assets/images/search_icon.png';
import { Modal, message } from 'antd';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import PropTypes from 'prop-types';

const DEFAULT_ALL_MAKE = 'All';
const DEFAULT_ALL_MODELS = 'All Models';
const DEFAULT_ALL_BODY_TYPES = 'All Body Types';
const DEFAULT_LOCATION_BAGHDAD = '';

const Searchemptymodal = ({
  visible,
  onClose,
  make,
  setMake,
  model,
  setModel,
  bodyType,
  setBodyType,
  selectedLocation,
  setSelectedLocation,
  toastmessage,
  setSaveSearchesReload,
  filterData
}) => {
  if (!visible) {
    return null;
  }

  const [messageApi, contextHolder] = message.useMessage();

  const handleSaveSearch = async () => {
    try {
      
      // Use filterData if available, otherwise use individual props
      const searchparams = filterData ? {
        search_query: filterData.keyword || '',
        make: filterData.make || '',
        model: filterData.model || '',
        year_min: filterData.year_min || '',
        year_max: filterData.year_max || '',
        price_min: filterData.price_min || '',
        price_max: filterData.price_max || '',
        location: filterData.location || '',
        body_type: filterData.body_type || '',
        fuel_type: filterData.fuel_type || '',
        transmission: filterData.transmission || '',
        min_kilometers: filterData.min_kilometers || '',
        max_kilometers: filterData.max_kilometers || '',
        number_of_cylinders: filterData.number_of_cylinders || '',
        min_consumption: filterData.min_consumption || '',
        max_consumption: filterData.max_consumption || '',
        colour: filterData.colour || '',
        number_of_seats: filterData.number_of_seats || '',
        extra_features: filterData.extra_features || [],
        number_of_doors: filterData.number_of_doors || '',
        interior: filterData.interior || '',
        payment_options: filterData.payment_options || '',
        page: 1,
        limit: 10,
        newest_listing: filterData.newest_listing || true,
      } : {
        search_query: '',
        make: make || '',
        model: model || '',
        year_min: '',
        year_max: '',
        price_min: '',
        price_max: '',
        location: selectedLocation || '',
        body_type: bodyType || '',
        fuel_type: '',
        transmission: '',
        min_kilometers: '',
        max_kilometers: '',
        number_of_cylinders: '',
        min_consumption: '',
        max_consumption: '',
        colour: '',
        number_of_seats: '',
        extra_features: [],
        number_of_doors: '',
        interior: '',
        payment_options: '',
        page: 1,
        limit: 10,
        newest_listing: true,
      };

      const response = await carAPI.postsavesearches(searchparams);
      const data = handleApiResponse(response);

      if (data?.message) {
        messageApi.open({
          type: 'success',
          content: data?.message,
          onClose: () => {
            onClose();
          },
        });
         setSaveSearchesReload(searchparams)
      }

      if (toastmessage && typeof toastmessage === 'function') {
        toastmessage(data?.message);
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to save search');
       messageApi.error({
          type: 'success',
          content: errorData?.message,
          onClose: () => {
            onClose();
          },
        });
    }
  };

   return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      closable
      width={420}
      className='search-empty-modal'
    >
      {contextHolder}
      <div style={{ textAlign: 'center', padding: '10px' }}>
        <img
          src={emptysearch}
          alt='No Results'
          style={{ maxWidth: '100px', marginBottom: '15px' }}
        />

        <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
          We didn’t find anything that matches this search
        </p>

        <p style={{ fontSize: '12px', color: '#898384', marginBottom: '15px' }}>
          You could try to remove some filters:
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Use filterData values if available, otherwise fall back to props */}
          {(filterData ? filterData.make : make) && (filterData ? filterData.make : make) !== DEFAULT_ALL_MAKE && (
            <button style={filterStyle} onClick={() => setMake(DEFAULT_ALL_MAKE)}>
              {filterData ? filterData.make : make}
            </button>
          )}
          {(filterData ? filterData.model : model) && (filterData ? filterData.model : model) !== DEFAULT_ALL_MODELS && (
            <button style={filterStyle} onClick={() => setModel(DEFAULT_ALL_MODELS)}>
              {filterData ? filterData.model : model}
            </button>
          )}
          {(filterData ? filterData.body_type : bodyType) && (filterData ? filterData.body_type : bodyType) !== DEFAULT_ALL_BODY_TYPES && (
            <button style={filterStyle} onClick={() => setBodyType(DEFAULT_ALL_BODY_TYPES)}>
              {filterData ? filterData.body_type : bodyType}
            </button>
          )}
          {(filterData ? filterData.location : selectedLocation) && (filterData ? filterData.location : selectedLocation) !== DEFAULT_LOCATION_BAGHDAD && (
            <button
              style={filterStyle}
              onClick={() => setSelectedLocation(DEFAULT_LOCATION_BAGHDAD)}
            >
              {filterData ? filterData.location : selectedLocation}
            </button>
          )}
          {/* Show year range from filterData */}
          {filterData && filterData.year_min && filterData.year_max && (
            <button style={filterStyle}>
              {filterData.year_min === filterData.year_max 
                ? `${filterData.year_min}` 
                : `${filterData.year_min} - ${filterData.year_max}`}
            </button>
          )}
          {/* Show price range from filterData */}
          {filterData && filterData.price_min && filterData.price_max && (
            <button style={filterStyle}>
              {filterData.price_min === filterData.price_max 
                ? `₹${filterData.price_min}` 
                : `₹${filterData.price_min} - ₹${filterData.price_max}`}
            </button>
          )}
          {/* Show kilometer range from filterData */}
          {filterData && filterData.min_kilometers && filterData.max_kilometers && (
            <button style={filterStyle}>
              {filterData.min_kilometers === filterData.max_kilometers 
                ? `${filterData.min_kilometers} km` 
                : `${filterData.min_kilometers} - ${filterData.max_kilometers} km`}
            </button>
          )}
          {/* Show additional filters from filterData */}
          {filterData && filterData.fuel_type && filterData.fuel_type !== 'Any' && (
            <button style={filterStyle}>
              {filterData.fuel_type}
            </button>
          )}
          {filterData && filterData.transmission && filterData.transmission !== 'Any' && (
            <button style={filterStyle}>
              {filterData.transmission}
            </button>
          )}
          {filterData && filterData.colour && filterData.colour !== 'Any' && (
            <button style={filterStyle}>
              {filterData.colour}
            </button>
          )}
        </div>

        <p style={{ fontSize: '12px', color: '#555', marginTop: '15px' }}>
          Or save the search and be notified as soon as we have something for you.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button style={cancelBtnStyle} onClick={onClose}>
            Cancel
          </button>
          <button style={saveBtnStyle} onClick={handleSaveSearch}>
            <img src={searchicon} alt='Save Search' /> Save Search
          </button>
        </div>
      </div>
    </Modal>
  );
};

Searchemptymodal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  make: PropTypes.string,
  setMake: PropTypes.func,
  model: PropTypes.string,
  setModel: PropTypes.func,
  bodyType: PropTypes.string,
  setBodyType: PropTypes.func,
  selectedLocation: PropTypes.string,
  setSelectedLocation: PropTypes.func,
  toastmessage: PropTypes.func,
  setSaveSearchesReload: PropTypes.func,
  filterData: PropTypes.object,
};

const filterStyle = {
  background: '#fff',
  padding: '5px 10px',
  borderRadius: '6px',
  margin: '5px',
  fontSize: '12px',
  cursor: 'pointer',
  color: '#898384',
  borderColor: '#DAE1E7',
  borderStyle: 'solid',
  borderWidth: '1px',
};

const cancelBtnStyle = {
  border: '1px solid #008ad5',
  background: 'white',
  color: '#008ad5',
  padding: '8px 20px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

const saveBtnStyle = {
  background: '#008ad5',
  color: '#fff',
  border: 'none',
  padding: '8px 20px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

export default Searchemptymodal;