/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Button, message, InputNumber } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Cardetailsfilter from '../components/cardetailsfilter';
import { fetchMakeCars ,fetchModelCars} from '../commonFunction/fetchMakeCars';
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
const carModelsMock = {
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
const locations = ['All Locations', 'Baghdad', 'Beirut', 'Dubai', 'Riyadh', 'Cairo'];
const newUsedOptions = [DEFAULTS.NEW_USED, 'New', 'Used'];
const PRICE_MIN_VALUES = [5000, 10000, 20000, 30000, 40000];
const PRICE_MAX_VALUES = [20000, 30000, 40000, 50000, 100000];
const priceMinOptions = [DEFAULTS.PRICE_MIN, ...PRICE_MIN_VALUES];
const priceMaxOptions = [DEFAULTS.PRICE_MAX, ...PRICE_MAX_VALUES];
const DEFAULT_CAR_COUNT = 0;

const LandingFilters = ({ setFilterCarsData, filtercarsData: _filtercarsData, sortedbydata, setSelectedLocation, setIsLoading }) => {
  const [, setLoading] = useState(false);
  const [, setCarSearch] = useState([]);
  const [carLocation,setCarLocation]=useState()
  const [carMakes, setCarMakes] = useState([DEFAULTS.ALL_MAKE, 'Toyota', 'Honda', 'BMW', 'Mercedes', 'Hyundai']);

// Initialize make from localStorage if available
const getInitialMake = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.make && saved.make !== '') {
      return saved.make;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.ALL_MAKE;
};

const [make, setMake] = useState(getInitialMake);

// Initialize model from localStorage if available
const getInitialModel = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.model && saved.model !== '') {
      return saved.model;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.ALL_MODELS;
};

  const [model, setModel] = useState(getInitialModel);
// Initialize bodyType from localStorage if available
const getInitialBodyType = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.body_type && saved.body_type !== '') {
      return saved.body_type;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.ALL_BODY_TYPES;
};

  const [bodyType, setBodyType] = useState(getInitialBodyType);
   const [carModels, setCarModels] = useState([]);
    const [carBodyTypes, setCarBodyTypes] = useState(bodyTypes);
// Initialize location from localStorage if available
const getInitialLocation = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.location && saved.location !== '') {
      return saved.location;
    }
  } catch (e) {
    // Silent error handling
  }
  return 'All Locations';
};

  const [location, setLocation] = useState(getInitialLocation);

// Initialize newUsed from localStorage if available
const getInitialNewUsed = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.condition && saved.condition !== '') {
      return saved.condition;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.NEW_USED;
};

// Initialize priceMin from localStorage if available
const getInitialPriceMin = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.price_min && saved.price_min !== '') {
      return saved.price_min;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.PRICE_MIN;
};

// Initialize priceMax from localStorage if available
const getInitialPriceMax = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.price_max && saved.price_max !== '') {
      return saved.price_max;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.PRICE_MAX;
};

  const [newUsed, setNewUsed] = useState(getInitialNewUsed);
  const [priceMin, setPriceMin] = useState(getInitialPriceMin);
  const [priceMax, setPriceMax] = useState(getInitialPriceMax);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
   const [showMinInput, setShowMinInput] = useState(false);
    const [showMaxInput, setShowMaxInput] = useState(false);

// Initialize minPrice and maxPrice from localStorage if available
const getInitialMinPrice = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.price_min && saved.price_min !== '') {
      return parseFloat(saved.price_min);
    }
  } catch (e) {
    // Silent error handling
  }
  return null;
};

