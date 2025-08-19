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
