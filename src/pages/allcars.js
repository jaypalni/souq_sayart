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
import { message, Pagination, Skeleton } from 'antd';
import { useLocation, Link } from 'react-router-dom';
const Allcars = () => {
  const [filtercarsData, setFilterCarsData] = useState({ cars: [], pagination: {} });
  const [sortedbydata, setSortedbyData] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [isLoading, setIsLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [currentPage, setCurrentPage] = useState({});
  const [limit, setLimit] = useState({});

  const location = useLocation();
  const carType = location.state?.type; // 'featured' or 'recommended'

  console.log('Car Type:', carType);

  // Initialize selectedLocation from localStorage on component mount
  useEffect(() => {
    try {
      const savedSearchData = JSON.parse(localStorage.getItem('searchcardata'));
      const location = savedSearchData?.location;
      // Set to 'All Locations' if location is empty, null, or undefined
      if (location && location !== '') {
        setSelectedLocation(location);
      } else {
        setSelectedLocation('All Locations');
      }
    } catch (error) {
      // Silent error handling
    }
  }, []);

  // Clear filtercarsData when loading starts
  useEffect(() => {
    if (isLoading) {
      setFilterCarsData({ cars: [], pagination: {} });
      // Force clear any cached data
      setRenderKey(prev => prev + 1);
    }
  }, [isLoading]);

  // Initialize component state on mount
  useEffect(() => {
    setFilterCarsData({ cars: [], pagination: {} });
    setSortedbyData('');
    // Only clear non-essential cached data, preserve searchcardata
    localStorage.removeItem('cachedCarsData');
    localStorage.removeItem('carsData');
    localStorage.removeItem('filterData');
    localStorage.removeItem('carSearchData');
  }, []);

  // setIsLoading function with render key update
  const debugSetIsLoading = (loading) => {
    setIsLoading(loading);
    if (loading) {
      // Force re-render when loading starts
      setRenderKey(prev => prev + 1);
    }
  };

  
  return (
    <div>
      <PlaneBanner name={'jdi'} selectedLocation={selectedLocation} />
      <AllCarFilters
        filtercarsData={filtercarsData}
        setFilterCarsData={setFilterCarsData}
        sortedbydata={sortedbydata}
        setSelectedLocation={setSelectedLocation}
        setIsLoading={debugSetIsLoading}
        limit={limit}
        currentPage={currentPage}
        featuredorrecommended={carType}

      />
      <CarListing
        key={`${renderKey}-${filtercarsData?.cars?.length || 0}`}
        filtercarsData={filtercarsData}
        cardata={filtercarsData.cars || []}
        title="Search Results"
        sortedbydata={sortedbydata}
        setSortedbyData={setSortedbyData}
        isLoading={isLoading}
        setCurrentPage={setCurrentPage}
        setLimit={setLimit}
      />
      <Bestcarsalebytype />
    </div>
  );
};

const CarListing = ({ filtercarsData, cardata, sortedbydata, setSortedbyData, title, isLoading ,setLimit,setCurrentPage}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  // Initialize sortOption from localStorage or prop
  const getInitialSortOption = () => {
    try {
      const saved = localStorage.getItem('sortOption');
      return saved || sortedbydata || 'Newest Listing';
    } catch (e) {
      return sortedbydata || 'Newest Listing';
    }
  };

  const [sortOption, setSortOption] = useState(getInitialSortOption);
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Sync sortOption with sortedbydata prop
  useEffect(() => {
    if (sortedbydata && sortedbydata !== sortOption) {
      setSortOption(sortedbydata);
      localStorage.setItem('sortOption', sortedbydata);
    }
  }, [sortedbydata, sortOption]);

  // Use filtercarsData directly - no local state to avoid duplication
  const carsToDisplay = filtercarsData?.cars || [];
  const paginationToDisplay = filtercarsData?.pagination || {};
  


 const Addfavcarapi = async (carId) => {
  try {
    setLoading(carId);
    const response = await userAPI.addFavorite(carId);
    const data = handleApiResponse(response);

    if (data) {
      // Update the filtercarsData directly instead of local state
      const updatedCars = carsToDisplay.map((car) =>
        car.car_id === carId ? { ...car, is_favorite: true } : car
      );
      // Update the parent state
      if (filtercarsData?.cars) {
        filtercarsData.cars = updatedCars;
      }
      messageApi.open({
        type: 'success',
        content: data?.message || 'Car added to favorites',
      });
    } else {
      console.log('error11',data)
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
      // Update the filtercarsData directly instead of local state
      const updatedCars = carsToDisplay.map((car) =>
        car.car_id === carId ? { ...car, is_favorite: false } : car
      );
      // Update the parent state
      if (filtercarsData?.cars) {
        filtercarsData.cars = updatedCars;
      }
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
  };
  const onPageChange = (page, pageSize) => {

    setCurrentPage(page)
    setLimit(pageSize)
  };
  const handleSelect = (option) => {
    setSortOption(option); 
    setSortedbyData(option);
    localStorage.setItem('sortOption', option);
    setIsOpen(false);
  };

  const renderCarCards = () => {
    if (!carsToDisplay || carsToDisplay.length === 0) {
      return null;
    }
    
    return carsToDisplay.map((car) => {
      return (
        <div className="col-3 col-lg-3 col-xl-3  col-md-6 col-sm-6 p-0" key={car.id || `${car.ad_title}-${car.price}`}>
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
    });
  };
  return (
    <div className="car-listing-container">
      {contextHolder}
      <div className="car-listing-header">
        <span>
          {carsToDisplay?.length === 0 
            ? 'No cars found' 
            : `Showing 1 - ${carsToDisplay?.length} Cars`}
        </span>
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
      
      {/* Empty state message - only show when not loading */}
      {!isLoading && carsToDisplay && carsToDisplay.length === 0 && (
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
        {isLoading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 8 }).map((_, index) => (
            <div className="col-3 col-md-4 col-sm-6 p-0" key={`skeleton-loader-${index}`}>
              <div className="allcars-listing-card">
                <Skeleton.Image 
                  // style={{ }} 
                  active 
                />
                <div style={{ padding: '16px' }}>
                  <Skeleton.Input style={{ width: '100%', height: 20, marginBottom: 8 }} active />
                  <Skeleton.Input style={{ width: '60%', height: 16, marginBottom: 8 }} active />
                  <Skeleton.Input style={{ width: '80%', height: 14, marginBottom: 8 }} active />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                    <Skeleton.Input style={{ width: '30%', height: 12 }} active />
                    <Skeleton.Input style={{ width: '30%', height: 12 }} active />
                    <Skeleton.Input style={{ width: '30%', height: 12 }} active />
                  </div>
                  <Skeleton.Input style={{ width: '50%', height: 12, marginTop: 8 }} active />
                </div>
              </div>
            </div>
          ))
        ) : (
          renderCarCards()
        )}
</div>

      <div className="row">
        <div className="col-12 d-flex justify-content-center">
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            onChange={onPageChange}
            defaultCurrent={paginationToDisplay?.page}
            total={paginationToDisplay?.total}
              defaultPageSize={20}
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
  sortedbydata: PropTypes.string,
  setSortedbyData: PropTypes.func,
  isLoading: PropTypes.bool,
};

CarListing.defaultProps = {
  filtercarsData: { cars: [], pagination: {} },
  cardata: [],
  title: 'Search Results',
};