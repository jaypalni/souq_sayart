/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import emptysearch from '../assets/images/emptysearch.gif';
import searchicon from '../assets/images/search_icon.png';
import { Modal, message } from 'antd';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import PropTypes from 'prop-types';
import '../assets/styles/searchemptymodal.css';

const DEFAULT_ALL_MAKE = 'All';
const DEFAULT_ALL_MODELS = 'All Models';
const DEFAULT_ALL_BODY_TYPES = 'All Body Types';
const DEFAULT_LOCATION_BAGHDAD = '';

// Helper function to build search parameters
const buildSearchParams = (filterData, props) => {
  const {
    make,
    model,
    bodyType,
    selectedLocation,
    priceMin,
    priceMax,
    newUsed
  } = props;

  if (filterData) {
    return {
      search_query: filterData.keyword || '',
      make: filterData.make || '',
      model: filterData.model || '',
      year_min: filterData.year_min || '',
      year_max: filterData.year_max || '',
      price_min: filterData?.price_min ?? priceMin ?? '',
      price_max: filterData?.price_max ?? priceMax ?? '',
      location: filterData.location || '',
      body_type: filterData.body_type || '',
      fuel_type: filterData.fuel_type || '',
      transmission: filterData.transmission || '',
      min_kilometers: filterData.min_kilometers || '',
      max_kilometers: filterData.max_kilometers || '',
      number_of_cylinders: filterData.number_of_cylinders || '',
      min_consumption: filterData.min_consumption || '',
      max_consumption: filterData.max_consumption || '',
      colour: filterData.colour || '',
      number_of_seats: filterData.number_of_seats || '',
      extra_features: filterData.extra_features || [],
      number_of_doors: filterData.number_of_doors || '',
      interior: filterData.interior || '',
      payment_options: filterData.payment_options || '',
      page: 1,
      limit: 10,
      newest_listing: filterData.newest_listing || true,
    };
  }

  return {
    search_query: '',
    make: make || '',
    model: model || '',
    year_min: '',
    year_max: '',
    price_min: priceMin || '',
    price_max: priceMax || '',
    location: selectedLocation || '',
    body_type: bodyType || '',
    fuel_type: '',
    transmission: '',
    min_kilometers: '',
    max_kilometers: '',
    number_of_cylinders: '',
    min_consumption: '',
    max_consumption: '',
    colour: '',
    number_of_seats: '',
    extra_features: [],
    number_of_doors: '',
    interior: '',
    payment_options: '',
    page: 1,
    limit: 10,
    newest_listing: true,
  };
};

// Helper function to handle successful save
const handleSaveSuccess = (data, searchparams, messageApi, onClose, setSaveSearchesReload, toastmessage) => {
  if (data?.message) {
    messageApi.open({
      type: 'success',
      content: data?.message,
      onClose: () => {
        onClose();
      },
    });
    setSaveSearchesReload(searchparams);
  }

  if (toastmessage && typeof toastmessage === 'function') {
    toastmessage(data?.message);
  }
};

// Helper function to handle save error
const handleSaveError = (error, messageApi, onClose) => {
  const errorData = handleApiError(error);
  message.error(errorData.message || 'Failed to save search');
  messageApi.error({
    type: 'success',
    content: errorData?.message,
    onClose: () => {
      onClose();
    },
  });
};

