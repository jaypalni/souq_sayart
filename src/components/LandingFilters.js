/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../assets/styles/landingFilters.css';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
import { fetchMakeCars, fetchModelCars } from '../commonFunction/fetchMakeCars';
import { useNavigate } from 'react-router-dom';
import Searchemptymodal from '../components/searchemptymodal';
import { useDispatch } from 'react-redux';
import { logoutUser, clearCustomerDetails } from '../redux/actions/authActions';
import {
  DEFAULT_MAKE,
  DEFAULT_MODEL,
  DEFAULT_BODY_TYPE,
  DEFAULT_LOCATION,
} from '../utils/apiUtils';
const { Option } = Select;

const DEFAULT_NEW_USED = 'New & Used';
const DEFAULT_PRICE_MIN = 'Price Min';
const DEFAULT_PRICE_MAX = 'Price Max';

// Price constants to avoid magic numbers
const PRICE_5K = 5000;
const PRICE_10K = 10000;
const PRICE_20K = 20000;
const PRICE_30K = 30000;
const PRICE_40K = 40000;
const PRICE_50K = 50000;
const PRICE_100K = 100000;

const PRICE_MIN_VALUES = Object.freeze([
  PRICE_5K,
  PRICE_10K,
  PRICE_20K,
  PRICE_30K,
  PRICE_40K,
]);
const PRICE_MAX_VALUES = Object.freeze([
  PRICE_20K,
  PRICE_30K,
  PRICE_40K,
  PRICE_50K,
  PRICE_100K,
]);
const DEFAULT_CAR_COUNT = 342642;
const INDIA_TZ_OFFSET_MIN = -330;
const HTTP_STATUS_UNAUTHORIZED = 401;
const TOKEN_EXPIRY_REDIRECT_DELAY_MS = 2000;

const newUsedOptions = [DEFAULT_NEW_USED, 'New', 'Used'];
const priceMinOptions = [DEFAULT_PRICE_MIN, ...PRICE_MIN_VALUES];
const priceMaxOptions = [DEFAULT_PRICE_MAX, ...PRICE_MAX_VALUES];



const LandingFilters = ({ searchbodytype }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setLoading] = useState(false);
  const [make, setMake] = useState(DEFAULT_MAKE);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [bodyType, setBodyType] = useState(DEFAULT_BODY_TYPE);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carBodyTypes, setCarBodyTypes] = useState([]);
  const [carLocation, setCarLocation] = useState([]);
  const [newUsed, setNewUsed] = useState(DEFAULT_NEW_USED);
  const [priceMin, setPriceMin] = useState(DEFAULT_PRICE_MIN);
  const [priceMax, setPriceMax] = useState(DEFAULT_PRICE_MAX);
  const carCount = DEFAULT_CAR_COUNT;
  const [openDropdown, setOpenDropdown] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setToastMsg] = useState('');

  const dropdownRefs = {
    newUsed: useRef(),
    priceMin: useRef(),
    priceMax: useRef(),
  };

  useEffect(() => {
    fetchMakeCars({ setLoading, setCarMakes });
  }, []);

  useEffect(() => {
    if (make) {
      fetchModelCars({ setLoading, setCarModels, make });
    }
  }, [make]);

  useEffect(() => {
    if (model) {
      fetchBodyTypeCars();
    }
  }, []);

  useEffect(() => {
    if (bodyType) {
      fetchRegionCars();
    }
  }, []);

  useEffect(() => {
    setBodyType(searchbodytype);
  }, [searchbodytype]);

  const fetchBodyTypeCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getBodyCars({});
      const data1 = handleApiResponse(response);

      if (data1) {
        setCarBodyTypes(data1?.data);
      }

      message.success(data1.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to Make car data');
      setCarBodyTypes([]);
    } finally {
      setLoading(false);
    }
  };

const fetchRegionCars = async () => {
  try {
    setLoading(true);
    const response = await carAPI.getLocationCars({});
    const data1 = handleApiResponse(response);

   if (!data1) {
      message.error('No location data received');
      setCarLocation([]);
      return;
    }

    const locations = data1?.data || [];
    setCarLocation(locations);

    const geoData = await getGeoData();
    const defaultLocation = resolveDefaultLocation(locations, geoData);

    if (defaultLocation) {
      setLocation(defaultLocation.location);
    }


    message.success(data1?.message || 'Fetched successfully');
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to fetch location data');
    setCarLocation([]);
  } finally {
    setLoading(false);
  }
};

