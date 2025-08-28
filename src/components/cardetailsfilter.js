/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FilterIcon from '../assets/images/filter_icon.svg';
import { carAPI } from '../services/api';
import {
  Drawer,
  Button,
  Select,
  Input,
  Checkbox,
  Radio,
  Divider,
  Row,
  Col,
} from 'antd';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import Comforticon from '../assets/images/comfort_icon.svg';
import Mediaicon from '../assets/images/media_icon.svg';
import Extrasicon from '../assets/images/extras_icon.svg';
import Safetyicon from '../assets/images/safety_icon.svg';
import Searchicon from '../assets/images/search_icon.svg';
import Backarrowicon from '../assets/images/backarrow_icon.svg';

const { Option } = Select;

// Constants moved outside component
const fuelOptions = ['Any', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissionOptions = ['Any', 'Automatic', 'Manual', 'Steptonic'];
const cylinderOptions = ['3', '4', '5', '6', '8', '12', 'N/A', 'Electric', 'Not Sure'];
const numberofdoors = ['Any', '2/3', '4/5'];

const extraFeaturesData = [
  {
    title: 'Comfort & Convenience',
    icon: <img src={Comforticon} alt="Comfort Icon" />,
    features: ['Heated seats', 'Keyless entry', 'power mirrors'],
  },
  {
    title: 'Entertainment & Media',
    icon: <img src={Mediaicon} alt="Media Icon" />,
    features: ['Bluetooth', 'Cd Play', 'Radio'],
  },
  {
    title: 'Extras',
    icon: <img src={Extrasicon} alt="Extras Icon" />,
    features: ['Navigation', 'Alloy wheels', 'Power locks'],
  },
  {
    title: 'Safety & Security',
    icon: <img src={Safetyicon} alt="Safety Icon" />,
    features: ['Diesel', 'Electric'],
  },
];

// Custom hook for filter state management
const useFilterState = () => {
  const [selectedValues, setSelectedValues] = useState(['Any']);
  const [transmissionselectedValues, settransmissionselectedValues] = useState(['Any']);
  const [cylinderselectedValues, setcylinderselectedValues] = useState([]);
  const [doorselectedValues, setdoorselectedValues] = useState([]);
  const [condition, setCondition] = useState(['Any']);
  const [ownerType, setOwnerType] = useState(['Any']);
  
  return {
    selectedValues, setSelectedValues,
    transmissionselectedValues, settransmissionselectedValues,
    cylinderselectedValues, setcylinderselectedValues,
    doorselectedValues, setdoorselectedValues,
    condition, setCondition,
    ownerType, setOwnerType,
  };
};

// Custom hook for range inputs
const useRangeInputs = () => {
  const [kilometersMin, setKilometersMin] = useState('');
  const [kilometersMax, setKilometersMax] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [powerMin, setPowerMin] = useState('');
  const [powerMax, setPowerMax] = useState('');
  const [consumptionMin, setConsumptionMin] = useState('');
  const [consumptionMax, setConsumptionMax] = useState('');
  const [seatsMin, setSeatsMin] = useState('');
  const [seatsMax, setSeatsMax] = useState('');
  
  return {
    kilometersMin, setKilometersMin, kilometersMax, setKilometersMax,
    yearMin, setYearMin, yearMax, setYearMax,
    priceMin, setPriceMin, priceMax, setPriceMax,
    powerMin, setPowerMin, powerMax, setPowerMax,
    consumptionMin, setConsumptionMin, consumptionMax, setConsumptionMax,
    seatsMin, setSeatsMin, seatsMax, setSeatsMax,
  };
};

// Custom hook for single value inputs
const useSingleInputs = () => {
  const [trimValue, setTrimValue] = useState('Any');
  const [colorValue, setColorValue] = useState('Any');
  const [interiorValue, setInteriorValue] = useState('Any');
  const [paymentOptions, setPaymentOptions] = useState('Any');
  const [regionalSpecs, setRegionalSpecs] = useState('Any');
  
  return {
    trimValue, setTrimValue,
    colorValue, setColorValue,
    interiorValue, setInteriorValue,
    paymentOptions, setPaymentOptions,
    regionalSpecs, setRegionalSpecs,
  };
};

// Helper functions
const handleCheckboxChange = (option, selectedValues, setSelectedValues) => {
  if (selectedValues.includes(option)) {
    setSelectedValues(selectedValues.filter((val) => val !== option));
  } else {
    setSelectedValues([...selectedValues, option]);
  }
};

const handleFeatureToggle = (selectedFeatures, setSelectedFeatures) => (feature) => {
  setSelectedFeatures((prev) =>
    prev.includes(feature)
      ? prev.filter((f) => f !== feature)
      : [...prev, feature]
  );
};

const handleKeywordsChange = (keywords, setKeywords) => (value) => {
  if (value.trim()) {
    setKeywords(value.split(',').map(k => k.trim()).filter(k => k));
  } else {
    setKeywords([]);
  }
};

// Extracted components
const RangeInputGroup = ({ label, minValue, maxValue, onMinChange, onMaxChange, minPlaceholder, maxPlaceholder }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
      {label}
    </div>
    <Row gutter={8}>
      <Col span={12}>
        <Input 
          placeholder={minPlaceholder || 'Min'} 
          value={minValue}
          onChange={onMinChange}
        />
      </Col>
      <Col span={12}>
        <Input 
          placeholder={maxPlaceholder || 'Max'} 
          value={maxValue}
          onChange={onMaxChange}
        />
      </Col>
    </Row>
  </div>
);

RangeInputGroup.propTypes = {
  label: PropTypes.string.isRequired,
  minValue: PropTypes.string.isRequired,
  maxValue: PropTypes.string.isRequired,
  onMinChange: PropTypes.func.isRequired,
  onMaxChange: PropTypes.func.isRequired,
  minPlaceholder: PropTypes.string,
  maxPlaceholder: PropTypes.string,
};

const CheckboxGroup = ({ title, options, selectedValues, onChange, setSelectedValues }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
      {title}
    </div>
    <div className="checkbox-button-group">
      {options.map((option) => (
        <label
          key={option}
          className={`checkbox-button ${selectedValues.includes(option) ? 'selected' : ''}`}
        >
          <Checkbox
            checked={selectedValues.includes(option)}
            onChange={() => onChange(option, selectedValues, setSelectedValues)}
            style={{ display: 'none' }}
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

CheckboxGroup.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  setSelectedValues: PropTypes.func.isRequired,
};

const SelectInput = ({ title, value, onChange, options, style }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
      {title}
    </div>
    <Select
      value={value}
      onChange={onChange}
      style={{ width: '100%', marginTop: '10px', ...style }}
    >
      {options.map(option => (
        <Option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </Option>
      ))}
    </Select>
  </div>
);

SelectInput.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  style: PropTypes.object,
};

const ExtraFeaturesDrawer = ({ visible, onClose, search, onSearchChange, selectedFeatures, onFeatureToggle }) => (
  <Drawer
    title={null}
    closeIcon={null}
    placement="left"
    onClose={onClose}
    open={visible}
    width={380}
    bodyStyle={{
      padding: 0,
      height: '100%',
      overflow: 'hidden',
    }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: 16,
      borderBottom: '1px solid #eee',
    }}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Back to main filters"
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <img
          src={Backarrowicon}
          alt="Back Arrow Icon"
          style={{ width: 24, height: 24 }}
        />
      </button>
      <span style={{
        fontWeight: 700,
        fontSize: 16,
        marginLeft: 16,
        color: '#0A0A0B',
      }}>
        Extra Features
      </span>
    </div>
    
    <div style={{ padding: 16 }}>
      <Input
        placeholder="Search Here..."
        value={search}
        onChange={onSearchChange}
        prefix={
          <img
            src={Searchicon}
            alt="Search Icon"
            style={{ width: 24, height: 24 }}
          />
        }
        style={{
          borderRadius: 8,
          height: 44,
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.07)',
        }}
      />
    </div>
    
    <div style={{
      height: 'calc(100vh - 120px)',
      overflowY: 'auto',
      marginTop: 0,
      marginLeft: 16,
      marginRight: 16,
    }}>
      {extraFeaturesData.map((section) => {
        const filtered = section.features.filter((f) =>
          f.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length === 0) {
          return null;
        }
        return (
          <div key={section.title} style={{ marginBottom: 5 }}>
            <div style={{
              fontWeight: 700,
              fontSize: 16,
              margin: '16px 0 8px',
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{ marginRight: 8 }}>{section.icon}</span>
              {section.title}
            </div>
            {filtered.map((feature) => (
              <button
                type="button"
                key={feature}
                onClick={() => onFeatureToggle(feature)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  height: 36,
                  fontSize: 12,
                  fontWeight: 400,
                  background: selectedFeatures.includes(feature) ? '#f5f5f5' : '#fff',
                  cursor: 'pointer',
                  width: '100%',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{feature}</span>
                {selectedFeatures.includes(feature) ? (
                  <FaCheck style={{ color: '#222' }} />
                ) : (
                  <MdOutlineCheckBoxOutlineBlank style={{ color: '#fff' }} />
                )}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  </Drawer>
);

ExtraFeaturesDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedFeatures: PropTypes.array.isRequired,
  onFeatureToggle: PropTypes.func.isRequired,
};

const Cardetailsfilter = ({ make, model, bodyType, location, onSearchResults }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extrafeaturesvisible, setextrafeaturesvisible] = useState(false);
  const [value, setValue] = useState('Any');
  const [search, setSearch] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [keywords, setKeywords] = useState([]);

  // Use custom hooks for state management
  const filterState = useFilterState();
  const rangeInputs = useRangeInputs();
  const singleInputs = useSingleInputs();

  const handleChange = (e) => setValue(e.target.value);

  const handleFuelTypeChange = (option) => {
    if (filterState.selectedValues.includes(option)) {
      filterState.setSelectedValues(filterState.selectedValues.filter((item) => item !== option));
    } else {
      filterState.setSelectedValues([...filterState.selectedValues, option]);
    }
  };

  const prepareFilterData = () => {
    const filterData = {
      make: make !== 'Any' ? make : '',
      model: model !== 'All Models' ? model : '',
      trim: singleInputs.trimValue !== 'Any' ? singleInputs.trimValue : '',
      year_min: rangeInputs.yearMin ? parseInt(rangeInputs.yearMin) : '',
      year_max: rangeInputs.yearMax ? parseInt(rangeInputs.yearMax) : '',
      price_min: rangeInputs.priceMin ? parseInt(rangeInputs.priceMin) : '', 
      price_max: rangeInputs.priceMax ? parseInt(rangeInputs.priceMax) : '', 
      location: location !== 'Any' ? location : '',
      min_kilometers: rangeInputs.kilometersMin ? parseInt(rangeInputs.kilometersMin) : '',
      max_kilometers: rangeInputs.kilometersMax ? parseInt(rangeInputs.kilometersMax) : '',
      colour: singleInputs.colorValue !== 'Any' ? singleInputs.colorValue : '',
      transmission: filterState.transmissionselectedValues.length > 0 && filterState.transmissionselectedValues[0] !== 'Any' ? filterState.transmissionselectedValues[0] : '',
      regional_specs: singleInputs.regionalSpecs !== 'Any' ? singleInputs.regionalSpecs : '',
      condition: filterState.condition.length > 0 && filterState.condition[0] !== 'Any' ? filterState.condition[0] : '',
      body_type: bodyType !== 'All Body Types' ? bodyType : '',
      number_of_doors: filterState.doorselectedValues.length > 0 && filterState.doorselectedValues[0] !== 'Any' ? filterState.doorselectedValues[0] : '',
      fuel_type: filterState.selectedValues.length > 0 && filterState.selectedValues[0] !== 'Any' ? filterState.selectedValues[0] : '',
      owner_type: filterState.ownerType.length > 0 && filterState.ownerType[0] !== 'Any' ? filterState.ownerType[0] : '',
      keyword: keywords.length > 0 ? keywords.join(', ') : '',
      page: 1, 
      limit: 20 
    };
    return filterData;
  };

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const filterData = prepareFilterData();
      const response = await carAPI.searchCars(filterData);      
      
      if (onSearchResults && response.data) {
        onSearchResults(response.data);
      }
      
      setVisible(false);
    } catch (error) {
      console.error('Search API Error:', error);
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setVisible(true)}
        aria-label="Open filters"
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <img
          src={FilterIcon}
          alt="Filter Icon"
          style={{ width: '30px', height: '30px' }}
        />
      </button>
      
      <Drawer
        title="Filter"
        placement="left"
        onClose={() => setVisible(false)}
        visible={visible}
        width={380}
        bodyStyle={{
          paddingBottom: 80,
          height: 'calc(100% - 108px)',
          overflow: 'hidden',
        }}
      >
        <div style={{
          height: '100%',
          overflowY: 'auto',
          paddingRight: '8px',
        }}>
          <SelectInput
            title="Trim"
            value={singleInputs.trimValue}
            onChange={singleInputs.setTrimValue}
            options={['Any', 'Base', 'Sport']}
          />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
              Verified
            </div>
            <Radio.Group
              onChange={handleChange}
              value={value}
              style={{ display: 'flex', gap: '10px' }}
            >
              <Radio.Button
                value="Any"
                className="custom-radio-button"
                style={{
                  width: '20%',
                  textAlign: 'center',
                  marginRight: '10px',
                  borderRadius: '4px',
                  color: '#000',
                  fontSize: '12px',
                  fontWeight: '400',
                  borderColor: value === 'Any' ? '#D67900' : undefined,
                  backgroundColor: value === 'Any' ? '#FFEDD5' : undefined,
                }}
              >
                Any
              </Radio.Button>
              <Radio.Button
                value="Available"
                className="custom-radio-button"
                style={{
                  width: '30%',
                  textAlign: 'center',
                  borderRadius: '4px',
                  color: '#000',
                  fontSize: '12px',
                  fontWeight: '400',
                  borderLeft: '1px solid #D67900',
                  borderColor: value === 'Available' ? '#D67900' : undefined,
                  backgroundColor: value === 'Available' ? '#FFEDD5' : undefined,
                }}
              >
                Available
              </Radio.Button>
            </Radio.Group>
          </div>

          <RangeInputGroup
            label="Kilometers"
            minValue={rangeInputs.kilometersMin}
            maxValue={rangeInputs.kilometersMax}
            onMinChange={(e) => rangeInputs.setKilometersMin(e.target.value)}
            onMaxChange={(e) => rangeInputs.setKilometersMax(e.target.value)}
          />

          <RangeInputGroup
            label="Year"
            minValue={rangeInputs.yearMin}
            maxValue={rangeInputs.yearMax}
            onMinChange={(e) => rangeInputs.setYearMin(e.target.value)}
            onMaxChange={(e) => rangeInputs.setYearMax(e.target.value)}
          />

          <RangeInputGroup
            label="Price (Range)"
            minValue={rangeInputs.priceMin}
            maxValue={rangeInputs.priceMax}
            onMinChange={(e) => rangeInputs.setPriceMin(e.target.value)}
            onMaxChange={(e) => rangeInputs.setPriceMax(e.target.value)}
          />

          <CheckboxGroup
            title="Fuel Type"
            options={fuelOptions}
            selectedValues={filterState.selectedValues}
            onChange={handleFuelTypeChange}
            setSelectedValues={filterState.setSelectedValues}
          />

          <CheckboxGroup
            title="Condition"
            options={['Any', 'Used', 'New']}
            selectedValues={filterState.condition}
            onChange={handleCheckboxChange}
            setSelectedValues={filterState.setCondition}
          />

          <CheckboxGroup
            title="Transmission"
            options={transmissionOptions}
            selectedValues={filterState.transmissionselectedValues}
            onChange={handleCheckboxChange}
            setSelectedValues={filterState.settransmissionselectedValues}
          />

          <CheckboxGroup
            title="Number of Cylinders"
            options={cylinderOptions}
            selectedValues={filterState.cylinderselectedValues}
            onChange={handleCheckboxChange}
            setSelectedValues={filterState.setcylinderselectedValues}
          />

          <RangeInputGroup
            label="Power (1hp)"
            minValue={rangeInputs.powerMin}
            maxValue={rangeInputs.powerMax}
            onMinChange={(e) => rangeInputs.setPowerMin(e.target.value)}
            onMaxChange={(e) => rangeInputs.setPowerMax(e.target.value)}
          />

          <RangeInputGroup
            label="Consumption (l/100)"
            minValue={rangeInputs.consumptionMin}
            maxValue={rangeInputs.consumptionMax}
            onMinChange={(e) => rangeInputs.setConsumptionMin(e.target.value)}
            onMaxChange={(e) => rangeInputs.setConsumptionMax(e.target.value)}
          />

          <SelectInput
            title="Color"
            value={singleInputs.colorValue}
            onChange={singleInputs.setColorValue}
            options={['Any', 'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple']}
          />

          <RangeInputGroup
            label="Number Of Seats"
            minValue={rangeInputs.seatsMin}
            maxValue={rangeInputs.seatsMax}
            onMinChange={(e) => rangeInputs.setSeatsMin(e.target.value)}
            onMaxChange={(e) => rangeInputs.setSeatsMax(e.target.value)}
          />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '3px' }}>
              Extra Features
            </div>
            <Select
              value="Any"
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() => setextrafeaturesvisible(true)}
            >
              <Select.Option value="Any">Any</Select.Option>
            </Select>
          </div>

          <CheckboxGroup
            title="Number of Doors"
            options={numberofdoors}
            selectedValues={filterState.doorselectedValues}
            onChange={handleCheckboxChange}
            setSelectedValues={filterState.setdoorselectedValues}
          />

          <SelectInput
            title="Interior"
            value={singleInputs.interiorValue}
            onChange={singleInputs.setInteriorValue}
            options={['Any', 'Leather', 'Cloth']}
          />

          <SelectInput
            title="Payment Options"
            value={singleInputs.paymentOptions}
            onChange={singleInputs.setPaymentOptions}
            options={['Any', 'Cash', 'Installment']}
            style={{ marginTop: '3px' }}
          />

          <SelectInput
            title="Regional Specs"
            value={singleInputs.regionalSpecs}
            onChange={singleInputs.setRegionalSpecs}
            options={['Any', 'GCC', 'US', 'European', 'Japanese', 'Korean', 'Chinese', 'Other']}
          />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
              Keywords
            </div>
            <Input
              placeholder="Enter keywords (e.g., low mileage, one owner, accident free)"
              value={keywords.join(', ')}
              onChange={handleKeywordsChange(keywords, setKeywords)}
              style={{ width: '100%', marginTop: '10px' }}
            />
          </div>

          <CheckboxGroup
            title="Owner Type"
            options={['Any', 'Individual', 'Dealer']}
            selectedValues={filterState.ownerType}
            onChange={handleCheckboxChange}
            setSelectedValues={filterState.setOwnerType}
          />

          <Divider />
          <Button type="primary" block onClick={handleApplyFilters} loading={loading}>
            {loading ? 'Searching...' : 'Apply Filters'}
          </Button>
        </div>
      </Drawer>

      <ExtraFeaturesDrawer
        visible={extrafeaturesvisible}
        onClose={() => setextrafeaturesvisible(false)}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        selectedFeatures={selectedFeatures}
        onFeatureToggle={handleFeatureToggle(selectedFeatures, setSelectedFeatures)}
      />
    </>
  );
};

Cardetailsfilter.propTypes = {
  make: PropTypes.string,
  model: PropTypes.string,
  bodyType: PropTypes.string,
  location: PropTypes.string,
  onSearchResults: PropTypes.func,
};

export default Cardetailsfilter;