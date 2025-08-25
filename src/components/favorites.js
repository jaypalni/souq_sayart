/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */


import React, { useState, useEffect } from 'react';
import '../assets/styles/favorites.css';
import { message } from 'antd';
import { FaGlobe, FaMapMarkerAlt, FaRegHeart } from 'react-icons/fa';
import redcar_icon from '../assets/images/redcar_icon.jpg';
import { TbManualGearbox } from 'react-icons/tb';
import { userAPI } from '../services/api';
import { CheckCircleFilled } from '@ant-design/icons';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { Link } from 'react-router-dom';

const MyFavoritesCars = () => {
  const [carsData, setCarsData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [, setLoading] = useState(false);
  const [page ,] = useState(1);
  const [, limit] = useState(15);

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

      if (newcars?.data?.favorites) {
        setCarsData(newcars.data?.favorites);
      }
       messageApi.open({
              type: 'success',
              content: newcars?.message,
            });
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
              type: 'error',
              content: errorData.error,
            });
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

      if (data) {
         messageApi.open({
          type: 'success',
          content: data?.message,
        });
        await Allcarsapi();
      } else {
         messageApi.open({
          type: 'error',
          content: data?.message,
        });
      }
    } catch (error) {
      const errorData = handleApiError(error);
       messageApi.open({
          type: 'error',
          content: errorData?.message,
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-listing-container">
      {contextHolder}
      <div className="car-listing-header">
        <span>Favorites</span>
      </div>
      <div className="row">
  {carsData.map((car) => (
    <div className="col-3 p-0" key={car.car_id}>
      <Link
        to={`/carDetails/${car.car_id}`}
        className="car-listing-link"
      >
        <div className="allcars-listing-card">
          <div className="car-listing-image-wrapper">
            <img
              src={car.image_url || redcar_icon}
              alt={car.ad_title || 'Car Image'}
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
            <button
              className="car-listing-fav"
              style={{
                backgroundColor: '#008ad5',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                Deletecarapi(car.car_id);
              }}
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
            </div>
            <div className="car-listing-price">
              {'IQD ' + Number(car.price).toLocaleString()}
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
                  <FaGlobe /> {car.country_code}
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
      </Link>
    </div>
  ))}
</div>
    </div>
  );
};

export default MyFavoritesCars;