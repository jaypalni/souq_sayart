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
const locations = [DEFAULTS.BAGHDAD, 'Beirut', 'Dubai', 'Riyadh', 'Cairo'];
const newUsedOptions = [DEFAULTS.NEW_USED, 'New', 'Used'];
const PRICE_MIN_VALUES = [5000, 10000, 20000, 30000, 40000];
const PRICE_MAX_VALUES = [20000, 30000, 40000, 50000, 100000];
const priceMinOptions = [DEFAULTS.PRICE_MIN, ...PRICE_MIN_VALUES];
const priceMaxOptions = [DEFAULTS.PRICE_MAX, ...PRICE_MAX_VALUES];
const DEFAULT_CAR_COUNT = 342642;

const LandingFilters = ({ setFilterCarsData, filtercarsData: _filtercarsData, sortedbydata, setSelectedLocation }) => {
  const [, setLoading] = useState(false);
  const [, setCarSearch] = useState([]);
  const [carMakes, setCarMakes] = useState([DEFAULTS.ALL_MAKE, 'Toyota', 'Honda', 'BMW', 'Mercedes', 'Hyundai']);

const [make, setMake] = useState(DEFAULTS.ALL_MAKE);

  const [model, setModel] = useState(DEFAULTS.ALL_MODELS);
  const [bodyType, setBodyType] = useState(DEFAULTS.ALL_BODY_TYPES);
   const [carModels, setCarModels] = useState([]);
    const [carBodyTypes, setCarBodyTypes] = useState(bodyTypes);
  const [location, setLocation] = useState(DEFAULTS.BAGHDAD);
  const [newUsed, setNewUsed] = useState(DEFAULTS.NEW_USED);
  const [priceMin, setPriceMin] = useState(DEFAULTS.PRICE_MIN);
  const [priceMax, setPriceMax] = useState(DEFAULTS.PRICE_MAX);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
   const [showMinInput, setShowMinInput] = useState(false);
    const [showMaxInput, setShowMaxInput] = useState(false);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
  const dropdownRefs = {
    [DROPDOWN_NEW_USED]: useRef(),
    [DROPDOWN_PRICE_MIN]: useRef(),
    [DROPDOWN_PRICE_MAX]: useRef(),
  };
  const [filterVisible, setFilterVisible] = useState(false);
  const [carCount, setCarCount] = useState(DEFAULT_CAR_COUNT);

    useEffect(() => {
      fetchMakeCars({ setLoading, setCarMakes });
      fetchtotalcarcount();
    }, []);

 // After restoring saved search values
useEffect(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('searchcardata'));
    if (saved) {
      setMake(saved.make === '' ? DEFAULTS.ALL_MAKE : (saved.make || DEFAULTS.ALL_MAKE));
      setModel(saved.model === '' ? DEFAULTS.ALL_MODELS : (saved.model || DEFAULTS.ALL_MODELS));
      setBodyType(saved.body_type === '' ? DEFAULTS.ALL_BODY_TYPES : (saved.body_type || DEFAULTS.ALL_BODY_TYPES));
      setLocation(saved.location === '' ? DEFAULTS.BAGHDAD : (saved.location || DEFAULTS.BAGHDAD));
    }
  } catch (e) {
    // Silent error handling
  }
}, []);


 useEffect(() => {
    if (make && make !== DEFAULTS.ALL_MAKE) {
      fetchModelCars({ setLoading, setCarModels, make }).then(() => {
        setModel(DEFAULTS.ALL_MODELS);
      });
    } else {
      setCarModels([]);
      setModel(DEFAULTS.ALL_MODELS);
    }
  }, [make]);

  useEffect(() => {
    if (model) {
      fetchBodyTypeCars();
    }
  }, []);

  useEffect(() => {
handleSearch()
  }, [sortedbydata]);
  
  useEffect(() => {
    if (make) {
      fetchModelCars({ setLoading, setCarModels, make });
    }
    setBodyType(DEFAULTS.ALL_BODY_TYPES)
  }, [make]);
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
      location: location === DEFAULTS.BAGHDAD ? '' : location,
      newUsed: newUsed === DEFAULTS.NEW_USED ? '' : newUsed,
      priceMin,
      priceMax,
      newest_listing: sortbynewlist,
      oldest_listing: sortbyold,
      sort_by: sortbypriceormileage,
      sort_order: sortorder,
    };



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
      if (location !== DEFAULTS.BAGHDAD) {
        apiParams.location = location;
      } else {
        apiParams.location = '';
      }


      const response = await carAPI.getSearchCars(apiParams);
      const data1 = handleApiResponse(response);

      if (data1) {
        const results = data1?.data?.cars || [];
        setCarSearch(results);

        if (results.length === 0) {
          setIsModalOpen(true);
        } else {
          setFilterCarsData(data1.data); // Pass the full data object with cars and pagination
          localStorage.setItem('searchcardata', JSON.stringify(apiParams));
          // Update breadcrumb directly via prop
          if (setSelectedLocation) {
            setSelectedLocation(location);
          }
          // Dispatch custom event to update breadcrumb (fallback)
          window.dispatchEvent(new CustomEvent('searchDataUpdated'));
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
  onChange={(value) => {
    setModel(value);
    handleChange('Model', value);
  }}
  className="allcars-filters-select"
  size="large"
  dropdownClassName="allcars-filters-dropdown"
  disabled={make === DEFAULTS.ALL_MAKE}
>
  {carModels?.map((m) => (
    <Option key={m} value={m.model_name}>
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
              onChange={(value) => {
                setBodyType(value);
                handleChange('Body Type', value);
              }}
              className="allcars-filters-select"
              size="large"
              dropdownClassName="allcars-filters-dropdown"
            >
              {carBodyTypes.map((b) => (
                <Option key={b} value={b?.body_type}>
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
              onChange={(value) => {
                setLocation(value);
                handleChange('Location', value);
                // Update breadcrumb directly via prop
                if (setSelectedLocation) {
                  setSelectedLocation(value);
                }
                // Dispatch custom event to update breadcrumb (fallback)
                window.dispatchEvent(new CustomEvent('searchDataUpdated'));
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