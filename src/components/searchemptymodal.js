/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import emptysearch from '../assets/images/emptysearch.gif';
import searchicon from '../assets/images/search_icon.png';
import { message } from 'antd';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import PropTypes from 'prop-types';

const DEFAULT_ALL_MAKE = 'All';
const DEFAULT_ALL_MODELS = 'All Models';
const DEFAULT_ALL_BODY_TYPES = 'All Body Types';
const DEFAULT_LOCATION_BAGHDAD = 'Baghdad';

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
}) => {
  if (!visible) {
    return null;
  }

  const [messageApi, contextHolder] = message.useMessage();

  const handleSaveSearch = async () => {
    try {
      const searchparams = {
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
      } else {
        message.success({
          content: 'Search saved successfully!',
          onClose: () => {
            onClose();
          },
        });
      }

      toastmessage(data?.message);
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to save search');
    }
  };

  return (
    <>
      {contextHolder}
      <button
        type="button"
        className="modal-overlay"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
      <dialog
        open
        className="modal-content"
        aria-label="Search results modal"
      >
        <img
          src={emptysearch}
          alt="No Results"
          className="modal-image"
          style={{ maxWidth: '100px', marginBottom: '15px' }}
        />

        <p
          style={{
            fontSize: '16px',
            color: '#0A0A0B',
            fontWeight: 700,
            marginBottom: '4px',
            textAlign: 'center',
          }}
        >
          We didn’t find anything that matches this search
        </p>

        <p
          style={{
            fontSize: '12px',
            color: '#898384',
            fontWeight: 400,
            marginTop: 0,
            textAlign: 'center',
          }}
        >
          you could try to remove some filters:
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {make !== DEFAULT_ALL_MAKE && (
            <button
  type="button"
  style={filterStyle}
  onClick={() => setMake(DEFAULT_ALL_MAKE)}
>
  {make}
</button>
          )}

          {model !== DEFAULT_ALL_MODELS && (
            <button
  type="button"
  style={filterStyle}
  onClick={() => setModel(DEFAULT_ALL_MODELS)}
>
  {model}
</button>
          )}

          {bodyType !== DEFAULT_ALL_BODY_TYPES && (
            <button
  type="button"
  style={filterStyle}
  onClick={() => setBodyType(DEFAULT_ALL_BODY_TYPES)}
>
  {bodyType}
</button>
          )}

          {selectedLocation !== DEFAULT_LOCATION_BAGHDAD && (
           <button
  type="button"
  style={filterStyle}
  onClick={() => setSelectedLocation(DEFAULT_LOCATION_BAGHDAD)}
>
  {selectedLocation}
</button>
          )}
        </div>
        <p
          style={{
            fontSize: '12px',
            color: '#555',
            textAlign: 'center',
            marginTop: '15px',
          }}
        >
          Or save the search and be notified as soon as we have something for
          you.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '15px',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          <button style={cancelBtnStyle} onClick={onClose}>
            Cancel
          </button>
          <button style={saveBtnStyle} onClick={handleSaveSearch}>
            <img src={searchicon} alt="Save Search" /> Save Search
          </button>
        </div>
      </dialog>
    </>
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