/**
 * @file favorites.js
 * @description Component for managing and displaying user favorites.
 * @version 1.0.0
 * @date 2025-08-19
 * @author Palni
 *
 * Copyright (c) 2025 Palni.
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { FaGlobe, FaMapMarkerAlt, FaRegHeart } from 'react-icons/fa';
import redcar_icon from '../assets/images/redcar_icon.jpg';
import { TbManualGearbox } from 'react-icons/tb';
import { userAPI } from '../services/api';
import { CheckCircleFilled } from '@ant-design/icons';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

const MyFavoritesCars = () => {
  const [carsData, setCarsData] = useState([]);
  const [setLoading] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(15);

  useEffect(() => {
    Allcarsapi();
  }, []);

  const Allcarsapi = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getFavorites({
        page,
        limit,
      });
      const newcars = handleApiResponse(response);

      if (newcars?.favorites) {
        setCarsData(newcars.favorites);
      }
      message.success(newcars.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to load car data');
      setCarsData([]);
    } finally {
      setLoading(false);
    }
  };

  const Deletecarapi = async (carId) => {
    try {
      setLoading(true);

      const response = await userAPI.removeFavorite(carId);
      const data = handleApiResponse(response);

      if (data.success) {
        message.success(data.message || 'Removed from favorites');
        await Allcarsapi();
      } else {
        message.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(
        errorData.message || 'Failed to remove car from favorites.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-listing-container">
      <div className="car-listing-header">
        <span>Favorites</span>
      </div>
      <div className="row">
        {carsData.map((car, idx) => (
          <div className="col-3 p-0" key={idx}>
            <div className="allcars-listing-card">
              <div className="car-listing-image-wrapper">
                <img
                  src={car.image_url || redcar_icon}
                  alt={car.ad_title || 'Car Image'}
                  className="car-listing-image"
                />
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
                <button
                  className="car-listing-fav"
                  style={{
                    backgroundColor: '#008ad5',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => Deletecarapi(car.id)}
                >
                  <FaRegHeart />
                </button>
              </div>
              <div className="car-listing-content">
                <div className="d-flex">
                  <div className="car-listing-title">
                    {car.year + ' ' + car.make + ' ' + car.model ||
                      'No Title Available'}
                  </div>
                  <div className="car-listing-price">{'$' + car.price}</div>
                </div>
                <div className="car-listing-engine">{car.fuel_type}</div>
                <div className="car-listing-details row">
                  <div className="col-5">
                    <span>
                      <TbManualGearbox /> {car.transmission}
                    </span>
                  </div>
                  <div className="col-3">
                    <span>
                      <FaGlobe /> {car.consumption || 'UAE'}
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
        ))}
      </div>
    </div>
  );
};

export default MyFavoritesCars;