const Searchemptymodal = ({
  visible,
  onClose,
  make,
  setMake,
  model,
  setModel,
  bodyType,
  setBodyType,
  selectedLocation,
  setSelectedLocation,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  newUsed,
  setNewUsed,
  toastmessage,
  setSaveSearchesReload,
  filterData
}) => {
  if (!visible) {
    return null;
  }

  const [messageApi, contextHolder] = message.useMessage();

  const handleSaveSearch = async () => {
    try {
      console.log('DEBUG VALUES =>', {
        filterData_price_min: filterData?.price_min,
        filterData_price_max: filterData?.price_max,
        local_priceMin: priceMin,
        local_priceMax: priceMax
      });

      const props = {
        make,
        model,
        bodyType,
        selectedLocation,
        priceMin,
        priceMax,
        newUsed
      };

      const searchparams = buildSearchParams(filterData, props);
      const response = await carAPI.postsavesearches(searchparams);
      const data = handleApiResponse(response);

      handleSaveSuccess(data, searchparams, messageApi, onClose, setSaveSearchesReload, toastmessage);
    } catch (error) {
      handleSaveError(error, messageApi, onClose);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      closable
      width={420}
      className='search-empty-modal'
    >
      {contextHolder}
      <EmptySearchContent
        filterData={filterData}
        make={make}
        setMake={setMake}
        model={model}
        setModel={setModel}
        bodyType={bodyType}
        setBodyType={setBodyType}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        priceMin={priceMin}
        priceMax={priceMax}
        newUsed={newUsed}
        setNewUsed={setNewUsed}
        onClose={onClose}
        onSaveSearch={handleSaveSearch}
      />
    </Modal>
  );
};

// Helper function to get filter value
const getFilterValue = (filterData, propValue, defaultValue) => {
  return filterData ? filterData[propValue] : propValue;
};

// Helper function to check if filter should be shown
const shouldShowFilter = (filterData, propValue, propName, defaultValue) => {
  const value = getFilterValue(filterData, propName, propValue);
  return value && value !== defaultValue;
};

// Helper function to format price range
const formatPriceRange = (filterData, priceMin, priceMax) => {
  if (filterData) {
    const { price_min, price_max } = filterData;
    if (price_min && price_max) {
      return price_min === price_max 
        ? `IQD ${price_min}`
        : `IQD ${price_min} - IQD ${price_max}`;
    }
    return price_min ? `IQD ${price_min}` : `IQD ${price_max}`;
  }
  
  if (priceMin && priceMax) {
    return priceMin === priceMax 
      ? `IQD ${priceMin}`
      : `IQD ${priceMin} - IQD ${priceMax}`;
  }
  return priceMin ? `IQD ${priceMin}` : `IQD ${priceMax}`;
};

// Helper function to format year range
const formatYearRange = (yearMin, yearMax) => {
  return yearMin === yearMax ? `${yearMin}` : `${yearMin} - ${yearMax}`;
};

// Helper function to format kilometer range
const formatKilometerRange = (minKm, maxKm) => {
  return minKm === maxKm ? `${minKm} km` : `${minKm} - ${maxKm} km`;
};

// Filter button component
const FilterButton = ({ children, onClick, style = filterStyle }) => (
  <button style={style} onClick={onClick}>
    {children}
  </button>
);

// Filter buttons section component
const FilterButtons = ({ filterData, make, setMake, model, setModel, bodyType, setBodyType, selectedLocation, setSelectedLocation, priceMin, priceMax, newUsed, setNewUsed }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    {shouldShowFilter(filterData, make, 'make', DEFAULT_ALL_MAKE) && (
      <FilterButton onClick={() => setMake(DEFAULT_ALL_MAKE)}>
        {getFilterValue(filterData, make, 'make')}
      </FilterButton>
    )}
    
    {shouldShowFilter(filterData, model, 'model', DEFAULT_ALL_MODELS) && (
      <FilterButton onClick={() => setModel(DEFAULT_ALL_MODELS)}>
        {getFilterValue(filterData, model, 'model')}
      </FilterButton>
    )}
    
    {shouldShowFilter(filterData, bodyType, 'body_type', DEFAULT_ALL_BODY_TYPES) && (
      <FilterButton onClick={() => setBodyType(DEFAULT_ALL_BODY_TYPES)}>
        {getFilterValue(filterData, bodyType, 'body_type')}
      </FilterButton>
    )}
    
    {shouldShowFilter(filterData, selectedLocation, 'location', DEFAULT_LOCATION_BAGHDAD) && (
      <FilterButton onClick={() => setSelectedLocation(DEFAULT_LOCATION_BAGHDAD)}>
        {getFilterValue(filterData, selectedLocation, 'location')}
      </FilterButton>
    )}
    
    {filterData && filterData.year_min && filterData.year_max && (
      <FilterButton>
        {formatYearRange(filterData.year_min, filterData.year_max)}
      </FilterButton>
    )}
    
    {(filterData ? filterData.price_min || filterData.price_max : priceMin || priceMax) && (
      <FilterButton>
        {formatPriceRange(filterData, priceMin, priceMax)}
      </FilterButton>
    )}
    
    {getFilterValue(filterData, newUsed, 'condition') && (
      <FilterButton onClick={() => setNewUsed('New & Used')}>
        {getFilterValue(filterData, newUsed, 'condition')}
      </FilterButton>
    )}
    
    {filterData && filterData.min_kilometers && filterData.max_kilometers && (
      <FilterButton>
        {formatKilometerRange(filterData.min_kilometers, filterData.max_kilometers)}
      </FilterButton>
    )}
    
    {filterData && filterData.fuel_type && filterData.fuel_type !== 'Any' && (
      <FilterButton>{filterData.fuel_type}</FilterButton>
    )}
    
    {filterData && filterData.transmission && filterData.transmission !== 'Any' && (
      <FilterButton>{filterData.transmission}</FilterButton>
    )}
    
    {filterData && filterData.colour && filterData.colour !== 'Any' && (
      <FilterButton>{filterData.colour}</FilterButton>
    )}
  </div>
);

// Main content component
const EmptySearchContent = ({ filterData, make, setMake, model, setModel, bodyType, setBodyType, selectedLocation, setSelectedLocation, priceMin, priceMax, newUsed, setNewUsed, onClose, onSaveSearch }) => (
  <div style={{ textAlign: 'center', padding: '10px' }}>
    <img
      src={emptysearch}
      alt='No Results'
      style={{ maxWidth: '100px', marginBottom: '15px' }}
    />

    <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
      We didn't find anything that matches this search
    </p>

    <p style={{ fontSize: '12px', color: '#898384', marginBottom: '15px' }}>
      You could try to remove some filters:
    </p>

    <FilterButtons
      filterData={filterData}
      make={make}
      setMake={setMake}
      model={model}
      setModel={setModel}
      bodyType={bodyType}
      setBodyType={setBodyType}
      selectedLocation={selectedLocation}
      setSelectedLocation={setSelectedLocation}
      priceMin={priceMin}
      priceMax={priceMax}
      newUsed={newUsed}
      setNewUsed={setNewUsed}
    />

    <p style={{ fontSize: '12px', color: '#555', marginTop: '15px' }}>
      Or save the search and be notified as soon as we have something for you.
    </p>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
      <button style={cancelBtnStyle} onClick={onClose}>
        Cancel
      </button>
      <button style={saveBtnStyle} onClick={onSaveSearch}>
        <img src={searchicon} alt='Save Search' /> Save Search
      </button>
    </div>
  </div>
);

Searchemptymodal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  make: PropTypes.string,
  setMake: PropTypes.func,
  model: PropTypes.string,
  setModel: PropTypes.func,
  bodyType: PropTypes.string,
  setBodyType: PropTypes.func,
  selectedLocation: PropTypes.string,
  setSelectedLocation: PropTypes.func,
  priceMin: PropTypes.number,      // ✅ Added
  setPriceMin: PropTypes.func,     // ✅ Added
  priceMax: PropTypes.number,      // ✅ Added
  setPriceMax: PropTypes.func,     // ✅ Added
  newUsed: PropTypes.string,       // ✅ Added
  setNewUsed: PropTypes.func,      // ✅ Added
  toastmessage: PropTypes.func,
  setSaveSearchesReload: PropTypes.func,
  filterData: PropTypes.object,
};

const filterStyle = {
  background: '#fff',
  padding: '5px 10px',
  borderRadius: '6px',
  margin: '5px',
  fontSize: '12px',
  cursor: 'pointer',
  color: '#898384',
  borderColor: '#DAE1E7',
  borderStyle: 'solid',
  borderWidth: '1px',
};

const cancelBtnStyle = {
  border: '1px solid #008ad5',
  background: 'white',
  color: '#008ad5',
  padding: '8px 20px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

const saveBtnStyle = {
  background: '#008ad5',
  color: '#fff',
  border: 'none',
  padding: '8px 20px',
  borderRadius: '25px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

export default Searchemptymodal;