const getGeoData = async () => {
  try {
    const cacheKey = 'geoDataCache';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      const maxAgeMs = 24 * 60 * 60 * 1000; 
      if (parsed?.ts && Date.now() - parsed.ts < maxAgeMs && parsed?.data) {
        return parsed.data;
      }
    }

    const geoRes = await fetch('https://ipapi.co/json/');
    if (!geoRes.ok) {
      throw new Error(`Geo API error: ${geoRes.status}`);
    }

    const geoData = await geoRes.json();

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        ts: Date.now(),
        data: geoData,
      }),
    );

    return geoData;
  } catch (error) {
    return null;
  }
};

const resolveDefaultLocation = (locations, geoData) => {
  if (!locations || locations.length === 0) {
    return null;
  }

  const geoMatch = getLocationFromGeo(locations, geoData);
  if (geoMatch) {
    return geoMatch;
  }

  if (isIndiaLocale()) {
    return (
      locations.find((loc) => loc.location.toLowerCase() === 'india') ||
      locations.find((loc) => loc.location.toLowerCase() === 'dubai')
    );
  }

  return locations[0];
};

const getLocationFromGeo = (locations, geoData) => {
  if (!geoData) {
    return null;
  }

  const userCountry = geoData?.country_name?.toLowerCase();
  return (
    locations.find((loc) => loc.location.toLowerCase() === userCountry) || null
  );
};

