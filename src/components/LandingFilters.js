/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Button, InputNumber, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../assets/styles/landingFilters.css';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
import { fetchMakeCars, fetchModelCars } from '../commonFunction/fetchMakeCars';
import { useNavigate } from 'react-router-dom';
import Searchemptymodal from '../components/searchemptymodal';
import Cardetailsfilter from '../components/cardetailsfilter';
import { useDispatch } from 'react-redux';
import { logoutUser, clearCustomerDetails } from '../redux/actions/authActions';
import {
  DEFAULT_MAKE,
  DEFAULT_MODEL,
  DEFAULT_BODY_TYPE,
  DEFAULT_LOCATION,
} from '../utils/apiUtils';
const { Option } = Select;

// Correct constants to match UI values
const CORRECT_DEFAULT_MAKE = 'All Make';
const CORRECT_DEFAULT_MODEL = 'All Models';
const CORRECT_DEFAULT_BODY_TYPE = 'All Body Types';
const CORRECT_DEFAULT_LOCATION = 'All Locations';

const DEFAULT_NEW_USED = 'New & Used';
const DEFAULT_PRICE_MIN = 'Price Min';
const DEFAULT_PRICE_MAX = 'Price Max';


const DEFAULT_CAR_COUNT = 0;
const INDIA_TZ_OFFSET_MIN = -330;
const HTTP_STATUS_UNAUTHORIZED = 401;
const TOKEN_EXPIRY_REDIRECT_DELAY_MS = 2000;

const newUsedOptions = [DEFAULT_NEW_USED, 'New', 'Used'];



