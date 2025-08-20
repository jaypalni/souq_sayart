/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Cardetailsfilter from '../components/cardetailsfilter';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError, DEFAULT_MAKE, DEFAULT_MODEL, DEFAULT_BODY_TYPE, DEFAULT_LOCATION } from '../utils/apiUtils';
import '../assets/styles/allcarfilters.css';
import Searchemptymodal from '../components/searchemptymodal';

const { Option } = Select;

const DEFAULTS = {
  ALL_MAKE: 'All Make',
  ALL_MODELS: 'All Models',
  ALL_BODY_TYPES: 'All Body Types',
  BAGHDAD: 'Baghdad',
  NEW_USED: 'New & Used',
  PRICE_MIN: 'Price Min',
  PRICE_MAX: 'Price Max',
};
const DROPDOWN_NEW_USED = 'newUsed';
const DROPDOWN_PRICE_MIN = 'priceMin';
const DROPDOWN_PRICE_MAX = 'priceMax';
const carMakes = [DEFAULTS.ALL_MAKE, 'Toyota', 'Honda', 'BMW', 'Mercedes', 'Hyundai'];

const carModels = {
  Toyota: [DEFAULTS.ALL_MAKE, 'Corolla', 'Camry', 'Yaris'],
  Honda: [DEFAULTS.ALL_MAKE, 'Civic', 'Accord', 'CR-V'],
  BMW: [DEFAULTS.ALL_MAKE, '3 Series', '5 Series', 'X5'],
  Mercedes: [DEFAULTS.ALL_MAKE, 'C-Class', 'E-Class', 'GLA'],
  Hyundai: [DEFAULTS.ALL_MAKE, 'Elantra', 'Sonata', 'Tucson'],
};

const bodyTypes = [
  'All Body Types',
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
];
const locations = [DEFAULTS.BAGHDAD, 'Beirut', 'Dubai', 'Riyadh', 'Cairo'];
const newUsedOptions = [DEFAULTS.NEW_USED, 'New', 'Used'];
const PRICE_MIN_VALUES = [5000, 10000, 20000, 30000, 40000];
const PRICE_MAX_VALUES = [20000, 30000, 40000, 50000, 100000];
const priceMinOptions = [DEFAULTS.PRICE_MIN, ...PRICE_MIN_VALUES];
const priceMaxOptions = [DEFAULTS.PRICE_MAX, ...PRICE_MAX_VALUES];
const DEFAULT_CAR_COUNT = 342642;

