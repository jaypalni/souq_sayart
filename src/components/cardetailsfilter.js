// /*
//  * Copyright (c) 2025 Palni. All rights reserved.
//  * This file is part of the ss-frontend project.
//  * Unauthorized copying, modification, or distribution of this file,
//  * via any medium is strictly prohibited unless explicitly authorized.
//  */

// import React, { useState,useEffect } from 'react';
// import PropTypes from 'prop-types';
// import FilterIcon from '../assets/images/filter_icon.svg';
// import { carAPI } from '../services/api';
// import {
//   Drawer,
//   Button,
//   Select,
//   Input,
//   Checkbox,
//   Radio,
//   Divider,
//   Row,
//   Col,
// } from 'antd';
// import { FaCheck } from 'react-icons/fa';
// import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
// import Comforticon from '../assets/images/comfort_icon.svg';
// import Mediaicon from '../assets/images/media_icon.svg';
// import Extrasicon from '../assets/images/extras_icon.svg';
// import Safetyicon from '../assets/images/safety_icon.svg';
// import Searchicon from '../assets/images/search_icon.svg';
// import Backarrowicon from '../assets/images/backarrow_icon.svg';
// import { message } from 'antd';
// import { handleApiResponse, handleApiError } from '../utils/apiUtils';
// import Searchemptymodal from './searchemptymodal';
// import { fetchMakeCars, fetchModelCars } from '../commonFunction/fetchMakeCars';

// const { Option } = Select;

// // Constants moved outside component
// const DEFAULTS = {
//   ALL_MAKE: 'All Make',
//   ALL_MODELS: 'All Models',
// };

// const fuelOptions = ['Any', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
// const transmissionOptions = ['Any', 'Automatic', 'Manual', 'Steptonic'];
// const cylinderOptions = ['3', '4', '5', '6', '8', '12', 'N/A', 'Electric', 'Not Sure'];
// const numberofdoors = ['Any', '2/3', '4/5'];


// const yearOptions = [];
// const currentYear = new Date().getFullYear();

// for (let year = 1980; year <= currentYear; year++) {
//   yearOptions.push(year);
// }


// const extraFeaturesData = [
//   {
//     title: 'Comfort & Convenience',
//     icon: <img src={Comforticon} alt="Comfort Icon" />,
//     features: ['Heated seats', 'Keyless entry', 'power mirrors'],
//   },
//   {
//     title: 'Entertainment & Media',
//     icon: <img src={Mediaicon} alt="Media Icon" />,
//     features: ['Bluetooth', 'Cd Play', 'Radio'],
//   },
//   {
//     title: 'Extras',
//     icon: <img src={Extrasicon} alt="Extras Icon" />,
//     features: ['Navigation', 'Alloy wheels', 'Power locks'],
//   },
//   {
//     title: 'Safety & Security',
//     icon: <img src={Safetyicon} alt="Safety Icon" />,
//     features: ['Diesel', 'Electric'],
//   },
// ];

// // Custom hook for filter state management
// const useFilterState = () => {
//   const [selectedValues, setSelectedValues] = useState(['Any']);
//   const [transmissionselectedValues, settransmissionselectedValues] = useState(['Any']);
//   const [cylinderselectedValues, setcylinderselectedValues] = useState([]);
//   const [doorselectedValues, setdoorselectedValues] = useState([]);
//   const [condition, setCondition] = useState(['Any']);
//   const [ownerType, setOwnerType] = useState(['Any']);
  
//   return {
//     selectedValues, setSelectedValues,
//     transmissionselectedValues, settransmissionselectedValues,
//     cylinderselectedValues, setcylinderselectedValues,
//     doorselectedValues, setdoorselectedValues,
//     condition, setCondition,
//     ownerType, setOwnerType,
//   };
// };

// // Custom hook for range inputs
// const useRangeInputs = () => {
//   const [kilometersMin, setKilometersMin] = useState('');
//   const [kilometersMax, setKilometersMax] = useState('');
//   const [yearMin, setYearMin] = useState('');
//   const [yearMax, setYearMax] = useState('');
//   const [priceMin, setPriceMin] = useState('');
//   const [priceMax, setPriceMax] = useState('');
//   const [powerMin, setPowerMin] = useState('');
//   const [powerMax, setPowerMax] = useState('');
//   const [consumptionMin, setConsumptionMin] = useState('');
//   const [consumptionMax, setConsumptionMax] = useState('');
//   const [seatsMin, setSeatsMin] = useState('');
//   const [seatsMax, setSeatsMax] = useState('');
  
//   return {
//     kilometersMin, setKilometersMin, kilometersMax, setKilometersMax,
//     yearMin, setYearMin, yearMax, setYearMax,
//     priceMin, setPriceMin, priceMax, setPriceMax,
//     powerMin, setPowerMin, powerMax, setPowerMax,
//     consumptionMin, setConsumptionMin, consumptionMax, setConsumptionMax,
//     seatsMin, setSeatsMin, seatsMax, setSeatsMax,
//   };
// };

// // Custom hook for single value inputs
// const useSingleInputs = () => {
//   const [trimValue, setTrimValue] = useState('Any');
//   const [colorValue, setColorValue] = useState('Any');
//   const [interiorValue, setInteriorValue] = useState('Any');
//   const [paymentOptions, setPaymentOptions] = useState('Any');
//   const [regionalSpecs, setRegionalSpecs] = useState('Any');
  
//   return {
//     trimValue, setTrimValue,
//     colorValue, setColorValue,
//     interiorValue, setInteriorValue,
//     paymentOptions, setPaymentOptions,
//     regionalSpecs, setRegionalSpecs,
//   };
// };

// // Helper functions
// const handleCheckboxChange = (option, selectedValues, setSelectedValues) => {
//   if (selectedValues.includes(option)) {
    
//      setSelectedValues([]);
//   } else {
    
//     setSelectedValues([option]);
//   }
// };

// const handleFeatureToggle = (selectedFeatures, setSelectedFeatures) => (feature) => {
//   setSelectedFeatures((prev) =>
//     prev.includes(feature)
//       ? prev.filter((f) => f !== feature)
//       : [...prev, feature]
//   );
// };

// const handleKeywordsChange = (keywords, setKeywords) => (value) => {
//   if (value?.trim()) {
//     setKeywords(value?.split(',').map(k => k?.trim()).filter(k => k));
//   } else {
//     setKeywords([]);
//   }
// };

// // Helper functions for filter data preparation
// const ensureArray = (value) => {
//   if (Array.isArray(value)) {
//     return value;
//   }
//   if (value && value !== 'All Locations' && value !== 'All Location' && value !== '') {
//     return [value];
//   }
//   return [];
// };

// const getFilterValue = (value, defaultValue = '') => {
//   return value !== defaultValue ? value : '';
// };

// const getArrayFilterValue = (array, defaultValue = 'Any') => {
//   return array.length > 0 && array[0] !== defaultValue ? array[0] : '';
// };

// const getNumericFilterValue = (value) => {
//   return value ? String(parseInt(value)) : '';
// };

// const prepareFilterData = (filterParams) => {
//   const { 
//     selectedMake, 
//     selectedModel, 
//     bodyType, 
//     location, 
//     singleInputs, 
//     rangeInputs, 
//     filterState, 
//     keywords,
//     currentPage,
//     limit, 
//     featuredorrecommended, 
//     newUsed,
//     selectedColors = [],
//     selectedRegionalSpecs = [],
//     selectedBodyType = []
//   } = filterParams;
  
//   const apiParams = {
//     make: getFilterValue(selectedMake, 'All Make'),
//     model: getFilterValue(selectedModel, 'All Models'),
//     trim: getFilterValue(singleInputs.trimValue, 'Any'),
//     year_min: getNumericFilterValue(rangeInputs.yearMin),
//     year_max: getNumericFilterValue(rangeInputs.yearMax),
//     price_min: getNumericFilterValue(rangeInputs.priceMin),
//     price_max: getNumericFilterValue(rangeInputs.priceMax),
//     locations: ensureArray(location),
//     min_kilometers: getNumericFilterValue(rangeInputs.kilometersMin),
//     max_kilometers: getNumericFilterValue(rangeInputs.kilometersMax),
//     colors: selectedColors && selectedColors.length > 0 ? selectedColors : [],
//     transmissions: filterState.transmissionselectedValues.filter(v => v !== 'Any'),
//     regional_specs_list: selectedRegionalSpecs && selectedRegionalSpecs.length > 0 ? selectedRegionalSpecs : [],
//     body_types: selectedBodyType && selectedBodyType.length > 0 ? selectedBodyType : [],
//     doors: filterState.doorselectedValues,
//     number_of_cylinders: getArrayFilterValue(filterState.cylinderselectedValues),
//     fuel_types: filterState.selectedValues.filter(v => v !== 'Any'),
//     seller_type: getArrayFilterValue(filterState.ownerType),
//     keyword: keywords.length > 0 ? keywords.join(', ') : '',
//     page: currentPage,
//     limit: limit
//   };

//   // Debug logging for locations
//   console.log('prepareFilterData - Input location:', location, 'Type:', typeof location, 'Is Array:', Array.isArray(location));
//   console.log('prepareFilterData - Processed locations:', apiParams.locations, 'Type:', typeof apiParams.locations, 'Is Array:', Array.isArray(apiParams.locations));

//   // Only include type parameter if featuredorrecommended has a value
//   if (featuredorrecommended) {
//     apiParams.type = featuredorrecommended;
//   }

//   // Only include condition parameter if newUsed has a value and is not default
//   if (newUsed && newUsed !== 'New & Used') {
//     apiParams.condition = newUsed;
//   }

//   return apiParams;
// };

// // PropTypes for helper functions
// getFilterValue.propTypes = {
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
// };

// getArrayFilterValue.propTypes = {
//   array: PropTypes.array.isRequired,
//   defaultValue: PropTypes.string,
// };

// getNumericFilterValue.propTypes = {
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
// };

// prepareFilterData.propTypes = {
//   filterParams: PropTypes.shape({
//     selectedMake: PropTypes.string,
//     selectedModel: PropTypes.string,
//     bodyType: PropTypes.string,
//     location: PropTypes.string,
//       singleInputs: PropTypes.object.isRequired,
//       rangeInputs: PropTypes.object.isRequired,
//       featuredorrecommended: PropTypes.string,
//       newUsed: PropTypes.string,
//       filterState: PropTypes.object.isRequired,
//       keywords: PropTypes.array.isRequired,
//   }).isRequired,
// };

