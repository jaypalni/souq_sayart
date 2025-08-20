/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useEffect, useState } from 'react';
import AllCarFilters from '../components/allcarfilters';
import PlaneBanner from '../components/planeBanner';
import redcar_icon from '../assets/images/redcar_icon.jpg';
import { CheckCircleFilled } from '@ant-design/icons';
import '../assets/styles/carListing.css';
import { FaChevronDown, FaChevronUp, FaRegHeart } from 'react-icons/fa';
import Bestcarsalebytype from '../components/bestcarsalebytype';
import { userAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import car_type from '../assets/images/car_type.png';
import country_code from '../assets/images/country_code.png';
import speed_code from '../assets/images/speed_dashboard.png';
import { message, Pagination } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
const Allcars = () => {
  const [filtercarsData, setFilterCarsData] = useState([]);
  return (
    <div>
      <PlaneBanner name={'jdi'} />
      <AllCarFilters
        filtercarsData={filtercarsData}
        setFilterCarsData={setFilterCarsData}
      />
      <CarListing
        filtercarsData={filtercarsData}
        setFilterCarsData={setFilterCarsData}
      />
      <Bestcarsalebytype />
    </div>
  );
};

const CarListing = ({ filtercarsData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedCars = location.state?.cars || [];
  const passedPagination = location.state?.pagination || {};
  const [carsData, setCarsData] = useState(passedCars);
  const [paginationData, setPaginationData] = useState(passedPagination);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Newest Listing');
  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (filtercarsData.length === 0) {
      setCarsData(passedCars);
      setPaginationData(passedPagination);
    } else {
      setCarsData(filtercarsData?.cars);
      setPaginationData(filtercarsData?.pagination);
    }
  }, [filtercarsData]);

  const Addfavcarapi = async (carId) => {
    try {
      setLoading(true);

      const response = await userAPI.addFavorite(carId);
      const data = handleApiResponse(response);

      if (data.success) {
        message.success(data.message || 'Added to favorites');
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

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  const onPageChange = (page, pageSize) => {
    console.log(page, pageSize);
  };

  const handleSelect = (option) => {
    setSortOption(option);
    setIsOpen(false);
    console.log('Selected:', option);
  };
  return (
    <div className="car-listing-container">
      <div className="car-listing-header">
        <span>Showing 1 - {carsData?.length} Cars</span>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            onClick={toggleDropdown}
            style={{
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            Sort : {sortOption}
            <span style={{ fontSize: '12px' }}>
              {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </span>
          </div>

          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                marginTop: '5px',
                zIndex: 10,
                minWidth: '180px',
              }}
            >
              {[
                'Newest Listing',
                'Oldest Listing',
                'Low to High',
                'High to Low',
              ].map((option) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = '#f2f2f2')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = '#fff')
                  }
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="row">
        {carsData?.map((car) => (
          <div
            className="col-3 p-0"
            key={car.id || `${car.ad_title}-${car.price}`}
          >
            <div
              className="allcars-listing-card"
              onClick={() => navigate(`/carDetails/${car.car_id}`)}
            >
              <div className="car-listing-image-wrapper">
                <img
                  src={`${BASE_URL}${car.car_image}`}
                  alt="Car"
                  onError={(e) => (e.target.src = redcar_icon)}
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
                    backgroundColor: '#ffffff',
                    color: '#008ad5',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    Addfavcarapi(car.id);
                  }}
                >
                  <FaRegHeart />
                </button>
              </div>
              <div className="car-listing-content">
                <div className="d-flex">
                  <div className="car-listing-title">
                    {car.ad_title || 'No Title Available'}
                  </div>
                </div>
                <div className="car-listing-price">
                  {'IQD ' + Number(car.price).toLocaleString()}
                </div>
                <div className="car-listing-engine">
                  {car.fuel_type === 'Electric'
                    ? car.fuel_type
                    : `${car.no_of_cylinders}cyl ${(
                        car.engine_cc / 1000
                      ).toFixed(1)}L  ${car.fuel_type}`}
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
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-center">
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            onChange={onPageChange}
            defaultCurrent={paginationData?.page}
            total={paginationData?.total}
          />
        </div>
      </div>
    </div>
  );
};

export default Allcars;