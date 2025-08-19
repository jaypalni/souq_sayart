/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Select, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Cardetailsfilter from '../components/cardetailsfilter';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/allcarfilters.css';
import Searchemptymodal from '../components/searchemptymodal';

const { Option } = Select;

const carMakes = ['All Make', 'Toyota', 'Honda', 'BMW', 'Mercedes', 'Hyundai'];

const carModels = {
  Toyota: ['All Models', 'Corolla', 'Camry', 'Yaris'],
  Honda: ['All Models', 'Civic', 'Accord', 'CR-V'],
  BMW: ['All Models', '3 Series', '5 Series', 'X5'],
  Mercedes: ['All Models', 'C-Class', 'E-Class', 'GLA'],
  Hyundai: ['All Models', 'Elantra', 'Sonata', 'Tucson'],
};

const bodyTypes = [
  'All Body Types',
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
];
const locations = ['Baghdad', 'Beirut', 'Dubai', 'Riyadh', 'Cairo'];
const newUsedOptions = ['New & Used', 'New', 'Used'];
const priceMinOptions = ['Price Min', 5000, 10000, 20000, 30000, 40000];
const priceMaxOptions = ['Price Max', 20000, 30000, 40000, 50000, 100000];

const LandingFilters = ({ setFilterCarsData, filtercarsData }) => {
  const [loading, setLoading] = useState(false);
  const [carSearch, setCarSearch] = useState([]);
  const [make, setMake] = useState('All Make');
  const [model, setModel] = useState('All Models');
  const [bodyType, setBodyType] = useState('All Body Types');
  const [location, setLocation] = useState('Baghdad');
  const [newUsed, setNewUsed] = useState('New & Used');
  const [priceMin, setPriceMin] = useState('Price Min');
  const [priceMax, setPriceMax] = useState('Price Max');
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [carCount] = useState(342642);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = {
    newUsed: useRef(),
    priceMin: useRef(),
    priceMax: useRef(),
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
        setMake(saved.make || 'All Make');
        setModel(saved.model || 'All Models');
        setBodyType(saved.body_type || 'All Body Types');
        setLocation(saved.location || 'Baghdad');
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
      setModel('All Models');
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
        make: make !== 'All' ? make : '',
        model: model !== 'All Models' ? model : '',
        body_type: bodyType !== 'All Body Types' ? bodyType : '',
        location: location !== 'Baghdad' ? location : '',
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
            handleChange(
              type === 'newUsed'
                ? 'New & Used'
                : type === 'priceMin'
                ? 'Price Min'
                : 'Price Max',
              opt
            );
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
                setModel('All Models');
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
              disabled={make === 'All Make'}
            >
              {(carModels[make] || ['All Models']).map((m) => (
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
              setOpenDropdown(openDropdown === 'newUsed' ? null : 'newUsed')
            }
            tabIndex={0}
          >
            {newUsed}{' '}
            <span className="allcars-filters-text-arrow">
              <MdKeyboardArrowDown />
            </span>
            {openDropdown === 'newUsed' &&
              renderDropdown('newUsed', newUsedOptions, newUsed, setNewUsed)}
          </div>
          <div
            className="allcars-filters-text"
            onClick={() =>
              setOpenDropdown(openDropdown === 'priceMin' ? null : 'priceMin')
            }
            tabIndex={0}
          >
            {priceMin}{' '}
            <span className="allcars-filters-text-arrow">
              <MdKeyboardArrowDown />
            </span>
            {openDropdown === 'priceMin' &&
              renderDropdown(
                'priceMin',
                priceMinOptions,
                priceMin,
                setPriceMin
              )}
          </div>
          <div
            className="allcars-filters-text"
            onClick={() =>
              setOpenDropdown(openDropdown === 'priceMax' ? null : 'priceMax')
            }
            tabIndex={0}
          >
            {priceMax}{' '}
            <span className="allcars-filters-text-arrow">
              <MdKeyboardArrowDown />
            </span>
            {openDropdown === 'priceMax' &&
              renderDropdown(
                'priceMax',
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
