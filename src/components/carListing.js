/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { CheckCircleFilled } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/carListing.css';
import { Empty, message } from 'antd';
import { userAPI } from '../services/api';
import car_type from '../assets/images/car_type.png';
import country_code from '../assets/images/country_code.png';
import speed_code from '../assets/images/speed_dashboard.png';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CarListing = ({ title, cardata }) => {
  const navigate = useNavigate();
  const [, setLoading] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [visibleCars, setVisibleCars] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_URL;



  useEffect(() => {
    if (Array.isArray(cardata) && cardata.length > 0) {
      let startIndex = 0;

      const updateVisibleCars = () => {
        const slice = cardata.slice(startIndex, startIndex + 10);
        setVisibleCars(slice);
        startIndex = (startIndex + 10) % cardata.length;
      };

      updateVisibleCars();
      const interval = setInterval(updateVisibleCars, 900000);

      return () => clearInterval(interval);
    } else {
      // Clear visible cars when cardata is empty
      setVisibleCars([]);
    }
  }, [cardata]);

  const handleFavorite = async (carId) => {
    try {
      setLoading(carId);
      const response = await userAPI.addFavorite(Number(carId));
      const data1 = handleApiResponse(response);

      if (data1) {
        setVisibleCars((prevCars) =>
          prevCars.map((car) =>
            car.car_id === carId ? { ...car, is_favorite: true } : car
          )
        );
        messageApi.open({
          type: 'success',
          content: data1?.message || 'Added to favorites successfully',
        });
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
          content: errorData?.message || 'Failed to add to favorites',
        });
      }
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveFavorite = async (carId) => {
    try {
      setLoading(carId);
      const response = await userAPI.removeFavorite(Number(carId));
      const data1 = handleApiResponse(response);

      if (data1) {
        setVisibleCars((prevCars) =>
          prevCars.map((car) =>
            car.car_id === carId ? { ...car, is_favorite: false } : car
          )
        );
        messageApi.open({
          type: 'success',
          content: data1?.message || 'Removed from favorites successfully',
        });
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
          content: errorData?.message || 'Failed to remove from favorites',
        });
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="car-listing-container">
      {contextHolder}
      {visibleCars.length > 0 && (
        <div className="car-listing-header mt-4">
          <span>{title}</span>
         <button
  type="button"
  className="car-listing-seeall"
 onClick={() => {
  const type = title === 'Featured Car' ? 'featured' : 'recommended';
  localStorage.setItem('searchcardata', JSON.stringify({ Empty }));
  navigate('/allcars', { state: { type } });
}}

>
  See All
</button>

        </div>
      )}
      {visibleCars.length === 0 && Array.isArray(cardata) && cardata.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#666',
          fontSize: '16px'
        }}>
          <p>No cars found matching your search criteria.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
      <div className="car-listing-flex-row">
        {visibleCars.map((car) => (
          <div className="car-listing-card" key={car.car_id}>
            <Link
              to={`/carDetails/${car.car_id}`}
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

            <div className="car-listing-fav">
              {car.is_favorite ? (
                <FaHeart
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveFavorite(car.car_id);
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
                    handleFavorite(car.car_id);
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
    </div>
  );
};

export default CarListing;

CarListing.propTypes = {
  title: PropTypes.string,
  cardata: PropTypes.arrayOf(
    PropTypes.shape({
      car_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      car_image: PropTypes.string,
      ad_title: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      fuel_type: PropTypes.string,
      no_of_cylinders: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      engine_cc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      transmission: PropTypes.string,
      country_code: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      mileage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      location: PropTypes.string,
      featured: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      is_verified: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      title: PropTypes.string,
      is_favorite: PropTypes.bool,
    })
  ),
};

CarListing.defaultProps = {
  title: '',
  cardata: [],
};
