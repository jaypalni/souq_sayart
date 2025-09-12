/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import '../assets/styles/mycarslisting.css';
import { Radio, Select, Pagination, message } from 'antd';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import CarCard from './CarCard';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const { Option } = Select;

const STATUS = {
  ACTIVE: 'Active',
  DRAFTS: 'Drafts',
  SOLD: 'Sold',
};

const FILTER = {
  BASE: 'Base',
  SPORT: 'Sport',
};

const renderPaginationItem = (page, type, originalElement) => {
  if (type === 'prev') {
    return <span>« Prev</span>;  // Optional custom text for previous button
  }
  if (type === 'next') {
    return <span>Next »</span>;  // Optional custom text for next button
  }
  return originalElement;        // Default: page numbers like 1, 2, 3
};


const MyListingsPagination = ({ currentPage, totalItems, onChangePage }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: 20,
      color: '#0A0A0B',
      borderRadius: '4px',
    }}
  >
    {/* <Pagination
      className="custom-pagination"
      current={currentPage}
      total={totalItems || 50}
      pageSize={15}
      onChange={onChangePage}
      showSizeChanger={false}
      itemRender={renderPaginationItem}
    /> */}
  </div>
);

MyListingsPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number,
  onChangePage: PropTypes.func.isRequired,
};