// // Extracted components
// const RangeInputGroup = ({ 
//   label, 
//   minValue, 
//   maxValue, 
//   onMinChange, 
//   onMaxChange, 
//   minPlaceholder, 
//   maxPlaceholder, 
//   onBlurValidation,
//   minComponent,
//   maxComponent
// }) => (
//   <div style={{ marginBottom: 16 }}>
//     <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
//       {label}
//     </div>
//     <Row gutter={8}>
//       <Col span={12}>
//         {minComponent ? (
//           minComponent
//         ) : (
//           <Input 
//             placeholder={minPlaceholder || 'Min'} 
//             value={minValue}
//             onChange={(e) => handleNumberInput(e, onMinChange)}
//             onBlur={() => onBlurValidation?.()}
//           />
//         )}
//       </Col>
//       <Col span={12}>
//         {maxComponent ? (
//           maxComponent
//         ) : (
//           <Input 
//             placeholder={maxPlaceholder || 'Max'} 
//             value={maxValue}
//             onChange={(e) => handleNumberInput(e, onMaxChange)}
//             onBlur={() => onBlurValidation?.()}
//           />
//         )}
//       </Col>
//     </Row>
//   </div>
// );


// const MAX_PRICE = 5000000000;

//  const handleNumberInput = (e, callback) => {
//   let value = e.target.value?.replace(/[^0-9]/g, ''); // remove non-numeric

//   if (value) {
//     let num = parseInt(value, 10);
//     if (num > MAX_PRICE) {
//       num = MAX_PRICE; // enforce max
//     }
//     value = String(num);
//   }

//   callback({ target: { value } }); // trigger state update with clean & capped value
// };

// RangeInputGroup.propTypes = {
//   label: PropTypes.string.isRequired,
//   minValue: PropTypes.string.isRequired,
//   maxValue: PropTypes.string.isRequired,
//   onMinChange: PropTypes.func.isRequired,
//   onMaxChange: PropTypes.func.isRequired,
//   minPlaceholder: PropTypes.string,
//   maxPlaceholder: PropTypes.string,
// };

// const CheckboxGroup = ({ title, options, selectedValues, onChange, setSelectedValues }) => (
//   <div style={{ marginBottom: 16 }}>
//     <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
//       {title}
//     </div>
//     <div className="checkbox-button-group">
//       {options.map((option) => (
//         <label
//           key={option}
//           className={`checkbox-button ${selectedValues.includes(option) ? 'selected' : ''}`}
//         >
//           <Checkbox
//             checked={selectedValues.includes(option)}
//             onChange={() => onChange(option, selectedValues, setSelectedValues)}
//             style={{ display: 'none' }}
//           />
//           {option}
//         </label>
//       ))}
//     </div>
//   </div>
// );

// CheckboxGroup.propTypes = {
//   title: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(PropTypes.string).isRequired,
//   selectedValues: PropTypes.array.isRequired,
//   onChange: PropTypes.func.isRequired,
//   setSelectedValues: PropTypes.func.isRequired,
// };

// const SelectInput = ({ title, value, onChange, options, style }) => (
//   <div style={{ marginBottom: 16 }}>
//     <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
//       {title}
//     </div>
//     <Select
//       value={value}
//       onChange={onChange}
//       style={{ width: '100%', marginTop: '10px', ...style }}
//     >
//       {options.map(option => (
//         <Option key={option.value || option} value={option.value || option}>
//           {option.label || option}
//         </Option>
//       ))}
//     </Select>
//   </div>
// );

// const SelectInputTrimData = ({ title, value, onChange, options, style }) => (
//   <div style={{ marginBottom: 16 }}>
//     <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
//       {title}
//     </div>
//     <Select
//       value={value}
//       onChange={onChange}
//       style={{ width: '100%', marginTop: '10px', ...style }}
//     >
//       {options.map(option => (
//         <Option key={option.id} value={option.trim_name}>
//           {option.trim_name}
//         </Option>
//       ))}
//     </Select>
//   </div>
// );

// const SelectInputMultiAPI = ({ title, value, onChange, options, style, valueField = 'id', labelField = 'name', defaultOption }) => {
//   console.log(`${title} SelectInputMultiAPI:`, { value, optionsLength: options.length, options: options.slice(0, 2), valueField, labelField });
  
//   // Helper function to get the correct field value with fallbacks
//   const getFieldValue = (option, field) => {
//     // Try multiple possible field names
//     const possibleFields = [
//       field,
//       field.replace('_name', ''),
//       field.replace('_name', '_id'),
//       'name',
//       'id',
//       'title',
//       'label'
//     ];
    
//     for (const possibleField of possibleFields) {
//       if (option[possibleField] !== undefined) {
//         return option[possibleField];
//       }
//     }
    
//     // If no field found, return the field name itself
//     return option[field] || field;
//   };
  
//   return (
//     <div style={{ marginBottom: 16 }}>
//       <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
//         {title}
//       </div>
//       <Select
//         mode="multiple"
//         value={value}
//         onChange={onChange}
//         placeholder={`Select ${title}`}
//         style={{ width: '100%', marginTop: '10px', ...style }}
//         showSearch
//         filterOption={(input, option) =>
//           (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
//         }
//         maxTagCount="responsive"
//       >
//         {defaultOption && (
//           <Option key="default" value={defaultOption.value}>
//             {defaultOption.label}
//           </Option>
//         )}
//         {options.map(option => {
//           const displayValue = getFieldValue(option, labelField);
//           const optionValue = getFieldValue(option, labelField);
          
//           console.log(`${title} option:`, option, 'displayValue:', displayValue, 'optionValue:', optionValue);
          
//           return (
//             <Option key={option[valueField] || option.id || optionValue} value={optionValue}>
//               {displayValue}
//             </Option>
//           );
//         })}
//       </Select>
//     </div>
//   );
// };

// SelectInputTrimData.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.string,
//   onChange: PropTypes.func.isRequired,
//   options: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//     trim_name: PropTypes.string.isRequired,
//   })).isRequired,
//   style: PropTypes.object,
// };

// SelectInputMultiAPI.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.array,
//   onChange: PropTypes.func.isRequired,
//   options: PropTypes.array.isRequired,
//   style: PropTypes.object,
//   valueField: PropTypes.string,
//   labelField: PropTypes.string,
//   defaultOption: PropTypes.shape({
//     value: PropTypes.string,
//     label: PropTypes.string,
//   }),
// };

// const SelectInputAPI = ({ title, value, onChange, options, style, valueField = 'id', labelField = 'name', defaultOption }) => {
//   console.log(`${title} SelectInputAPI:`, { value, optionsLength: options.length, options: options.slice(0, 2), valueField, labelField });
  
//   // Helper function to get the correct field value with fallbacks
//   const getFieldValue = (option, field) => {
//     // Try multiple possible field names
//     const possibleFields = [
//       field,
//       field.replace('_name', ''),
//       field.replace('_name', '_id'),
//       'name',
//       'id',
//       'title',
//       'label'
//     ];
    
//     for (const possibleField of possibleFields) {
//       if (option[possibleField] !== undefined) {
//         return option[possibleField];
//       }
//     }
    
//     // If no field found, return the field name itself
//     return option[field] || field;
//   };
  
//   return (
//     <div style={{ marginBottom: 16 }}>
//       <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
//         {title}
//       </div>
//       <Select
//         value={value}
//         onChange={onChange}
//         placeholder={`Select ${title}`}
//         style={{ width: '100%', marginTop: '10px', ...style }}
//         showSearch
//         filterOption={(input, option) =>
//           (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
//         }
//       >
//         {defaultOption && (
//           <Option key="default" value={defaultOption.value}>
//             {defaultOption.label}
//           </Option>
//         )}
//         {options.map(option => {
//           const displayValue = getFieldValue(option, labelField);
//           const optionValue = getFieldValue(option, labelField); // Use same value for both display and storage
          
//           console.log(`${title} option:`, option, 'displayValue:', displayValue, 'optionValue:', optionValue);
          
//           return (
//             <Option key={option[valueField] || option.id || optionValue} value={optionValue}>
//               {displayValue}
//             </Option>
//           );
//         })}
//       </Select>
//     </div>
//   );
// };

// SelectInputAPI.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.string,
//   onChange: PropTypes.func.isRequired,
//   options: PropTypes.array.isRequired,
//   style: PropTypes.object,
//   valueField: PropTypes.string,
//   labelField: PropTypes.string,
//   defaultOption: PropTypes.shape({
//     value: PropTypes.string,
//     label: PropTypes.string,
//   }),
// };

// SelectInput.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
//   options: PropTypes.array.isRequired,
//   style: PropTypes.object,
// };

// const ExtraFeaturesDrawer = ({ visible, onClose, search, onSearchChange, selectedFeatures, onFeatureToggle }) => (
//   <Drawer
//     title={null}
//     closeIcon={null}
//     placement="left"
//     onClose={onClose}
//     open={visible}
//     width={380}
//     bodyStyle={{
//       padding: 0,
//       height: '100%',
//       overflow: 'hidden',
//     }}
//   >
//     <div style={{
//       display: 'flex',
//       alignItems: 'center',
//       padding: 16,
//       borderBottom: '1px solid #eee',
//     }}>
//       <button
//         type="button"
//         onClick={onClose}
//         aria-label="Back to main filters"
//         style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
//       >
//         <img
//           src={Backarrowicon}
//           alt="Back Arrow Icon"
//           style={{ width: 24, height: 24 }}
//         />
//       </button>
//       <span style={{
//         fontWeight: 700,
//         fontSize: 16,
//         marginLeft: 16,
//         color: '#0A0A0B',
//       }}>
//         Extra Features
//       </span>
//     </div>
    
//     <div style={{ padding: 16 }}>
//       <Input
//         placeholder="Search Here..."
//         value={search}
//         onChange={onSearchChange}
//         prefix={
//           <img
//             src={Searchicon}
//             alt="Search Icon"
//             style={{ width: 24, height: 24 }}
//           />
//         }
//         style={{
//           borderRadius: 8,
//           height: 44,
//           boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.07)',
//         }}
//       />
//     </div>
    