const getInitialMaxPrice = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved && saved.price_max && saved.price_max !== '') {
      return parseFloat(saved.price_max);
    }
  } catch (e) {
    // Silent error handling
  }
  return null;
};

    const [minPrice, setMinPrice] = useState(getInitialMinPrice);
    const [maxPrice, setMaxPrice] = useState(getInitialMaxPrice);
  const dropdownRefs = {
    [DROPDOWN_NEW_USED]: useRef(),
    [DROPDOWN_PRICE_MIN]: useRef(),
    [DROPDOWN_PRICE_MAX]: useRef(),
  };
  const [filterVisible, setFilterVisible] = useState(false);
  const [carCount, setCarCount] = useState(DEFAULT_CAR_COUNT);

  // Auto-search function to update car count on filter changes
  const autoSearchForCount = async (filterParams = {}) => {
    try {
      const currentMake = filterParams.make !== undefined ? filterParams.make : make;
      const currentModel = filterParams.model !== undefined ? filterParams.model : model;
      const currentLocation = filterParams.location !== undefined ? filterParams.location : location;
      const currentBodyType = filterParams.bodyType !== undefined ? filterParams.bodyType : bodyType;

      const apiParams = {
        make: currentMake === DEFAULTS.ALL_MAKE ? '' : currentMake,
        model: currentModel === DEFAULTS.ALL_MODELS ? '' : currentModel,
        body_type: currentBodyType === DEFAULTS.ALL_BODY_TYPES ? '' : currentBodyType,
        location: currentLocation === 'All Locations' ? '' : (currentLocation || ''),
        price_min: minPrice !== null ? minPrice : '',
        price_max: maxPrice !== null ? maxPrice : '',
        condition: newUsed === DEFAULTS.NEW_USED ? '' : newUsed,
        page: 1,
        limit: 1, // We only need the count, so limit to 1 for efficiency
      };

      const response = await carAPI.getSearchCars(apiParams);
      const data = handleApiResponse(response);

      if (data && data.data && data.data.pagination) {
        setCarCount(data.data.pagination.total);
      }
    } catch (error) {
      console.warn('Auto-search for count failed:', error);
    if(error?.message==='Network Error' ){ messageApi.open({
            type: 'error',
            content:'You’re offline! Please check your network connection and try again.',
          });
        }
    }
  };

    useEffect(() => {
      fetchMakeCars({ setLoading, setCarMakes });
      // fetchtotalcarcount();
    }, []);


useEffect(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    
    if (saved && saved.location && saved.location !== '') {
      setLocation(saved.location);
      if (setSelectedLocation) {
        setSelectedLocation(saved.location);
      }
    } else {
      setLocation('All Locations');
    }
  } catch (e) {
    setLocation('All Locations');
  }
}, [setSelectedLocation]);

// Trigger search on component mount if there are saved filter values
useEffect(() => {
  const hasSavedFilters = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('searchcardata'));
      return saved && (
        (saved.make && saved.make !== '') ||
        (saved.model && saved.model !== '') ||
        (saved.body_type && saved.body_type !== '') ||
        (saved.price_min && saved.price_min !== '') ||
        (saved.price_max && saved.price_max !== '')
      );
    } catch (e) {
      return false;
    }
  };

  // Only trigger search if there are meaningful saved filters
  if (hasSavedFilters()) {
    // Small delay to ensure all state is initialized
    const timer = setTimeout(() => {
      handleSearch();
    }, 100);
    return () => clearTimeout(timer);
  }
}, []); // Empty dependency array - only run on mount

