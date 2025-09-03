/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AllCarFilters from '../components/allcarfilters';
import PlaneBanner from '../components/planeBanner';
import redcar_icon from '../assets/images/redcar_icon.jpg';
import { CheckCircleFilled } from '@ant-design/icons';
import '../assets/styles/carListing.css';
import { FaChevronDown, FaChevronUp, FaRegHeart, FaHeart } from 'react-icons/fa';
import Bestcarsalebytype from '../components/bestcarsalebytype';
import { userAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import car_type from '../assets/images/car_type.png';
import country_code from '../assets/images/country_code.png';
import speed_code from '../assets/images/speed_dashboard.png';
import { message, Pagination } from 'antd';
import { useLocation, Link } from 'react-router-dom';
const Allcars = () => {
  const [filtercarsData, setFilterCarsData] = useState({ cars: [], pagination: {} });
  const [sortedbydata, setSortedbyData] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  // Initialize selectedLocation from localStorage on component mount
  useEffect(() => {
    try {
      const savedSearchData = JSON.parse(localStorage.getItem('searchcardata'));
      if (savedSearchData?.location) {
        setSelectedLocation(savedSearchData.location);
      } else {
        setSelectedLocation('All Locations');
      }
    } catch (error) {
      // Silent error handling
    }
  }, []);

  
  return (
    <div>
      <PlaneBanner name={'jdi'} selectedLocation={selectedLocation} />
      <AllCarFilters
        filtercarsData={filtercarsData}
        setFilterCarsData={setFilterCarsData}
        sortedbydata={sortedbydata}
        setSelectedLocation={setSelectedLocation}
      />
      <CarListing
        filtercarsData={filtercarsData}
        cardata={filtercarsData.cars || []}
        title="Search Results"
        setSortedbyData={setSortedbyData}
      />
      <Bestcarsalebytype />
    </div>
  );
};

const CarListing = ({ filtercarsData, cardata, setSortedbyData, title }) => {
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const passedCars = location.state?.cars || [];
  const passedPagination = location.state?.pagination || {};
  const [carsData, setCarsData] = useState(passedCars);
  const [paginationData, setPaginationData] = useState(passedPagination);
  const [loading, setLoading] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Newest Listing');
  const toggleDropdown = () => setIsOpen(!isOpen);
 

  useEffect(() => {
    // Check if filtercarsData has been set by a filter search (not just initial empty state)
    const hasFilterData = filtercarsData && 
                         Array.isArray(filtercarsData.cars) && 
                         (filtercarsData.cars.length > 0 || (filtercarsData.pagination && Object.keys(filtercarsData.pagination).length > 0));
    
    if (hasFilterData) {
      setCarsData(filtercarsData.cars);
      setPaginationData(filtercarsData.pagination);
    } else if (cardata && cardata.length > 0) {
      setCarsData(cardata);
      setPaginationData(filtercarsData?.pagination || {});
    } else {
      // Use passedCars from navigation state (initial load or when no filters applied)
      setCarsData(passedCars);
      setPaginationData(passedPagination);
    }
  }, [filtercarsData, cardata, passedCars, passedPagination]);

 const Addfavcarapi = async (carId) => {
  try {
    setLoading(carId);
    const response = await userAPI.addFavorite(carId);
    const data = handleApiResponse(response);

    if (data) {
      setCarsData((prevCars) =>
        prevCars.map((car) =>
          car.car_id === carId ? { ...car, is_favorite: true } : car
        )
      );
      messageApi.open({
        type: 'success',
        content: data?.message || 'Car added to favorites',
      });
    } else {
      message.error(data.message || 'Something went wrong');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to add car to favorites.');
  } finally {
    setLoading(null);
  }
};

const Removefavcarapi = async (carId) => {
  try {
    setLoading(carId);
    const response = await userAPI.removeFavorite(carId);
    const data = handleApiResponse(response);

    if (data) {
      setCarsData((prevCars) =>
        prevCars.map((car) =>
          car.car_id === carId ? { ...car, is_favorite: false } : car
        )
      );
      messageApi.open({
        type: 'success',
        content: data?.message || 'Car removed from favorites',
      });
    } else {
      messageApi.open({
        type: 'error',
        content: data?.message || 'Something went wrong',
      });
    }
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to remove car from favorites.');
  } finally {
    setLoading(null);
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
    setSortedbyData(option); 
    setIsOpen(false);
  };
  return (
    <div className="car-listing-container">
      {contextHolder}
      <div className="car-listing-header">
        <span>Showing 1 - {carsData?.length} Cars</span>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            onClick={toggleDropdown}
            style={{
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              padding: 0,
            }}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            Sort : {sortOption}
            <span style={{ fontSize: '12px' }}>
              {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </span>
          </button>

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
                'Price : Low to High',
                'Price : High to Low',
                'Mileage: Low to High',
                'Mileage: High to Low',
              ].map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = '#f2f2f2')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = '#fff')
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Empty state message */}
      {carsData && carsData.length === 0 && (
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
      
      <div className="row">
  {carsData && carsData.length > 0 && carsData.map((car) => { 

    return (
      <div className="col-3 p-0" key={car.id || `${car.ad_title}-${car.price}`}>
        <Link className="allcars-listing-card" to={`/carDetails/${car.car_id}`}>
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
  key={car.car_id}
  className="car-listing-fav"
  style={{
    backgroundColor: '#ffffff',
    color: '#008ad5',
    border: 'none',
    cursor: 'pointer',
  }}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (car.is_favorite) {
      Removefavcarapi(car.car_id);
    } else {
      Addfavcarapi(car.car_id);
    }
  }}
  disabled={loading === car.car_id}
>
  {car.is_favorite ? <FaHeart color='#008ad5' /> : <FaRegHeart />}
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
                : `${car.no_of_cylinders}cyl ${(car.engine_cc / 1000).toFixed(
                    1
                  )}L  ${car.fuel_type}`}
            </div>
            <div className="car-listing-details row">
              <div className="col-5">
                <span>
                  <img src={car_type} alt="Car" style={{ width: 14, height: 14 }} />{' '}
                  {car.transmission}
                </span>
              </div>
              <div className="col-3">
                <span>
                  <img src={country_code} alt="Country" style={{ width: 14, height: 14 }} />{' '}
                  {car.country_code}
                </span>
              </div>
              <div className="col-4">
                <span>
                  <img src={speed_code} alt="Speed" style={{ width: 14, height: 14 }} />{' '}
                  {car.mileage}
                </span>
              </div>
              <div className="car-listing-location">{car.location}</div>
            </div>
          </div>
        </Link>
      </div>
    );
  })}
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

CarListing.propTypes = {
  filtercarsData: PropTypes.shape({
    cars: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        car_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
      })
    ),
    pagination: PropTypes.shape({
      page: PropTypes.number,
      total: PropTypes.number,
      limit: PropTypes.number,
    }),
  }),
  cardata: PropTypes.array,
  title: PropTypes.string,
};

CarListing.defaultProps = {
  filtercarsData: { cars: [], pagination: {} },
  cardata: [],
  title: 'Search Results',
};