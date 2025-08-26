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

const fuelOptions = ['Any', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];

const transmissionOptions = ['Any', 'Automatic', 'Manual', 'Steptonic'];

const cylinderOptions = [
  '3',
  '4',
  '5',
  '6',
  '8',
  '12',
  'N/A',
  'Electric',
  'Not Sure',
];

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

const numberofdoors = ['Any', '2/3', '4/5'];

const Cardetailsfilter = ({ make, model, bodyType, location, onSearchResults }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [extrafeaturesvisible, setextrafeaturesvisible] = useState(false);

  const [value, setValue] = useState('Any');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const [selectedValues, setSelectedValues] = useState(['Any']);

  const [transmissionselectedValues, settransmissionselectedValues] = useState([
    'Any',
  ]);

  const transmissionhandleChange = (option) => {
    if (transmissionselectedValues.includes(option)) {
      settransmissionselectedValues(
        transmissionselectedValues.filter((val) => val !== option)
      );
    } else {
      settransmissionselectedValues([...transmissionselectedValues, option]);
    }
  };

  const [cylinderselectedValues, setcylinderselectedValues] = useState([]);

  const cylinderhandleChange = (option) => {
    if (cylinderselectedValues.includes(option)) {
      setcylinderselectedValues(
        cylinderselectedValues.filter((val) => val !== option)
      );
    } else {
      setcylinderselectedValues([...cylinderselectedValues, option]);
    }
  };

  const [doorselectedValues, setdoorselectedValues] = useState([]);

  const doorhandleChange = (option) => {
    if (doorselectedValues.includes(option)) {
      setdoorselectedValues(doorselectedValues.filter((val) => val !== option));
    } else {
      setdoorselectedValues([...doorselectedValues, option]);
    }
  };

  const [search, setSearch] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [trimValue, setTrimValue] = useState('Any');
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
  const [colorValue, setColorValue] = useState('Any');
  const [seatsMin, setSeatsMin] = useState('');
  const [seatsMax, setSeatsMax] = useState('');
  const [interiorValue, setInteriorValue] = useState('Any');
  const [paymentOptions, setPaymentOptions] = useState('Any');
  const [regionalSpecs, setRegionalSpecs] = useState('Any');
  const [condition, setCondition] = useState(['Any']);
  const [keywords, setKeywords] = useState([]);
  const [ownerType, setOwnerType] = useState(['Any']);



  const handleFeatureToggle = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };



  const handleApplyFilters = async () => {
    const filterData = {
      make: make !== 'Any' ? make : '',
      model: model !== 'Any' ? model : '',
      trim: trimValue !== 'Any' ? trimValue : '',
      year_min: yearMin ? parseInt(yearMin) : '',
      year_max: yearMax ? parseInt(yearMax) : '',
      price_min: priceMin ? parseInt(priceMin) : '', 
      price_max: priceMax ? parseInt(priceMax) : '', 
      location: location !== 'Any' ? location : '',
       min_kilometers: kilometersMin ? parseInt(kilometersMin) : '',
      max_kilometers: kilometersMax ? parseInt(kilometersMax) : '',
         colour: colorValue !== 'Any' ? colorValue : '',
         transmission: transmissionselectedValues.length > 0 && transmissionselectedValues[0] !== 'Any' ? transmissionselectedValues[0] : '',
      regional_specs: regionalSpecs !== 'Any' ? regionalSpecs : '',
      condition: condition.length > 0 && condition[0] !== 'Any' ? condition[0] : '',
      body_type: bodyType !== 'Any' ? bodyType : '',
      number_of_doors: doorselectedValues.length > 0 && doorselectedValues[0] !== 'Any' ? doorselectedValues[0] : '',
            fuel_type: selectedValues.length > 0 && selectedValues[0] !== 'Any' ? selectedValues[0] : '',
      owner_type: ownerType.length > 0 && ownerType[0] !== 'Any' ? ownerType[0] : '',
      keyword: keywords.length > 0 ? keywords.join(', ') : '',
      
      page: 1, 
      limit: 20 
    };

    
    try {
      setLoading(true);
    
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
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >








          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>Trim</div>
            <Select
              value={trimValue}
              onChange={setTrimValue}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <Option value="Any">Any</Option>
              <Option value="Base">Base</Option>
              <Option value="Sport">Sport</Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Verified
            </div>
            <Radio.Group
              onChange={handleChange}
              value={value}
              style={{
                display: 'flex',
                gap: '10px',
              }}
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
                  backgroundColor:
                    value === 'Available' ? '#FFEDD5' : undefined,
                }}
              >
                Available
              </Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Kilometers
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input 
                  placeholder="Min" 
                  value={kilometersMin}
                  onChange={(e) => setKilometersMin(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input 
                  placeholder="Max" 
                  value={kilometersMax}
                  onChange={(e) => setKilometersMax(e.target.value)}
                />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Year
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input 
                  placeholder="Min" 
                  value={yearMin}
                  onChange={(e) => setYearMin(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input 
                  placeholder="Max" 
                  value={yearMax}
                  onChange={(e) => setYearMax(e.target.value)}
                />
              </Col>
            </Row>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Price (Range)
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input 
                  placeholder="Min" 
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input 
                  placeholder="Max" 
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Fuel Type
            </div>
            <div className="checkbox-button-group">
              {fuelOptions.map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    selectedValues.includes(option) ? 'selected' : ''
                  }`}
                >
                  <Checkbox
                    value={option}
                    checked={selectedValues.includes(option)}
                    onChange={() => {
                      if (selectedValues.includes(option)) {
                        setSelectedValues(
                          selectedValues.filter((item) => item !== option)
                        );
                      } else {
                        setSelectedValues([...selectedValues, option]);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Condition
            </div>
            <div className="checkbox-button-group">
              {['Any', 'Used', 'New'].map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    condition.includes(option) ? 'selected' : ''
                  }`}
                >
                  <Checkbox
                    checked={condition.includes(option)}
                    onChange={() => {
                      if (condition.includes(option)) {
                        setCondition(
                          condition.filter((item) => item !== option)
                        );
                      } else {
                        setCondition([...condition, option]);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Transmission
            </div>
            <div className="checkbox-button-group">
              {transmissionOptions.map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    transmissionselectedValues.includes(option)
                      ? 'selected'
                      : ''
                  }`}
                >
                  <Checkbox
                    checked={transmissionselectedValues.includes(option)}
                    onChange={() => transmissionhandleChange(option)}
                    style={{ display: 'none' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Number of Cylinders
            </div>
            <div className="checkbox-button-group">
              {cylinderOptions.map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    cylinderselectedValues.includes(option) ? 'selected' : ''
                  }`}
                >
                  <Checkbox
                    checked={cylinderselectedValues.includes(option)}
                    onChange={() => cylinderhandleChange(option)}
                    style={{ display: 'none' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Power (1hp)
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input 
                  placeholder="Min" 
                  value={powerMin}
                  onChange={(e) => setPowerMin(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input 
                  placeholder="Max" 
                  value={powerMax}
                  onChange={(e) => setPowerMax(e.target.value)}
                />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Consumption (l/100)
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input 
                  placeholder="Min" 
                  value={consumptionMin}
                  onChange={(e) => setConsumptionMin(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input 
                  placeholder="Max" 
                  value={consumptionMax}
                  onChange={(e) => setConsumptionMax(e.target.value)}
                />
              </Col>
            </Row>
          </div>
          {/* <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '3px',
              }}
            >
              Air Conditioning
            </div>
            <Select
              value={airConditioning}
              onChange={setAirConditioning}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <Option value="Any">Any</Option>
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </div> */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '3px',
              }}
            >
              Color
            </div>
            <Select
              value={colorValue}
              onChange={setColorValue}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <Option value="Any">Any</Option>
              <Option value="Black">Black</Option>
              <Option value="White">White</Option>
              <Option value="Red">Red</Option>
              <Option value="Blue">Blue</Option>
              <Option value="Green">Green</Option>
              <Option value="Yellow">Yellow</Option>
              <Option value="Orange">Orange</Option>
              <Option value="Purple">Purple</Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Number Of Seats
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input 
                  placeholder="Min" 
                  value={seatsMin}
                  onChange={(e) => setSeatsMin(e.target.value)}
                />
              </Col>
              <Col span={12}>
                <Input 
                  placeholder="Max" 
                  value={seatsMax}
                  onChange={(e) => setSeatsMax(e.target.value)}
                />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '3px',
              }}
            >
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
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Number of Doors
            </div>
            <div className="checkbox-button-group">
              {numberofdoors.map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    doorselectedValues.includes(option) ? 'selected' : ''
                  }`}
                >
                  <Checkbox
                    checked={doorselectedValues.includes(option)}
                    onChange={() => doorhandleChange(option)}
                    style={{ display: 'none' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '3px',
              }}
            >
              Interior
            </div>
            <Select
              value={interiorValue}
              onChange={setInteriorValue}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <Option value="Any">Any</Option>
              <Option value="Leather">Leather</Option>
              <Option value="Cloth">Cloth</Option>
            </Select>
          </div>
          {/* <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '3px',
              }}
            >
              Source
            </div>
            <Select
              value={sourceValue}
              onChange={setSourceValue}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <Option value="Any">Any</Option>
              <Option value="Private">Private</Option>
              <Option value="Dealer">Dealer</Option>
            </Select>
          </div> */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Payment Options
            </div>
            <Select
              value={paymentOptions}
              onChange={setPaymentOptions}
              style={{ width: '100%', marginTop: '3px' }}
            >
              <Option value="Any">Any</Option>
              <Option value="Cash">Cash</Option>
              <Option value="Installment">Installment</Option>
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '3px',
              }}
            >
              Regional Specs
            </div>
            <Select
              value={regionalSpecs}
              onChange={setRegionalSpecs}
              style={{ width: '100%', marginTop: '10px' }}
            >
              <Option value="Any">Any</Option>
              <Option value="GCC">GCC</Option>
              <Option value="US">US</Option>
              <Option value="European">European</Option>
              <Option value="Japanese">Japanese</Option>
              <Option value="Korean">Korean</Option>
              <Option value="Chinese">Chinese</Option>
              <Option value="Other">Other</Option>
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Keywords
            </div>
            <Input
              placeholder="Enter keywords (e.g., low mileage, one owner, accident free)"
              value={keywords.join(', ')}
              onChange={(e) => {
                const value = e.target.value;
                if (value.trim()) {
                  setKeywords(value.split(',').map(k => k.trim()).filter(k => k));
                } else {
                  setKeywords([]);
                }
              }}
              style={{ width: '100%', marginTop: '10px' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              Owner Type
            </div>
            <div className="checkbox-button-group">
              {['Any', 'Individual', 'Dealer'].map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    ownerType.includes(option) ? 'selected' : ''
                  }`}
                >
                  <Checkbox
                    checked={ownerType.includes(option)}
                    onChange={() => {
                      if (ownerType.includes(option)) {
                        setOwnerType(
                          ownerType.filter((item) => item !== option)
                        );
                      } else {
                        setOwnerType([...ownerType, option]);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <Divider />
          <Button type="primary" block onClick={handleApplyFilters} loading={loading}>
            {loading ? 'Searching...' : 'Apply Filters'}
          </Button>
        </div>
      </Drawer>
      <Drawer
        title={null}
        closeIcon={null}
        placement="left"
        onClose={() => setextrafeaturesvisible(false)}
        open={extrafeaturesvisible}
        width={380}
        bodyStyle={{
          padding: 0,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 16,
            borderBottom: '1px solid #eee',
          }}
        >
          <button
            type="button"
            onClick={() => setextrafeaturesvisible(false)}
            aria-label="Back to main filters"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img
              src={Backarrowicon}
              alt="Back Arrow Icon"
              style={{ width: 24, height: 24 }}
            />
          </button>
          <span
            style={{
              fontWeight: 700,
              fontSize: 16,
              marginLeft: 16,
              color: '#0A0A0B',
            }}
          >
            Extra Features
          </span>
        </div>
        <div style={{ padding: 16 }}>
          <Input
            placeholder="Search Here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <div
          style={{
            height: 'calc(100vh - 120px)',
            overflowY: 'auto',
            marginTop: 0,
            marginLeft: 16,
            marginRight: 16,
          }}
        >
          {extraFeaturesData.map((section) => {
            const filtered = section.features.filter((f) =>
              f.toLowerCase().includes(search.toLowerCase())
            );
           if (filtered.length === 0) {
             return null;
           }
            return (
              <div key={section.title} style={{ marginBottom: 5 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    margin: '16px 0 8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: 8 }}>{section.icon}</span>
                  {section.title}
                </div>
                {filtered.map((feature) => (
                  <button
                    type="button"
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      height: 36,
                      fontSize: 12,
                      fontWeight: 400,
                      background: selectedFeatures.includes(feature)
                        ? '#f5f5f5'
                        : '#fff',
                      cursor: 'pointer',
                      width: '100%',
                      border: 'none',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>
                      {feature}
                    </span>
                    {selectedFeatures.includes(feature) ? (
                      <FaCheck style={{ color: '#222' }} />
                    ) : (
                      <MdOutlineCheckBoxOutlineBlank
                        style={{ color: '#fff' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </Drawer>
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