//     <div style={{
//       height: 'calc(100vh - 120px)',
//       overflowY: 'auto',
//       marginTop: 0,
//       marginLeft: 16,
//       marginRight: 16,
//     }}>
//       {extraFeaturesData.map((section) => {
//         const filtered = section.features.filter((f) =>
//           f.toLowerCase().includes(search.toLowerCase())
//         );
//         if (filtered.length === 0) {
//           return null;
//         }
//         return (
//           <div key={section.title} style={{ marginBottom: 5 }}>
//             <div style={{
//               fontWeight: 700,
//               fontSize: 16,
//               margin: '16px 0 8px',
//               display: 'flex',
//               alignItems: 'center',
//             }}>
//               <span style={{ marginRight: 8 }}>{section.icon}</span>
//               {section.title}
//             </div>
//             {filtered.map((feature) => (
//               <button
//                 type="button"
//                 key={feature}
//                 onClick={() => onFeatureToggle(feature)}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   padding: '10px 12px',
//                   height: 36,
//                   fontSize: 12,
//                   fontWeight: 400,
//                   background: selectedFeatures.includes(feature) ? '#f5f5f5' : '#fff',
//                   cursor: 'pointer',
//                   width: '100%',
//                   border: 'none',
//                   textAlign: 'left',
//                 }}
//               >
//                 <span style={{ textTransform: 'capitalize' }}>{feature}</span>
//                 {selectedFeatures.includes(feature) ? (
//                   <FaCheck style={{ color: '#222' }} />
//                 ) : (
//                   <MdOutlineCheckBoxOutlineBlank style={{ color: '#fff' }} />
//                 )}
//               </button>
//             ))}
//           </div>
//         );
//       })}
//     </div>
//   </Drawer>
// );

// ExtraFeaturesDrawer.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   search: PropTypes.string.isRequired,
//   onSearchChange: PropTypes.func.isRequired,
//   selectedFeatures: PropTypes.array.isRequired,
//   onFeatureToggle: PropTypes.func.isRequired,
// };

// const Cardetailsfilter = ({ 
//   make, 
//   model, 
//   bodyType, 
//   location, 
//   onSearchResults,
//   limit,
//   currentPage, 
//   featuredorrecommended, 
//   newUsed, 
//   onMakeChange, 
//   onModelChange,
//   selectedMake: propSelectedMake,
//   selectedModel: propSelectedModel,
//   selectedBodyType: propSelectedBodyType,
//   selectedLocation: propSelectedLocation,
//   selectedNewUsed: propSelectedNewUsed,
//   selectedPriceMin: propSelectedPriceMin,
//   selectedPriceMax: propSelectedPriceMax
// }) => {
//   const [visible, setVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [extrafeaturesvisible, setextrafeaturesvisible] = useState(false);
//   const [value, setValue] = useState('Any');
//   const [search, setSearch] = useState('');
//   const [messageApi, contextHolder] = message.useMessage();

//   // Make and Model state management
//   const [carMakes, setCarMakes] = useState([DEFAULTS.ALL_MAKE]);
//   const [carModels, setCarModels] = useState([]);
//   const [selectedMake, setSelectedMake] = useState(make || DEFAULTS.ALL_MAKE);
//   const [selectedModel, setSelectedModel] = useState(model || DEFAULTS.ALL_MODELS);

//   // Ensure limit and currentPage are valid numbers
//   const validLimit = typeof limit === 'number' && limit > 0 ? limit : 20;
//   const validCurrentPage = typeof currentPage === 'number' && currentPage > 0 ? currentPage : 1;
//   const [selectedFeatures, setSelectedFeatures] = useState([]);
//   const [keywords, setKeywords] = useState([]);
//   const [trimData, setTrimData] = useState(false);
//   const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false);
//   const [emptySearchData, setEmptySearchData] = useState(null);
//   const [regionalSpecsOptions, setRegionalSpecsOptions] = useState([]);

//   // New Changes for API'S
// const CORRECT_DEFAULT_BODY_TYPE = 'All Body Types';

// const [carBodyTypes, setCarBodyTypes] = useState([]);
// const [carLocations, setCarLocations] = useState([]);
// const [searchBodyType, setSearchBodyType] = useState('');




// // Selected values for dropdowns - initialize from props
// const [selectedBodyType, setSelectedBodyType] = useState(propSelectedBodyType || []);
// const [selectedLocation, setSelectedLocation] = useState(() => {
//   // Filter out "All Locations" from initial prop values
//   if (propSelectedLocation) {
//     return Array.isArray(propSelectedLocation) 
//       ? propSelectedLocation.filter(loc => loc !== 'All Locations' && loc !== 'All Location' && loc !== 'All')
//       : propSelectedLocation !== 'All Locations' && propSelectedLocation !== 'All Location' && propSelectedLocation !== 'All'
//         ? [propSelectedLocation] 
//         : [];
//   }
//   return [];
// });
// const [selectedColors, setSelectedColors] = useState([]);
// const [selectedRegionalSpecs, setSelectedRegionalSpecs] = useState([]);

// // Debug logging
// console.log('Cardetailsfilter - Received props:', { 
//   propSelectedMake, 
//   propSelectedModel, 
//   propSelectedBodyType, 
//   propSelectedLocation, 
//   propSelectedNewUsed, 
//   propSelectedPriceMin, 
//   propSelectedPriceMax 
// });
// console.log('Cardetailsfilter - Current state:', { selectedMake, selectedModel, selectedBodyType, selectedLocation, selectedColors, selectedRegionalSpecs });
// console.log('API data counts:', { carMakes: carMakes.length, carModels: carModels.length, carBodyTypes: carBodyTypes.length, carLocations: carLocations.length });


//   const filterState = useFilterState();
//   const rangeInputs = useRangeInputs();
//   const singleInputs = useSingleInputs();

//   // Update state when props change
//   useEffect(() => {
//     if (propSelectedMake && propSelectedMake !== selectedMake) {
//       console.log('Cardetailsfilter - Updating make from prop:', propSelectedMake);
//       setSelectedMake(propSelectedMake);
//     }
//   }, [propSelectedMake]);

//   useEffect(() => {
//     if (propSelectedModel && propSelectedModel !== selectedModel) {
//       console.log('Cardetailsfilter - Updating model from prop:', propSelectedModel);
//       console.log('Cardetailsfilter - Available models:', carModels);
//       setSelectedModel(propSelectedModel);
//     }
//   }, [propSelectedModel]);

//   useEffect(() => {
//     if (propSelectedBodyType && propSelectedBodyType !== selectedBodyType) {
//       console.log('Cardetailsfilter - Updating bodyType from prop:', propSelectedBodyType);
//       setSelectedBodyType(propSelectedBodyType);
//     }
//   }, [propSelectedBodyType]);

//   useEffect(() => {
//     if (propSelectedLocation && propSelectedLocation !== selectedLocation) {
//       console.log('Cardetailsfilter - Updating location from prop:', propSelectedLocation);
//       // Filter out "All Locations" from prop values
//       const filteredLocation = Array.isArray(propSelectedLocation) 
//         ? propSelectedLocation.filter(loc => loc !== 'All Locations' && loc !== 'All Location' && loc !== 'All')
//         : propSelectedLocation !== 'All Locations' && propSelectedLocation !== 'All Location' && propSelectedLocation !== 'All'
//           ? [propSelectedLocation] 
//           : [];
//       setSelectedLocation(filteredLocation);
//     }
//   }, [propSelectedLocation]);

//   // Fetch models when component initializes with a selected make from props
//   useEffect(() => {
//     if (propSelectedMake && propSelectedMake !== 'Any' && carMakes.length > 0) {
//       console.log('Cardetailsfilter - Fetching models for prop make:', propSelectedMake);
//       fetchModelCars({ setLoading, setCarModels, make: propSelectedMake });
//     }
//   }, [propSelectedMake, carMakes.length]);

//   const handleChange = (e) => setValue(e.target.value);


//   // Fetch make data on component mount
//   useEffect(() => {
//     fetchMakeCars({ setLoading, setCarMakes });
//   }, []);

//   // Fetch model data when make changes
//   useEffect(() => {
//     if (selectedMake && selectedMake !== DEFAULTS.ALL_MAKE) {
//       fetchModelCars({ setLoading, setCarModels, make: selectedMake }).then(() => {
//         // Reset model when make changes
//         setSelectedModel(DEFAULTS.ALL_MODELS);
//       });
//     } else {
//       setCarModels([]);
//       setSelectedModel(DEFAULTS.ALL_MODELS);
//     }
//   }, [selectedMake]);

//   // Sync with parent component props
//   useEffect(() => {
//     if (make !== selectedMake) {
//       setSelectedMake(make || DEFAULTS.ALL_MAKE);
//     }
//     if (model !== selectedModel) {
//       setSelectedModel(model || DEFAULTS.ALL_MODELS);
//     }
//   }, [make, model]);

//   useEffect(() => {
//     fetchTrimData()
//   },[selectedMake, selectedModel])

//    useEffect(() => {
//     handleApplyFilters()
//   },[validCurrentPage, validLimit])

//   useEffect(() => {
//       fetchUpdateOptionsData();
//     }, []);

//   const fetchTrimData = async () => {
//   try {
//     setLoading(true);
//     const response = await carAPI.trimDetailsFilter(selectedMake, selectedModel);
//     const data1 = handleApiResponse(response);

//     if (data1) {
//       setTrimData(data1?.data);
//     }

//     message.success(data1.message || 'Fetched successfully');
//   } catch (error) {
//     const errorData = handleApiError(error);
//     message.error(errorData.message || 'Failed to Trim car data');
//     setTrimData([]);
//   } finally {
//     setLoading(false);
//   }
// };

// const fetchUpdateOptionsData = async () => {
//   try {
//     setLoading(true);
//     const response = await carAPI.uploadOptionDetails({});
//     const data1 = handleApiResponse(response);

//     if (data1?.data?.regional_specs) {
//       // Set the API response to state
//       setRegionalSpecsOptions(data1.data.regional_specs);
//     }

//     message.success(data1.message || 'Fetched successfully');
//   } catch (error) {
//     const errorData = handleApiError(error);
//     message.error(errorData.message || 'Failed to fetch Regional Specs');
//     setRegionalSpecsOptions([]); // reset on error
//   } finally {
//     setLoading(false);
//   }
// };
// const validateRange = (label, min, max) => {
//   if (!isNaN(min) && !isNaN(max) && min > max) {
//      messageApi.open({
//                 type: 'error',
//                 content: `Minimum ${label} cannot be greater than maximum ${label}`,
//               });
   
//     return false;
//   }
//   return true;
// };

//   const handleApplyFilters = () => {
//   const validateRange = (label, min, max) => {
//     // alert('wdhuwjd')
//   if (!isNaN(min) && !isNaN(max) && min > max) {
//    messageApi.open({
//                 type: 'error',
//                 content: `Minimum ${label} cannot be greater than maximum ${label}`,
//               });
   
//     return false;
//   }
//   return true;
// };
//   const minKilometers = parseInt(rangeInputs.kilometersMin, 10);
//   const maxKilometers = parseInt(rangeInputs.kilometersMax, 10);
//   const minYear = parseInt(rangeInputs.yearMin, 10);
//   const maxYear = parseInt(rangeInputs.yearMax, 10);
// // In handleApplyFilters:
// if (
//   !validateRange('kilometers', minKilometers, maxKilometers) ||
//   !validateRange('price', rangeInputs.priceMin, rangeInputs.priceMax)||
//    !validateRange('Year', minYear, maxYear)

