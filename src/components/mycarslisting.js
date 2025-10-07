/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import '../assets/styles/mycarslisting.css';
import { Radio, Select, Pagination, message, Modal, Button } from 'antd';
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
  REJECT: 'Reject',
};

const renderPaginationItem = (page, type, originalElement) => {
  if (type === 'prev') {
    return <span>« </span>;  // Optional custom text for previous button
  }
  if (type === 'next') {
    return <span> »</span>;  // Optional custom text for next button
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
   const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

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


console.log('carDetails',carDetails)
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
      } else if (filterStatus === FILTER.REJECT) {
        filterParam = 'rejected';
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
      if (cardetail.status_code === 200) {
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

  const openDeleteModal = (carId) => {
    setSelectedCarId(carId);
    setIsModalOpen(true);
  };

    const confirmDelete = async () => {
    if (selectedCarId) {
      await handleDeleteMethod(selectedCarId);
    }
    setIsModalOpen(false);
    setSelectedCarId(null);
  };


  return (
    <div className="mylistings-container">
      {/* Header */}
      <div className="mylistings-header">
        <div className="mylistings-header-content">
          <h2>My Listings</h2>
          <p>Post an ad in just 3 simple steps</p>
        </div>
      </div>

      {/* Subscribe Banner */}
      <div className="mylisting-car-image-container">
        <div className="mylistings-banner-content">
          <h1 className="mylistings-banner-title">
            Subscribe To Our Packages
          </h1>
          <button className="mylistings-subscribe-btn">
            Subscribe
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mylistings-filters">
        <Radio.Group onChange={handleChange} value={value} className="mylistings-radio-group">
          {['Active', 'Drafts', 'Sold'].map((status) => (
            <Radio.Button
              key={status}
              value={status}
              className={`custom-radio-button mylistings-radio-button ${value === status ? 'active' : 'inactive'}`}
            >
              {status}
            </Radio.Button>
          ))}
        </Radio.Group>

        {value === 'Active' && (
          <Select value={filterStatus} className="mylistings-select" onChange={handleFilterChange}>
            <Option value="Any">All</Option>
            <Option value="Base">Pending Approval</Option>
            <Option value="Sport">Approved</Option>
            <Option value="Reject">Rejected</Option>
          </Select>
        )}
      </div>

      {/* Car List */}
      <div className="mylistings-car-list">
        {(() => {
          if (!tokenReady) {
            return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '18px', color: '#555', fontWeight: 500 }}>
        Initializing...
      </p>
    </div>
  );
           
          }
          if (loading) {
              return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '18px', color: '#555', fontWeight: 500 }}>
        Loading Cars...
      </p>
    </div>
  );
          }
         if (carDetails.length === 0) {
  return (
    <div
  style={{
    display: 'flex',
    flexDirection: 'column', // ✅ Stack vertically
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    gap: '12px', // ✅ Adds spacing between text & button
  }}
>
  <p style={{ fontSize: '18px', color: '#555', fontWeight: 500 }}>
    No listings posted.
  </p>

 {/* Show Create Button only for Active & Drafts */}
      {(value === STATUS.ACTIVE && filterStatus !== 'Reject' || value === STATUS.DRAFTS) && (
        <Button
          type='primary'
          style={{
            backgroundColor: '#008AD5',
            borderColor: '#008AD5',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            padding: '6px 20px',
            borderRadius: '6px',
          }}
          onClick={() => navigate('/sell')}
        >
          Create a New Listing
        </Button>
      )}
</div>

  );
}

          return (
            <div className="car-grid mylistings-car-grid">
              {carDetails.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  value={value}
                  filterStatus={filterStatus}
                  handleDelete={() => openDeleteModal(car.id)}
                  navigate={navigate}
                  onRefresh={fetchCars}
                />
              ))}
            </div>
          );
        })()}
      </div>

      {/* Pagination */}
     {carDetails.length > 0 && (
  <div className="mylistings-pagination">
    <Pagination
      className="custom-pagination"
      current={page}            
      total={totalCount}        
      pageSize={limit}          
      onChange={(newPage) => {
        console.log('Page Changed To:', newPage);
        setPage(newPage);
      }}
      showSizeChanger={false}   
      // showQuickJumper // Show input for quick jump
      itemRender={renderPaginationItem} // Custom render for < and >
    />
  </div>
)}


{/* Delete Confirmation Modal */}
      <Modal
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  width={400} // ✅ Custom modal width
  footer={[
    <div
      key="footer-buttons"
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
      }}
    >
      <Button
        key="cancel"
        onClick={() => setIsModalOpen(false)}
        style={{
          borderColor: '#008AD5',
          color: '#008AD5',
          backgroundColor: 'white',
          fontSize: '15px',
          fontWeight: 600,
          flex: 1, 
          maxWidth: '120px', 
        }}
      >
        Cancel
      </Button>

      <Button
        key="confirm"
        onClick={confirmDelete}
        style={{
          backgroundColor: '#008AD5',
          color: 'white',
          fontSize: '15px',
          fontWeight: 600,
          border: 'none',
          flex: 1,
          maxWidth: '120px', 
        }}
      >
        {loading ? 'Confirming...' : 'Confirm'}
      </Button>
    </div>,
  ]}
>
  <p style={{ fontSize: '18px', fontWeight: 500, textAlign: 'center', marginRight: '15px' }}>
    Are you sure you want to delete this car? 
  </p>
</Modal>

    </div>
  );
};

export default Mycarslisting;
