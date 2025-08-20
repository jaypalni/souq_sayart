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

const Mycarslisting = () => {
  const [value, setValue] = useState('Active');
  const [filterStatus, setFilterStatus] = useState('Any');
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [carDetails, setCarDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();


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
      return 'any';
    }
    if (value === STATUS.DRAFTS) {
      return 'drafts';
    }
    if (value === STATUS.SOLD) {
      return 'sold';
    }
    return '';
  };


  const fetchCars = async () => {
    try {
      setLoading(true);
      const statusParam = getStatusParam();
      const response = await carAPI.getMylistingCars({ page, limit, status: statusParam });
      const cardetail = handleApiResponse(response);

      if (['pending', 'approved', 'any'].includes(statusParam)) {
        setCarDetails(cardetail.data.approved_pending || []);
      } else if (statusParam === 'drafts') {
        setCarDetails(cardetail.data.draft || []);
      } else if (statusParam === 'sold') {
        setCarDetails(cardetail.data.sold || []);
      } else {
        setCarDetails([]);
      }
      setTotalCount(cardetail.data.total || 0);

      message.success(cardetail.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to load car data');
      setCarDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [page, limit, value, filterStatus]);


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


  const renderPagination = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        color: '#0A0A0B',
        borderRadius: '4px',
      }}
    >
      <Pagination
        className="custom-pagination"
        current={page}
        total={totalCount || 50}
        pageSize={15}
        onChange={(newPage) => setPage(newPage)}
        showSizeChanger={false}
        itemRender={(type, originalElement) => {
          if (type === 'prev') {
            return <span>&lt;</span>;
          }
          if (type === 'next') {
            return <span>&gt;</span>;
          }
          return originalElement;
        }}
      />
    </div>
  );

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
        {loading ? (
          <p>Loading cars...</p>
        ) : carDetails.length === 0 ? (
          <p>No cars found.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(308px, 1fr))',
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
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default Mycarslisting;
