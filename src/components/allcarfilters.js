/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Button, message, Input } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Cardetailsfilter from '../components/cardetailsfilter';
import { fetchMakeCars ,fetchModelCars} from '../commonFunction/fetchMakeCars';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError, DEFAULT_MAKE, DEFAULT_MODEL, DEFAULT_BODY_TYPE, DEFAULT_LOCATION } from '../utils/apiUtils';
import '../assets/styles/allcarfilters.css';
import Searchemptymodal from '../components/searchemptymodal';
import { type } from '@testing-library/user-event/dist/type';

const { Option } = Select;

const DEFAULTS = {
  ALL_MAKE: 'All Make',
  ALL_MODELS: 'All Models',
  ALL_BODY_TYPES: 'All Body Types',
  ALL_LOCATIONS: 'All Locations',
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

const LandingFilters = ({ 
  setFilterCarsData, 
  filtercarsData: _filtercarsData, 
  sortedbydata, 
  setSelectedLocation, 
  setIsLoading,
  limit,
  currentPage, 
  setCurrentPage, 
  featuredorrecommended, 
  onClearFeaturedOrRecommended,
  setIsnetworkError,
  selectedMake: propSelectedMake,
  selectedModel: propSelectedModel,
  selectedBodyType: propSelectedBodyType,
  selectedLocation: propSelectedLocation,
  selectedNewUsed: propSelectedNewUsed,
  selectedPriceMin: propSelectedPriceMin,
  selectedPriceMax: propSelectedPriceMax
}) => {
  const [, setLoading] = useState(false);
  const [, setCarSearch] = useState([]);
  const [carLocation,setCarLocation]=useState()
  const [carMakes, setCarMakes] = useState([DEFAULTS.ALL_MAKE, 'Toyota', 'Honda', 'BMW', 'Mercedes', 'Hyundai']);

  // Ensure limit and currentPage are valid numbers
  const validLimit = typeof limit === 'number' && limit > 0 ? limit : 20;
  const validCurrentPage = typeof currentPage === 'number' && currentPage > 0 ? currentPage : 1;

// Initialize make from props or localStorage if available
const getInitialMake = () => {
  
  // First check if prop is provided
  if (propSelectedMake && propSelectedMake !== '') {
    return propSelectedMake;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.make && saved.make !== '') {
      return saved.make;
    }
  } catch (e) {
    // Silent error handling
  }
  
  return DEFAULTS.ALL_MAKE;
};

const [make, setMake] = useState(getInitialMake);

// Initialize model from props or localStorage if available
const getInitialModel = () => {
  
  // First check if prop is provided
  if (propSelectedModel && propSelectedModel !== '') {
    return propSelectedModel;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.model && saved.model !== '') {
      return saved.model;
    }
  } catch (e) {
    // Silent error handling
  }
  
  return DEFAULTS.ALL_MODELS;
};

  const [model, setModel] = useState(getInitialModel);