const LandingFilters = ({ setFilterCarsData, filtercarsData: _filtercarsData }) => {
  const [, setLoading] = useState(false);
  const [, setCarSearch] = useState([]);
const [make, setMake] = useState(DEFAULTS.ALL_MAKE);
  const [model, setModel] = useState(DEFAULTS.ALL_MODELS);
  const [bodyType, setBodyType] = useState(DEFAULTS.ALL_BODY_TYPES);
  const [location, setLocation] = useState(DEFAULTS.BAGHDAD);
  const [newUsed, setNewUsed] = useState(DEFAULTS.NEW_USED);
  const [priceMin, setPriceMin] = useState(DEFAULTS.PRICE_MIN);
  const [priceMax, setPriceMax] = useState(DEFAULTS.PRICE_MAX);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carCount] = useState(DEFAULT_CAR_COUNT);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = {
    [DROPDOWN_NEW_USED]: useRef(),
    [DROPDOWN_PRICE_MIN]: useRef(),
    [DROPDOWN_PRICE_MAX]: useRef(),
  };
  const [filterVisible, setFilterVisible] = useState(false);

  

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('searchcardata'));
      if (saved) {
        setMake(saved.make || DEFAULT_MAKE);
        setModel(saved.model || DEFAULT_MODEL);
        setBodyType(saved.body_type || DEFAULT_BODY_TYPE);
        setLocation(saved.location || DEFAULT_LOCATION);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        dropdownRefs[openDropdown] &&
        !dropdownRefs[openDropdown].current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (type) => {
    if (openDropdown === type) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(type);
    }
  };  

  const handleChange = (name, _value) => {
    if (name === 'Make') {
      setModel(DEFAULTS.ALL_MODELS);
    }
  };

  const handleToast = (msg) => {
    if (msg) {
      message.success(msg);
    }
  };

  const handleSearch = async () => {
    const saveParams = {
      make,
      model,
      body_type: bodyType,
      location,
      newUsed,
      priceMin,
      priceMax,
    };

    localStorage.setItem('searchcardata', JSON.stringify(saveParams));
    message.success('Filters saved!');

    try {
      setLoading(true);
      const apiParams = {
        make: '',
        model: '',
        body_type: '',
        location: '',
      };
      if (make !== DEFAULTS.ALL_MAKE) {
        apiParams.make = make;
      }
      if (model !== DEFAULTS.ALL_MODELS) {
        apiParams.model = model;
      }
      if (bodyType !== DEFAULTS.ALL_BODY_TYPES) {
        apiParams.body_type = bodyType;
      }
      if (location !== DEFAULTS.BAGHDAD) {
        apiParams.location = location;
      }

      const response = await carAPI.getSearchCars(apiParams);
      const data1 = handleApiResponse(response);

      if (data1) {
        const results = data1?.data || [];
        setCarSearch(results);

        if (results.length === 0) {
          setIsModalOpen(true);
        } else {
          setFilterCarsData(results);
          localStorage.setItem('searchcardata', JSON.stringify(apiParams));
          messageApi.open({
            type: 'success',
            content: data1?.message,
          });
        }
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to search car data');
      setCarSearch([]);
    } finally {
      setLoading(false);
    }
  };

  const getDropdownLabel = (type) => {
    if (type === DROPDOWN_NEW_USED) {
      return DEFAULTS.NEW_USED;
    }
    if (type === DROPDOWN_PRICE_MIN) {
      return DEFAULTS.PRICE_MIN;
    }
    return DEFAULTS.PRICE_MAX;
  };

  const renderDropdown = (type, options, value, setValue) => (
    <div id={`menu-${type}`} className="allcars-filters-dropdown-menu" ref={dropdownRefs[type]}>
      {options.map((opt) => {
        let itemClass = 'allcars-filters-dropdown-item';
        if (value === opt) {
          itemClass += ' selected';
        }
        return (
          <button
            type="button"
            key={opt}
            className={itemClass}
            onClick={() => {
              setValue(opt);
              handleChange(getDropdownLabel(type), opt);
              setOpenDropdown(null);
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="allcars-filters-outer">
      {contextHolder}
      <div className="allcars-filters-bar">
        <div className="allcars-filters-row">
          <div className="allcars-filters-col">
            <label className="allcars-filters-label" htmlFor="make-select">Make</label>
            <Select
              id="make-select"
              value={make}
              onChange={(value) => {
                setMake(value);
                setModel(DEFAULTS.ALL_MODELS);
                handleChange('Make', value);
              }}
              className="allcars-filters-select"
              size="large"
              dropdownClassName="allcars-filters-dropdown"
            >
              {carMakes.map((m) => (
                <Option key={m} value={m}>
                  {m}
                </Option>
              ))}
            </Select>
          </div>
          <div className="allcars-filters-col">
            <label className="allcars-filters-label" htmlFor="model-select">Model</label>
            <Select
              id="model-select"
              value={model}
              onChange={(value) => {
                setModel(value);
                handleChange('Model', value);
              }}
              className="allcars-filters-select"
              size="large"
              dropdownClassName="allcars-filters-dropdown"
              disabled={make === DEFAULTS.ALL_MAKE}
            >
              {(carModels[make] || [DEFAULTS.ALL_MODELS]).map((m) => (
                <Option key={m} value={m}>
                  {m}
                </Option>
              ))}
            </Select>
          </div>
          <div className="allcars-filters-col">
            <label className="allcars-filters-label" htmlFor="bodytype-select">Body Type</label>
            <Select
              id="bodytype-select"
              value={bodyType}
              onChange={(value) => {
                setBodyType(value);
                handleChange('Body Type', value);
              }}
              className="allcars-filters-select"
              size="large"
              dropdownClassName="allcars-filters-dropdown"
            >
              {bodyTypes.map((b) => (
                <Option key={b} value={b}>
                  {b}
                </Option>
              ))}
            </Select>
          </div>
          <div className="allcars-filters-col">
            <label className="allcars-filters-label" htmlFor="location-select">Location</label>
            <Select
              id="location-select"
              value={location}
              onChange={(value) => {
                setLocation(value);
                handleChange('Location', value);
              }}
              className="allcars-filters-select"
              size="large"
              dropdownClassName="allcars-filters-dropdown"
            >
              {locations.map((l) => (
                <Option key={l} value={l}>
                  {l}
                </Option>
              ))}
            </Select>
          </div>

          <Cardetailsfilter
            visible={filterVisible}
            onClose={() => setFilterVisible(false)}
          />

          <div className="allcars-filters-col allcars-filters-btn-col">
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              className="allcars-filters-btn"
            >
              <span>Show {carCount.toLocaleString()} Cars</span>
            </Button>
          </div>
        </div>

        <div className="allcars-filters-row allcars-filters-row-text">
          <button
            type="button"
            className="allcars-filters-text"
            onClick={() => toggleDropdown(DROPDOWN_NEW_USED)}
            aria-expanded={openDropdown === DROPDOWN_NEW_USED}
            aria-controls={`menu-${DROPDOWN_NEW_USED}`}
          >
            {newUsed}{' '}
            <span className="allcars-filters-text-arrow">
              <MdKeyboardArrowDown />
            </span>
            {openDropdown === DROPDOWN_NEW_USED &&
              renderDropdown(DROPDOWN_NEW_USED, newUsedOptions, newUsed, setNewUsed)}
          </button>
          <button
            type="button"
            className="allcars-filters-text"
            onClick={() => toggleDropdown(DROPDOWN_PRICE_MIN)}
            aria-expanded={openDropdown === DROPDOWN_PRICE_MIN}
            aria-controls={`menu-${DROPDOWN_PRICE_MIN}`}
          >
            {priceMin}{' '}
            <span className="allcars-filters-text-arrow">
              <MdKeyboardArrowDown />
            </span>
            {openDropdown === DROPDOWN_PRICE_MIN &&
              renderDropdown(
                DROPDOWN_PRICE_MIN,
                priceMinOptions,
                priceMin,
                setPriceMin,
              )}
          </button>
          <button
            type="button"
            className="allcars-filters-text"
            onClick={() => toggleDropdown(DROPDOWN_PRICE_MAX)}
            aria-expanded={openDropdown === DROPDOWN_PRICE_MAX}
            aria-controls={`menu-${DROPDOWN_PRICE_MAX}`}
          >
            {priceMax}{' '}
            <span className="allcars-filters-text-arrow">
              <MdKeyboardArrowDown />
            </span>
            {openDropdown === DROPDOWN_PRICE_MAX &&
              renderDropdown(
                DROPDOWN_PRICE_MAX,
                priceMaxOptions,
                priceMax,
                setPriceMax,
              )}
          </button>
        </div>
      </div>
      <Searchemptymodal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toastmessage={handleToast}
        make={make}
        setMake={setMake}
        model={model}
        setModel={setModel}
        bodyType={bodyType}
        setBodyType={setBodyType}
        selectedLocation={location}
        setSelectedLocation={setLocation}
        onSave={handleSearch}
      />
    </div>
  );
};

export default LandingFilters;
 
LandingFilters.propTypes = {
  setFilterCarsData: PropTypes.func.isRequired,
  filtercarsData: PropTypes.any,
};