// ) {
//   return;
// }

//   applyFilters()
// };



//   const applyFilters = async () => {
//     try {
//       setLoading(true);
//       const filterData = prepareFilterData({ 
//         selectedMake, 
//         selectedModel, 
//         bodyType, 
//         location, 
//         singleInputs, 
//         rangeInputs, 
//         filterState, 
//         keywords, 
//         currentPage: validCurrentPage, 
//         limit: validLimit, 
//         featuredorrecommended, 
//         newUsed,
//         selectedColors,
//         selectedRegionalSpecs,
//         selectedBodyType
//       });
//       const response = await carAPI.searchCars(filterData);      
//       if (response.data) {
//         const results = response.data.cars || response.data || [];
        
//         if (onSearchResults) {
//           onSearchResults(response.data);
//         }
        
//         if (response?.data?.data?.cars.length === 0) {
//           setEmptySearchData(filterData);
//           setIsEmptyModalOpen(true);
//           message.info('No cars found with the current filters. Try adjusting your search criteria.');
//         } else {
//           message.success(`Found ${results.length} car(s) matching your filters!`);
//         }
//       }
      
//       setVisible(false);
//     } catch (error) {
//       console.error('Search API Error:', error);
      
//       // Still try to call onSearchResults with empty data to reset the state
//       if (onSearchResults) {
//         onSearchResults({ cars: [], pagination: {} });
//       }
      
//       setVisible(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//     const handleResetFilters = () => {
//     // Reset range inputs
//     rangeInputs.setKilometersMin('');
//     rangeInputs.setKilometersMax('');
//     rangeInputs.setYearMin('');
//     rangeInputs.setYearMax('');
//     rangeInputs.setPriceMin('');
//     rangeInputs.setPriceMax('');
//     rangeInputs.setPowerMin('');
//     rangeInputs.setPowerMax('');
//     rangeInputs.setConsumptionMin('');
//     rangeInputs.setConsumptionMax('');
//     rangeInputs.setSeatsMin('');
//     rangeInputs.setSeatsMax('');

//     // Reset filter state
//     filterState.setSelectedValues(['Any']);
//     filterState.settransmissionselectedValues(['Any']);
//     filterState.setcylinderselectedValues([]);
//     filterState.setdoorselectedValues([]);
//     filterState.setCondition(['Any']);
//     filterState.setOwnerType(['Any']);

//     // Reset single inputs
//     singleInputs.setTrimValue('Any');
//     singleInputs.setColorValue('Any');
//     singleInputs.setInteriorValue('Any');
//     singleInputs.setPaymentOptions('Any');
//     singleInputs.setRegionalSpecs('Any');
//     setKeywords([]);
//     setSelectedFeatures([]);

//     // Reset selected values
//     setSelectedMake('Any');
//     setSelectedModel('Any');
//     setSelectedBodyType([]);
//     setSelectedLocation([]);
//     setSelectedColors([]);
//     setSelectedRegionalSpecs([]);

//     setValue('Any');

//     message.success('Filters have been reset!');
//   };


//   return (
//     <>
//     {contextHolder}
//       <button
//         type="button"
//         onClick={() => setVisible(true)}
//         aria-label="Open filters"
//         style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
//       >
//         <img
//           src={FilterIcon}
//           alt="Filter Icon"
//           style={{ width: '30px', height: '30px' }}
//         />
//       </button>
      
//       <Drawer
//         title="Filter"
//         placement="left"
//         onClose={() => setVisible(false)}
//         visible={visible}
//         width={380}
//         bodyStyle={{
//           paddingBottom: 80,
//           height: 'calc(100% - 108px)',
//           overflow: 'hidden',
//         }}
//       >
//         <div style={{
//           height: '100%',
//           overflowY: 'auto',
//           paddingRight: '8px',
//         }}>

//           {/* <SelectInputAPI
//             title="Make"
//             value={selectedMake}
//             onChange={(value) => setSelectedMake(value)}
//             options={carMakes}
//             valueField="id"
//             labelField="make_name"
//             defaultOption={{ value: 'Any', label: 'Any Make' }}
//           />

//           <SelectInputAPI
//             title="Model"
//             value={selectedModel}
//             onChange={(value) => setSelectedModel(value)}
//             options={carModels}
//             valueField="id"
//             labelField="model_name"
//             defaultOption={{ value: 'Any', label: 'Any Model' }}
//           /> */}
          
//           <SelectInput
//             title="Make"
//             value={selectedMake}
//             onChange={(value) => {
//               const newMake = value || DEFAULTS.ALL_MAKE;
//               setSelectedMake(newMake);
//               setSelectedModel(DEFAULTS.ALL_MODELS);
//               if (onMakeChange) {
//                 onMakeChange(newMake);
//               }
//             }}
//             options={carMakes.map(make => ({ value: make?.name || make, label: make?.name || make }))}
//           />

//           <SelectInput
//             title="Model"
//             value={selectedModel}
//             onChange={(value) => {
//               const newModel = value || DEFAULTS.ALL_MODELS;
//               setSelectedModel(newModel);
//               if (onModelChange) {
//                 onModelChange(newModel);
//               }
//             }}
//             options={carModels.map(model => ({ value: model?.model_name || model, label: model?.model_name || model }))}
//           />

//           <SelectInputTrimData
//             title="Trim"
//             value={singleInputs.trimValue}
//             onChange={singleInputs.setTrimValue}
//             options={trimData}
//           />

//           <SelectInputMultiAPI
//             title="Body Type"
//             value={selectedBodyType}
//             onChange={(value) => setSelectedBodyType(value)}
//             options={carBodyTypes}
//             valueField="id"
//             labelField="body_type"
//           />

//           <SelectInputMultiAPI
//             title="Location"
//             value={selectedLocation.filter(loc => loc !== 'All Locations')}
//             onChange={(value) => {
//               // Filter out "All Locations" from the new value
//               const filteredValue = value.filter(loc => loc !== 'All Locations');
//               setSelectedLocation(filteredValue);
//             }}
//             options={carLocations.filter(location => location.location !== 'All Locations')}
//             valueField="id"
//             labelField="location"
//           />

//           <div style={{ marginBottom: 16 }}>
//             <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
//               Verified
//             </div>
//             <Radio.Group
//               onChange={handleChange}
//               value={value}
//               style={{ display: 'flex', gap: '10px' }}
//             >
//               <Radio.Button
//                 value="Any"
//                 className="custom-radio-button"
//                 style={{
//                   width: '20%',
//                   textAlign: 'center',
//                   marginRight: '10px',
//                   borderRadius: '4px',
//                   color: '#000',
//                   fontSize: '12px',
//                   fontWeight: '400',
//                   borderColor: value === 'Any' ? '#D67900' : undefined,
//                   backgroundColor: value === 'Any' ? '#FFEDD5' : undefined,
//                 }}
//               >
//                 Any
//               </Radio.Button>
//               <Radio.Button
//                 value="Available"
//                 className="custom-radio-button"
//                 style={{
//                   width: '30%',
//                   textAlign: 'center',
//                   borderRadius: '4px',
//                   color: '#000',
//                   fontSize: '12px',
//                   fontWeight: '400',
//                   borderLeft: '1px solid #D67900',
//                   borderColor: value === 'Available' ? '#D67900' : undefined,
//                   backgroundColor: value === 'Available' ? '#FFEDD5' : undefined,
//                 }}
//               >
//                 Available
//               </Radio.Button>
//             </Radio.Group>
//           </div>

//           <RangeInputGroup
//             label="Kilometers"
//             minValue={rangeInputs.kilometersMin}
//             maxValue={rangeInputs.kilometersMax}
//             onMinChange={(e) => rangeInputs.setKilometersMin(e.target.value)}
//             onMaxChange={(e) => rangeInputs.setKilometersMax(e.target.value)}
//              onBlurValidation={() => {
//               console.log('s33',rangeInputs.kilometersMax,rangeInputs.kilometersMin)
//     const min = parseInt(rangeInputs.kilometersMin, 10);
//     const max = parseInt(rangeInputs.kilometersMax, 10);

//     if (!isNaN(min) && !isNaN(max) && min > max) {
//         messageApi.open({
//                 type: 'error',
//                 content: 'Minimum kilometers cannot be greater than maximum kilometers',
//               });
    
//     }
//   }}
//           />

          
// <RangeInputGroup
//   label="Year"
//   minComponent={
//     <Select
//       placeholder="Min Year"
//       value={rangeInputs.yearMin || undefined}
//       style={{ width: '100%' }}
//       onChange={(value) => rangeInputs.setYearMin(value)}
//       onBlur={() => {
//         const min = parseInt(rangeInputs.yearMin, 10);
//         const max = parseInt(rangeInputs.yearMax, 10);
//         if (!isNaN(min) && !isNaN(max) && min > max) {
//           message.error('Minimum Year cannot be greater than Maximum Year');
//         }
//       }}
//     >
//       {yearOptions.map((year) => (
//         <Option key={year} value={year}>
//           {year}
//         </Option>
//       ))}
//     </Select>
//   }
//   maxComponent={
//     <Select
//       placeholder="Max Year"
//       value={rangeInputs.yearMax || undefined}
//       style={{ width: '100%' }}
//       onChange={(value) => rangeInputs.setYearMax(value)}
//       onBlur={() => {
//         const min = parseInt(rangeInputs.yearMin, 10);
//         const max = parseInt(rangeInputs.yearMax, 10);
//         if (!isNaN(min) && !isNaN(max) && min > max) {
//           message.error('Minimum Year cannot be greater than Maximum Year');
//         }
//       }}
//     >
//       {yearOptions.map((year) => (
//         <Option key={year} value={year}>
//           {year}
//         </Option>
//       ))}
//     </Select>
//   }
// />

//           <RangeInputGroup
//             label="Price (Range)"
//             minValue={rangeInputs.priceMin}
//             maxValue={rangeInputs.priceMax}
//             onMinChange={(e) => rangeInputs.setPriceMin(e.target.value)}
//             onMaxChange={(e) => rangeInputs.setPriceMax(e.target.value)}
//             onBlurValidation={() => {
//     const min = parseInt(rangeInputs.priceMin, 10);
//     const max = parseInt(rangeInputs.priceMax, 10);

//     if (!isNaN(min) && !isNaN(max) && min > max) {
//         messageApi.open({
//                 type: 'error',
//                 content: 'Minimum Price cannot be greater than maximum Price',
//               });
    