const isIndiaLocale = () => {
  const tz =
    Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() || '';
  const tzOffset = new Date().getTimezoneOffset();
  const langs = [navigator.language, ...(navigator.languages || [])].filter(
    Boolean,
  );

  const hasIndiaLanguage = langs.some((l) => {
    const ll = String(l).toLowerCase();
    return ll.endsWith('-in') || ll === 'en-in' || ll.includes('-in');
  });

  return (
    tz === 'asia/kolkata' ||
    tz === 'asia/calcutta' ||
    tzOffset === INDIA_TZ_OFFSET_MIN ||
    hasIndiaLanguage
  );
};

  const handleToast = (msg) => {
    setToastMsg(msg);
    if (msg) {
      message.success(msg);
    }
  };

  const handleChange = () => {};

  const getDropdownLabel = (type) => {
    if (type === 'newUsed') {
      return 'New & Used';
    }
    if (type === 'priceMin') {
      return 'Price Min';
    }
    return 'Price Max';
  };

  const valueOrEmpty = (currentValue, defaultValue) => {
    if (currentValue !== defaultValue) {
      return currentValue;
    }
    return '';
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const params = {
        make: valueOrEmpty(make, DEFAULT_MAKE),
        model: valueOrEmpty(model, DEFAULT_MODEL),
        body_type: valueOrEmpty(bodyType, DEFAULT_BODY_TYPE),
        location: valueOrEmpty(location, DEFAULT_LOCATION),
        price_min: priceMin !== DEFAULT_PRICE_MIN ? priceMin : '',
        price_max: priceMax !== DEFAULT_PRICE_MAX ? priceMax : '',
        condition: newUsed === DEFAULT_NEW_USED ? '' : newUsed,
      };

      const response = await carAPI.getSearchCars(params);
      const data1 = handleApiResponse(response);

      if (data1) {
        const results = data1?.data?.cars || [];

        if (results.length === 0) {
          setIsModalOpen(true);
        } else {
          navigate('/allcars', {
            state: { cars: results, pagination: data1?.data?.pagination },
          });
          localStorage.setItem('searchcardata', JSON.stringify(params));
        }
      }
    } catch (error) {
      const errorData = handleApiError(error);

      if (errorData.status === HTTP_STATUS_UNAUTHORIZED) {
        messageApi.open({
          type: 'error',
          content: 'Your session has expired. Please log in again.',
        });

        setTimeout(() => {
          (async () => {
            localStorage.removeItem('token');
            localStorage.clear();

            await dispatch(logoutUser());
            dispatch(clearCustomerDetails());
            dispatch({ type: 'CLEAR_USER_DATA' });

            navigate('/login');
          })();
        }, TOKEN_EXPIRY_REDIRECT_DELAY_MS);
      } else {
        messageApi.open({
          type: 'error',
          content: errorData.message,
        });
      }

      
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (type) => {
    if (openDropdown === type) {
      setOpenDropdown(null);
      return;
    }
    setOpenDropdown(type);
  };

  React.useEffect(() => {
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

  const renderDropdown = (type, options, value, setValue) => (
    <div
      className="landing-filters-dropdown-menu"
      ref={dropdownRefs[type]}
      role="menu"
    >
      {options.map((opt) => {
        const label = getDropdownLabel(type);
        const onSelect = () => {
          setValue(opt);
          handleChange(label, opt);
          setOpenDropdown(null);
        };
        return (
          <div
            key={opt}
            className={(function buildClass() {
              let cls = 'landing-filters-dropdown-item';
              if (value === opt) {
                cls += ' selected';
              }
              return cls;
            })()}
            role="menuitem"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect();
              }
            }}
          >
            {opt}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="landing-filters-outer">
      {contextHolder}
      <div className="landing-filters-bar">
        <div className="landing-filters-row">
          <div className="landing-filters-col">
            <label className="landing-filters-label" htmlFor="make-select">Make</label>
            <Select
              id="make-select"
              value={make}
              onChange={(value) => {
                setMake(value);
                setModel('All Models');
                handleChange('Make', value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
              placeholder="All Models"
            >
              {carMakes.map((m) => (
                <Option key={m.id} value={m.name}>
                  {m.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label" htmlFor="model-select">Model</label>
            <Select
              id="model-select"
              value={model}
              onChange={(value) => {
                setModel(value);
                handleChange('Model', value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
              disabled={make === 'All Make'}
            >
              {carModels?.map((m) => (
                <Option key={m.id} value={m.model_name}>
                  {m.model_name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label" htmlFor="bodytype-select">Body Type</label>
            <Select
              id="bodytype-select"
              value={bodyType}
              onChange={(value) => {
                setBodyType(value);
                handleChange('Body Type', value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
            >
              {carBodyTypes.map((b) => (
                <Option key={b.id} value={b.body_type}>
                  {b.body_type}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label" htmlFor="location-select">Location</label>
            <Select
              id="location-select"
              value={location}
              onChange={(value) => {
                setLocation(value);
                handleChange('Location', value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
            >
              {carLocation.map((l) => (
                <Option key={l.id} value={l.location}>
                  {l.location}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col landing-filters-btn-col">
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              className="landing-filters-btn"
            >
              <span>Show {carCount.toLocaleString()} Cars</span>
            </Button>
          </div>
        </div>
        <div className="landing-filters-row landing-filters-row-text">
          <button
            type="button"
            className="landing-filters-text"
            onClick={() => toggleDropdown('newUsed')}
            style={{ background: 'transparent', border: 'none', padding: 0 }}
          >
            <span className="landing-filters-text-label">{newUsed}</span>
            <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === 'newUsed' &&
              renderDropdown('newUsed', newUsedOptions, newUsed, setNewUsed)}
          </button>
          <button
            type="button"
            className="landing-filters-text"
            onClick={() => toggleDropdown('priceMin')}
            style={{ background: 'transparent', border: 'none', padding: 0 }}
          >
            <span className="landing-filters-text-label">{priceMin}</span>
            <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === 'priceMin' &&
              renderDropdown(
                'priceMin',
                priceMinOptions,
                priceMin,
                setPriceMin,
              )}
          </button>
          <button
            type="button"
            className="landing-filters-text"
            onClick={() => toggleDropdown('priceMax')}
            style={{ background: 'transparent', border: 'none', padding: 0 }}
          >
            <span className="landing-filters-text-label">{priceMax}</span>
            <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === 'priceMax' &&
              renderDropdown(
                'priceMax',
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
  searchbodytype: PropTypes.string,
};