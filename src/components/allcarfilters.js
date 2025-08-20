/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Select, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Cardetailsfilter from '../components/cardetailsfilter';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError, DEFAULT_MAKE, DEFAULT_MODEL, DEFAULT_BODY_TYPE, DEFAULT_LOCATION } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
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
const priceMinOptions = [DEFAULTS.PRICE_MIN, 5000, 10000, 20000, 30000, 40000];
const priceMaxOptions = [DEFAULTS.PRICE_MAX, 20000, 30000, 40000, 50000, 100000];

const LandingFilters = ({ setFilterCarsData, filtercarsData }) => {
  const [loading, setLoading] = useState(false);
  const [carSearch, setCarSearch] = useState([]);
const [make, setMake] = useState(DEFAULTS.ALL_MAKE);
  const [model, setModel] = useState(DEFAULTS.ALL_MODELS);
  const [bodyType, setBodyType] = useState(DEFAULTS.ALL_BODY_TYPES);
  const [location, setLocation] = useState(DEFAULTS.BAGHDAD);
  const [newUsed, setNewUsed] = useState(DEFAULTS.NEW_USED);
  const [priceMin, setPriceMin] = useState(DEFAULTS.PRICE_MIN);
  const [priceMax, setPriceMax] = useState(DEFAULTS.PRICE_MAX);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [carCount] = useState(342642);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = {
    [DROPDOWN_NEW_USED]: useRef(),
    [DROPDOWN_PRICE_MIN]: useRef(),
    [DROPDOWN_PRICE_MAX]: useRef(),
  };
  const [filterVisible, setFilterVisible] = useState(false);
  const [storedsearchparams, setStoredSearchParams] = useState(null);

  useEffect(() => {
    let params = null;
    try {
      params = JSON.parse(localStorage.getItem('searchcardata'));
    } catch (e) {
      params = null;
    }
    setStoredSearchParams(params);
  }, []);

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

  const handleChange = (name, value) => {
    if (name === 'Make') {
      setModel(DEFAULTS.ALL_MODELS);
    }
  };

  const handleToast = (msg) => {
    setToastMsg(msg);
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
        make: make !== DEFAULTS.ALL_MAKE ? make : '',
        model: model !== DEFAULTS.ALL_MODELS ? model : '',
        body_type: bodyType !== DEFAULTS.ALL_BODY_TYPES ? bodyType : '',
        location: location !== DEFAULTS.BAGHDAD ? location : '',
      };

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
    if (type === DROPDOWN_NEW_USED) return DEFAULTS.NEW_USED;
    if (type === DROPDOWN_PRICE_MIN) return DEFAULTS.PRICE_MIN;
    return DEFAULTS.PRICE_MAX;
  };

  const renderDropdown = (type, options, value, setValue) => (
    <div className="allcars-filters-dropdown-menu" ref={dropdownRefs[type]}>
      {options.map((opt) => (
        <div
          key={opt}
          className={`allcars-filters-dropdown-item${
            value === opt ? ' selected' : ''
          }`}
          onClick={() => {
            setValue(opt);
            handleChange(getDropdownLabel(type), opt);
            setOpenDropdown(null);
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  );

  return (
    <div className="allcars-filters-outer">
      {contextHolder}
      <div className="allcars-filters-bar">
        <div className="allcars-filters-row">
          <div className="allcars-filters-col">
            <label className="allcars-filters-label">Make</label>
            <Select
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
            <label className="allcars-filters-label">Model</label>
            <Select
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
            <label className="allcars-filters-label">Body Type</label>
            <Select
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
            <label className="allcars-filters-label">Location</label>
            <Select
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
          <div
            className="allcars-filters-text"
            onClick={() =>
              setOpenDropdown(
                openDropdown === DROPDOWN_NEW_USED ? null : DROPDOWN_NEW_USED,
              )
            }
            tabIndex={0}
          >
            {newUsed}{' '}
            <span className="allcars-filters-text-arrow">
              <MdKeyboardArrowDown />
            </span>
            {openDropdown === DROPDOWN_NEW_USED &&
              renderDropdown(DROPDOWN_NEW_USED, newUsedOptions, newUsed, setNewUsed)}
          </div>
          <div
            className="allcars-filters-text"
            onClick={() =>
              setOpenDropdown(
                openDropdown === DROPDOWN_PRICE_MIN ? null : DROPDOWN_PRICE_MIN,
              )
            }
            tabIndex={0}
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
                setPriceMin
              )}
          </div>
          <div
            className="allcars-filters-text"
            onClick={() =>
              setOpenDropdown(
                openDropdown === DROPDOWN_PRICE_MAX ? null : DROPDOWN_PRICE_MAX,
              )
            }
            tabIndex={0}
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
                setPriceMax
              )}
          </div>
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