// Temporary: Add a function to manually clear localStorage (for debugging)
useEffect(() => {
fetchRegionCars()
}, []);


  useEffect(() => {
    if (make && make !== DEFAULTS.ALL_MAKE) {
      fetchModelCars({ setLoading, setCarModels, make }).then(() => {
        // Only reset model if it's not already set from localStorage
        const saved = JSON.parse(localStorage.getItem('searchcardata'));
        if (!saved || !saved.model || saved.model === '') {
          setModel(DEFAULTS.ALL_MODELS);
        }
      });
    } else {
      setCarModels([]);
      setModel(DEFAULTS.ALL_MODELS);
    }
    
    // Auto-search for count when make changes
    autoSearchForCount({ make });
  }, [make]);

  useEffect(() => {
    // Fetch body types on component mount
    fetchBodyTypeCars();
    
    // Fetch models if there's a saved make
    try {
      const saved = JSON.parse(localStorage.getItem('searchcardata'));
      if (saved && saved.make && saved.make !== '' && saved.make !== DEFAULTS.ALL_MAKE) {
        fetchModelCars({ setLoading, setCarModels, make: saved.make });
      }
    } catch (e) {
      // Silent error handling
    }
  }, []);

  useEffect(() => {
handleSearch()
  }, [sortedbydata]);
  
  useEffect(() => {
    if (make) {
      fetchModelCars({ setLoading, setCarModels, make });
    }
    // Only reset body type if it's not already set from localStorage
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (!saved || !saved.body_type || saved.body_type === '') {
      setBodyType(DEFAULTS.ALL_BODY_TYPES);
    }
  }, [make]);

  // Auto-search for count when model changes
  useEffect(() => {
    autoSearchForCount({ model });
  }, [model]);

  // Auto-search for count when location changes
  useEffect(() => {
    autoSearchForCount({ location });
  }, [location]);

  // Auto-search for count when body type changes
  useEffect(() => {
    autoSearchForCount({ bodyType });
  }, [bodyType]);
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
      console.log('geoData',geoData)
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

  const handleToast = (msg) => {
    if (msg) {
      message.success(msg);
    }
  };

  const handleSearch = async () => {
    let sortbynewlist = false;
  let sortbyold = false;
  let sortbypriceormileage = '';
  let sortorder = '';

  switch (sortedbydata) {
    case 'Newest Listing':
      sortbynewlist = true;
      break;

    case 'Oldest Listing':
      sortbyold = true;
      break;

    case 'Price : Low to High':
      sortbypriceormileage = 'price';
      sortorder = 'asc';
      break;

    case 'Price : High to Low':
      sortbypriceormileage = 'price';
      sortorder = 'desc';
      break;

    case 'Mileage: Low to High':
      sortbypriceormileage = 'mileage';
      sortorder = 'asc';
      break;

    case 'Mileage: High to Low':
      sortbypriceormileage = 'mileage';
      sortorder = 'desc';
      break;

    default:
      // No sort selected, keep defaults
      break;
  }
    const saveParams = {
      make: make === DEFAULTS.ALL_MAKE ? '' : make,
      model: model === DEFAULTS.ALL_MODELS ? '' : model,
      body_type: bodyType === DEFAULTS.ALL_BODY_TYPES ? '' : bodyType,
      location: location === 'All Locations' ? '' : (location || ''),
      newUsed: newUsed === DEFAULTS.NEW_USED ? '' : newUsed,
      priceMin,
      priceMax,
      newest_listing: sortbynewlist,
      oldest_listing: sortbyold,
      sort_by: sortbypriceormileage,
      sort_order: sortorder,
    };



    // Save filters to localStorage
    localStorage.setItem('searchcardata', JSON.stringify(saveParams));
    // Update breadcrumb directly via prop
    if (setSelectedLocation) {
      setSelectedLocation(location);
    }
    // Dispatch custom event to update breadcrumb (fallback)
    window.dispatchEvent(new CustomEvent('searchDataUpdated'));
    message.success('Filters saved!');

    try {
      setLoading(true);
       const cleanedMin = minPrice !== null ? minPrice : '';
    const cleanedMax = maxPrice !== null ? maxPrice : '';
      const apiParams = {
        make: '',
        model: '',
        body_type: '',
        location: '',
        price_min: cleanedMin,
      price_max: cleanedMax,
      newest_listing: sortbynewlist,
      oldest_listing: sortbyold,
      sort_by: sortbypriceormileage,
      sort_order: sortorder,
      };
       // Handle make parameter
       if (make === DEFAULTS.ALL_MAKE) {
         apiParams.make = '';
       } else {
         apiParams.make = make;
       }
      if (model !== DEFAULTS.ALL_MODELS) {
        apiParams.model = model;
      } else {
        apiParams.model = '';
      }
      if (bodyType !== DEFAULTS.ALL_BODY_TYPES) {
        apiParams.body_type = bodyType;
      } else {
        apiParams.body_type = '';
      }
      if (location && location !== '' && location !== 'All Locations') {
        apiParams.location = location;
      } else {
        apiParams.location = '';
      }

      // if (newUsed !== '') {
      //   apiParams.condition = newUsed;
      // } else {
      //   apiParams.condition = '';
      // }

      // Set loading state and clear previous data immediately
      if (setIsLoading) {
        setIsLoading(true);
      }
      // Clear previous search results immediately when new search starts
      setFilterCarsData({ cars: [], pagination: {} });
      // Also clear any c
      // ached search results
      setCarSearch([]);
      // Clear only non-essential cached data, preserve searchcardata and filter options
      localStorage.removeItem('cachedCarsData');
      localStorage.removeItem('carsData');
      localStorage.removeItem('filterData');
      localStorage.removeItem('carSearchData');
      localStorage.removeItem('savedCarsData');

      const response = await carAPI.getSearchCars(apiParams);
      const data1 = handleApiResponse(response);

      if (data1) {
        const results = data1?.data?.cars || [];
        setCarSearch(results);

        // Update car count from pagination
        if (data1.data.pagination && data1.data.pagination.total !== undefined) {
          setCarCount(data1.data.pagination.total);
        }

        if (results.length === 0) {
          setIsModalOpen(true);
          setFilterCarsData({ cars: [], pagination: {} });
        } else {
          setFilterCarsData({ cars: [], pagination: {} });
          setFilterCarsData({
            cars: data1.data.cars || [],
            pagination: data1.data.pagination || {}
          });
          localStorage.setItem('searchcardata', JSON.stringify(apiParams));
          if (setSelectedLocation) {
            setSelectedLocation(location);
          }
          window.dispatchEvent(new CustomEvent('searchDataUpdated'));
          // messageApi.open({
          //   type: 'success',
          //   content: data1?.message,
          // });
        }
      }
    } catch (error) {
      const errorData = handleApiError(error);
    if(error?.message==='Network Error' ){ messageApi.open({
            type: 'error',
            content:'You’re offline! Please check your network connection and try again.',
          });
        }
      message.error(errorData.message || 'Failed to search car data');
      setCarSearch([]);
    } finally {
      setLoading(false);
      // Clear loading state
      if (setIsLoading) {
        setIsLoading(false);
      }
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
    <div className="allcars-filters-outer">
      {contextHolder}
      <div className="allcars-filters-bar">
        <div className="allcars-filters-row">
          <div className="allcars-filters-col">
            <label className="allcars-filters-label" htmlFor="make-select">Make</label>
            <Select
  id="make-select"
  value={make}
  showSearch
  allowClear
  placeholder="Select Make"
  onChange={(value) => {
    setMake(value || DEFAULTS.ALL_MAKE); // Reset to default if cleared
    setModel(DEFAULTS.ALL_MODELS);
    handleChange('Make', value || DEFAULTS.ALL_MAKE);
  }}
  className="allcars-filters-select"
  size="large"
  dropdownClassName="allcars-filters-dropdown"
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
>
  {carMakes.map((m) => (
    <Option key={m?.name} value={m?.name}>
      {m?.name}
    </Option>
  ))}
</Select>

          </div>
          <div className="allcars-filters-col">
            <label className="allcars-filters-label" htmlFor="model-select">Model</label>
            <Select
  id="model-select"
  value={model}
  showSearch
  allowClear
  placeholder="Select Model"
  onChange={(value) => {
    setModel(value || DEFAULTS.ALL_MODELS);
    handleChange('Model', value || DEFAULTS.ALL_MODELS);
  }}
  className="allcars-filters-select"
  size="large"
  dropdownClassName="allcars-filters-dropdown"
  disabled={make === DEFAULTS.ALL_MAKE}
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
>
  {carModels?.map((m) => (
    <Option key={m.model_name} value={m.model_name}>
      {m.model_name}
    </Option>
  ))}
</Select>


          </div>
          <div className="allcars-filters-col">
            <label className="allcars-filters-label" htmlFor="bodytype-select">Body Type</label>
            <Select
  id="bodytype-select"
  value={bodyType}
  showSearch
  allowClear
  placeholder="Select Body Type"
  onChange={(value) => {
    setBodyType(value || DEFAULTS.ALL_BODY_TYPES);
    handleChange('Body Type', value || DEFAULTS.ALL_BODY_TYPES);
  }}
  className="allcars-filters-select"
  size="large"
  dropdownClassName="allcars-filters-dropdown"
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
>
  {carBodyTypes.map((b) => (
    <Option key={b?.body_type} value={b?.body_type}>
      {b?.body_type}
    </Option>
  ))}
</Select>

          </div>
          <div className="allcars-filters-col">
            <label className="allcars-filters-label" htmlFor="location-select">Location</label>
            <Select
  id="location-select"
  value={location}
  showSearch
  allowClear
  placeholder="Select Location"
  onChange={(value) => {
    const selectedValue = value || DEFAULTS.ALL_LOCATIONS;
    setLocation(selectedValue);
    handleChange('Location', selectedValue);

    // Update breadcrumb directly via prop
    if (setSelectedLocation) {
      setSelectedLocation(selectedValue);
    }

    // Dispatch custom event to update breadcrumb (fallback)
    window.dispatchEvent(new CustomEvent('searchDataUpdated'));
  }}
  className="allcars-filters-select"
  size="large"
  dropdownClassName="allcars-filters-dropdown"
  filterOption={(input, option) =>
    option?.children?.toLowerCase().includes(input.toLowerCase())
  }
>
  {carLocation?.map((l) => (
    <Option key={l?.id} value={l?.location}>
      {l?.location}
    </Option>
  ))}
</Select>

          </div>

          <Cardetailsfilter
            visible={filterVisible}
            onClose={() => setFilterVisible(false)}
            make={make}
            model={model}
            bodyType={bodyType}
            location={location}
            onSearchResults={(searchResults) => {
              if (searchResults?.data !== undefined) {
                setFilterCarsData(searchResults.data);
                setFilterVisible(false);
              }
            }}
          />

          <div className="allcars-filters-col allcars-filters-btn-col">
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
          <div className="landing-filters-row landing-filters-row-text">
         
            {/* Price Min */}
<div>
  {!showMinInput ? (
    <div
      style={{
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '15px',
        color: '#008AD5',
        minWidth: '100px',
        textAlign: 'center',
        fontWeight: 400,
      }}
      onClick={() => setShowMinInput(true)}
    >
      {minPrice !== null ? `₹${minPrice}` : 'Price Min'}
    </div>
  ) : (
    <InputNumber
      style={{ width: '100px' }}
      min={0}
      value={minPrice}
      onChange={(value) => {
        if (maxPrice !== null && value >= maxPrice) {
          messageApi.error('Minimum price should be less than Maximum price');
          return;
        }
        setMinPrice(value);
      }}
      onBlur={() => {
        if (minPrice === null) setShowMinInput(false);
      }}
      placeholder="Min"
    />
  )}
</div>

{/* Price Max */}
<div>
  {!showMaxInput ? (
    <div
      style={{
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '15px',
        color: '#008AD5',
        minWidth: '100px',
        textAlign: 'center',
        fontWeight: 400,
      }}
      onClick={() => setShowMaxInput(true)}
    >
      {maxPrice !== null ? `₹${maxPrice}` : 'Price Max'}
    </div>
  ) : (
    <InputNumber
      style={{ width: '120px' }}
      min={0}
      value={maxPrice}
      onChange={(value) => {
        if (value > 5000000000) {
          messageApi.error('Maximum allowed price is ₹5,000,000,000');
          return;
        }
        if (minPrice !== null && value <= minPrice) {
          messageApi.error('Maximum price should be greater than Minimum price');
          return;
        }
        setMaxPrice(value);
      }}
      onBlur={() => {
        if (maxPrice === null) setShowMaxInput(false);
      }}
      placeholder="Max"
    />
  )}
</div>


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
        onSave={handleSearch}
        setSaveSearchesReload={() => {}}
      />
    </div>
  );
};

export default LandingFilters;
 
LandingFilters.propTypes = {
  setFilterCarsData: PropTypes.func.isRequired,
  filtercarsData: PropTypes.any,
  sortedbydata: PropTypes.string,
  setSelectedLocation: PropTypes.func,
  setIsLoading: PropTypes.func,
};