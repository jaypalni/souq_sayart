/**
 * @file Allcarslistdata.js
 * @description Component for displaying all cars data in list format.
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

import React from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { FaRegHeart, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { TbManualGearbox } from 'react-icons/tb';

const Allcarslistdata = ({ car, idx }) => {
  return (
    <div className="col-3 p-0" key={idx}>
      <div className="allcars-listing-card">
        <div className="car-listing-image-wrapper">
          <img src={car.image} alt={car.title} className="car-listing-image" />
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
            <FaRegHeart />
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

export default Allcarslistdata;