//     }
//   }}
//           />

//           <SelectInputMultiAPI
//             title="Fuel Type"
//             value={filterState.selectedValues.filter(v => v !== 'Any')}
//             onChange={(value) => filterState.setSelectedValues(value.length > 0 ? value : ['Any'])}
//             options={fuelOptions.filter(option => option !== 'Any').map(option => ({ value: option, label: option }))}
//           />

//           <CheckboxGroup
//             title="Condition"
//             options={['Any', 'Used', 'New']}
//             selectedValues={filterState.condition}
//             onChange={handleCheckboxChange}
//             setSelectedValues={filterState.setCondition}
//           />

//           <SelectInputMultiAPI
//             title="Transmission"
//             value={filterState.transmissionselectedValues.filter(v => v !== 'Any')}
//             onChange={(value) => filterState.settransmissionselectedValues(value.length > 0 ? value : ['Any'])}
//             options={transmissionOptions.filter(option => option !== 'Any').map(option => ({ value: option, label: option }))}
//           />

//           <CheckboxGroup
//             title="Number of Cylinders"
//             options={cylinderOptions}
//             selectedValues={filterState.cylinderselectedValues}
//             onChange={handleCheckboxChange}
//             setSelectedValues={filterState.setcylinderselectedValues}
//           />
//           <SelectInputMultiAPI
//             title="Color"
//             value={selectedColors}
//             onChange={(value) => setSelectedColors(value)}
//             options={['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Silver', 'Gray', 'Brown'].map(option => ({ value: option, label: option }))}
//           />

//           <SelectInputMultiAPI
//             title="Number of Doors"
//             value={filterState.doorselectedValues}
//             onChange={(value) => filterState.setdoorselectedValues(value)}
//             options={numberofdoors.filter(option => option !== 'Any').map(option => ({ value: option, label: option }))}
//           />

//           {/* <SelectInput
//             title="Interior"
//             value={singleInputs.interiorValue}
//             onChange={singleInputs.setInteriorValue}
//             options={['Any', 'Leather', 'Cloth']}
//           /> */}

//           {/* <SelectInput
//             title="Payment Options"
//             value={singleInputs.paymentOptions}
//             onChange={singleInputs.setPaymentOptions}
//             options={['Any', 'Cash', 'Installment']}
//             style={{ marginTop: '3px' }}
//           /> */}

//           <SelectInputMultiAPI
//             title="Regional Specs"
//             value={selectedRegionalSpecs}
//             onChange={(value) => setSelectedRegionalSpecs(value)}
//             options={regionalSpecsOptions.map(spec => ({
//               value: spec.regional_spec,
//               label: spec.regional_spec
//             }))}
//           />


//           <div style={{ marginBottom: 16 }}>
//             <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
//               Keywords
//             </div>
//             <Input
//               placeholder="Enter keywords (e.g., low mileage, one owner, accident free)"
//               value={keywords.join(', ')}
//               onChange={(e) => handleKeywordsChange(keywords, setKeywords)(e.target.value)}
//               style={{ width: '100%', marginTop: '10px' }}
//             />
//           </div>

//           <CheckboxGroup
//             title="Owner Type"
//             options={['Any', 'Individual', 'Dealer']}
//             selectedValues={filterState.ownerType}
//             onChange={handleCheckboxChange}
//             setSelectedValues={filterState.setOwnerType}
//           />

//           <Divider />
//         </div>
//         <Row gutter={12} className='mt-4'>
//   <Col span={12}>
//     <Button
//       type="primary"
//       block
//       onClick={handleApplyFilters}
//       loading={loading}
//     >
//       {loading ? 'Searching...' : 'Apply Filters'}
//     </Button>
//   </Col>
//   <Col span={12}>
//     <Button
//       block
//       onClick={handleResetFilters}
//       style={{
//         backgroundColor: '#FFFFFF',
//         border: '1px solid #008ad5',
//         color: '#008ad5',
//       }}
//     >
//       Reset Filters
//     </Button>
//   </Col>
// </Row>
//       </Drawer>

//       <ExtraFeaturesDrawer
//         visible={extrafeaturesvisible}
//         onClose={() => setextrafeaturesvisible(false)}
//         search={search}
//         onSearchChange={(e) => setSearch(e.target.value)}
//         selectedFeatures={selectedFeatures}
//         onFeatureToggle={handleFeatureToggle(selectedFeatures, setSelectedFeatures)}
//       />

//       <Searchemptymodal
//         visible={isEmptyModalOpen}
//         onClose={() => setIsEmptyModalOpen(false)}
//         make={selectedMake}
//         setMake={setSelectedMake} 
//         model={selectedModel}
//         setModel={setSelectedModel}
//         bodyType={bodyType}
//         setBodyType={() => {}} // Placeholder - parent component should handle this
//         selectedLocation={location}
//         setSelectedLocation={() => {}} // Placeholder - parent component should handle this
//         toastmessage={(msg) => message.info(msg)}
//         setSaveSearchesReload={() => {}}
//         filterData={emptySearchData}
//       />
//     </>
//   );
// };

// Cardetailsfilter.propTypes = {
//   make: PropTypes.string,
//   model: PropTypes.string,
//   bodyType: PropTypes.string,
//   location: PropTypes.string,
//   onSearchResults: PropTypes.func,
//   limit: PropTypes.number,
//   currentPage: PropTypes.number,
//   featuredorrecommended: PropTypes.string,
//   newUsed: PropTypes.string,
//   onMakeChange: PropTypes.func,
//   onModelChange: PropTypes.func,
//   selectedMake: PropTypes.string,
//   selectedModel: PropTypes.string,
//   selectedBodyType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
//   selectedLocation: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
//   selectedNewUsed: PropTypes.string,
//   selectedPriceMin: PropTypes.number,
//   selectedPriceMax: PropTypes.number,
// };

// export default Cardetailsfilter;

/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
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
import { message } from 'antd';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import Searchemptymodal from './searchemptymodal';
import { fetchMakeCars, fetchModelCars } from '../commonFunction/fetchMakeCars';

const { Option } = Select;

// Constants moved outside component
const fuelOptions = ['Any', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissionOptions = ['Any', 'Automatic', 'Manual', 'Steptonic'];
const cylinderOptions = ['3', '4', '5', '6', '8', '12', 'N/A', 'Electric', 'Not Sure'];
const numberofdoors = ['Any', '2/3', '4/5'];


const yearOptions = [];
const currentYear = new Date().getFullYear();

for (let year = 1980; year <= currentYear; year++) {
  yearOptions.push(year);
}


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
  const [trimValue, setTrimValue] = useState([]);
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
    // Remove the option from the array
    setSelectedValues(selectedValues.filter(item => item !== option));
  } else {
    // Add the option to the array
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
  if (value?.trim()) {
    setKeywords(value?.split(',').map(k => k?.trim()).filter(k => k));
  } else {
    setKeywords([]);
  }
};

// Helper function to convert newUsed string to condition array
const convertNewUsedToCondition = (newUsed) => {
  if (newUsed === 'New & Used') {
    return ['Used', 'New']; // Select both when "New & Used" is selected
  } else if (newUsed === 'New') {
    return ['New'];
  } else if (newUsed === 'Used') {
    return ['Used'];
  }
  return ['Used', 'New']; // Default to both
};

// Helper functions for filter data preparation
const getFilterValue = (value, defaultValue = '') => {
  return value !== defaultValue ? value : '';
};

const getArrayFilterValue = (array, defaultValue = 'Any') => {
  return array.length > 0 && array[0] !== defaultValue ? array[0] : '';
};

const getNumericFilterValue = (value) => {
  return value ? String(parseInt(value)) : '';
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

const prepareFilterData = (filterParams) => {
  const { 
    selectedMake, 
    selectedModel, 
    bodyType, 
    location, 
    singleInputs, 
    rangeInputs, 
    filterState, 
    keywords,
    currentPage,
    limit, 
    featuredorrecommended, 
    newUsed,
    selectedColors = [],
    selectedRegionalSpecs = [],
    selectedBodyType = [],
    sortedbydata
  } = filterParams;
  
  const sortConfig = getSortParameters(sortedbydata);
  
  const apiParams = {
    make: getFilterValue(selectedMake, 'All Make'),
    model: getFilterValue(selectedModel, 'All Models'),
    trim: singleInputs.trimValue.length > 0 ? singleInputs.trimValue : [],
    year_min: getNumericFilterValue(rangeInputs.yearMin),
    year_max: getNumericFilterValue(rangeInputs.yearMax),
    price_min: getNumericFilterValue(rangeInputs.priceMin),
    price_max: getNumericFilterValue(rangeInputs.priceMax),
    locations: location && location.length > 0 ? location : [],
    min_kilometers: getNumericFilterValue(rangeInputs.kilometersMin),
    max_kilometers: getNumericFilterValue(rangeInputs.kilometersMax),
    colors: selectedColors && selectedColors.length > 0 ? selectedColors : [],
    transmissions: filterState.transmissionselectedValues.filter(v => v !== 'Any'),
    regional_specs_list: selectedRegionalSpecs && selectedRegionalSpecs.length > 0 ? selectedRegionalSpecs : [],
    body_types: selectedBodyType && selectedBodyType.length > 0 ? selectedBodyType : [],
    doors: filterState.doorselectedValues,
    number_of_cylinders: getArrayFilterValue(filterState.cylinderselectedValues),
    fuel_types: filterState.selectedValues.filter(v => v !== 'Any'),
    seller_type: filterState.ownerType.filter(v => v !== 'Any'),
    condition: filterState.condition.includes('Any') ? ['Used', 'New'] : filterState.condition.filter(v => v !== 'Any'),
    keyword: keywords.length > 0 ? keywords.join(', ') : '',
    page: currentPage,
    limit: limit,
    // Add sorting parameters
    newest_listing: sortConfig.sortbynewlist,
    oldest_listing: sortConfig.sortbyold,
    sort_by: sortConfig.sortbypriceormileage,
    sort_order: sortConfig.sortorder
  };

  // Debug logging for locations

  // Only include type parameter if featuredorrecommended has a value
  if (featuredorrecommended) {
    apiParams.type = featuredorrecommended;
  }

  return apiParams;
};

// PropTypes for helper functions
getFilterValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

getArrayFilterValue.propTypes = {
  array: PropTypes.array.isRequired,
  defaultValue: PropTypes.string,
};

getNumericFilterValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

prepareFilterData.propTypes = {
  filterParams: PropTypes.shape({
    make: PropTypes.string,
    model: PropTypes.string,
    bodyTypes: PropTypes.array,
    locations: PropTypes.array,
    colors: PropTypes.array,
    regionalSpecs: PropTypes.array,
    singleInputs: PropTypes.object.isRequired,
    rangeInputs: PropTypes.object.isRequired,
    featuredorrecommended: PropTypes.string,
    newUsed: PropTypes.string,
    filterState: PropTypes.object.isRequired,
    keywords: PropTypes.array.isRequired,
  }).isRequired,
};

// Extracted components
const RangeInputGroup = ({ 
  label, 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange, 
  minPlaceholder, 
  maxPlaceholder, 
  onBlurValidation,
  minComponent,
  maxComponent
}) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
      {label}
    </div>
    <Row gutter={8}>
      <Col span={12}>
        {minComponent ? (
          minComponent
        ) : (
          <Input 
            placeholder={minPlaceholder || 'Min'} 
            value={minValue}
            onChange={(e) => handleNumberInput(e, onMinChange)}
            onBlur={() => onBlurValidation?.()}
          />
        )}
      </Col>
      <Col span={12}>
        {maxComponent ? (
          maxComponent
        ) : (
          <Input 
            placeholder={maxPlaceholder || 'Max'} 
            value={maxValue}
            onChange={(e) => handleNumberInput(e, onMaxChange)}
            onBlur={() => onBlurValidation?.()}
          />
        )}
      </Col>
    </Row>
  </div>
);


