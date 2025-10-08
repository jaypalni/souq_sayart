/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/favorites.css';
import { message, Spin } from 'antd';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { userAPI } from '../services/api';
import { CheckCircleFilled } from '@ant-design/icons';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { Link, useNavigate } from 'react-router-dom';
import favoriteGif from '../assets/images/favorites_animi.gif';
import car_type from '../assets/images/car_type.png';
import country_code from '../assets/images/country_code.png';
import speed_code from '../assets/images/speed_dashboard.png';

const MyFavoritesCars = () => {
  const navigate = useNavigate();
  const [carsData, setCarsData] = useState([]);
  const [, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [page] = useState(1);
  const [limit] = useState(15);

 const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchFavorites();
      effectRan.current = true;
    }
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getFavorites({ page, limit });
      const data = handleApiResponse(response);

      if (data?.data?.favorites) {
        setCarsData(data.data.favorites);
      } else {
        setCarsData([]);
      }

    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.error || 'Something went wrong',
      });
      setCarsData([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (carId) => {
    try {
      setLoading(true);
      const response = await userAPI.removeFavorite(carId);
      const data = handleApiResponse(response);

      if (data) {
        messageApi.open({
          type: 'success',
          content: data.message,
        });
        fetchFavorites();
      }
    } catch (error) {
      if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK' || error?.name === 'AxiosError') {
        // Network/offline error -> show user-friendly message
        messageApi.open({ 
          type: 'error', 
          content: 'You\'re offline! Please check your network connection and try again.' 
        });
      } else {
        const errorData = handleApiError(error);
        messageApi.open({
          type: 'error',
          content: errorData?.message || 'Something went wrong',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {

    if (carsData.length === 0) {
      return (
        <div className="no-favorites" style={{ textAlign: 'center', padding: '0 0' }}>
          <img src={favoriteGif} alt="Favorite" className="modal-image" />

          <p style={{ marginBottom: '10px', fontSize: '18px', color: '#0A0A0B', fontWeight: 700 }}>
            You Have No Favorites
          </p>

          <h3 style={{ marginTop: '2px', fontSize: '14px', color: '#0A0A0B', fontWeight: 400 }}>
            You have not saved any vehicles yet.<br />
            Tap the heart icon on a listing to add it here.
          </h3>

          <button
            style={{
              marginTop: '10px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#008ad5',
              border: 'none',
              borderRadius: '32px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            Browse Cars
          </button>
        </div>
      );
    }

    return (
      <div className="car-listing-flex-row-allfav">
        {carsData.map((car) => (
          <div className="car-listing-card" key={car.car_id}>
            <Link
              to={`/carDetails/${car.car_id}`}
              state={{ previousPage: 'Favorites' }}
              style={car.featured ? { cursor: 'pointer' } : {}}
            >
              <div className="car-listing-image-wrapper">
                <img
                  src={`${BASE_URL}${car.car_image}`}
                  alt={car.title}
                  className="car-listing-image"
                />
                <div className="car-listing-badges">
                  {Number(car.featured) === 1 && (
                    <div className="car-listing-badge blue-bg">Featured</div>
                  )}
                  {Number(car.is_verified) === 1 && (
                    <div className="car-listing-badge orenge-bg">
                      <CheckCircleFilled /> Certified Dealer
                    </div>
                  )}
                </div>
              </div>
            </Link>

            <div className="car-listing-fav" style={{ backgroundColor: '#008ad5' }}>
              {car.is_favorite ? (
               <FaRegHeart
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(car.car_id);
  }}
  style={{
       color: '#ffffff',
    
    
    // padding: '6px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  }}
/>
              ) : (
                <FaRegHeart
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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

            <div className="car-listing-content">
              <div className="d-flex">
                <div className="car-listing-title">{car.ad_title}</div>
              </div>
              <div className="car-listing-price">
                {'IQD ' + Number(car.price).toLocaleString()}
              </div>
              <div className="car-listing-engine">
                {car.fuel_type === 'Electric'
                  ? car.fuel_type
                  : `${car.no_of_cylinders}cyl ${(car.engine_cc / 1000).toFixed(
                      1
                    )}L  ${car.fuel_type}`}
              </div>
              <div className="car-listing-details row">
                <div className="col-5">
                  <span>
                    <img
                      src={car_type}
                      alt="Car"
                      style={{ width: 14, height: 14 }}
                    />{' '}
                    {car.transmission}
                  </span>
                </div>
                <div className="col-3">
                  <span>
                    <img
                      src={country_code}
                      alt="Country"
                      style={{ width: 14, height: 14 }}
                    />
                    {car.country_code}
                  </span>
                </div>
                <div className="col-4">
                  <span>
                    <img
                      src={speed_code}
                      alt="Speed"
                      style={{ width: 14, height: 14 }}
                    />
                    {car.mileage}
                  </span>
                </div>
                <div className="car-listing-location">{car.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="car-listing-container">
      {contextHolder}
      <div className="car-listing-header">
        <span>Favorites</span>
      </div>

      {renderContent()}
    </div>
  );
};

export default MyFavoritesCars;