const LandingFilters = ({ searchbodytype, setSaveSearchesReload }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setLoading] = useState(false);
  const [make, setMake] = useState(CORRECT_DEFAULT_MAKE);
  const [model, setModel] = useState(CORRECT_DEFAULT_MODEL);
  const [bodyType, setBodyType] = useState(CORRECT_DEFAULT_BODY_TYPE);
  const [location, setLocation] = useState(CORRECT_DEFAULT_LOCATION);
  
  
  // Force location to "All Locations" on component mount
  useEffect(() => {
    setLocation('All Locations');
  }, []);
  
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carBodyTypes, setCarBodyTypes] = useState([]);
  const [carLocation, setCarLocation] = useState([]);
  const [newUsed, setNewUsed] = useState(DEFAULT_NEW_USED);
  
  const [, setPriceMax] = useState(DEFAULT_PRICE_MAX);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setToastMsg] = useState('');
  const [showMinInput, setShowMinInput] = useState(false);
  const [showMaxInput, setShowMaxInput] = useState(false);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [carCount, setCarCount] = useState(DEFAULT_CAR_COUNT);
  const [filterVisible, setFilterVisible] = useState(false);
  const locationAsArray = (loc) => {
  if (loc && loc !== CORRECT_DEFAULT_LOCATION) {
    return [loc]; // wrap in array
  }
  return []; // default empty array
};
 const bodyTypeAsArray = (loc) => {
  if (loc && loc !== CORRECT_DEFAULT_BODY_TYPE) {
    return [loc]; // wrap in array
  }
  return []; // default empty array
};

  // Auto-search function to update car count on filter changes
  const autoSearchForCount = async () => {
    try {
      const apiParams = {
        make: valueOrEmpty(make, CORRECT_DEFAULT_MAKE),
        model: valueOrEmpty(model, CORRECT_DEFAULT_MODEL),
        body_types: bodyTypeAsArray(bodyType),
       locations: locationAsArray(location),
        price_min: minPrice !== null ? minPrice : '',
        price_max: maxPrice !== null ? maxPrice : '',
        page: 1,
        limit: 1, // We only need the count, so limit to 1 for efficiency
        ...(newUsed !== DEFAULT_NEW_USED && { condition: newUsed })
      };
      const response = await carAPI.getSearchCars(apiParams);
      const data = handleApiResponse(response);

      if (data?.data?.pagination) {
        setCarCount(data?.data?.pagination?.total ?? 0);
      }
    } catch (error) {
      // Silent error handling for auto-search
    }
  };

  const dropdownRefs = {
    newUsed: useRef(),
    priceMin: useRef(),
    priceMax: useRef(),
  };

  useEffect(() => {
    fetchMakeCars({ setLoading, setCarMakes });
    fetchtotalcarcount()
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
    if (searchbodytype) {
      setBodyType(searchbodytype);
    } else {
      setBodyType(CORRECT_DEFAULT_BODY_TYPE);
    }
  }, [searchbodytype]);

  // Combined effect for auto-search - calls once on load and after each param change
  useEffect(() => {
    // Only call search if we have the necessary data loaded
  
      autoSearchForCount();
    
  }, [make, model, location, bodyType, newUsed, minPrice, maxPrice, carMakes.length]);
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
  // Always return null to use "All Locations" as default
  return null;
};


  const handleToast = (msg) => {
    setToastMsg(msg);
    if (msg) {
      message.success(msg);
    }
  };

  const handleChange = (field, value) => {
    // This function can be used for additional logic if needed
  };

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

  const validatePriceRange = (newMin, newMax) => {
  if (
    newMin !== DEFAULT_PRICE_MIN &&
    newMax !== DEFAULT_PRICE_MAX &&
    Number(newMin) > Number(newMax)
  ) {
    setPriceMax(DEFAULT_PRICE_MAX); // reset to default
    messageApi.open({
      type: 'warning',
      content: "Max price can't be lesser than Min price.",
    });
  }
};
  const handleSearch = async () => {
    try {
      setLoading(true);

      const cleanedMin = minPrice !== null ? minPrice : '';
    const cleanedMax = maxPrice !== null ? maxPrice : '';

      const params = {
        make: valueOrEmpty(make, CORRECT_DEFAULT_MAKE),
        model: valueOrEmpty(model, CORRECT_DEFAULT_MODEL),
        body_types: bodyTypeAsArray(bodyType),
        // location: valueOrEmpty(location, CORRECT_DEFAULT_LOCATION),
        locations: locationAsArray(location),
         price_min: cleanedMin,
      price_max: cleanedMax,
        condition: newUsed === DEFAULT_NEW_USED ? '' : newUsed,
      };


    
      const response = await carAPI.getSearchCars(params);
      const data1 = handleApiResponse(response);

      if (data1) {
        const results = data1?.data?.cars || [];

        // Update car count from pagination
        if (data1.data.pagination && data1.data.pagination.total !== undefined) {
          setCarCount(data1?.data?.pagination?.total);
        }

        if (results.length === 0) {
          setIsModalOpen(true);
        } else {
          navigate('/allcars', {
            state: { 
              cars: results, 
              pagination: data1?.data?.pagination,
              // Pass selected filter values
              selectedMake: make,
              selectedModel: model,
              selectedBodyType: bodyType,
              selectedLocation: location,
              selectedNewUsed: newUsed,
              selectedPriceMin: minPrice,
              selectedPriceMax: maxPrice
            },
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
           if (type === 'priceMin') {
          validatePriceRange(opt, maxPrice);
        }
        if (type === 'priceMax') {
          validatePriceRange(minPrice, opt);
        }
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

  const fetchtotalcarcount = async () => {
  try {
    setLoading(true);
    const response = await carAPI.totalcarscount();
    const data1 = handleApiResponse(response);

    if (data1?.total_cars !== undefined) {
      setCarCount(data1.total_cars); 
    } else {
      message.error('No content found');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message);
  } finally {
    setLoading(false);
  }
};


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
  placeholder="All Make"
  showSearch
  allowClear
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
  onClear={() => {
    setMake(CORRECT_DEFAULT_MAKE);
  }}
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
  placeholder="All Models"
  showSearch
  allowClear
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
  onClear={() => {
    setModel(CORRECT_DEFAULT_MODEL);
  }}
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
  placeholder="All Body Types"
  showSearch
  allowClear
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
  onClear={() => {
    setBodyType(CORRECT_DEFAULT_BODY_TYPE);
  }}
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
  placeholder="All Locations"
  showSearch
  allowClear
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
  onClear={() => {
    setLocation(CORRECT_DEFAULT_LOCATION);
  }}
>
  <Option key="all-locations" value="All Locations">
    All Locations
  </Option>
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
            {/* Price Min */}
<div>
  {!showMinInput ? (
    <button
      type="button"
      style={{
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '15px',
        color: '#fff',
        minWidth: '100px',
        textAlign: 'center',
        fontWeight: 700,
        background: 'transparent',
        border: 'none',
      }}
      onClick={() => setShowMinInput(true)}
      aria-label="Set minimum price"
    >
      {minPrice !== null ? `₹${minPrice}` : 'Price Min'}
    </button>
  ) : (
   <Input
  style={{ width: '100px' }}
  type="tel"
  value={minPrice}
  placeholder="Min"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ''); // allow only digits
    setMinPrice(value ? Number(value) : null);
  }}
  onBlur={() => {
    if (minPrice === null) setShowMinInput(false);
  }}
/>

  )}
</div>

{/* Price Max */}
<div>
  {!showMaxInput ? (
    <button
      type="button"
      style={{
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '15px',
        color: '#fff',
        minWidth: '100px',
        textAlign: 'center',
        fontWeight: 700,
        background: 'transparent',
        border: 'none',
      }}
      onClick={() => setShowMaxInput(true)}
      aria-label="Set maximum price"
    >
      {maxPrice !== null ? `₹${maxPrice}` : 'Price Max'}
    </button>
  ) : (
   <Input
  style={{ width: '120px' }}
  type="tel" // use tel so numeric keypad shows on mobile
  value={maxPrice}
  placeholder="Max"
  onChange={(e) => {
    // Allow only digits
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setMaxPrice(digitsOnly ? Number(digitsOnly) : null);
  }}
  onBlur={() => {
    if (maxPrice === null) setShowMaxInput(false);

    // Validation checks on blur
    if (maxPrice > 5000000000) {
      messageApi.error('Maximum allowed price is ₹5,000,000,000');
      setMaxPrice(5000000000); // optional: reset to max limit
    }

    if (minPrice !== null && maxPrice <= minPrice) {
      messageApi.error('Maximum price should be greater than Minimum price');
    }
  }}
/>

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
        priceMin={minPrice}               
        setPriceMin={setMinPrice}         
        priceMax={maxPrice}              
        setPriceMax={setMaxPrice}         
        newUsed={newUsed}                  
        setNewUsed={setNewUsed}
        onSave={handleSearch}
        setSaveSearchesReload={setSaveSearchesReload}
        
      />
    </div>
  );
};

export default LandingFilters;

LandingFilters.propTypes = {
  searchbodytype: PropTypes.string,
  setSaveSearchesReload: PropTypes.func,
};