const Mycarslisting = () => {
  const [value, setValue] = useState('Active');
  const [filterStatus, setFilterStatus] = useState('Any');
  const [carDetails, setCarDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(15);
  const [tokenReady, setTokenReady] = useState(false);

  const navigate = useNavigate();
  const authState = useSelector(state => state.auth);

  // Check if token is available (Redux only - persisted by Redux Persist)
  useEffect(() => {
    const token = authState?.token;
    
    if (token && token !== 'undefined' && token !== 'null' && token.trim().length > 0) {
      setTokenReady(true);
    } else {
      setTokenReady(false);
    }
  }, [authState?.token]);

  const handleChange = (e) => {
    setValue(e.target.value);
    setPage(1);
  };


  const handleFilterChange = (val) => {
    setFilterStatus(val);
    setPage(1);
  };

  const getStatusParam = () => {
    if (value === STATUS.ACTIVE) {
      if (filterStatus === FILTER.BASE) {
        return 'pending';
      }
      if (filterStatus === FILTER.SPORT) {
        return 'approved';
      }
      return 'all';
    }
    if (value === STATUS.DRAFTS) {
      return 'drafts';
    }
    if (value === STATUS.SOLD) {
      return 'sold';
    }
    return '';
  };


//   const fetchCars = async () => {
//   try {
//     setLoading(true);

//     const statusParam = getStatusParam() || '';
//     console.log('Calling API with:', { status: statusParam, page });

//     const response = await carAPI.getMylistingCars(statusParam, page || 1);
//     const cardetail = handleApiResponse(response);

//     // Safely extract data
//     const data = cardetail?.data || {};
//     const pagination = cardetail?.pagination || {};

//     let list = [];
//     if (['pending', 'approved', 'all'].includes(statusParam)) {
//       list = data.approved_pending || [];
//     } else if (statusParam === 'drafts') {
//       list = data.draft || [];
//     } else if (statusParam === 'sold') {
//       list = data.sold || [];
//     }

//     setCarDetails(list);

//     // Use pagination total
//     setTotalCount(pagination.total || 0);

//     console.log('Pagination Data:', pagination);
// console.log('Total Count Set To:', pagination.total);


//     // Optional: update page limit dynamically
//     setLimit(pagination.limit || 15);

//     if (list.length === 0) {
//       message.info('No cars found for the selected filter');
//     } else {
//       message.success(cardetail.message || 'Fetched successfully');
//     }
//   } catch (error) {
//     const errorData = handleApiError(error);
//     message.error(errorData.message || 'Failed to load car data');
//     setCarDetails([]);
//   } finally {
//     setLoading(false);
//   }
// };

const fetchCars = async () => {
  try {
    setLoading(true);

    // Determine type based on selected tab
    let typeParam = '';
    if (value === STATUS.ACTIVE) {
      typeParam = 'active';
    } else if (value === STATUS.DRAFTS) {
      typeParam = 'draft';
    } else if (value === STATUS.SOLD) {
      typeParam = 'sold';
    }

    // Determine filter param only for active
    let filterParam = '';
    if (typeParam === 'active') {
      if (filterStatus === FILTER.BASE) {
        filterParam = 'pending';
      } else if (filterStatus === FILTER.SPORT) {
        filterParam = 'approved';
      } else {
        filterParam = 'all'; // Default to 'all'
      }
    }

    console.log('Calling API with:', { type: typeParam, filter: filterParam, page });

    // Call API dynamically
    const response = await carAPI.getMylistingCars(typeParam, filterParam, page || 1);

    const cardetail = handleApiResponse(response);

    // Safely extract data
    const data = cardetail?.data || {};
    const pagination = cardetail?.pagination || {};

    let list = [];
    if (typeParam === 'active') {
      list = data.approved_pending || [];
    } else if (typeParam === 'draft') {
      list = data.draft || [];
    } else if (typeParam === 'sold') {
      list = data.sold || [];
    }

    setCarDetails(list);

    // Set total count from pagination
    setTotalCount(pagination.total || 0);

    // Optional: Update limit if API provides dynamic value
    setLimit(pagination.limit || 10);

    console.log('Pagination Data:', pagination);
    console.log('Total Count Set To:', pagination.total);

    if (list.length === 0) {
      message.info('No cars found for the selected filter');
    } else {
      message.success(cardetail.message || 'Fetched successfully');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to load car data');
    setCarDetails([]);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    if (tokenReady) {
      fetchCars();
    }
  }, [page, limit, value, filterStatus, tokenReady]);


  const handleDeleteMethod = async (carId) => {
    try {
      setLoading(true);
      const response = await carAPI.deleteCar(carId);
      const cardetail = handleApiResponse(response);
      if (cardetail?.data) {
        message.success(cardetail.message || 'Car deleted successfully');
        fetchCars();
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to delete car data');
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <div>
      {/* Header */}
      <div style={{ background: '#008ad5', color: '#fff', padding: '32px 0 16px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 35px' }}>
          <h2 style={{ margin: 0 }}>My Listings</h2>
          <p style={{ margin: 0 }}>Post an ad in just 3 simple steps</p>
        </div>
      </div>

      {/* Subscribe Banner */}
      <div className="mylisting-car-image-container">
        <div>
          <h1 style={{ top: 55, left: 35, color: '#fff', fontSize: 40, fontWeight: 700, width: 355 }}>
            Subscribe To Our Packages
          </h1>
          <button
            style={{
              top: 20,
              left: 35,
              background: '#008ad500',
              color: '#fff',
              borderRadius: 22,
              border: '1px solid #fff',
              padding: '10px 20px',
            }}
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          marginTop: 35,
          marginLeft: 35,
          marginRight: 25,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Radio.Group onChange={handleChange} value={value} style={{ display: 'flex', gap: '10px' }}>
          {['Active', 'Drafts', 'Sold'].map((status) => (
            <Radio.Button
              key={status}
              value={status}
              className="custom-radio-button"
              style={{
                width: 75,
                textAlign: 'center',
                borderRadius: '4px',
                color: value === status ? '#D67900' : '#000',
                fontSize: '14px',
                fontWeight: value === status ? '700' : '400',
                borderColor: '#fff',
                backgroundColor: value === status ? '#FFEDD5' : undefined,
              }}
            >
              {status}
            </Radio.Button>
          ))}
        </Radio.Group>

        {value === 'Active' && (
          <Select value={filterStatus} style={{ minWidth: 140, borderColor: '#fff' }} onChange={handleFilterChange}>
            <Option value="Any">All</Option>
            <Option value="Base">Pending Approval</Option>
            <Option value="Sport">Approved</Option>
          </Select>
        )}
      </div>

      {/* Car List */}
      <div style={{ padding: '20px' }}>
        {(() => {
          if (!tokenReady) {
            return <p>Initializing...</p>;
          }
          if (loading) {
            return <p>Loading cars...</p>;
          }
          if (carDetails.length === 0) {
            return <p>No cars found.</p>;
          }
          return (
            <div
              style={{
                display: 'grid',
                // gridTemplateColumns: 'repeat(auto-fill, minmax(308px, 1fr))',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                justifyContent: 'center',
              }}
            >
              {carDetails.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  value={value}
                  filterStatus={filterStatus}
                  handleDelete={handleDeleteMethod}
                  navigate={navigate}
                />
              ))}
            </div>
          );
        })()}
      </div>

      {/* Pagination */}
      {/* Pagination */}
<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', width: '100%' }}>
  <Pagination
    className="custom-pagination"
    current={page}            // Controlled by state
    total={totalCount}        // Comes from API
    pageSize={limit}          // API provided limit
    onChange={(newPage) => {
      console.log('Page Changed To:', newPage);
      setPage(newPage);
    }}
    showSizeChanger={false}   // Hides page size dropdown
    showQuickJumper            // Show input for quick jump
    itemRender={renderPaginationItem} // Custom render for < and >
  />
</div>


    </div>
  );
};

export default Mycarslisting;