// Initialize bodyType from props or localStorage if available
const getInitialBodyType = () => {
  
  // First check if prop is provided
  if (propSelectedBodyType && propSelectedBodyType !== '') {
    return propSelectedBodyType;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.body_type && saved.body_type !== '') {
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
// Initialize location from props or localStorage if available
const getInitialLocation = () => {
  
  // First check if prop is provided
  if (propSelectedLocation && propSelectedLocation !== '') {
    return propSelectedLocation;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.location && saved.location !== '') {
      return saved.location;
    }
  } catch (e) {
    // Silent error handling
  }
  
  return DEFAULTS.ALL_LOCATIONS;
};

  const [location, setLocation] = useState(getInitialLocation);

// Initialize newUsed from props or localStorage if available
const getInitialNewUsed = () => {
  // First check if prop is provided
  if (propSelectedNewUsed && propSelectedNewUsed !== '') {
    return propSelectedNewUsed;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.condition && saved.condition !== '') {
      return saved.condition;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.NEW_USED;
};

// Initialize priceMin from props or localStorage if available
const getInitialPriceMin = () => {
  // First check if prop is provided
  if (propSelectedPriceMin !== null && propSelectedPriceMin !== undefined) {
    return propSelectedPriceMin;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.price_min && saved.price_min !== '') {
      return saved.price_min;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.PRICE_MIN;
};

// Initialize priceMax from props or localStorage if available
const getInitialPriceMax = () => {
  // First check if prop is provided
  if (propSelectedPriceMax !== null && propSelectedPriceMax !== undefined) {
    return propSelectedPriceMax;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.price_max && saved.price_max !== '') {
      return saved.price_max;
    }
  } catch (e) {
    // Silent error handling
  }
  return DEFAULTS.PRICE_MAX;
};

  const [newUsed, setNewUsed] = useState(getInitialNewUsed);
  const [priceMin, ] = useState(getInitialPriceMin);
  const [priceMax, ] = useState(getInitialPriceMax);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
   const [showMinInput, setShowMinInput] = useState(false);
    const [showMaxInput, setShowMaxInput] = useState(false);

// Initialize minPrice and maxPrice from props or localStorage if available
const getInitialMinPrice = () => {
  // First check if prop is provided
  if (propSelectedPriceMin !== null && propSelectedPriceMin !== undefined) {
    return propSelectedPriceMin;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.price_min && saved.price_min !== '') {
      return parseFloat(saved.price_min);
    }
  } catch (e) {
    // Silent error handling
  }
  return null;
};

const getInitialMaxPrice = () => {
  // First check if prop is provided
  if (propSelectedPriceMax !== null && propSelectedPriceMax !== undefined) {
    return propSelectedPriceMax;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved?.price_max && saved.price_max !== '') {
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
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialSearch = useRef(false); // Track if initial search has been made
  const [isHovering, setIsHovering] = useState(false); // Track hover state for clear button
  const [propsProcessed, setPropsProcessed] = useState(false); // Track if props have been processed

  // Helper function to get value or empty string
  const valueOrEmpty = (currentValue, defaultValue) => {
    if (currentValue !== defaultValue) {
      return currentValue;
    }
    return '';
  };

  // Helper function to handle locations parameter consistently
  const getLocationsParam = (currentLocation) => {
    // Always return an array
    if (currentLocation && currentLocation !== '' && currentLocation !== DEFAULTS.ALL_LOCATIONS) {
      return [currentLocation];
    }
    return [];
  };

  // Function to clear featuredorrecommended and location state
  const clearFeaturedOrRecommended = () => {
    // Call the parent callback to clear the featuredorrecommended value
    // Pass a custom search function that doesn't include the type parameter
    if (onClearFeaturedOrRecommended) {
      onClearFeaturedOrRecommended(() => {
        // Custom search function that excludes type parameter
        autoSearchForCountWithoutType();
      });
    }
  };

  // Helper function to handle body_types parameter consistently (returns array like locations)
  const getBodyTypesParam = (currentBodyType) => {
    // Always return an array
    if (currentBodyType && currentBodyType !== '' && currentBodyType !== DEFAULTS.ALL_BODY_TYPES) {
      return [currentBodyType];
    }
    return [];
  };

  // Auto-search function without type parameter (for after clearing)
  const autoSearchForCountWithoutType = async () => {
    try {
      const apiParams = {
        make: valueOrEmpty(make, DEFAULTS.ALL_MAKE),
        model: valueOrEmpty(model, DEFAULTS.ALL_MODELS),
        body_types: getBodyTypesParam(bodyType),
        locations: getLocationsParam(location),
        price_min: minPrice !== null ? minPrice : '',
        price_max: maxPrice !== null ? maxPrice : '',
        page: 1,
        limit: 1, // We only need the count, so limit to 1 for efficiency
        ...(newUsed !== DEFAULTS.NEW_USED && { condition: newUsed })
        // Note: No type parameter included
      };
      
      
      const response = await carAPI.getSearchCars(apiParams);
      const data = handleApiResponse(response);

      // Null checks for pagination data
      if (data?.data?.pagination && typeof data.data.pagination.total === 'number') {
        setCarCount(data.data.pagination.total);
      }
    } catch (error) {
      // Silent error handling for auto-search
    }
  };

  // Auto-search function to update car count on filter changes
  const autoSearchForCount = async () => {
    try {
      const apiParams = {
        make: valueOrEmpty(make, DEFAULTS.ALL_MAKE),
        model: valueOrEmpty(model, DEFAULTS.ALL_MODELS),
        body_types: getBodyTypesParam(bodyType),
        locations: getLocationsParam(location),
        price_min: minPrice !== null ? minPrice : '',
        price_max: maxPrice !== null ? maxPrice : '',
        page: 1,
        limit: 1, // We only need the count, so limit to 1 for efficiency
        ...(newUsed !== DEFAULTS.NEW_USED && { condition: newUsed })
        // Note: Only include type if featuredorrecommended has a truthy value
        // When cleared (undefined/null/empty), type parameter is not included
      };
      
      // Only add type parameter if featuredorrecommended has a value
      if (featuredorrecommended) {
        apiParams.type = featuredorrecommended;
      }
      
      
      const response = await carAPI.getSearchCars(apiParams);
      const data = handleApiResponse(response);

      // Null checks for pagination data
      if (data?.data?.pagination && typeof data.data.pagination.total === 'number') {
        setCarCount(data.data.pagination.total);
      }
    } catch (error) {
      // Silent error handling for auto-search
    }
  };

    useEffect(() => {
      fetchMakeCars({ setLoading, setCarMakes });
      
    }, []);


useEffect(() => {
  // Only run this effect if no prop is provided
  if (propSelectedLocation) {
    return;
  }
  
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    
    if (saved?.location && saved.location !== '') {
      setLocation(saved.location);
      if (setSelectedLocation) {
        setSelectedLocation(saved.location);
      }
    } else {
      setLocation(DEFAULTS.ALL_LOCATIONS);
    }
  } catch (e) {
    setLocation(DEFAULTS.ALL_LOCATIONS);
  }
}, [setSelectedLocation, propSelectedLocation]);

// Note: Removed handleSearch() call on mount to prevent multiple API calls
// The autoSearchForCount() in the combined useEffect will handle the count display

// Temporary: Add a function to manually clear localStorage (for debugging)
useEffect(() => {
fetchRegionCars()
}, []);


  useEffect(() => {
    if (make && make !== DEFAULTS.ALL_MAKE) {
      fetchModelCars({ setLoading, setCarModels, make }).then(() => {
        // Only reset model if it's not already set from localStorage
        const saved = JSON.parse(localStorage.getItem('searchcardata'));
        if (!saved?.model || saved.model === '') {
          setModel(DEFAULTS.ALL_MODELS);
        }
      });
    } else {
      setCarModels([]);
      setModel(DEFAULTS.ALL_MODELS);
    }
  }, [make]);

  useEffect(() => {
    // Fetch body types on component mount
    fetchBodyTypeCars();
    
    // Fetch models if there's a saved make
    try {
      const saved = JSON.parse(localStorage.getItem('searchcardata'));
      if (saved?.make && saved.make !== '' && saved.make !== DEFAULTS.ALL_MAKE) {
        fetchModelCars({ setLoading, setCarModels, make: saved.make });
      }
    } catch (e) {
      // Silent error handling
    }
  }, []);

  useEffect(() => {
    // Only call handleSearch when sortedbydata actually changes, not on initial load
    if (sortedbydata) {
      handleSearch();
    }
  }, [sortedbydata]);

  // Initial load - call handleSearch once when data is ready and props are processed
  useEffect(() => {
    if (carMakes.length > 0 && !hasInitialSearch.current) {
      // If no props are provided, process immediately
      if (!propSelectedMake && !propSelectedModel && !propSelectedBodyType && !propSelectedLocation) {
        setPropsProcessed(true);
      }
      
      if (propsProcessed) {
        hasInitialSearch.current = true;
        setIsInitialized(true);
        
        handleSearch();
      }
    }
  }, [carMakes.length, propsProcessed]);

  // Filter changes - call autoSearchForCount after each param change (only after initial load)
  useEffect(() => {
    // Only call search if we have the necessary data loaded and initial search is done
    // Add a small delay to prevent calls during initialization
    if (carMakes.length > 0 && hasInitialSearch.current) {
      const timer = setTimeout(() => {
        autoSearchForCount();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [make, model, location, bodyType, newUsed, minPrice, maxPrice]);
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

  // Debug effect to track prop changes
  useEffect(() => {
    
    // Mark props as processed after a short delay
    const timer = setTimeout(() => {
      setPropsProcessed(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [propSelectedMake, propSelectedModel, propSelectedBodyType, propSelectedLocation, propSelectedNewUsed, propSelectedPriceMin, propSelectedPriceMax]);

  // Update state when props change
  useEffect(() => {
    if (propSelectedMake && propSelectedMake !== make) {
      setMake(propSelectedMake);
    }
  }, [propSelectedMake]);

  useEffect(() => {
    if (propSelectedModel && propSelectedModel !== model) {
      setModel(propSelectedModel);
    }
  }, [propSelectedModel]);

  useEffect(() => {
    if (propSelectedBodyType && propSelectedBodyType !== bodyType) {
      setBodyType(propSelectedBodyType);
    }
  }, [propSelectedBodyType]);

  useEffect(() => {
    if (propSelectedLocation && propSelectedLocation !== location) {
      setLocation(propSelectedLocation);
    }
  }, [propSelectedLocation]);

  useEffect(() => {
    if (propSelectedNewUsed && propSelectedNewUsed !== newUsed) {
      setNewUsed(propSelectedNewUsed);
    }
  }, [propSelectedNewUsed]);


  useEffect(() => {
    if (propSelectedPriceMin !== null && propSelectedPriceMin !== undefined && propSelectedPriceMin !== minPrice) {
      setMinPrice(propSelectedPriceMin);
    }
  }, [propSelectedPriceMin]);

  useEffect(() => {
    if (propSelectedPriceMax !== null && propSelectedPriceMax !== undefined && propSelectedPriceMax !== maxPrice) {
      setMaxPrice(propSelectedPriceMax);
    }
  }, [propSelectedPriceMax]);

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

  // Helper function to determine sort parameters
  const getSortParameters = (sortedbydata) => {
    const sortConfig = {
      sortbynewlist: false,
      sortbyold: false,
      sortbypriceormileage: '',
      sortorder: ''
    };

    switch (sortedbydata) {
      case 'Newest Listing':
        sortConfig.sortbynewlist = true;
        break;
      case 'Oldest Listing':
        sortConfig.sortbyold = true;
        break;
      case 'Price : Low to High':
        sortConfig.sortbypriceormileage = 'price';
        sortConfig.sortorder = 'asc';
        break;
      case 'Price : High to Low':
        sortConfig.sortbypriceormileage = 'price';
        sortConfig.sortorder = 'desc';
        break;
      case 'Mileage: Low to High':
        sortConfig.sortbypriceormileage = 'mileage';
        sortConfig.sortorder = 'asc';
        break;
      case 'Mileage: High to Low':
        sortConfig.sortbypriceormileage = 'mileage';
        sortConfig.sortorder = 'desc';
        break;
      default:
        break;
    }

    return sortConfig;
  };

  // Helper function to build save parameters
  const buildSaveParams = (sortConfig) => ({
    make: make === DEFAULTS.ALL_MAKE ? '' : make,
    model: model === DEFAULTS.ALL_MODELS ? '' : model,
    body_types: getBodyTypesParam(bodyType),
    locations: getLocationsParam(location),
    condition: newUsed === DEFAULTS.NEW_USED ? '' : newUsed,
    priceMin,
    priceMax,
    newest_listing: sortConfig.sortbynewlist,
    oldest_listing: sortConfig.sortbyold,
    sort_by: sortConfig.sortbypriceormileage,
    sort_order: sortConfig.sortorder,
  });

  // Helper function to build API parameters
  const buildApiParams = (sortConfig) => {
    const cleanedMin = minPrice !== null ? minPrice : '';
    const cleanedMax = maxPrice !== null ? maxPrice : '';
    
    const apiParams = {
      make: make === DEFAULTS.ALL_MAKE ? '' : make,
      model: model === DEFAULTS.ALL_MODELS ? '' : model,
      body_types: getBodyTypesParam(bodyType),
      locations: getLocationsParam(location),
      price_min: cleanedMin,
      price_max: cleanedMax,
      condition:newUsed === DEFAULTS.NEW_USED ? '' : newUsed,
      newest_listing: sortConfig.sortbynewlist,
      oldest_listing: sortConfig.sortbyold,
      sort_by: sortConfig.sortbypriceormileage,
      sort_order: sortConfig.sortorder,
    };

    // Only include type parameter if featuredorrecommended has a value
    if (featuredorrecommended) {
      apiParams.type = featuredorrecommended;
    }

    return apiParams;
  };

  // Helper function to save filters and update UI
  const saveFiltersAndUpdateUI = (saveParams) => {
    localStorage.setItem('searchcardata', JSON.stringify(saveParams));
    
    if (setSelectedLocation) {
      setSelectedLocation(location);
    }
    
    window.dispatchEvent(new CustomEvent('searchDataUpdated'));
    message.success('Filters saved!');
  };

  // Helper function to clear cached data
  const clearCachedData = () => {
    setFilterCarsData({ cars: [], pagination: {} });
    setCarSearch([]);
    
    const cacheKeys = ['cachedCarsData', 'carsData', 'filterData', 'carSearchData', 'savedCarsData'];
    cacheKeys.forEach(key => localStorage.removeItem(key));
  };

  // Helper function to update pagination data
  const updatePaginationData = (pagination) => {
    if (pagination && typeof pagination.total === 'number') {
      setCarCount(pagination.total);
    }
    if (setCurrentPage && pagination && typeof pagination.page === 'number') {
      setCurrentPage(pagination.page);
    }
  };

  // Helper function to save search data
  const saveSearchData = (apiParams) => {
    if (apiParams && typeof apiParams === 'object') {
      try {
        localStorage.setItem('searchcardata', JSON.stringify(apiParams));
      } catch (error) {
        // Silent error handling
      }
    }
  };

  // Helper function to handle empty results
  const handleEmptyResults = () => {
    setIsModalOpen(true);
    setFilterCarsData({ cars: [], pagination: {} });
  };

  // Helper function to handle successful results
  const handleSuccessfulResults = (data1, apiParams) => {
    setFilterCarsData({
      cars: data1.data.cars || [],
      pagination: data1.data.pagination || {}
    });
    
    saveSearchData(apiParams);
    
    if (setSelectedLocation && location) {
      setSelectedLocation(location);
    }
    window.dispatchEvent(new CustomEvent('searchDataUpdated'));
  };

  const handleSearchResults = (data1, apiParams) => {
    if (!data1 || !data1.data) {
      return;
    }

    const results = data1.data.cars || [];
    setCarSearch(results);
    updatePaginationData(data1.data.pagination);

    if (results.length === 0) {
      handleEmptyResults();
    } else {
      handleSuccessfulResults(data1, apiParams);
    }
  };

  const handleSearchWithCondition = async (condition) => {
    setNewUsed(condition);
  };

  const handleSearch = async () => {
    
    const sortConfig = getSortParameters(sortedbydata);
    const saveParams = buildSaveParams(sortConfig);
    const apiParams = buildApiParams(sortConfig);
setIsnetworkError(false)
    saveFiltersAndUpdateUI(saveParams);

    try {
      setLoading(true);
      
      if (setIsLoading) {
        setIsLoading(true);
      }
      
      clearCachedData();
      const response = await carAPI.getSearchCars(apiParams);
      const data1 = handleApiResponse(response);

      if (data1) {
        handleSearchResults(data1, apiParams);
      }
    } catch (error) {
      const errorData = handleApiError(error);
    if(error?.message==='Network Error' ){ 
      messageApi.open({
            type: 'error',
            content: 'You\'re offline! Please check your network connection and try again.',
          });
      setIsnetworkError(true)
        } else {
      message.error(errorData.message || 'Failed to search car data');
        }
      setCarSearch([]);
    } finally {
      setLoading(false);
      
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

  // Helper function to handle dropdown item click
  const handleDropdownItemClick = (type, opt, setValue) => {
    setValue(opt);
    handleChange(getDropdownLabel(type), opt);
    setOpenDropdown(null);
    
    // Call API only when condition is selected
    if (type === DROPDOWN_NEW_USED) {
      setTimeout(() => {
        handleSearchWithCondition(opt);
      }, 100);
    }
  };

  // Helper function to render a single dropdown item
  const renderDropdownItem = (opt, value, type, setValue) => {
    const itemClass = `allcars-filters-dropdown-item${value === opt ? ' selected' : ''}`;
    
    return (
      <button
        type="button"
        key={opt}
        className={itemClass}
        onClick={() => handleDropdownItemClick(type, opt, setValue)}
      >
        {opt}
      </button>
    );
  };

  const renderDropdown = (type, options, value, setValue) => (
    <div id={`menu-${type}`} className="allcars-filters-dropdown-menu" ref={dropdownRefs[type]}>
      {options.map((opt) => renderDropdownItem(opt, value, type, setValue))}
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
            featuredorrecommended={featuredorrecommended}
            newUsed={newUsed}
            onMakeChange={(newMake) => {
              setMake(newMake);
              setModel(DEFAULTS.ALL_MODELS);
            }}
            onModelChange={(newModel) => {
              setModel(newModel);
            }}
            onBodyTypeChange={(newBodyType) => {
              if (newBodyType && newBodyType.length > 0) {
                setBodyType(newBodyType[0]);
              } else {
                setBodyType(DEFAULTS.ALL_BODY_TYPES);
              }
            }}
            onLocationChange={(newLocation) => {
              if (newLocation && newLocation.length > 0) {
                setLocation(newLocation[0]);
              } else {
                setLocation(DEFAULTS.ALL_LOCATIONS);
              }
            }}
            onConditionChange={(newCondition) => {
              setNewUsed(newCondition);
            }}
            onResetFilters={() => {
              // Reset all filter values in allcarfilters
              setMake(DEFAULTS.ALL_MAKE);
              setModel(DEFAULTS.ALL_MODELS);
              setBodyType(DEFAULTS.ALL_BODY_TYPES);
              setLocation(DEFAULTS.ALL_LOCATIONS);
              setNewUsed(DEFAULTS.NEW_USED);
              setMinPrice(null);
              setMaxPrice(null);
            }}
            onFilterChange={(filterData) => {
              // Update main filter values when changed in modal
              if (filterData.make) {
                setMake(filterData.make);
              }
              if (filterData.model) {
                setModel(filterData.model);
              }
              if (filterData.bodyType && filterData.bodyType.length > 0) {
                setBodyType(filterData.bodyType[0]);
              }
              if (filterData.location && filterData.location.length > 0) {
                setLocation(filterData.location[0]);
              }
              if (filterData.newUsed) {
                setNewUsed(filterData.newUsed);
              }
              if (filterData.priceMin) {
                setMinPrice(filterData.priceMin);
              }
              if (filterData.priceMax) {
                setMaxPrice(filterData.priceMax);
              }
            }}
            onSearchResults={(searchResults) => {
              // Null checks for search results
              if (!searchResults || !searchResults.data) {
                return;
              }

              setFilterCarsData(searchResults.data);
              setFilterVisible(false);
              
              // Update current page with the page value from backend response with null checks
              if (setCurrentPage && searchResults.data.pagination && typeof searchResults.data.pagination.page === 'number') {
                setCurrentPage(searchResults.data.pagination.page);
              }
              
              // Update car count from pagination with null checks
              if (searchResults.data.pagination && typeof searchResults.data.pagination.total === 'number') {
                setCarCount(searchResults.data.pagination.total);
              } else if (searchResults.carCount !== undefined) {
                // Fallback to carCount property if passed directly
                setCarCount(searchResults.carCount);
              }
            }}
            limit={validLimit}
            currentPage={validCurrentPage}
            selectedMake={make}
            selectedModel={model}
            selectedBodyType={bodyType}
            selectedLocation={location}
            selectedNewUsed={newUsed}
            selectedPriceMin={minPrice}
            selectedPriceMax={maxPrice}
            sortedbydata={sortedbydata}
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
   <Input
  style={{ width: '100px' }}
  type="tel"
  value={minPrice}
  placeholder="Min"
  onChange={(e) => {
    // Allow only digits
    const value = e.target.value.replace(/\D/g, '');

    // Check against maxPrice
    if (maxPrice !== null && Number(value) >= maxPrice) {
      messageApi.error('Minimum price should be less than Maximum price');
      return;
    }

    setMinPrice(value ? Number(value) : null);
    
    // Call API when price changes
    setTimeout(() => {
      handleSearch();
    }, 500);
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
   <Input
  style={{ width: '120px' }}
  type="tel"
  value={maxPrice !== null ? maxPrice : ''} // Show empty string when null
  placeholder="Max"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only digits
    const numericValue = value ? Number(value) : null;

    // Always update state first
    setMaxPrice(numericValue);

    // Validate max limit
    if (numericValue !== null && numericValue > 5000000000) {
      messageApi.error('Maximum allowed price is ₹5,000,000,000');
    }

    // Validate against min price
    if (minPrice !== null && numericValue !== null && numericValue <= minPrice) {
      messageApi.error('Maximum price should be greater than Minimum price');
    }
    
    // Call API when price changes
    setTimeout(() => {
      handleSearch();
    }, 500);
  }}
  onBlur={() => {
    if (maxPrice === null) setShowMaxInput(false);
  }}
/>


  )}
</div>

{featuredorrecommended && (
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        position: 'relative',
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={clearFeaturedOrRecommended}
    >
      <span>{featuredorrecommended?.charAt(0).toUpperCase() + featuredorrecommended?.slice(1).toLowerCase()}</span>
      {isHovering && (
        <CloseOutlined 
          style={{ 
          fontSize: '8px',
    color: '#f8f8f8',
    cursor: 'pointer',
    borderRadius: '20px',
    backgroundColor:'#b9b5b5',
    padding: '4px'
          }} 
        />
      )}
</div>
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
        setSaveSearchesReload={() => {}}
        filterData={null}
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
  limit: PropTypes.any,
  currentPage: PropTypes.any,
  setCurrentPage: PropTypes.func,
  featuredorrecommended: PropTypes.string,
  onClearFeaturedOrRecommended: PropTypes.func,
  // New props for selected values from previous page
  selectedMake: PropTypes.string,
  selectedModel: PropTypes.string,
  selectedBodyType: PropTypes.string,
  selectedLocation: PropTypes.string,
  selectedNewUsed: PropTypes.string,
  selectedPriceMin: PropTypes.number,
  selectedPriceMax: PropTypes.number,
};