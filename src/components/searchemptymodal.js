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

const DEFAULT_ALL_MAKE = 'All Make';
const DEFAULT_ALL_MODELS = 'All Models';
const DEFAULT_ALL_BODY_TYPES = 'All Body Types';
const DEFAULT_LOCATION_BAGHDAD = 'All Locations';
const DEFAULT_CONDITION = 'New & Used';
// Helper function to build search parameters
const buildSearchParams = (filterData, props) => {
  const {
    make,
    model,
    bodyType,
    selectedLocation,
    priceMin,
    priceMax,
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
const getFilterValue = (filterData, propName, propValue) => {
  return filterData ? filterData[propName] : propValue;
};

// Helper function to check if filter should be shown
const shouldShowFilter = (filterData, propValue, propName, defaultValue) => {
  const value = getFilterValue(filterData, propName, propValue);
  console.log('shouldShowFilter:', { filterData, propName, propValue, value, defaultValue });
  return value && value !== defaultValue && propValue && propValue !== defaultValue;
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

FilterButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

// Filter buttons section component
const FilterButtons = ({ 
  filterData, 
  make, 
  setMake, 
  model, 
  setModel, 
  bodyType, 
  setBodyType, 
  selectedLocation, 
  setSelectedLocation, 
  priceMin, 
  priceMax, 
  newUsed, 
  setNewUsed 
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    {shouldShowFilter(filterData, make, 'make', DEFAULT_ALL_MAKE) && (
      <FilterButton onClick={() => setMake(DEFAULT_ALL_MAKE)}>
        {getFilterValue(filterData, 'make', make)}
      </FilterButton>
    )}
    
    {shouldShowFilter(filterData, model, 'model', DEFAULT_ALL_MODELS) && (
      <FilterButton onClick={() => setModel(DEFAULT_ALL_MODELS)}>
        {getFilterValue(filterData, 'model', model)}
      </FilterButton>
    )}
    
    {shouldShowFilter(filterData, bodyType, 'body_type', DEFAULT_ALL_BODY_TYPES) && (
      <FilterButton onClick={() => setBodyType(DEFAULT_ALL_BODY_TYPES)}>
        {getFilterValue(filterData, 'body_type', bodyType)}
      </FilterButton>
    )}
    
    {shouldShowFilter(filterData, selectedLocation, 'location', DEFAULT_LOCATION_BAGHDAD) && (
      <FilterButton onClick={() => setSelectedLocation(DEFAULT_LOCATION_BAGHDAD)}>
        {getFilterValue(filterData, 'location', selectedLocation)}
      </FilterButton>
    )}
    
    {filterData?.year_min && filterData?.year_max && (
      <FilterButton>
        {formatYearRange(filterData.year_min, filterData.year_max)}
      </FilterButton>
    )}
    
    {(filterData ? filterData.price_min || filterData.price_max : priceMin || priceMax) && (
      <FilterButton>
        {formatPriceRange(filterData, priceMin, priceMax)}
      </FilterButton>
    )}
    
    {shouldShowFilter(filterData, newUsed, 'condition', DEFAULT_CONDITION) && (
      <FilterButton onClick={() => setNewUsed(DEFAULT_CONDITION)}>
        {getFilterValue(filterData, 'condition', newUsed)}
      </FilterButton>
    )}
    
    {filterData?.min_kilometers && filterData?.max_kilometers && (
      <FilterButton>
        {formatKilometerRange(filterData.min_kilometers, filterData.max_kilometers)}
      </FilterButton>
    )}
    
    {filterData?.fuel_types && Array.isArray(filterData.fuel_types) && filterData.fuel_types.length > 0 && (
      filterData.fuel_types.map((fuel, index) => (
        <FilterButton key={`fuel-${index}`}>{fuel}</FilterButton>
      ))
    )}
    
    {filterData?.transmissions && Array.isArray(filterData.transmissions) && filterData.transmissions.length > 0 && (
      filterData.transmissions.map((trans, index) => (
        <FilterButton key={`trans-${index}`}>{trans}</FilterButton>
      ))
    )}
    
    {filterData?.colors && Array.isArray(filterData.colors) && filterData.colors.length > 0 && (
      filterData.colors.map((color, index) => (
        <FilterButton key={`color-${index}`}>{color}</FilterButton>
      ))
    )}
    
    {filterData?.body_types && Array.isArray(filterData.body_types) && filterData.body_types.length > 0 && (
      filterData.body_types.map((bodyType, index) => (
        <FilterButton key={`body-${index}`}>{bodyType}</FilterButton>
      ))
    )}
    
    {filterData?.locations && Array.isArray(filterData.locations) && filterData.locations.length > 0 && (
      filterData.locations.map((loc, index) => (
        <FilterButton key={`loc-${index}`}>{loc}</FilterButton>
      ))
    )}
    
    {filterData?.trim && Array.isArray(filterData.trim) && filterData.trim.length > 0 && (
      filterData.trim.map((trimValue, index) => (
        <FilterButton key={`trim-${index}`}>{trimValue}</FilterButton>
      ))
    )}
    
    {filterData?.regional_specs_list && Array.isArray(filterData.regional_specs_list) && filterData.regional_specs_list.length > 0 && (
      filterData.regional_specs_list.map((spec, index) => (
        <FilterButton key={`spec-${index}`}>{spec}</FilterButton>
      ))
    )}
    
    {filterData?.number_of_cylinders && Array.isArray(filterData.number_of_cylinders) && filterData.number_of_cylinders.length > 0 && (
      filterData.number_of_cylinders.map((cyl, index) => (
        <FilterButton key={`cyl-${index}`}>{cyl}</FilterButton>
      ))
    )}
    
    {filterData?.doors && Array.isArray(filterData.doors) && filterData.doors.length > 0 && (
      filterData.doors.map((door, index) => (
        <FilterButton key={`door-${index}`}>{door}</FilterButton>
      ))
    )}
    
    {filterData?.seller_type && Array.isArray(filterData.seller_type) && filterData.seller_type.length > 0 && (
      filterData.seller_type.map((seller, index) => (
        <FilterButton key={`seller-${index}`}>{seller}</FilterButton>
      ))
    )}
    
    {filterData?.condition && Array.isArray(filterData.condition) && filterData.condition.length > 0 && (
      filterData.condition.map((cond, index) => (
        <FilterButton key={`cond-${index}`}>{cond}</FilterButton>
      ))
    )}
    
    {filterData?.keyword && filterData.keyword !== '' && (
      <FilterButton>{filterData.keyword}</FilterButton>
    )}
  </div>
);

FilterButtons.propTypes = {
  filterData: PropTypes.shape({
    keyword: PropTypes.string,
    make: PropTypes.string,
    model: PropTypes.string,
    year_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    locations: PropTypes.array,
    body_type: PropTypes.string,
    body_types: PropTypes.array,
    fuel_type: PropTypes.string,
    fuel_types: PropTypes.array,
    transmission: PropTypes.string,
    transmissions: PropTypes.array,
    min_kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max_kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    colour: PropTypes.string,
    colors: PropTypes.array,
    condition: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    trim: PropTypes.array,
    regional_specs_list: PropTypes.array,
    number_of_cylinders: PropTypes.array,
    doors: PropTypes.array,
    seller_type: PropTypes.array,
  }),
  make: PropTypes.string,
  setMake: PropTypes.func,
  model: PropTypes.string,
  setModel: PropTypes.func,
  bodyType: PropTypes.string,
  setBodyType: PropTypes.func,
  selectedLocation: PropTypes.string,
  setSelectedLocation: PropTypes.func,
  priceMin: PropTypes.number,
  priceMax: PropTypes.number,
  newUsed: PropTypes.string,
  setNewUsed: PropTypes.func,
};

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

EmptySearchContent.propTypes = {
  filterData: PropTypes.shape({
    keyword: PropTypes.string,
    make: PropTypes.string,
    model: PropTypes.string,
    year_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    locations: PropTypes.array,
    body_type: PropTypes.string,
    body_types: PropTypes.array,
    fuel_type: PropTypes.string,
    fuel_types: PropTypes.array,
    transmission: PropTypes.string,
    transmissions: PropTypes.array,
    min_kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max_kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    colour: PropTypes.string,
    colors: PropTypes.array,
    condition: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    trim: PropTypes.array,
    regional_specs_list: PropTypes.array,
    number_of_cylinders: PropTypes.array,
    doors: PropTypes.array,
    seller_type: PropTypes.array,
  }),
  make: PropTypes.string,
  setMake: PropTypes.func,
  model: PropTypes.string,
  setModel: PropTypes.func,
  bodyType: PropTypes.string,
  setBodyType: PropTypes.func,
  selectedLocation: PropTypes.string,
  setSelectedLocation: PropTypes.func,
  priceMin: PropTypes.number,
  priceMax: PropTypes.number,
  newUsed: PropTypes.string,
  setNewUsed: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onSaveSearch: PropTypes.func.isRequired,
};

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
  priceMin: PropTypes.number,
  setPriceMin: PropTypes.func,
  priceMax: PropTypes.number,
  setPriceMax: PropTypes.func,
  newUsed: PropTypes.string,
  setNewUsed: PropTypes.func,
  toastmessage: PropTypes.func,
  setSaveSearchesReload: PropTypes.func,
  filterData: PropTypes.shape({
    keyword: PropTypes.string,
    make: PropTypes.string,
    model: PropTypes.string,
    year_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    locations: PropTypes.array,
    body_type: PropTypes.string,
    body_types: PropTypes.array,
    fuel_type: PropTypes.string,
    fuel_types: PropTypes.array,
    transmission: PropTypes.string,
    transmissions: PropTypes.array,
    min_kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max_kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    colour: PropTypes.string,
    colors: PropTypes.array,
    condition: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    trim: PropTypes.array,
    regional_specs_list: PropTypes.array,
    number_of_cylinders: PropTypes.array,
    doors: PropTypes.array,
    seller_type: PropTypes.array,
  }),
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