const MAX_PRICE = 5000000000;

 const handleNumberInput = (e, callback) => {
  let value = e.target.value?.replace(/[^0-9]/g, ''); // remove non-numeric

  if (value) {
    let num = parseInt(value, 10);
    if (num > MAX_PRICE) {
      num = MAX_PRICE; // enforce max
    }
    value = String(num);
  }

  callback({ target: { value } }); // trigger state update with clean & capped value
};

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

const SelectInputTrimData = ({ title, value, onChange, options, style }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
      {title}
    </div>
    <Select
      mode="multiple"
      value={value}
      onChange={onChange}
      placeholder={`Select ${title}`}
      style={{ width: '100%', marginTop: '10px', ...style }}
      showSearch
      filterOption={(input, option) =>
        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
      }
      maxTagCount="responsive"
    >
      {options.map(option => (
        <Option key={option.id} value={option.trim_name}>
          {option.trim_name}
        </Option>
      ))}
    </Select>
  </div>
);

const SelectInputMultiAPI = ({ title, value, onChange, options, style, valueField = 'id', labelField = 'name', defaultOption }) => {
  
  // Helper function to get the correct field value with fallbacks
  const getFieldValue = (option, field) => {
    // Try multiple possible field names
    const possibleFields = [
      field,
      field.replace('_name', ''),
      field.replace('_name', '_id'),
      'name',
      'id',
      'title',
      'label'
    ];
    
    for (const possibleField of possibleFields) {
      if (option[possibleField] !== undefined) {
        return option[possibleField];
      }
    }
    
    // If no field found, return the field name itself
    return option[field] || field;
  };
  
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
        {title}
      </div>
      <Select
        mode="multiple"
        value={value}
        onChange={onChange}
        placeholder={`Select ${title}`}
        style={{ width: '100%', marginTop: '10px', ...style }}
        showSearch
        filterOption={(input, option) =>
          (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
        }
        maxTagCount="responsive"
      >
        {defaultOption && (
          <Option key="default" value={defaultOption.value}>
            {defaultOption.label}
          </Option>
        )}
        {options.map(option => {
          const displayValue = getFieldValue(option, labelField);
          const optionValue = getFieldValue(option, labelField);
          
          
          return (
            <Option key={option[valueField] || option.id || optionValue} value={optionValue}>
              {displayValue}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

SelectInputTrimData.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    trim_name: PropTypes.string.isRequired,
  })).isRequired,
  style: PropTypes.object,
};

SelectInputMultiAPI.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  style: PropTypes.object,
  valueField: PropTypes.string,
  labelField: PropTypes.string,
  defaultOption: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
};

const SelectInputAPI = ({ title, value, onChange, options, style, valueField = 'id', labelField = 'name', defaultOption }) => {
  
  // Helper function to get the correct field value with fallbacks
  const getFieldValue = (option, field) => {
    // Try multiple possible field names
    const possibleFields = [
      field,
      field.replace('_name', ''),
      field.replace('_name', '_id'),
      'name',
      'id',
      'title',
      'label'
    ];
    
    for (const possibleField of possibleFields) {
      if (option[possibleField] !== undefined) {
        return option[possibleField];
      }
    }
    
    // If no field found, return the field name itself
    return option[field] || field;
  };
  
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
        {title}
      </div>
      <Select
        value={value}
        onChange={onChange}
        placeholder={`Select ${title}`}
        style={{ width: '100%', marginTop: '10px', ...style }}
        showSearch
        filterOption={(input, option) =>
          (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
        }
      >
        {defaultOption && (
          <Option key="default" value={defaultOption.value}>
            {defaultOption.label}
          </Option>
        )}
        {options.map(option => {
          const displayValue = getFieldValue(option, labelField);
          const optionValue = getFieldValue(option, labelField); // Use same value for both display and storage
          
          
          return (
            <Option key={option[valueField] || option.id || optionValue} value={optionValue}>
              {displayValue}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

SelectInputAPI.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  style: PropTypes.object,
  valueField: PropTypes.string,
  labelField: PropTypes.string,
  defaultOption: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
};

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

const Cardetailsfilter = ({ 
  make, 
  model, 
  bodyType, 
  location, 
  onSearchResults,
  limit,
  currentPage, 
  featuredorrecommended, 
  newUsed, 
  onMakeChange, 
  onModelChange,
  onBodyTypeChange,
  onLocationChange,
  onConditionChange,
  onResetFilters,
  selectedMake: propSelectedMake,
  selectedModel: propSelectedModel,
  selectedBodyType: propSelectedBodyType,
  selectedLocation: propSelectedLocation,
  selectedNewUsed: propSelectedNewUsed,
  selectedPriceMin: propSelectedPriceMin,
  selectedPriceMax: propSelectedPriceMax,
  sortedbydata,
  onFilterChange
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extrafeaturesvisible, setextrafeaturesvisible] = useState(false);
  const [value, setValue] = useState('Any');
  const [search, setSearch] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  // Ensure limit and currentPage are valid numbers
  const validLimit = typeof limit === 'number' && limit > 0 ? limit : 20;
  const validCurrentPage = typeof currentPage === 'number' && currentPage > 0 ? currentPage : 1;
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [trimData, setTrimData] = useState(false);
  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false);
  const [emptySearchData, setEmptySearchData] = useState(null);
  const [regionalSpecsOptions, setRegionalSpecsOptions] = useState([]);

  // New Changes for API'S
const CORRECT_DEFAULT_BODY_TYPE = 'All Body Types';

// Initialize with static data like allcarfilters.js
const bodyTypes = [
  'All Body Types',
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
];
const locations = ['All Locations', 'Baghdad', 'Beirut', 'Dubai', 'Riyadh', 'Cairo'];

const [carBodyTypes, setCarBodyTypes] = useState(bodyTypes);
const [carLocation, setCarLocation] = useState(locations);
const [searchBodyType, setSearchBodyType] = useState('');




// Selected values for dropdowns - initialize from props
const [selectedBodyType, setSelectedBodyType] = useState(() => {
  if (propSelectedBodyType) {
    // Handle both string and array formats
    if (Array.isArray(propSelectedBodyType)) {
      return propSelectedBodyType;
    } else if (propSelectedBodyType !== 'All Body Types' && propSelectedBodyType !== '') {
      return [propSelectedBodyType];
    }
  }
  return [];
});
const [selectedLocation, setSelectedLocation] = useState(() => {
  // Filter out "All Locations" from initial prop values
  if (propSelectedLocation) {
    return Array.isArray(propSelectedLocation) 
      ? propSelectedLocation.filter(loc => loc !== 'All Locations' && loc !== 'All Location' && loc !== 'All')
      : propSelectedLocation !== 'All Locations' && propSelectedLocation !== 'All Location' && propSelectedLocation !== 'All'
        ? [propSelectedLocation] 
        : [];
  }
  return [];
});
const [selectedColors, setSelectedColors] = useState([]);
const [selectedRegionalSpecs, setSelectedRegionalSpecs] = useState([]);

// Missing state variables
const [selectedMake, setSelectedMake] = useState(propSelectedMake || '');
const [selectedModel, setSelectedModel] = useState(propSelectedModel || '');
const [carMakes, setCarMakes] = useState([]);
const [carModels, setCarModels] = useState([]);

  const filterState = useFilterState();
  const rangeInputs = useRangeInputs();
  const singleInputs = useSingleInputs();
  
  // Initialize condition state from newUsed prop on mount
  useEffect(() => {
    const initialCondition = convertNewUsedToCondition(newUsed);
    filterState.setCondition(initialCondition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update state when props change
  useEffect(() => {
    if (propSelectedMake && propSelectedMake !== selectedMake) {
      setSelectedMake(propSelectedMake);
    }
  }, [propSelectedMake]);

  useEffect(() => {
    if (propSelectedModel && propSelectedModel !== selectedModel) {
      setSelectedModel(propSelectedModel);
    }
  }, [propSelectedModel]);

  // Sync condition state when newUsed prop changes (after mount)
  useEffect(() => {
    if (newUsed) {
      const newCondition = convertNewUsedToCondition(newUsed);
      
      const currentConditionStr = JSON.stringify([...filterState.condition].sort());
      const newConditionStr = JSON.stringify([...newCondition].sort());
      
      if (currentConditionStr !== newConditionStr) {
        filterState.setCondition(newCondition);
      }
    }
  }, [newUsed]);

  useEffect(() => {
    if (propSelectedBodyType) {
      // Handle both string and array formats
      if (Array.isArray(propSelectedBodyType)) {
        setSelectedBodyType(propSelectedBodyType);
      } else if (propSelectedBodyType !== 'All Body Types' && propSelectedBodyType !== '') {
        setSelectedBodyType([propSelectedBodyType]);
      } else {
        setSelectedBodyType([]);
      }
    }
  }, [propSelectedBodyType]);

  useEffect(() => {
    if (propSelectedLocation) {
      // Filter out "All Locations" from prop values
      const filteredLocation = Array.isArray(propSelectedLocation) 
        ? propSelectedLocation.filter(loc => loc !== 'All Locations' && loc !== 'All Location' && loc !== 'All')
        : propSelectedLocation !== 'All Locations' && propSelectedLocation !== 'All Location' && propSelectedLocation !== 'All'
          ? [propSelectedLocation] 
          : [];
      setSelectedLocation(filteredLocation);
    }
  }, [propSelectedLocation]);

  // Fetch models when component initializes with a selected make from props
  useEffect(() => {
    if (propSelectedMake && propSelectedMake !== 'Any' && carMakes.length > 0) {
      fetchModelCars({ setLoading, setCarModels, make: propSelectedMake });
    }
  }, [propSelectedMake, carMakes.length]);

  const handleChange = (e) => setValue(e.target.value);

  // Fetch body types data
  const fetchBodyTypeCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getBodyCars({});
      const data1 = handleApiResponse(response);

      if (data1 && data1.data) {
        // Convert API response to string array like allcarfilters.js
        const bodyTypeStrings = data1.data.map(item => item.body_type);
        setCarBodyTypes(bodyTypeStrings);
      }

      message.success(data1.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to fetch body type data');
      // Keep the static data on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations data
  const fetchRegionCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getLocationCars({});
      const data1 = handleApiResponse(response);

      if (data1 && data1.data) {
        // Convert API response to string array like allcarfilters.js
        const locationStrings = data1.data.map(item => item.location);
        setCarLocation(locationStrings);
      }

      message.success(data1?.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to fetch location data');
      // Keep the static data on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch make data on component mount
  useEffect(() => {
    fetchMakeCars({ setLoading, setCarMakes });
    fetchBodyTypeCars();
    fetchRegionCars();
  }, []);

   
  useEffect(() => {
    if (selectedMake && selectedMake !== 'Any') {
      fetchModelCars({ setLoading, setCarModels, make: selectedMake });
      // Only reset model if it's not being set from props
      if (!propSelectedModel) {
        setSelectedModel('Any');
      }
    } else {
      setCarModels([]);
      // Only reset model if it's not being set from props
      if (!propSelectedModel) {
        setSelectedModel('Any');
      }
    }
  }, [selectedMake]);
  
    useEffect(() => {
      if (selectedModel && selectedModel !== 'Any') {
        fetchTrimData();
      } else {
        setTrimData([]);
      }
    }, [selectedModel, selectedMake]);
  
  
    useEffect(() => {
  if (searchBodyType) {
    setSelectedBodyType([searchBodyType]);
  } else {
    setSelectedBodyType([]);
  }
}, [searchBodyType]);

  
    //  const fetchBodyTypeCars = async () => {
    //    try {
    //      setLoading(true);
    //      const response = await carAPI.getBodyCars({});
    //      const data1 = handleApiResponse(response);
   
    //      console.log('Body Type API response:', data1);
    //      if (data1) {
    //        setCarBodyTypes(data1?.data);
    //        console.log('Set carBodyTypes to:', data1?.data);
    //      }
   
    //      message.success(data1.message || 'Fetched successfully');
    //    } catch (error) {
    //      const errorData = handleApiError(error);
    //      message.error(errorData.message || 'Failed to Make car data');
    //      setCarBodyTypes([]);
    //    } finally {
    //      setLoading(false);
    //    }
    //  };
  
//   const fetchRegionCars = async () => {
//   try {
//     setLoading(true);
//     const res = await carAPI.getLocationCars();
//     const data = handleApiResponse(res);
    
//     console.log('Location API response:', data);
//     setCarLocations(data?.data || []); // ✅ fixed
//     console.log('Set carLocations to:', data?.data);
//   } catch (err) {
//     const errorData = handleApiError(err);
//     message.error(errorData.message || 'Failed to fetch locations');
//     setCarLocations([]); // ✅ fixed
//   } finally {
//     setLoading(false);
//   }
// };


   useEffect(() => {
    handleApplyFilters()
  },[validCurrentPage, validLimit])

  useEffect(() => {
      fetchUpdateOptionsData();
    }, []);

  const fetchTrimData = async () => {
  try {
    setLoading(true);
    const response = await carAPI.trimDetailsFilter(selectedMake, selectedModel);
    const data1 = handleApiResponse(response);

    if (data1) {
      setTrimData(data1?.data);
    }

    message.success(data1.message || 'Fetched successfully');
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to Trim car data');
    setTrimData([]);
  } finally {
    setLoading(false);
  }
};

const fetchUpdateOptionsData = async () => {
  try {
    setLoading(true);
    const response = await carAPI.uploadOptionDetails({});
    const data1 = handleApiResponse(response);

    if (data1?.data?.regional_specs) {
      // Set the API response to state
      setRegionalSpecsOptions(data1.data.regional_specs);
    }

    message.success(data1.message || 'Fetched successfully');
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to fetch Regional Specs');
    setRegionalSpecsOptions([]); // reset on error
  } finally {
    setLoading(false);
  }
};
const validateRange = (label, min, max) => {
  if (!isNaN(min) && !isNaN(max) && min > max) {
     messageApi.open({
                type: 'error',
                content: `Minimum ${label} cannot be greater than maximum ${label}`,
              });
   
    return false;
  }
  return true;
};

  const handleApplyFilters = () => {
  const validateRange = (label, min, max) => {
    // alert('wdhuwjd')
  if (!isNaN(min) && !isNaN(max) && min > max) {
   messageApi.open({
                type: 'error',
                content: `Minimum ${label} cannot be greater than maximum ${label}`,
              });
   
    return false;
  }
  return true;
};
  const minKilometers = parseInt(rangeInputs.kilometersMin, 10);
  const maxKilometers = parseInt(rangeInputs.kilometersMax, 10);
  const minYear = parseInt(rangeInputs.yearMin, 10);
  const maxYear = parseInt(rangeInputs.yearMax, 10);
// In handleApplyFilters:
if (
  !validateRange('kilometers', minKilometers, maxKilometers) ||
  !validateRange('price', rangeInputs.priceMin, rangeInputs.priceMax)||
   !validateRange('Year', minYear, maxYear)

) {
  return;
}

  applyFilters()
};



  const applyFilters = async () => {
    try {
      setLoading(true);
      const filterData = prepareFilterData({ 
        selectedMake, 
        selectedModel, 
        bodyType, 
        location: selectedLocation, 
        singleInputs, 
        rangeInputs, 
        filterState, 
        keywords, 
        currentPage: validCurrentPage, 
        limit: validLimit, 
        featuredorrecommended, 
        newUsed,
        selectedColors,
        selectedRegionalSpecs,
        selectedBodyType,
        sortedbydata
      });
      
      // Call onFilterChange callback to update main filter fields
      if (onFilterChange) {
        const filterChangeData = {
          make: selectedMake !== 'Any' ? selectedMake : '',
          model: selectedModel !== 'Any' ? selectedModel : '',
          bodyType: selectedBodyType,
          location: selectedLocation,
          newUsed: newUsed,
          priceMin: rangeInputs.priceMin,
          priceMax: rangeInputs.priceMax
        };
        onFilterChange(filterChangeData);
      }
      
      const response = await carAPI.searchCars(filterData);      
      if (response.data) {
        const results = response.data.cars || response.data || [];
        
        // Update car count from pagination if available and call parent callback
        if (onSearchResults) {
          const resultsWithCount = {
            ...response.data,
            carCount: response?.data?.pagination?.total || 0
          };
          onSearchResults(resultsWithCount);
        }
        
        if (response?.data?.data?.cars.length === 0) {
          setEmptySearchData(filterData);
          setIsEmptyModalOpen(true);
          message.info('No cars found with the current filters. Try adjusting your search criteria.');
        } else {
          message.success(`Found ${results.length} car(s) matching your filters!`);
        }
      }
      
      setVisible(false);
    } catch (error) {
      
      // Still try to call onSearchResults with empty data to reset the state
      if (onSearchResults) {
        onSearchResults({ cars: [], pagination: {} });
      }
      
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

    const handleResetFilters = () => {
    // Reset range inputs
    rangeInputs.setKilometersMin('');
    rangeInputs.setKilometersMax('');
    rangeInputs.setYearMin('');
    rangeInputs.setYearMax('');
    rangeInputs.setPriceMin('');
    rangeInputs.setPriceMax('');
    rangeInputs.setPowerMin('');
    rangeInputs.setPowerMax('');
    rangeInputs.setConsumptionMin('');
    rangeInputs.setConsumptionMax('');
    rangeInputs.setSeatsMin('');
    rangeInputs.setSeatsMax('');

    // Reset filter state
    filterState.setSelectedValues(['Any']);
    filterState.settransmissionselectedValues(['Any']);
    filterState.setcylinderselectedValues([]);
    filterState.setdoorselectedValues([]);
    filterState.setCondition(['Used', 'New']); // Reset to both (New & Used)
    filterState.setOwnerType(['Any']);

    // Reset single inputs
    singleInputs.setTrimValue([]);
    singleInputs.setColorValue('Any');
    singleInputs.setInteriorValue('Any');
    singleInputs.setPaymentOptions('Any');
    singleInputs.setRegionalSpecs('Any');
    setKeywords([]);
    setSelectedFeatures([]);

    // Reset selected values
    setSelectedMake('');
    setSelectedModel('');
    setSelectedBodyType([]);
    setSelectedLocation([]);
    setSelectedColors([]);
    setSelectedRegionalSpecs([]);

    setValue('Any');

    // Call the callback to reset filters in allcarfilters.js
    if (onResetFilters) {
      onResetFilters();
    }

    message.success('Filters have been reset!');
  };


  return (
    <>
    {contextHolder}
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

          <SelectInputAPI
            title="Make"
            value={selectedMake}
            onChange={(value) => {
              setSelectedMake(value);
              // Call onFilterChange callback immediately
              if (onFilterChange) {
                onFilterChange({
                  make: value !== 'Any' ? value : '',
                  model: selectedModel !== 'Any' ? selectedModel : '',
                  bodyType: selectedBodyType,
                  location: selectedLocation,
                  newUsed: newUsed,
                  priceMin: rangeInputs.priceMin,
                  priceMax: rangeInputs.priceMax
                });
              }
            }}
            options={carMakes}
            valueField="id"
            labelField="make_name"
            defaultOption={{ value: 'Any', label: 'Any Make' }}
          />

          <SelectInputAPI
            title="Model"
            value={selectedModel}
            onChange={(value) => {
              setSelectedModel(value);
              // Call onFilterChange callback immediately
              if (onFilterChange) {
                onFilterChange({
                  make: selectedMake !== 'Any' ? selectedMake : '',
                  model: value !== 'Any' ? value : '',
                  bodyType: selectedBodyType,
                  location: selectedLocation,
                  newUsed: newUsed,
                  priceMin: rangeInputs.priceMin,
                  priceMax: rangeInputs.priceMax
                });
              }
            }}
            options={carModels}
            valueField="id"
            labelField="model_name"
            defaultOption={{ value: 'Any', label: 'Any Model' }}
          />
          
          <SelectInputTrimData
            title="Trim"
            value={singleInputs.trimValue}
            onChange={singleInputs.setTrimValue}
            options={trimData}
          />

          <SelectInputMultiAPI
            title="Body Type"
            value={selectedBodyType}
            onChange={(value) => {
              setSelectedBodyType(value);
              // Call parent callback with selected values
              if (onBodyTypeChange) {
                onBodyTypeChange(value);
              }
              // Call onFilterChange callback immediately
              if (onFilterChange) {
                onFilterChange({
                  make: selectedMake !== 'Any' ? selectedMake : '',
                  model: selectedModel !== 'Any' ? selectedModel : '',
                  bodyType: value,
                  location: selectedLocation,
                  newUsed: newUsed,
                  priceMin: rangeInputs.priceMin,
                  priceMax: rangeInputs.priceMax
                });
              }
            }}
            options={carBodyTypes.map(bodyType => ({ value: bodyType, label: bodyType }))}
          />

          <SelectInputMultiAPI
            title="Location"
            value={selectedLocation}
            onChange={(value) => {
              setSelectedLocation(value);
              // Call parent callback with selected values
              if (onLocationChange) {
                onLocationChange(value);
              }
              // Call onFilterChange callback immediately
              if (onFilterChange) {
                onFilterChange({
                  make: selectedMake !== 'Any' ? selectedMake : '',
                  model: selectedModel !== 'Any' ? selectedModel : '',
                  bodyType: selectedBodyType,
                  location: value,
                  newUsed: newUsed,
                  priceMin: rangeInputs.priceMin,
                  priceMax: rangeInputs.priceMax
                });
              }
            }}
            options={carLocation.map(location => ({ value: location, label: location }))}
          />
{/* 
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
          </div> */}

          <RangeInputGroup
            label="Kilometers"
            minValue={rangeInputs.kilometersMin}
            maxValue={rangeInputs.kilometersMax}
            onMinChange={(e) => rangeInputs.setKilometersMin(e.target.value)}
            onMaxChange={(e) => rangeInputs.setKilometersMax(e.target.value)}
             onBlurValidation={() => {
    const min = parseInt(rangeInputs.kilometersMin, 10);
    const max = parseInt(rangeInputs.kilometersMax, 10);

    if (!isNaN(min) && !isNaN(max) && min > max) {
        messageApi.open({
                type: 'error',
                content: 'Minimum kilometers cannot be greater than maximum kilometers',
              });
    
    }
  }}
          />

          
<RangeInputGroup
  label="Year"
  minComponent={
    <Select
      placeholder="Min Year"
      value={rangeInputs.yearMin || undefined}
      style={{ width: '100%' }}
      onChange={(value) => rangeInputs.setYearMin(value)}
      onBlur={() => {
        const min = parseInt(rangeInputs.yearMin, 10);
        const max = parseInt(rangeInputs.yearMax, 10);
        if (!isNaN(min) && !isNaN(max) && min > max) {
          message.error('Minimum Year cannot be greater than Maximum Year');
        }
      }}
    >
      {yearOptions.map((year) => (
        <Option key={year} value={year}>
          {year}
        </Option>
      ))}
    </Select>
  }
  maxComponent={
    <Select
      placeholder="Max Year"
      value={rangeInputs.yearMax || undefined}
      style={{ width: '100%' }}
      onChange={(value) => rangeInputs.setYearMax(value)}
      onBlur={() => {
        const min = parseInt(rangeInputs.yearMin, 10);
        const max = parseInt(rangeInputs.yearMax, 10);
        if (!isNaN(min) && !isNaN(max) && min > max) {
          message.error('Minimum Year cannot be greater than Maximum Year');
        }
      }}
    >
      {yearOptions.map((year) => (
        <Option key={year} value={year}>
          {year}
        </Option>
      ))}
    </Select>
  }
/>

          <RangeInputGroup
            label="Price (Range)"
            minValue={rangeInputs.priceMin}
            maxValue={rangeInputs.priceMax}
            onMinChange={(e) => rangeInputs.setPriceMin(e.target.value)}
            onMaxChange={(e) => rangeInputs.setPriceMax(e.target.value)}
            onBlurValidation={() => {
    const min = parseInt(rangeInputs.priceMin, 10);
    const max = parseInt(rangeInputs.priceMax, 10);

    if (!isNaN(min) && !isNaN(max) && min > max) {
        messageApi.open({
                type: 'error',
                content: 'Minimum Price cannot be greater than maximum Price',
              });
    
    }
  }}
          />

          <SelectInputMultiAPI
            title="Fuel Type"
            value={filterState.selectedValues.filter(v => v !== 'Any')}
            onChange={(value) => filterState.setSelectedValues(value.length > 0 ? value : ['Any'])}
            options={fuelOptions.filter(option => option !== 'Any').map(option => ({ value: option, label: option }))}
          />

          <CheckboxGroup
            title="Condition"
            options={['Used', 'New']}
            selectedValues={filterState.condition}
            onChange={(option, selectedValues, setSelectedValues) => {
              // Calculate the new values after the change
              let newValues;
              if (selectedValues.includes(option)) {
                newValues = selectedValues.filter(item => item !== option);
              } else {
                newValues = [...selectedValues, option];
              }
              
              // Call the original handler to update the state
              handleCheckboxChange(option, selectedValues, setSelectedValues);
              
              // Convert condition array to newUsed format for allcarfilters
              let newUsedValue = 'New & Used'; // Default value
              if (newValues.length === 0) {
                // If no values selected, default to both
                newUsedValue = 'New & Used';
              } else if (newValues.length === 1) {
                // If only one value selected, use that value
                newUsedValue = newValues[0];
              } else if (newValues.length === 2) {
                // If both 'Used' and 'New' are selected
                newUsedValue = 'New & Used';
              }
              
              // Call the callback to update allcarfilters
              if (onConditionChange) {
                onConditionChange(newUsedValue);
              }
            }}
            setSelectedValues={filterState.setCondition}
          />

          <SelectInputMultiAPI
            title="Transmission"
            value={filterState.transmissionselectedValues.filter(v => v !== 'Any')}
            onChange={(value) => filterState.settransmissionselectedValues(value.length > 0 ? value : ['Any'])}
            options={transmissionOptions.filter(option => option !== 'Any').map(option => ({ value: option, label: option }))}
          />

          {/* <CheckboxGroup
            title="Number of Cylinders"
            options={cylinderOptions}
            selectedValues={filterState.cylinderselectedValues}
            onChange={handleCheckboxChange}
            setSelectedValues={filterState.setcylinderselectedValues}
          /> */}
          <SelectInputMultiAPI
            title="Color"
            value={selectedColors}
            onChange={(value) => setSelectedColors(value)}
            options={['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Silver', 'Gray', 'Brown'].map(option => ({ value: option, label: option }))}
          />

          <SelectInputMultiAPI
            title="Number of Doors"
            value={filterState.doorselectedValues}
            onChange={(value) => filterState.setdoorselectedValues(value)}
            options={numberofdoors.filter(option => option !== 'Any').map(option => ({ value: option, label: option }))}
          />

          {/* <SelectInput
            title="Interior"
            value={singleInputs.interiorValue}
            onChange={singleInputs.setInteriorValue}
            options={['Any', 'Leather', 'Cloth']}
          /> */}

          {/* <SelectInput
            title="Payment Options"
            value={singleInputs.paymentOptions}
            onChange={singleInputs.setPaymentOptions}
            options={['Any', 'Cash', 'Installment']}
            style={{ marginTop: '3px' }}
          /> */}

          <SelectInputMultiAPI
            title="Regional Specs"
            value={selectedRegionalSpecs}
            onChange={(value) => setSelectedRegionalSpecs(value)}
            options={regionalSpecsOptions.map(spec => ({
              value: spec.regional_spec,
              label: spec.regional_spec
            }))}
          />


          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '10px' }}>
              Keywords
            </div>
            <Input
              placeholder="Enter keywords (e.g., low mileage, one owner, accident free)"
              value={keywords.join(', ')}
              onChange={(e) => handleKeywordsChange(keywords, setKeywords)(e.target.value)}
              style={{ width: '100%', marginTop: '10px' }}
            />
          </div>

          <CheckboxGroup
            title="Owner Type"
            options={[ 'Individual', 'Dealer']}
            selectedValues={filterState.ownerType}
            onChange={handleCheckboxChange}
            setSelectedValues={filterState.setOwnerType}
          />

          <Divider />
        </div>
        <Row gutter={12} className='mt-4'>
  <Col span={12}>
    <Button
      type="primary"
      block
      onClick={handleApplyFilters}
      loading={loading}
    >
      {loading ? 'Searching...' : 'Apply Filters'}
    </Button>
  </Col>
  <Col span={12}>
    <Button
      block
      onClick={handleResetFilters}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #008ad5',
        color: '#008ad5',
      }}
    >
      Reset Filters
    </Button>
  </Col>
</Row>
      </Drawer>

      <ExtraFeaturesDrawer
        visible={extrafeaturesvisible}
        onClose={() => setextrafeaturesvisible(false)}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        selectedFeatures={selectedFeatures}
        onFeatureToggle={handleFeatureToggle(selectedFeatures, setSelectedFeatures)}
      />

      <Searchemptymodal
        visible={isEmptyModalOpen}
        onClose={() => setIsEmptyModalOpen(false)}
        make={make}
        setMake={() => {}} 
        model={model}
        setModel={() => {}} // Placeholder - parent component should handle this
        bodyType={bodyType}
        setBodyType={() => {}} // Placeholder - parent component should handle this
        selectedLocation={location}
        setSelectedLocation={() => {}} // Placeholder - parent component should handle this
        toastmessage={(msg) => message.info(msg)}
        setSaveSearchesReload={() => {}}
        filterData={emptySearchData}
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
  limit: PropTypes.number,
  currentPage: PropTypes.number,
  featuredorrecommended: PropTypes.string,
  newUsed: PropTypes.string,
  onMakeChange: PropTypes.func,
  onModelChange: PropTypes.func,
  onBodyTypeChange: PropTypes.func,
  onLocationChange: PropTypes.func,
  onConditionChange: PropTypes.func,
  onResetFilters: PropTypes.func,
  selectedMake: PropTypes.string,
  selectedModel: PropTypes.string,
  selectedBodyType: PropTypes.array,
  selectedLocation: PropTypes.array,
  selectedNewUsed: PropTypes.string,
  selectedPriceMin: PropTypes.number,
  selectedPriceMax: PropTypes.number,
  sortedbydata: PropTypes.string,
  onFilterChange: PropTypes.func,
};

export default Cardetailsfilter;