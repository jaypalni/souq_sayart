/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState } from 'react';
import { message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { FaRegHeart, FaGlobe, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { TbManualGearbox } from 'react-icons/tb';
import PropTypes from 'prop-types';
import { userAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

const Allcarslistdata = ({ car, idx, onClick }) => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const { translate } = useLanguage();
  const [messageApi, contextHolder] = message.useMessage();
  const [visibleCars, setVisibleCars] = useState([]);
  const [, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(car.is_favorite);
  const carId = car.id
 

const handleFavorite = async () => {
  try {
    setLoading(car.id);
    const response = await userAPI.addFavorite(car.id);
    const data1 = handleApiResponse(response);

    if (data1) {
      setIsFavorite(true); 
      messageApi.open({
        type: 'success',
        content: data1?.message || translate('landing.ADDED_TO_FAVORITES'),
      });
    }
  } catch (error) {
    // error handling
  } finally {
    setLoading(null);
  }
};

const handleRemoveFavorite = async () => {
  try {
    setLoading(car.id);
    const response = await userAPI.removeFavorite(car.id);
    const data1 = handleApiResponse(response);

    if (data1) {
      setIsFavorite(false); 
      messageApi.open({
        type: 'success',
        content: data1?.message || translate('landing.REMOVED_FROM_FAVORITES'),
      });
    }
  } catch (error) {
    // error handling
  } finally {
    setLoading(null);
  }
};



  
  return (
    <div className="col-3 p-0" key={idx} onClick={onClick} style={{ cursor: 'pointer' }}>
      {contextHolder}
      <div className="allcars-listing-card">
        <div className="car-listing-image-wrapper">
          <img src={`${BASE_URL}${car.image}`} alt={car.title} className="car-listing-image" />
          <div className="car-listing-badges">
            {car.featured && (
              <div className="car-listing-badge blue-bg">Featured</div>
            )}
            {car.certified && (
              <div className="car-listing-badge orenge-bg">
                <CheckCircleFilled /> Certified Dealer
              </div>
            )}
          </div>
          <div className="car-listing-fav">
  {isFavorite ? (
    <FaHeart
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRemoveFavorite();
      }}
      style={{
        backgroundColor: '#ffffff',
        color: '#008ad5',
        border: 'none',
        cursor: 'pointer',
      }}
    />
  ) : (
    <FaRegHeart
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFavorite();
      }}
      style={{
        backgroundColor: '#ffffff',
        color: '#008ad5',
        border: 'none',
        cursor: 'pointer',
      }}
    />
  )}
</div>

        </div>
        <div className="car-listing-content">
          <div className="d-flex">
            <div className="car-listing-title">{car.title}</div>
            <div className="car-listing-price">{car.price}</div>
          </div>
          <div className="car-listing-engine">{car.engine}</div>
          <div className="car-listing-details row">
            <div className="col-5">
              <span>
                <TbManualGearbox /> {car.transmission}
              </span>
            </div>
            <div className="col-3">
              <span>
                <FaGlobe /> {car.country}
              </span>
            </div>
            <div className="col-4">
              <span>
                <FaMapMarkerAlt /> {car.mileage}
              </span>
            </div>
            <div className="car-listing-location">{car.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Allcarslistdata.propTypes = {
  idx: PropTypes.number.isRequired,
  car: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    featured: PropTypes.bool.isRequired,
    certified: PropTypes.bool.isRequired,
    price: PropTypes.string.isRequired,
    engine: PropTypes.string.isRequired,
    transmission: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    mileage: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};

export default Allcarslistdata;