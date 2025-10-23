/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect,useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Modal,
  Image,
  Tooltip,
  InputNumber
} from 'antd';
import { PlusOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/sell.css';
import toyotaImg from '../assets/images/toyota.png';
import { useNavigate,useLocation } from 'react-router-dom';
import mercedesImg from '../assets/images/mercedes.png';
import miniImg from '../assets/images/mini.png';
import bmwImg from '../assets/images/bmw.png';
import hummerImg from '../assets/images/hummer.png';
import lamborghiniImg from '../assets/images/lamborghini.png';
import addMediaSvg from '../assets/images/addMedia.svg';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { fetchMakeCars, fetchModelCars } from '../commonFunction/fetchMakeCars';
import moment from 'moment';
import CarPostingModal from '../components/carpostingmodal';
import '../assets/styles/subscriptions.css';
import EmojiPicker from 'emoji-picker-react';
import { useLanguage } from '../contexts/LanguageContext';

const { Option } = Select;

const ExteriorColorInput = ({
  selectedColor,
  selectedColorImage,
  placeholder = 'Beige',
  onOpen,
  BASE_URL,
}) => {

  let imageSrc = null;
  if (selectedColorImage) {
    if (selectedColorImage.startsWith('http')) {
      imageSrc = selectedColorImage;
    } else {
      imageSrc = `${BASE_URL}${selectedColorImage}`;
    }
  }

  return (
    <button
      type='button'
      className={`exterior-color-input${!selectedColor ? ' placeholder' : ''}`}
      onClick={onOpen}
    >
    

      <span className='brand-text'>
        {selectedColor || placeholder}
      </span>

      <RightOutlined className='color-arrow' />
    </button>
  );
};

ExteriorColorInput.propTypes = {
  selectedColor: PropTypes.string,
  selectedColorImage: PropTypes.string,
  placeholder: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  BASE_URL: PropTypes.string.isRequired,
};

const InteriorColorInput = ({ selectedInteriorColor, onOpen, placeholder, translate }) => (
  <button
    type='button'
    className={`interior-color-input${!selectedInteriorColor ? ' placeholder' : ''}`}
    onClick={onOpen}
  >
    <span className='interior-color-text'>
      {selectedInteriorColor || (translate ? translate('sell.BEIGE') : placeholder || 'Beige')}
    </span>
    <RightOutlined className='color-arrow' />
  </button>
);

InteriorColorInput.propTypes = {
  selectedInteriorColor: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  translate: PropTypes.func,
};

const TrimInput = ({ selectedTrim, onOpen, translate }) => (
  <button
    type='button'
    className={`trim-input${!selectedTrim ? ' placeholder' : ''}`}
    onClick={onOpen}
  >
    <span className='trim-text'>
      {selectedTrim || (translate ? translate('sell.SELECT_TRIM') : 'Select Trim')}
    </span>
    <RightOutlined className='trim-arrow' />
  </button>
);

TrimInput.propTypes = {
  selectedTrim: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  translate: PropTypes.func,
};

const BrandInput = ({ selectedBrand, selectedModel, selectedTrim, selectedBrandImage, onOpen, BASE_URL, brandOptions, translate }) => {
  const selectedBrandObj = brandOptions.find((b) => b.value === selectedBrand);

  let imageSrc = null;
  if (selectedBrandObj?.img) {
    imageSrc = selectedBrandObj.img;
  } else if (selectedBrandImage) {
    if (selectedBrandImage.startsWith('http')) {
      imageSrc = selectedBrandImage;
    } else {
      imageSrc = `${BASE_URL}${selectedBrandImage}`;
    }
  }

  return (
    <button
      type='button'
      className={`brand-input${!selectedBrand ? ' placeholder' : ''}`}
      onClick={onOpen}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={selectedBrand || 'brand'}
          className='brand-input-img'
        />
      )}

      <span className='brand-text'>
        {(() => {
          if (selectedBrand) {
            const parts = [selectedBrand];
            if (selectedModel) parts.push(selectedModel);
            if (selectedTrim) parts.push(selectedTrim);
            const displayText = parts.join(' - ');
            return displayText;
          }
          return translate ? translate('sell.BRAND_AND_MODEL_PLACEHOLDER') : 'Brand and Model of your car';
        })()}
      </span>

      <RightOutlined className='brand-arrow' />
    </button>
  );
};

BrandInput.propTypes = {
  selectedBrand: PropTypes.string,
  selectedModel: PropTypes.string,
  selectedTrim: PropTypes.string,
  selectedBrandImage: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  BASE_URL: PropTypes.string.isRequired,
  brandOptions: PropTypes.array.isRequired,
  translate: PropTypes.func,
};

const YearInput = ({ selectedYear, onOpen, translate }) => (
  <button
    type='button'
    className={`year-input${!selectedYear ? ' placeholder' : ''}`}
    onClick={onOpen}
  >
    <span className='year-text'>
      {selectedYear || (translate ? translate('sell.SELECT_YEAR') : 'Select Year')}
    </span>
    <RightOutlined className='year-arrow' />
  </button>
);

YearInput.propTypes = {
  selectedYear: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  translate: PropTypes.func,
};

const RegionInput = ({ selectedRegion, onOpen, translate }) => (
  <button
    type='button'
    className={`region-input${!selectedRegion ? ' placeholder' : ''}`}
    onClick={onOpen}
  >
    <span className='region-text'>
      {selectedRegion || (translate ? translate('sell.SELECT_LOCATION') : 'Select Location')}
    </span>
    <RightOutlined className='region-arrow' />
  </button>
);

RegionInput.propTypes = {
  selectedRegion: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  translate: PropTypes.func,
};

const RegionalSpecsInput = ({ selectedRegionalSpecs, onOpen, translate }) => (
  <button
    type='button'
    className={`regionalspecs-input${
      !selectedRegionalSpecs ? ' placeholder' : ''
    }`}
    onClick={onOpen}
  >
    <span className='regionalspecs-text'>
      {selectedRegionalSpecs || (translate ? translate('sell.REGIONAL_SPECS') : 'Select Specs')}
    </span>
    <RightOutlined className='regionalspecs-arrow' />
  </button>
);

RegionalSpecsInput.propTypes = {
  selectedRegionalSpecs: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  translate: PropTypes.func,
};

const brandOptions = [
  { label: 'Toyota', value: 'Toyota', img: toyotaImg },
  { label: 'Mercedes', value: 'Mercedes', img: mercedesImg },
  { label: 'Mini Cooper', value: 'Mini Cooper', img: miniImg },
  { label: 'BMW', value: 'BMW', img: bmwImg },
  { label: 'Hummer', value: 'Hummer', img: hummerImg },
  { label: 'Lamborghini', value: 'Lamborghini', img: lamborghiniImg },
];


const Sell = () => {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [adTitle, setAdTitle] = useState('');
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [make, setMake] = useState('');
  const [yearData, setYearData] = useState([]);
  const [horsePower, setHorsePower] = useState([]);
  const [trimData, setTrimData] = useState([]);
  const [updateData, setUpdateData] = useState();
  const [,setAddData] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [description, setDescription] = useState(form.getFieldValue('description') || '');
  const [showPicker, setShowPicker] = useState(false);
  const MAX_LEN = 1000;
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [colorSearch, setColorSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState();
  const [selectedColorImage, setSelectedColorImage] = useState();
  const [selectedInteriorColor, setSelectedInteriorColor] = useState();
  const [trimModalOpen, setTrimModalOpen] = useState(false);
  const [trimSearch, setTrimSearch] = useState('');
  const [selectedTrim, setSelectedTrim] = useState();
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [brandNameOpen, setBrandNameOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedBrandImage, setSelectedBrandImage] = useState();
  const [selectedModel, setSelectedModel] = useState();
  const [modalName, setModalName] = useState();
  const [yearModalOpen, setYearModalOpen] = useState(false);
  const [yearSearch, setYearSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState();
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState();
  const [, setSelectedBadges] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState([]);
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedHorsepower, setSelectedHorsepower] = useState('');
  const [selectedRegion, setSelectedRegion] = useState();
  const [regionalSpecsModalOpen, setRegionalSpecsModalOpen] = useState(false);
  const [regionalSpecsSearch, setRegionalSpecsSearch] = useState('');
  const [selectedRegionalSpecs, setSelectedRegionalSpecs] = useState();
  const [selectedSeats, setSelectedSeats] = useState();
  const [selectedDoors, setSelectedDoors] = useState();
  const [selectedFuelType, setSelectedFuelType] = useState();
  const [selectedTransmissionType, setSelectedTransmissionType] = useState();
  const [selectedDriveType, setSelectedDriveType] = useState();
  const [selectedCylinders, setSelectedCylinders] = useState();
  const [mediaPreviewOpen, setMediaPreviewOpen] = useState(false);
  const [mediaPreviewImage, setMediaPreviewImage] = useState('');
  const [mediaFileList, setMediaFileList] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [, setSelectedInterior] = useState([]);
  const { state } = useLocation();
  const extras = state?.extras ?? [];
  const populatedRef = useRef(false);
  const { TextArea } = Input;
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'draft'
   const pickerRef = useRef(null);
  const [carId, setCarId] = useState('');
  const autoSaveIntervalRef = useRef(null);
  const lastSavedDataRef = useRef(null); // Track last saved data to detect changes
  const initialDataRef = useRef(null); // Track initial data from extras to detect user changes
  const isEditModeRef = useRef(false); // Track if we're in edit mode
  const [draggedIndex, setDraggedIndex] = useState(null); // Track which item is being dragged


const handleAddNew = () => {
  // Reset form fields
  form.resetFields();

  setAdTitle('');
  setDescription('');

  // Clear selections
  setSelectedColor(undefined);
  setSelectedColorImage(undefined);
  setSelectedInteriorColor(undefined);
  setSelectedTrim(undefined);
  setSelectedBrand(undefined);
  setSelectedBrandImage(undefined);
  setSelectedModel(undefined);
  setModalName(undefined);
  setSelectedYear(undefined);

  setSelectedCondition('');
  setSelectedBodyType(undefined);
  setSelectedBadges([]);
  setSelectedVehicleType([]);

  setSelectedPrice('');
  setSelectedHorsepower('');
  setSelectedRegion(undefined);

  setSelectedRegionalSpecs(undefined);

  setSelectedSeats(undefined);
  setSelectedDoors(undefined);
  setSelectedFuelType(undefined);
  setSelectedTransmissionType(undefined);
  setSelectedDriveType(undefined);
  setSelectedCylinders(undefined);

  // Media data
  setMediaPreviewImage('');
  setMediaFileList([]);

  // Interior data
  setSelectedInterior([]);

  // Reset car_id for new car
  setCarId('');
  
  // Reset last saved data ref and edit mode tracking
  lastSavedDataRef.current = null;
  initialDataRef.current = null;
  isEditModeRef.current = false;

  // Finally close the modal
  setShowModal(false);
};


  
  const toUploadFileList = (imagePath) => {
  if (!imagePath) return [];
  
  // Handle array of image URLs
  if (Array.isArray(imagePath)) {
    return imagePath.map((path, index) => {
      if (!path) return null;
      const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
      const name = url.split('/').pop() || `img-${Date.now()}-${index}`;
      return {
        uid: `server-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        status: 'done',
        url,
        originFileObj: null, // Mark as server file
      };
    }).filter(Boolean); // Remove null entries
  }
  
  // Handle single image URL (existing logic)
  const url = imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
  const name = url.split('/').pop() || `img-${Date.now()}`;
  return [
    {
      uid: `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      status: 'done',
      url,
      originFileObj: null, // Mark as server file
    },
  ];
};

 // Helper function to validate and extract data
const validateAndExtractData = (extras) => {
  if (!extras || (Array.isArray(extras) && extras.length === 0)) {
    return null;
  }
  const data = Array.isArray(extras) ? extras[0] : extras;
  if (!data || typeof data !== 'object') {
    return null;
  }
  return data;
};

// Helper function to build form values
const buildFormValues = (data) => ({
  adTitle: data.ad_title ?? data.adTitle ?? '',
  description: data.description ?? data.desc ?? '',
  brand: (() => {
    const make = data.make ?? data.brand ?? '';
    const model = data.model ?? '';
    const trim = data.trim ?? '';
    const parts = [];
    if (make) parts.push(make);
    if (model) parts.push(model);
    if (trim) parts.push(trim);
    return parts.join(' - ');
  })(),
  trim: data.trim ?? data.model ?? '',
  exteriorColor: data.exterior_color ?? data.exteriorColor ?? data.color ?? '',
  year: data.year ?? data.manufacture_year ?? '',
  price: (data.price ?? '').toString().replace(/,/g, ''),
  horsepower: data.horse_power ?? data.horsepower ?? '',
  vehicletype: data.vechile_type ?? data.vehicle_type ?? '',
  bodyType: data.body_type ?? data.bodyType ?? '',
  condition: data.condition ?? '',
  consumption: data.consumption ?? '',
  kilometers: (() => {
    const kmValue = data.kilometers ?? data.mileage ?? 0;
    return (kmValue === 0 || kmValue === '0') ? undefined : kmValue;
  })(),
  engineCC: data.engine_cc ?? data.engineCC ?? data.engine ?? '',
  transmissionType: data.transmission_type ?? data.transmission ?? '',
  driveType: data.drive_type ?? data.driveType ?? data.drive_type ?? '',
  fuelType: data.fuel_type ?? '',
  regionalSpecs: data.regional_specs ?? data.regionalSpecs ?? '',
  region: data.location ?? data.region ?? '',
  accidentHistory: data.accident_history ?? '',
  interior: data.interior ?? '',
  interiorColor: data.interior_color ?? data.interiorColor ?? '',
  cylinders: data.no_of_cylinders ?? data.cylinders ?? '',
  doors: data.number_of_doors ?? data.no_of_doors ?? '',
  seats: (() => {
    const seatsValue = data.number_of_seats ?? data.no_of_seats ?? '';
    return (seatsValue === 0 || seatsValue === '0') ? undefined : seatsValue;
  })(),
  extraFeatures: (() => {
    if (Array.isArray(data.extra_features)) {
      return data.extra_features;
    }
    const result = data.extra_features ? [data.extra_features] : [];
    return result;
  })(),
  badges: (() => {
    if (Array.isArray(data.badges)) {
      return data.badges;
    }
    return data.badges ? [data.badges] : [];
  })(),
  warrantyDate: data.warranty_date ? moment(data.warranty_date) : undefined,
});

// Helper function to set media files
const setMediaFiles = (data, setMediaFileList, form) => {
  let imagePath = data.image_url || data.car_image || '';
  
  // Handle JSON string array (if image_url is stored as JSON string)
  if (typeof imagePath === 'string' && imagePath.startsWith('[')) {
    try {
      imagePath = JSON.parse(imagePath);
    } catch (e) {
      // Failed to parse image_url JSON - continue with original value
    }
  }
  
  const mediaFileList = toUploadFileList(imagePath);
  if (typeof setMediaFileList === 'function') setMediaFileList(mediaFileList);
  form.setFieldsValue({ media: mediaFileList });
};

// Helper function to set brand-related state
const setBrandState = (data, imagePath, setSelectedBrand, setSelectedBrandImage, setMake) => {
  if (typeof setSelectedBrand === 'function') {
    const brandName = data.make ?? data.brand ?? '';
    setSelectedBrand(brandName);
    
    // Find the brand image from brandOptions (local array uses 'img' property)
    if (typeof setSelectedBrandImage === 'function') {
      const brandObj = brandOptions.find((b) => b.value === brandName);
      if (brandObj?.img) {
        // For local brandOptions, use the img property directly (it's already a full URL)
        setSelectedBrandImage(brandObj.img);
      } else {
        // Fallback to car_image if no brand image found
        setSelectedBrandImage(data.car_image ?? '');
      }
    }
    
    if (typeof setMake === 'function') setMake(brandName);
  }
};

const setColorState = (data, setSelectedColor, setSelectedColorImage) => {
  if (typeof setSelectedColor === 'function') {
    setSelectedColor(data.exterior_color ?? data.exteriorColor ?? data.color ?? '');
    if (typeof setSelectedColorImage === 'function') {
      setSelectedColorImage(data.colour_image ?? data.exterior_color_image ?? '');
    }
  }
};

// Helper function to set basic vehicle state
const setBasicVehicleState = (data, setters) => {
  const {
    setSelectedModel,
    setSelectedTrim,
    setSelectedYear,
    setSelectedPrice,
    setSelectedHorsepower,
    setSelectedVehicleType,
    setSelectedBodyType,
    setSelectedCondition,
    setSelectedRegionalSpecs,
    setSelectedRegion
  } = setters;

  
  // Try to extract model from various possible fields
  let modelValue = data.model ?? data.model_name ?? data.car_model ?? data.vehicle_model ?? '';
  
  // Don't use trim as model fallback, keep them separate
  if (!modelValue && data.ad_title) {
    // If ad_title contains 'Brand - Model' format, extract the model part
    const titleParts = data.ad_title.split(' - ');
    if (titleParts.length > 1) {
      modelValue = titleParts[1]; // Take the second part as model
    }
  }
  
  // Model extraction completed
  
  if (typeof setSelectedModel === 'function') {
    setSelectedModel(modelValue);
  }
  if (typeof setSelectedTrim === 'function') setSelectedTrim(data.trim ?? '');
  if (typeof setSelectedYear === 'function') setSelectedYear(data.year ?? '');
  if (typeof setSelectedPrice === 'function') setSelectedPrice((data.price ?? '').toString().replace(/,/g, ''));
  if (typeof setSelectedHorsepower === 'function') setSelectedHorsepower(data.horse_power ?? data.horsepower ?? '');
  if (typeof setSelectedVehicleType === 'function') setSelectedVehicleType(data.vechile_type ?? data.vehicle_type ?? '');
  if (typeof setSelectedBodyType === 'function') setSelectedBodyType(data.body_type ?? '');
  if (typeof setSelectedCondition === 'function') setSelectedCondition(data.condition ?? '');
  if (typeof setSelectedRegionalSpecs === 'function') setSelectedRegionalSpecs(data.regional_specs ?? '');
  if (typeof setSelectedRegion === 'function') setSelectedRegion(data.location ?? '');
};

// Helper function to set detailed vehicle state
const setDetailedVehicleState = (data, setters) => {
  const {
    setSelectedBadges,
    setSelectedSeats,
    setSelectedDoors,
    setSelectedFuelType,
    setSelectedTransmissionType,
    setSelectedDriveType,
    setSelectedCylinders,
    setSelectedInterior,
    setSelectedInteriorColor
  } = setters;

  if (typeof setSelectedBadges === 'function') {
    let badgesArray = [];
    if (Array.isArray(data.badges)) {
      badgesArray = data.badges;
    } else if (data.badges) {
      badgesArray = [data.badges];
    }
    setSelectedBadges(badgesArray);
  }
  if (typeof setSelectedSeats === 'function') {
    const seatsValue = data.number_of_seats ?? data.no_of_seats ?? null;
    setSelectedSeats((seatsValue === 0 || seatsValue === '0') ? undefined : seatsValue);
  }
  if (typeof setSelectedDoors === 'function') setSelectedDoors(data.number_of_doors ?? data.no_of_doors ?? '');
  if (typeof setSelectedFuelType === 'function') setSelectedFuelType(data.fuel_type ?? '');
  if (typeof setSelectedTransmissionType === 'function') setSelectedTransmissionType(data.transmission_type ?? '');
    if (typeof setSelectedDriveType === 'function') {
    setSelectedDriveType(data.drive_type ?? '');
  }
  if (typeof setSelectedCylinders === 'function') setSelectedCylinders(data.no_of_cylinders ?? '');
  if (typeof setSelectedInterior === 'function') setSelectedInterior(data.interior ?? '');
  if (typeof setSelectedInteriorColor === 'function') setSelectedInteriorColor(data.interior_color ?? '');
};

// Main effect function
useEffect(() => {
  const data = validateAndExtractData(extras);
  if (!data) {
    populatedRef.current = false;
    return;
  }
  
  if (populatedRef.current) return;

  // Set car_id from extras if it exists (this means we're in edit mode)
  if (data.id) {
    setCarId(data.id.toString());
    isEditModeRef.current = true; // Mark as edit mode
  }

  const imagePath = data.image_url || data.car_image || '';
  
  // Set media files
  setMediaFiles(data, setMediaFileList, form);
  
  // Set form values
  const formValues = buildFormValues(data);
  form.setFieldsValue(formValues);
  
  // Set ad title state from extras data
  const adTitleValue = data.ad_title ?? data.adTitle ?? '';
  setAdTitle(adTitleValue);
  
  // Set description state from extras data
  const descriptionValue = data.description ?? data.desc ?? '';
  setDescription(descriptionValue);

  // Set brand state
  setBrandState(data, imagePath, setSelectedBrand, setSelectedBrandImage, setMake);

  // Set color state
  setColorState(data, setSelectedColor, setSelectedColorImage);

  // Set basic vehicle state with a delay to avoid useEffect conflicts
  const basicSetters = {
    setSelectedModel,
    setSelectedTrim,
    setSelectedYear,
    setSelectedPrice,
    setSelectedHorsepower,
    setSelectedVehicleType,
    setSelectedBodyType,
    setSelectedCondition,
    setSelectedRegionalSpecs,
    setSelectedRegion
  };
  
  // Use setTimeout to set model and trim after useEffect has run
  setTimeout(() => {
    setBasicVehicleState(data, basicSetters);
  }, 50);

  // Set detailed vehicle state
  const detailedSetters = {
    setSelectedBadges,
    setSelectedSeats,
    setSelectedDoors,
    setSelectedFuelType,
    setSelectedTransmissionType,
    setSelectedDriveType,
    setSelectedCylinders,
    setSelectedInterior,
    setSelectedInteriorColor
  };
  setDetailedVehicleState(data, detailedSetters);

  // Update form field after state is set
  setTimeout(() => {
    const parts = [];
    if (data.make) parts.push(data.make);
    if (data.model) parts.push(data.model);
    if (data.trim) parts.push(data.trim);
    
    if (parts.length > 0) {
      form.setFieldsValue({ 
        brand: parts.join(' - ')
      });
    }
    
    // Generate auto title from the data
    const brandPart = data.make || '';
    const modelPart = data.model || '';
    const trimPart = data.trim || '';
    const yearPart = data.year || '';
    const autoTitle = `${brandPart} ${modelPart} ${trimPart} ${yearPart}`.trim();
    
    if (autoTitle) {
      setAdTitle(autoTitle);
      form.setFieldsValue({ adTitle: autoTitle });
    }
  }, 100);

  populatedRef.current = true;
}, [extras, form]);

// Auto-select "New" condition when kilometers is 0
useEffect(() => {
  const kilometers = form.getFieldValue('kilometers');
  if (kilometers === '0' || kilometers === 0) {
    setSelectedCondition('New');
    form.setFieldsValue({ condition: 'New' });
  }
}, [form.getFieldValue('kilometers')]);

  // your handleChange stays same
const handleChange = (e) => {
  let v = e.target.value || '';

  // ✅ Strictly enforce the max length
  if (v.length > MAX_LEN) {
    v = v.substring(0, MAX_LEN); // only keep the first MAX_LEN characters
    message.warning(translate('sell.DESCRIPTION_TRUNCATED', { max: MAX_LEN }));
  }

  // ✅ Update only the trimmed value
  setDescription(v);
  form.setFieldsValue({ description: v });
};


  // ✅ Emoji click (NO auto-close here)
  const handleEmojiClick = (emojiData) => {
    let v = (description || '') + emojiData.emoji;
    if (v.length > MAX_LEN) {
      v = v.slice(0, MAX_LEN);
      message.warning(translate('sell.DESCRIPTION_TRUNCATED', { max: MAX_LEN }));
    }
    setDescription(v);
    form.setFieldsValue({ description: v });
    // ❌ removed: setShowPicker(false)
  };

  // ✅ Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);


  useEffect(() => {
    fetchMakeCars({ setLoading, setCarMakes });
  }, []);

  useEffect(() => {
    make && fetchModelCars({ setLoading, setCarModels, make });
    setModalName('');
  }, [make]);

  useEffect(() => {
    fetchUpdateOptionsData();
  }, []);

  useEffect(() => {
    make && modalName && yearData && fetchTrimCars();
  }, [make, modalName, yearData]);

  useEffect(() => {
    modalName && make && fetchYearData();
  }, [make, modalName]);

  useEffect(() => {
    fetchHorsePower();
  }, []);

  // Drag and drop handlers for image reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }
    
    const newFileList = [...mediaFileList];
    const [draggedItem] = newFileList.splice(draggedIndex, 1);
    newFileList.splice(dropIndex, 0, draggedItem);
    
    setMediaFileList(newFileList);
    form.setFieldsValue({ media: newFileList });
    setDraggedIndex(null);
  };

  // Helper function to build current form data snapshot for comparison
  const buildFormDataSnapshot = (values) => {
    return JSON.stringify({
      adTitle: values.adTitle || '',
      description: values.description || '',
      make: make || '',
      model: selectedModel || modalName || '',
      year: selectedYear || '',
      price: values.price || '',
      kilometers: values.kilometers || '',
      exteriorColor: selectedColor || '',
      interiorColor: selectedInteriorColor || '',
      trim: selectedTrim || '',
      condition: values.condition || '',
      bodyType: values.bodyType || '',
      vehicletype: values.vehicletype || '',
      region: selectedRegion || '',
      regionalSpecs: selectedRegionalSpecs || '',
      seats: values.seats || '',
      doors: values.doors || '',
      fuelType: values.fuelType || '',
      transmissionType: values.transmissionType || '',
      driveType: values.driveType || '',
      cylinders: values.cylinders || '',
      engineCC: values.engineCC || '',
      consumption: values.consumption || '',
      horsepower: values.horsepower || '',
      interior: values.interior || '',
      accidentHistory: values.accidentHistory || '',
      warrantyDate: values.warrantyDate ? moment(values.warrantyDate).format('YYYY-MM-DD') : '',
      extraFeatures: JSON.stringify(values.extraFeatures || []),
      badges: JSON.stringify(values.badges || []),
      mediaCount: values.media?.length || 0,
      mediaUrls: values.media?.filter(f => !f.originFileObj && f.url).map(f => f.url).sort().join(',') || '',
    });
  };

  // Helper function to check if form has API-relevant data
  const hasFormData = (values) => {
    return values.adTitle || values.description || make || 
      (selectedModel || modalName) || selectedYear || values.price ||
      values.kilometers || selectedColor || selectedInteriorColor ||
      selectedTrim || values.condition || values.bodyType ||
      values.vehicletype || selectedRegion || selectedRegionalSpecs ||
      values.seats || values.doors || values.fuelType ||
      values.transmissionType || values.driveType || values.cylinders ||
      values.engineCC || values.consumption || values.horsepower ||
      values.interior || values.accidentHistory || values.warrantyDate ||
      (values.extraFeatures && values.extraFeatures.length > 0) ||
      (values.badges && values.badges.length > 0) ||
      (values.media && values.media.length > 0);
  };

  // Helper function to upload new images for auto-save
  const uploadNewImagesForAutoSave = async (newImages) => {
    const formData = new FormData();
    newImages.forEach((file) => {
      formData.append('attachment', file);
    });
    
    const response = await carAPI.postuploadcarimages(formData, 'car');
    return handleApiResponse(response);
  };

  // Helper function to handle auto-save with images
  const performAutoSaveWithImages = async (values, newImages, existingImages) => {
    try {
      const uploadResult = await uploadNewImagesForAutoSave(newImages);
      const allImages = uploadResult?.attachment_url?.length > 0 
        ? [...existingImages, ...uploadResult.attachment_url]
        : existingImages;
      
      // Update mediaFileList to replace uploaded images with server URLs
      if (uploadResult?.attachment_url?.length > 0) {
        const updatedFileList = [
          // Keep existing server images (without originFileObj)
          ...mediaFileList.filter(file => !file.originFileObj),
          // Add newly uploaded images as server files
          ...uploadResult.attachment_url.map((url, index) => ({
            uid: `server-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            name: url.split('/').pop() || `img-${Date.now()}-${index}`,
            status: 'done',
            url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
            originFileObj: null, // Mark as server file
          }))
        ];
        setMediaFileList(updatedFileList);
        form.setFieldsValue({ media: updatedFileList });
      }
      
      await handleCreateCar(allImages, true, values, true);
    } catch (uploadError) {
      await handleCreateCar(existingImages, true, values, true);
    }
  };

  // Helper function to perform auto-save
  const performAutoSave = async () => {
    const values = form.getFieldsValue();
    
    if (!hasFormData(values)) {
      console.log('⏭️ Auto-save skipped: No form data');
      return;
    }

    const currentDataSnapshot = buildFormDataSnapshot(values);
    
    // If no changes since last save, skip auto-save
    if (lastSavedDataRef.current === currentDataSnapshot) {
      console.log('⏭️ Auto-save skipped: No changes since last save');
      return;
    }
    
    // ✅ In edit mode, only auto-save if user made actual changes from initial data
    if (isEditModeRef.current && initialDataRef.current) {
      const hasChanges = initialDataRef.current !== currentDataSnapshot;
      console.log('🔍 Edit mode check:', {
        isEditMode: isEditModeRef.current,
        hasInitialData: !!initialDataRef.current,
        hasChanges,
        initialLength: initialDataRef.current?.length,
        currentLength: currentDataSnapshot.length
      });
      
      if (!hasChanges) {
        console.log('⏭️ Auto-save skipped: No changes from initial data in edit mode');
        return; // Skip auto-save - no changes from initial data
      }
    }
    
    console.log('💾 Auto-save triggered');
    
    // Show "Saving..." toast for auto-save using messageApi
    messageApi.open({
      type: 'loading',
      content: 'Saving...',
      duration: 0, // Don't auto-close
      key: 'auto-save', // Use key to update/close this specific message
    });
    
    try {
      const newImages = values.media?.filter(file => file.originFileObj).map(file => file.originFileObj) || [];
      const existingImages = values.media?.filter(file => !file.originFileObj && file.url).map(file => file.url) || [];
      
      if (newImages.length > 0) {
        await performAutoSaveWithImages(values, newImages, existingImages);
      } else {
        await handleCreateCar(existingImages, true, values, true);
      }
      
      lastSavedDataRef.current = currentDataSnapshot;
      
      // Close the "Saving..." message
      messageApi.destroy('auto-save');
    } catch (error) {
      // Close the "Saving..." message on error
      messageApi.destroy('auto-save');
      throw error;
    }
  };

  // Auto-save functionality - runs every 20 seconds
  useEffect(() => {
    const startAutoSave = () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }

      // ✅ For edit mode, capture initial snapshot on first interval run
      let isFirstRun = true;

      autoSaveIntervalRef.current = setInterval(async () => {
        try {
          // ✅ On first run in edit mode, just capture the snapshot and skip save
          if (isFirstRun && isEditModeRef.current) {
            isFirstRun = false;
            const values = form.getFieldsValue();
            const initialSnapshot = buildFormDataSnapshot(values);
            initialDataRef.current = initialSnapshot;
            lastSavedDataRef.current = initialSnapshot;
            console.log('📸 First auto-save interval: Captured initial snapshot (no save):', {
              snapshotLength: initialSnapshot.length
            });
            return; // Skip auto-save on first run in edit mode
          }
          
          isFirstRun = false;
          await performAutoSave();
        } catch (error) {
          // Silent error handling for auto-save
        }
      }, 20000);
    };

    startAutoSave();

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [form, selectedBrand, selectedModel, selectedYear, carId]);

  const fetchUpdateOptionsData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.uploadOptionDetails({});
      const data1 = handleApiResponse(response);
      if (data1) {
        setUpdateData(data1?.data);
      }

      message.success(data1.message || translate('filters.FETCHED_SUCCESSFULLY'));
    } catch (error) {
      if (error?.message === 'Network Error') {
      messageApi.open({
        type: 'error',
        content: translate('filters.OFFLINE_ERROR'),
      });
    } else {
      // Handle other API errors
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.message || translate('filters.FETCH_FAILED'),
      });
    }
      setUpdateData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (selectedYear || selectedBrand || selectedModel || selectedTrim) {
    const brandPart = selectedBrand || '';
    const modelPart = selectedModel || '';
    const trimPart = selectedTrim || '';
     const yearPart = selectedYear || '';
    const autoTitle = `${brandPart} ${modelPart} ${trimPart} ${yearPart}`.trim();

    // Update adTitle only if the user hasn't typed manually
    setAdTitle((prev) => {
      // If the previous title exactly matches the generated title OR it's empty, update it
      if (prev === '' || prev === autoTitle) {
        return autoTitle;
      }
      return prev;
    });

    // Also update the form field
    form.setFieldsValue({ adTitle: autoTitle });
  }
}, [selectedBrand, selectedModel, selectedTrim, selectedYear, form]);

// Clear dependent fields when brand changes
useEffect(()=>{
setSelectedTrim(extras?.trim||null)
    setSelectedYear()
setSelectedBodyType(extras?.body_type||'')
    form.setFieldsValue({ bodyType:extras?.body_type||'' });
},[selectedBrand])

// Update form field when brand, model, and trim state changes
useEffect(() => {
  const parts = [];
  if (selectedBrand) parts.push(selectedBrand);
  if (selectedModel) parts.push(selectedModel);
  if (selectedTrim) parts.push(selectedTrim);
  
  if (parts.length > 0) {
    form.setFieldsValue({ 
      brand: parts.join(' - ')
    });
  }
}, [selectedBrand, selectedModel, selectedTrim, form]);

// Only clear trim and body type when model changes manually (not during initial data loading)
useEffect(() => {
  const timer = setTimeout(() => {
    // setSelectedTrim(extras?.trim||null);
    setSelectedBodyType(extras?.body_type||'');
    form.setFieldsValue({ bodyType: extras?.body_type||'' });
  }, 100);
  
  return () => clearTimeout(timer);
}, [selectedModel]);
  const fetchTrimCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.trimDetails(make, modalName, yearData);
      const data1 = handleApiResponse(response);

      if (data1) {
        setTrimData(data1?.data);
      }

      message.success(data1.message || translate('filters.FETCHED_SUCCESSFULLY'));
    } catch (error) {
      if (error?.message === 'Network Error') {
      messageApi.open({
        type: 'error',
        content: translate('filters.OFFLINE_ERROR'),
      });
    } else {
      // Handle other API errors
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.message || translate('filters.FETCH_FAILED'),
      });
    }
      setTrimData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchYearData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getYearData(make, modalName);
      const data1 = handleApiResponse(response);

      if (data1) {
        setYearData(data1?.data);
      }

      message.success(data1.message || translate('filters.FETCHED_SUCCESSFULLY'));
    } catch (error) {
       if (error?.message === 'Network Error') {
      messageApi.open({
        type: 'error',
        content: translate('filters.OFFLINE_ERROR'),
      });
    } else {
      // Handle other API errors
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.message || translate('filters.FETCH_FAILED'),
      });
    }
      setYearData([]);
    } finally {
      setLoading(false);
    }
  };

    const fetchHorsePower = async () => {
    try {
      setLoading(true);
      const response = await carAPI.gethorsepower();
      const data1 = handleApiResponse(response);

      if (data1) {
        setHorsePower(data1?.data);
      }

      message.success(data1.message || translate('filters.FETCHED_SUCCESSFULLY'));
    } catch (error) {
       if (error?.message === 'Network Error') {
      messageApi.open({
        type: 'error',
        content: translate('filters.OFFLINE_ERROR'),
      });
    } else {
      // Handle other API errors
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.message || translate('filters.FETCH_FAILED'),
      });
    }
      setHorsePower([]);
    } finally {
      setLoading(false);
    }
  };



  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

// Helper function to build FormData for car creation/update
const buildCarFormData = (values, uploadedImages, isDraft) => {
  const cleanPrice = values.price ? values.price.replace(/,/g, '') : '';
  const formData = new FormData();
  
  // Append car_id only if it's not empty
  if (carId && carId !== '') {
    formData.append('car_id', carId);
  }
  
  // Append all form fields
  formData.append('make', make || '');
  formData.append('model', selectedModel || modalName || '');
  formData.append('year', selectedYear || '');
  formData.append('price', cleanPrice || '');
  formData.append('description', values?.description || '');
  formData.append('ad_title', values?.adTitle || '');
  formData.append('exterior_color', selectedColor || '');
  formData.append('interior_color', selectedInteriorColor || '');
  formData.append('mileage', values?.kilometers || '');
  formData.append('fuel_type', values?.fuelType || '');
  formData.append('transmission_type', values?.transmissionType || '');
  formData.append('body_type', values?.bodyType || '');
  formData.append('vechile_type', values?.vehicletype || '');
  formData.append('condition', values?.condition || '');
  formData.append('location', selectedRegion || '');
  formData.append('interior', values?.interior || '');
  formData.append('trim', selectedTrim || '');
  formData.append('regional_specs', selectedRegionalSpecs || '');
  formData.append('badges', values?.badges || '');
  formData.append('warranty_date', values?.warrantyDate ? moment(values.warrantyDate).format('YYYY-MM-DD') : '');
  formData.append('accident_history', values?.accidentHistory || '');
  formData.append('number_of_seats', values?.seats || '');
  formData.append('number_of_doors', values?.doors || '');
  formData.append('drive_type', values?.driveType || '');
  formData.append('engine_cc', values?.engineCC || '');
  formData.append('consumption', values?.consumption || '');
  formData.append('no_of_cylinders', values?.cylinders || '');
  formData.append('horse_power', values?.horsepower || '');
  formData.append('payment_option', '');
  formData.append('draft', isDraft);
  
  // Append arrays as JSON strings
  if (values?.extraFeatures && values.extraFeatures.length > 0) {
    formData.append('extra_features', JSON.stringify(values.extraFeatures));
  }
  
  // Append images
  if (uploadedImages && uploadedImages.length > 0) {
    const relativeImagePaths = uploadedImages.map(url => convertToRelativePath(url));
    relativeImagePaths.forEach((imagePath, index) => {
      formData.append(`car_images[${index}]`, imagePath);
    });
  }
  
  return formData;
};

// Helper function to handle post data success response
const handlePostDataSuccess = (data1, isDraft, text) => {
  setAddData(data1?.data);
  
  if (isDraft && data1?.data?.car_id && !carId) {
    setCarId(data1.data.car_id.toString());
  }

  const messageContent = typeof data1.message === 'object' 
    ? JSON.stringify(data1.message) 
    : data1.message;
  messageApi.open({
    type: 'success',
    content: messageContent,
  });

  if (text === '1') {
    setShowModal(true); 
  } else {
    form.resetFields();
  }
};



// Helper function to build FormData for handleCreateCar (with JSON images)
const buildCreateCarFormData = (values, uploadedImages, isDraft) => {
  const cleanPrice = values.price ? values.price.replace(/,/g, '') : '';
  const formData = new FormData();

  const trimmedDescription = (description || '').slice(0, MAX_LEN);
 
  if (carId && carId !== '') {
    formData.append('car_id', carId);
  }
  
  formData.append('make', make || '');
  formData.append('model', selectedModel || modalName || '');
  formData.append('year', selectedYear || '');
  formData.append('price', cleanPrice || '');
  formData.append('description', trimmedDescription || '');
  formData.append('ad_title', values?.adTitle || '');
  formData.append('exterior_color', selectedColor || '');
  formData.append('interior_color', selectedInteriorColor || '');
  formData.append('mileage', values?.kilometers || '');
  formData.append('fuel_type', values?.fuelType || '');
  formData.append('transmission_type', values?.transmissionType || '');
  formData.append('body_type', values?.bodyType || '');
  formData.append('vechile_type', values?.vehicletype || '');
  formData.append('condition', values?.condition || '');
  formData.append('location', selectedRegion || '');
  formData.append('interior', values?.interior || '');
  formData.append('trim', selectedTrim || '');
  formData.append('regional_specs', selectedRegionalSpecs || '');
  formData.append('badges', values?.badges || '');
  formData.append('warranty_date', values?.warrantyDate ? moment(values.warrantyDate).format('YYYY-MM-DD') : '');
  formData.append('accident_history', values?.accidentHistory || '');
  formData.append('number_of_seats', values?.seats || '');
  formData.append('number_of_doors', values?.doors || '');
  formData.append('drive_type', values?.driveType || '');
  formData.append('engine_cc', values?.engineCC || '');
  formData.append('consumption', values?.consumption || '');
  formData.append('no_of_cylinders', values?.cylinders || '');
  formData.append('horse_power', values?.horsepower || '');
  formData.append('payment_option', '');
  formData.append('draft', isDraft);
  
  if (values?.extraFeatures && values.extraFeatures.length > 0) {
    formData.append('extra_features', JSON.stringify(values.extraFeatures));
  }
  
  if (uploadedImages && uploadedImages.length > 0) {
    const relativeImagePaths = uploadedImages.map(url => convertToRelativePath(url));
    formData.append('car_images', JSON.stringify(relativeImagePaths));
  }
  
  return formData;
};

// Helper function to handle create car success
const handleCreateCarSuccess = (data1, isDraft, isAutoSave) => {
  setAddData(data1?.data);
  
  if (isDraft && data1?.data?.car_id && !carId) {
    setCarId(data1.data.car_id.toString());
  }

  const messageContent = typeof data1.message === 'object' 
    ? JSON.stringify(data1.message) 
    : data1.message;
  
  if (!isAutoSave) {
    messageApi.open({
      type: 'success',
      content: messageContent,
    });
  }
};

// Helper function to handle post-creation actions
const handlePostCreationActions = (isDraft, isAutoSave) => {
  if (isAutoSave) return;

  if (autoSaveIntervalRef.current) {
    clearInterval(autoSaveIntervalRef.current);
    autoSaveIntervalRef.current = null;
  }
  
  lastSavedDataRef.current = null;
  setModalMode(isDraft ? 'draft' : 'create');
  setShowModal(true);
  
  if (!isDraft) {
    form.resetFields();
  }
};

const handleCreateCar = async (uploadedImages = [], isDraft = false, valuesParam = null, isAutoSave = false) => {
  try {
    const values = valuesParam ?? (await form.validateFields());
    const formData = buildCreateCarFormData(values, uploadedImages, isDraft);

    setLoading(true);
    const response = await carAPI.createCar(formData);
    const data1 = handleApiResponse(response);

    if (data1) {
      handleCreateCarSuccess(data1, isDraft, isAutoSave);
      handlePostCreationActions(isDraft, isAutoSave);
    }
  } catch (error) {
    if (error?.message === 'Network Error') {
      messageApi.open({
        type: 'error',
        content: translate('filters.OFFLINE_ERROR') || 'You are offline, please check your internet connection',
      });
    } else {
      // ✅ Handle other API errors
      const errorData = handleApiError(error);
      const messageText = typeof errorData === 'object' 
        ? errorData?.message
        : (errorData || 'An error occurred');

      if (!isAutoSave) {
        messageApi.open({ type: 'error', content: messageText });
      }
    }
    setAddData([]);
  } finally {
    setLoading(false);
  }
};

// Helper function to separate images into new and existing while preserving order
const separateImages = (media) => {
  const newImages = [];
  const existingImages = [];
  const orderMap = []; // Track position: {type: 'new'/'existing', index: number}
  
  media?.forEach((file) => {
    if (file.originFileObj) {
      orderMap.push({ type: 'new', index: newImages.length });
      newImages.push(file.originFileObj);
    } else if (file.url) {
      orderMap.push({ type: 'existing', index: existingImages.length });
      existingImages.push(file.url);
    }
  });
  
  return { newImages, existingImages, orderMap };
};

// Helper function to upload images and get URLs
const uploadImagesAndGetUrls = async (newImages) => {
  const formData = new FormData();
  newImages.forEach((file) => {
    formData.append('attachment', file);
  });
  
  const response = await carAPI.postuploadcarimages(formData, 'car');
  return handleApiResponse(response);
};

// Helper function to handle draft save
const handleDraftSave = async (values) => {
  // Use mediaFileList state if values.media is empty or undefined
  const mediaToProcess = values.media && values.media.length > 0 ? values.media : mediaFileList;
  
  const { newImages, existingImages, orderMap } = separateImages(mediaToProcess);

  if (newImages.length === 0 && existingImages.length === 0) {
    await handleCreateCar([], true, values);
    return;
  }
  
  if (newImages.length > 0) {
    try {
      const uploadResult = await uploadImagesAndGetUrls(newImages);
      
      if (uploadResult?.attachment_url?.length > 0) {
        const newUploadedUrls = uploadResult.attachment_url;
        
        // Reconstruct images in the original drag-drop order
        const allImages = orderMap.map(item => {
          if (item.type === 'new') {
            return newUploadedUrls[item.index];
          } else {
            return existingImages[item.index];
          }
        });
        
        // Update mediaFileList to replace ALL with server URLs in correct order
        const updatedFileList = allImages.map((url, index) => ({
          uid: `server-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          name: url.split('/').pop() || `img-${Date.now()}-${index}`,
          status: 'done',
          url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
          originFileObj: null, // Mark as server file
        }));
        setMediaFileList(updatedFileList);
        form.setFieldsValue({ media: updatedFileList });
        
        await handleCreateCar(allImages, true, values);
      } else {
        message.error(uploadResult?.message || 'Upload failed');
      }
    } catch (error) {
      if (error?.message === 'Network Error') {
      messageApi.open({
        type: 'error',
        content: translate('filters.OFFLINE_ERROR'),
      });
    } else {
      // Handle other API errors
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.message || translate('filters.FETCH_FAILED'),
      });
    }
      throw error;
    }
  } else {
    await handleCreateCar(existingImages, true, values);
  }
};

// Helper function to handle create save
const handleCreateSave = async (values) => {
  // Use mediaFileList state if values.media is empty or undefined
  const mediaToProcess = values.media && values.media.length > 0 ? values.media : mediaFileList;
  
  const { newImages, existingImages, orderMap } = separateImages(mediaToProcess);
  
  if (newImages.length === 0 && existingImages.length === 0) {
    message.error(translate('sell.UPLOAD_MIN_PHOTOS'));
    return;
  }

  if (newImages.length > 0) {
    try {
      const uploadResult = await uploadImagesAndGetUrls(newImages);
      
      if (uploadResult?.attachment_url?.length > 0) {
        const newUploadedUrls = uploadResult.attachment_url;
        
        // Reconstruct images in the original drag-drop order
        const allImages = orderMap.map(item => {
          if (item.type === 'new') {
            return newUploadedUrls[item.index];
          } else {
            return existingImages[item.index];
          }
        });
        
        // Update mediaFileList to replace ALL with server URLs in correct order
        const updatedFileList = allImages.map((url, index) => ({
          uid: `server-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          name: url.split('/').pop() || `img-${Date.now()}-${index}`,
          status: 'done',
          url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
          originFileObj: null, // Mark as server file
        }));
        setMediaFileList(updatedFileList);
        form.setFieldsValue({ media: updatedFileList });
        
        await handleCreateCar(allImages, false, values);
      } else {
        message.error(uploadResult?.message || 'Upload failed');
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to upload images');
      throw error;
    }
  } else {
    await handleCreateCar(existingImages, false, values);
  }
};

const handleFinish = async (mode) => {
  try {
    if (mode === 'draft') {
      const values = form.getFieldsValue();
      await handleDraftSave(values);
      return;
    }

    if (mode === 'create') {
      const values = await form.validateFields();
      await handleCreateSave(values);
      return;
    }
  } catch (err) {
    const messageContent = err?.errorFields 
      ? 'Please fill required fields before submitting.'
      : handleApiError(err).message || 'An error occurred. Please try again.';
    
    messageApi.open({ type: 'error', content: messageContent });
  }
};

const handleUpdateCar = async () => {
  try {
    setLoading(true);
    
 
    const values = await form.validateFields();
    
    
    // Separate new uploads from existing server images while preserving order
    const { newImages, existingImages, orderMap } = separateImages(values.media);
    

    if (newImages.length === 0 && existingImages.length === 0) {
      message.error(translate('sell.UPLOAD_MIN_PHOTOS'));
      return;
    }

    // Upload new images first, then reconstruct in correct order
    let uploadedImages = existingImages;
    if (newImages.length > 0) {
      const newUploadedImages = await handleImageUpload(newImages);
      
      // Reconstruct images in the original drag-drop order
      uploadedImages = orderMap.map(item => {
        if (item.type === 'new') {
          return newUploadedImages[item.index];
        } else {
          return existingImages[item.index];
        }
      });
      
      // Update mediaFileList to replace ALL with server URLs in correct order
      const updatedFileList = uploadedImages.map((url, index) => ({
        uid: `server-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        name: url.split('/').pop() || `img-${Date.now()}-${index}`,
        status: 'done',
        url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
        originFileObj: null, // Mark as server file
      }));
      setMediaFileList(updatedFileList);
      form.setFieldsValue({ media: updatedFileList });
    }
    
    // Convert image URLs to relative paths for API payload
    const relativeImagePaths = uploadedImages.map(url => convertToRelativePath(url));
    
    const updateData = {
      car_id: parseInt(extras.id),
      make: make || '',
      model: selectedModel || modalName || '',
      year: selectedYear || '',
      price: values.price || '',
      description: values?.description || '',
      ad_title: values?.adTitle || '',
      exterior_color: selectedColor || '',
      interior_color: selectedInteriorColor || '',
      kilometers: values?.kilometers || extras?.kilometers || extras?.mileage || '',
      fuel_type: values?.fuelType || '',
      transmission_type: values?.transmissionType || '',
      body_type: values?.bodyType || '',
      vechile_type: values?.vehicletype || '',
      condition: values?.condition || '',
      location: selectedRegion || '',
      interior: values?.interior || '',
      trim: selectedTrim || '',
      regional_specs: selectedRegionalSpecs || '',
      badges: values?.badges || '',
      warranty_date: values?.warrantyDate ? moment(values.warrantyDate).format('YYYY-MM-DD') : '',
      accident_history: values?.accidentHistory || '',
      number_of_seats: values?.seats || '',
      number_of_doors: values?.doors || '',
      drive_type: values?.driveType || '',
      engine_cc: values?.engineCC || '',
      consumption: values?.consumption || '',
      no_of_cylinders: values?.cylinders || '',
      horse_power: values?.horsepower || '',
      payment_option: '',
      draft: false,
      extra_features: (() => {
        const extraFeatures = values?.extraFeatures || [];
        return extraFeatures;
      })(),
      car_images: relativeImagePaths || []
    };
    
    // Use same API as create but with JSON data for update
    const response = await carAPI.createCar(updateData);
    const data = handleApiResponse(response);

    if (data) {
      const messageContent = data.message || 'Car updated successfully';
      messageApi.open({
        type: 'success',
        content: messageContent,
      });
      
      // Navigate back to my listings
      navigate('/myListings');
    }
  } catch (err) {
    if (err?.message === 'Network Error' || !window.navigator.onLine) {
      messageApi.open({
        type: 'error',
        content: translate('filters.OFFLINE_ERROR') || 'You are offline, please check your internet connection',
      });
    } else if (err?.errorFields) {
      messageApi.open({
        type: 'error',
        content: 'Please fill required fields before submitting.',
      });
    } else {
      const errorData = handleApiError(err);
      messageApi.open({
        type: 'error',
        content: errorData.message || 'Failed to update car',
      });
    }
  } finally {
    setLoading(false);
  }
};

// buildUpdateData function removed - now using same FormData structure as create

// Helper functions to convert between full URLs and relative paths
const convertToRelativePath = (url) => {
  if (!url) return url;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://13.202.75.187:5002';
  return url.replace(baseUrl, '');
};


const handleImageUpload = async (images) => {
  if (!images || images.length === 0) return [];
  
  const formData = new FormData();
  images.forEach((image) => {
    formData.append('attachment', image);
  });

  const response = await carAPI.postuploadcarimages(formData, 'car');
  const data = handleApiResponse(response);
  
  return data?.attachment_url || [];
};





  const filteredColors = updateData?.colours?.filter((opt) =>
    opt.colour?.toLowerCase().includes(colorSearch?.toLowerCase())
  );

  const filteredColors1 = updateData?.interior_colors?.filter((opt) =>
    opt.interior_color?.toLowerCase().includes(colorSearch?.toLowerCase())
  );




  const handleEvaluateCar = () => {
     const messageContent = translate('sell.COMING_SOON');
     messageApi.open({
        type: 'success',
        content: messageContent,
      });
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(new Error(error));
    });

  const handleMediaPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setMediaPreviewImage(file.url || file.preview);
    setMediaPreviewOpen(true);
  };

  const handleMediaChange = ({ fileList: newFileList }) => {
    
    // Filter out files that are too large (only for new uploads)
    const filteredList = newFileList?.filter((file) => {
      // Skip size check for server-loaded files (they don't have originFileObj)
      if (!file.originFileObj) return true;
      return (file.size || file.originFileObj?.size) / 1024 / 1024 < 5;
    }) || [];
    
    setMediaFileList(filteredList);
    form.setFieldsValue({ media: filteredList });
  };

  const handleMediaRemove = (file) => {
    const newFileList = mediaFileList.filter(item => item.uid !== file.uid);
    setMediaFileList(newFileList);
    form.setFieldsValue({ media: newFileList });
    return true; // Allow removal
  };
 
  const mediaUploadButton = (
    <button 
      className='media-upload-button'
      type='button'
      aria-label='Add media file'
    >
      <PlusOutlined className='media-upload-icon' />
      <div className='media-upload-text'>
        Add Media
      </div>
    </button>
  );

  return (
    <>
      <div className='page-header'>
        {contextHolder}
        <div className='page-header-title'>
          {translate('sell.PAGE_TITLE')}
        </div>
        <div className='page-header-subtitle'>{translate('sell.PAGE_SUBTITLE')}</div>
      </div>
      <div className='sell-container'>
        <Card
          title={translate('sell.CAR_DESCRIPTION')}
          className='card-description'
        >
          <Form
            form={form}
            layout='vertical'
            onFinish={handleFinish}
            scrollToFirstError
            initialValues={{ condition: '', year: undefined }}
          >
            <Row gutter={24}>
              <Col xs={24} md={10}>
                <Form.Item
                  name='media'
                  valuePropName='fileList'
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      validator: (_, value) => {
                        // Check both the form value and the mediaFileList state
                        if ((!value || value.length === 0) && mediaFileList.length === 0) {
                          return Promise.reject(new Error(translate('sell.PLEASE_ADD_MEDIA')));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  {mediaFileList.length === 0 ? (
                    <div
                      className='custom-upload-area'
                      onClick={() => {
                        document.getElementById('hidden-upload-input').click();
                      }}
                    >
                      <img
                        src={addMediaSvg}
                        alt='Add Media'
                        className='custom-upload-icon'
                      />
                      <Button
                        className='custom-upload-btn'
                        type='link'
                        onClick={(e) => {
                          e.stopPropagation();
                          document
                            .getElementById('hidden-upload-input')
                            .click();
                        }}
                      >
                        {translate('sell.ADD_MEDIA')}
                      </Button>
                      <div className='custom-upload-info'>
                        {translate('sell.FILE_SIZE_INFO')}
                      </div>
                      <input
  id="hidden-upload-input"
  type="file"
  multiple
  accept=".jpg,.jpeg,.png,.heic,.heif"
  style={{ display: 'none' }}
  onChange={(e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      e.target.value = null;
      return;
    }

    // Check total count first
    if (mediaFileList.length + files.length > 15) {
      messageApi.error(translate('sell.IMAGE_MAX_COUNT'));
      e.target.value = null; // reset so it fires again
      return;
    }

    let hasInvalidFile = false;

    files.forEach((file) => {
      // Check file size
      if (file.size / 1024 / 1024 > 5) {
        hasInvalidFile = true;
        messageApi.error(translate('sell.IMAGE_SIZE_LIMIT_FILE', { file: file.name }));
        return;
      }

      // Check file type
      const allowedTypes = ['.jpg', '.jpeg', '.png', '.heic', '.heif'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        hasInvalidFile = true;
        messageApi.error(translate('sell.IMAGE_FORMAT_NOT_SUPPORTED', { file: file.name }));
        return;
      }
    });

    if (!hasInvalidFile) {
      const newFileList = [
        ...mediaFileList,
        ...files.map((file, idx) => ({
          uid: `${Date.now()}-${idx}`,
          name: file.name,
          status: 'done',
          originFileObj: file,
        })),
      ];

      setMediaFileList(newFileList);
      form.setFieldsValue({ media: newFileList });
      
      // Clear any validation errors for media field
      form.validateFields(['media']).catch(() => {
        // Ignore validation errors, we just added files
      });
    }

    e.target.value = null; // reset so it fires again
  }}
/>


                    </div>
                  ) : (
                   <>
 <Upload
  action="#"
  listType="picture-card"
  fileList={mediaFileList}
  onPreview={handleMediaPreview}
  onChange={handleMediaChange}
  onRemove={handleMediaRemove}
  itemRender={(originNode, file, fileList) => {
    const index = fileList.findIndex(f => f.uid === file.uid);
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        className="draggable-upload-item"
      >
        {originNode}
      </div>
    );
  }}
  beforeUpload={(file) => {
    // Check file size
    if (file.size / 1024 / 1024 > 5) {
      messageApi.error(translate('sell.IMAGE_SIZE_LIMIT_SMALLER', { file: file.name }));
      return Upload.LIST_IGNORE; // prevent adding this file
    }

    // Check file type
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.heic', '.heif'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      messageApi.error(translate('sell.IMAGE_FORMAT_NOT_SUPPORTED', { file: file.name }));
      return Upload.LIST_IGNORE;
    }

    if (mediaFileList.length + 1 > 15) {
      messageApi.error(translate('sell.IMAGE_MAX_COUNT_UPLOAD'));
      return Upload.LIST_IGNORE;
    }

    return true; // allow valid files
  }}
  multiple
  maxCount={15}
  accept=".jpg,.jpeg,.png,.heic,.heif"
  customRequest={({ file, onSuccess }) => {
    setTimeout(() => onSuccess('ok'), 0); // fake upload
  }}
>
  {mediaFileList.length < 15 && mediaUploadButton}
</Upload>



  {mediaFileList.length > 0 && (
    <div
      className='media-info-text'
      style={{ marginTop: '8px', color: '#666' }}
    >
      {translate('sell.TAP_TO_EDIT_REORDER')}
    </div>
  )}

  {mediaPreviewImage && (
    <Image
      wrapperStyle={{ display: 'none' }}
      preview={{
        visible: mediaPreviewOpen,
        onVisibleChange: (visible) => setMediaPreviewOpen(visible),
        afterOpenChange: (visible) => !visible && setMediaPreviewImage(''),
      }}
      src={mediaPreviewImage}
    />
  )}
</>

                  )}
                </Form.Item>
              </Col>
              <Col xs={24} md={14}>
                <Form.Item
                  className='form-item-label'
                  label={translate('sell.AD_TITLE')}
                  name='adTitle'
                >
                   <Input
    placeholder={translate('sell.TITLE_AUTO_GENERATED')}
    value={adTitle}
    disabled
    onChange={(e) => {
      setAdTitle(e.target.value);
      form.setFieldsValue({ adTitle: e.target.value });
    }}
  />
                </Form.Item>
                    <Form.Item
  className="form-item-label"
  label={translate('sell.DESCRIPTION')}
  name="description"
>
  <div className="description-container" style={{ position: 'relative' }}>
    <TextArea
      rows={4}
      placeholder={translate('sell.ENTER_DESCRIPTION')}
      value={description}
      onChange={handleChange}
    />

    {/* Row for emoji button + counter */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
      }}
    >
      {/* Emoji button */}
      <Button
        type="default"
        size="small"
        onClick={() => setShowPicker((prev) => !prev)}
      >
        {translate('sell.EMOJI')}
      </Button>

      {/* Live Counter */}
      <div
        className={`description-counter ${
          description.length === MAX_LEN ? 'max-length' : ''
        }`}
      >
        {description.length}/{MAX_LEN}
      </div>
    </div>

    {/* Emoji Picker */}
    {showPicker && (
      <div
        ref={pickerRef}
        style={{ position: 'absolute', zIndex: 1000, marginTop: 8 }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </div>
    )}
  </div>
</Form.Item>


              </Col>
            </Row>

           <Card
  title={
    <div
      style={{
        whiteSpace: 'normal',  // Allow text wrapping
        wordBreak: 'break-word', // Break long words if needed
        fontSize: window.innerWidth <= 768 ? '14px' : '16px', // Responsive font
        lineHeight: '1.4',
      }}
    >
      {translate('sell.ENTER_CAR_INFORMATION')}
    </div>
  }
  className="card-car-info"
>

              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
  className='no-asterisk form-item-label-small'
  label={`${translate('sell.CAR_INFORMATION')}*`}
  name='brand'
  rules={[
    {
      validator: (_, value) => {
        // Check if we have at least brand selected
        if (!selectedBrand) {
          return Promise.reject(new Error(translate('sell.PLEASE_SELECT_CAR_BRAND')));
        }
        // Check if model is selected when brand is selected
        if (selectedBrand && !selectedModel) {
          return Promise.reject(new Error(translate('sell.PLEASE_SELECT_CAR_MODEL')));
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <Input
    value={(() => {
      const parts = [];
      if (selectedBrand) parts.push(selectedBrand);
      if (selectedModel) parts.push(selectedModel);
      if (selectedTrim) parts.push(selectedTrim);
      return parts.join(' - ');
    })()}
    className='hidden-input'
    readOnly
  />
  <BrandInput
    selectedBrand={selectedBrand}
    selectedModel={selectedModel}
    selectedTrim={selectedTrim}
    selectedBrandImage={selectedBrandImage}
    onOpen={() => setBrandModalOpen(true)}
    BASE_URL={BASE_URL}
    brandOptions={brandOptions}
    translate={translate}
  />
</Form.Item>

                  <Modal
                    open={brandModalOpen}
                    onCancel={() => setBrandModalOpen(false)}
                    footer={null}
                    title={
                      <div className='modal-title-row'>
                        <span>{translate('sell.WHAT_IS_BRAND')}</span>
                      </div>
                    }
                    width={600}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder={translate('sell.SEARCH_BY_TYPING')}
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className='modal-search'
                    />
                    <div className='brand-modal-grid'>
                      {carMakes
                        ?.filter((opt) =>
                          opt?.name
                            ?.toLowerCase()
                            ?.includes(brandSearch?.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.name}
                            className={`brand-option${
                              selectedBrand === opt.name ? ' selected' : ''
                            }`}
                            onClick={() => {
                              // Check if user is changing make after selecting both make and model
                              if (selectedBrand && selectedModel && selectedBrand !== opt.name) {
                                const messageContent = translate('sell.CHANGING_MAKE_CLEARS_MODEL');
                                messageApi.open({
                                  type: 'warning',
                                  content: messageContent,
                                });
                                // Clear model and trim when changing make
                                setSelectedModel(undefined);
                                setModalName(undefined);
                                setSelectedTrim(undefined);
                                form.setFieldsValue({ 
                                  brand: opt.name,
                                  brandImage: opt.image,
                                  trim: undefined
                                });
                              } else {
                                // Normal flow - update brand field with current model and trim
                                const parts = [opt.name];
                                if (selectedModel) parts.push(selectedModel);
                                if (selectedTrim) parts.push(selectedTrim);
                                form.setFieldsValue({ 
                                  brand: parts.join(' - '),
                                  brandImage: opt.image,
                                });
                              }
                              
                              setSelectedBrand(opt.name);
                              setMake(opt.name);  
                              setBrandModalOpen(false);
                              setSelectedBrandImage(opt.image);
                              setBrandNameOpen(true);
                            }}
                          >
                            <img
                              src={`${BASE_URL}${opt.image}`}
                              alt={opt.value}
                              className='brand-option-img'
                            />
                            <span className='brand-option-label'>
                              {opt.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </Modal>

                  <Modal
                    open={brandNameOpen}
                    onCancel={() => setBrandNameOpen(false)}
                    footer={null}
                    title={
                      <div className='modal-title-row'>
                        <span>{translate('sell.WHAT_IS_MODEL')}</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder={translate('sell.SEARCH_BY_TYPING')}
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className='modal-search'
                    />
                    <div className='modal-list'>
                      {carModels
                        ?.filter((opt) =>
                          opt.model_name
                            .toLowerCase()
                            .includes(trimSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.model_name}
                            className={`modal-option${
                              selectedModel === opt.model_name
                                ? ' selected'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedModel(opt.model_name);
                              setModalName(opt.model_name);
                              // Update brand field with current brand, model, and trim
                              const parts = [];
                              if (selectedBrand) parts.push(selectedBrand);
                              parts.push(opt.model_name);
                              if (selectedTrim) parts.push(selectedTrim);
                              form.setFieldsValue({ 
                                trim: opt.model_name,
                                brand: parts.join(' - ')
                              });
                              form.validateFields(['brand']);
                              setBrandNameOpen(false);
                            }}
                          >
                            {opt.model_name}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label'
                    label={`${translate('sell.EXTERIOR_COLOR')}*`}
                    name='exteriorColor'
                    rules={[
    { required: true, message: translate('sell.EXTERIOR_COLOR_REQUIRED') },
  ]}
  required={false}
                  >
                    <ExteriorColorInput
                    selectedColor={selectedColor}
                    selectedColorImage={selectedColorImage}
                    onOpen={() => setColorModalOpen(true)}
                    placeholder={translate('sell.SELECT_EXTERIOR_COLOR')}
                    BASE_URL={BASE_URL}
                  />
                  </Form.Item>
                  <Modal
                    open={colorModalOpen}
                    onCancel={() => setColorModalOpen(false)}
                    footer={null}
                    title={
                      <div className='modal-title-row'>
                        <span>{translate('sell.WHAT_IS_EXTERIOR_COLOR')}</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder={translate('sell.SEARCH_BY_TYPING')}
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      className='modal-search'
                    />
                    <div className='color-modal-grid'>
                      {filteredColors?.map((opt) => (
                        <div
                          key={opt.colour}
                          className={`color-option${
                            selectedColor === opt.colour ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedColor(opt.colour);
                            setColorModalOpen(false);
                            form.setFieldsValue({ exteriorColor: opt.colour });
                            form.setFieldsValue({ exteriorColor: opt.colour,brandImage: opt.colour_image, });
                            setSelectedColorImage(opt.image);
                          }}
                        >
                           <img
                              src={`${BASE_URL}${opt.colour_image}`}
                              alt={opt.value}
                              className='color-swatch-modal'
                            />
                          <span className='color-option-label'>
                            {opt.colour}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Modal>
                </Col>
                 <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label-small'
                    label={`${translate('sell.YEAR')}*`}
                     name='year'
                     rules={[
    // { required: true, message: translate('sell.YEAR_REQUIRED') },
    {
      validator: (_, value) => {
        if (!selectedYear || selectedYear === '') {
          return Promise.reject(new Error(translate('sell.YEAR_REQUIRED')));
        }
        return Promise.resolve();
      },
    },
  ]}
  required={false}
                  >
                    <Input
                      value={selectedYear}
                      className='hidden-input'
                      readOnly
                    />
                    <YearInput 
                      selectedYear={selectedYear}
                      onOpen={() => setYearModalOpen(true)}
                      translate={translate}
                    />
                  </Form.Item>
                  <Modal
                    open={yearModalOpen}
                    onCancel={() => setYearModalOpen(false)}
                    footer={null}
                    title={
                      <div className='modal-title-row'>
                        <span>{translate('sell.WHAT_IS_YEAR')}</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder={translate('sell.SEARCH_BY_TYPING')}
                      value={yearSearch}
                      onChange={(e) => setYearSearch(e.target.value)}
                      className='modal-search'
                    />
                    <div className='modal-list-scrollable'>
                      {yearData
                        ?.filter((opt) => opt.year.includes(yearSearch))
                        ?.map((opt) => (
                          <div
                            key={opt.year}
                            className={`modal-option${
                              selectedYear === opt.year ? ' selected' : ''
                            }`}
                            onClick={() => {
                              setSelectedYear(opt.year);
                              setYearModalOpen(false);
                              form.setFieldsValue({ year: opt.year });
                            }}
                          >
                            {opt.year}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label'
                    label={translate('sell.TRIM')}
                    name='trim'
                  >
                    <TrimInput 
                      selectedTrim={selectedTrim}
                      onOpen={() => setTrimModalOpen(true)}
                      translate={translate}
                    />
                  </Form.Item>
                  <Modal
                    open={trimModalOpen}
                    onCancel={() => setTrimModalOpen(false)}
                    footer={null}
                    title={
                      <div className='modal-title-row'>
                        <span>{translate('sell.WHAT_IS_TRIM')}</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder={translate('sell.SEARCH_BY_TYPING')}
                      value={trimSearch}
                      onChange={(e) => setTrimSearch(e.target.value)}
                      className='modal-search'
                    />
                    <div className='modal-list'>
                      {trimData
                        ?.filter((opt) =>
                          opt?.trim_name
                            ?.toLowerCase()
                            ?.includes(trimSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.trim_name}
                            className={`modal-option${
                              selectedTrim === opt.value ? ' selected' : ''
                            }`}
                            onClick={() => {
                              setSelectedTrim(opt.trim_name);
                              setTrimModalOpen(false);
                              
                              const parts = [];
                              if (selectedBrand) parts.push(selectedBrand);
                              if (selectedModel) parts.push(selectedModel);
                              parts.push(opt.trim_name);
                              form.setFieldsValue({ 
                                trim: opt.trim_name,
                                brand: parts.join(' - ')
                              });
                            }}
                          >
                            {opt.trim_name}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
                
              </Row>
             <Row gutter={16}>
  <Col xs={24} md={6}>
    <Form.Item
      className='form-item-label'
      label={`${translate('sell.BODY_TYPE')}*`}
      name='bodyType'
      rules={[
    { required: true, message: translate('sell.BODY_TYPE_REQUIRED') },
  ]}
  required={false}
    >
      <Input
        value={selectedBodyType}
        className='hidden-input'
        readOnly
       
      />
      <div className='option-box-group'>
        {updateData?.body_types?.map((opt) => (
          <div
            key={opt.body_type}
            className={`option-box${selectedBodyType === opt.body_type ? ' selected' : ''}`}
            onClick={() => {
              // Check if Vehicle Type is Bike or Truck
              if (selectedVehicleType === 'Bike' || selectedVehicleType === 'Truck') {
                const messageContent = translate('sell.SELECT_VEHICLE_TYPE_CAR');
                messageApi.open({
                  type: 'warning',
                  content: messageContent,
                });
                return; // Prevent selection
              }
              
              setSelectedBodyType(opt.body_type);
              form.setFieldsValue({ bodyType: opt.body_type });
            }}
          >
            {opt.body_type}
          </div>
        ))}
      </div>
    </Form.Item>
  </Col>

  <Col xs={24} md={6}>
    <Form.Item
      className='form-item-label'
      label={`${translate('sell.CONDITION')}*`}
      name='condition'
      rules={[
    { required: true, message: translate('sell.CONDITION_REQUIRED') },
  ]}
  required={false}
    >
      <Input
        value={selectedCondition}
        className='hidden-input'
        readOnly
      />
      <div className='option-box-group'>
        {updateData?.car_conditions?.map((opt) => (
          <div
            key={opt.car_condition}
            className={`option-box${selectedCondition === opt.car_condition ? ' selected' : ''}`}
            onClick={() => {
              const currentKilometers = form.getFieldValue('kilometers');
              
              if (selectedCondition === 'New' && opt.car_condition !== 'New' && (currentKilometers === '0' || currentKilometers === 0)) {
                
              }
              
              setSelectedCondition(opt.car_condition);
              form.setFieldsValue({ condition: opt.car_condition });
              
              form.validateFields(['kilometers']);
            }}
          >
            {opt.car_condition}
          </div>
        ))}
      </div>
    </Form.Item>
  </Col>

  {/* Price input */}
  <Col xs={24} md={6}>
  <Form.Item
    className='form-item-label-large'
    label={`${translate('sell.PRICE_IQD')}*`}
    name='price'
   rules={[
      { required: true, message: translate('sell.PRICE_REQUIRED') },
      {
        validator: (_, value) => {
          if (!value) {
            return Promise.reject(new Error(translate('sell.PRICE_MIN_1000')));
          }

          const numericValue = parseFloat(value.replace(/,/g, ''));

          if (isNaN(numericValue)) {
            return Promise.reject(new Error(translate('sell.VALID_NUMBER')));
          }

          if (numericValue <= 1000) {
            return Promise.reject(new Error(translate('sell.PRICE_GREATER_THAN_1000')));
          }
          const maxAmount = 5000000000;
          if (numericValue > maxAmount) {
            return Promise.reject(
              new Error(translate('sell.PRICE_MAX_LIMIT'))
            );
          }

          return Promise.resolve();
        },
      },
    ]}
  >
    <Input
      className='custom-placeholder full-width-input'
      type='text'
      inputMode='decimal'
      placeholder={translate('sell.ENTER_PRICE')}
      value={selectedPrice || ''}
      onChange={(e) => {
        let inputValue = e.target.value;

        // Allow only numbers, commas, and one decimal point
        inputValue = inputValue.replace(/[^0-9.,]/g, '');

        // Prevent multiple decimal points
        const decimalParts = inputValue.split('.');
        if (decimalParts.length > 2) {
          inputValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
        }

        setSelectedPrice(inputValue); // Keep exactly what the user typed
        form.setFieldsValue({ price: inputValue });
      }}
    />
  </Form.Item>
</Col>
  <Col xs={24} md={6}>
    <Form.Item
      className='form-item-label'
      label={`${translate('sell.HORSEPOWER_HP')}*`}
      name='horsepower'rules={[
    { required: true, message: translate('sell.HORSEPOWER_REQUIRED') },
  ]}
  required={false}
    >
      <Select
        showSearch
        placeholder={translate('sell.SELECT_HORSEPOWER')}
        optionFilterProp='children'
        value={selectedHorsepower || undefined}
        onChange={(val) => {
          setSelectedHorsepower(val);
          form.setFieldsValue({ horsepower: val });
        }}
      >
        {horsePower?.map((hp) => (
              <Select.Option key={hp.id} value={hp.label}>
                {hp.label}
              </Select.Option>
            ))
          }
      </Select>
    </Form.Item>
  </Col>
</Row>

              <Row gutter={16}>
                {/* <Col xs={24} md={12}>
                  <Form.Item
                    className='form-item-label'
                    label='Badges'
                    name='badges'
                  >
                    <div className='option-box-group'>
                      {updateData?.badges?.map((opt) => (
                        <div
                          key={opt.badge}
                          className={`option-box${
                            selectedBadges.includes(opt.badge) ? ' selected' : ''
                          }`}
                          onClick={() => {
                            let newBadges;
                            if (selectedBadges.includes(opt.badge)) {
                              newBadges = selectedBadges?.filter(
                                (b) => b !== opt.badge
                              );
                            } else {
                              newBadges = [...selectedBadges, opt.badge];
                            }
                            setSelectedBadges(newBadges);
                            form.setFieldsValue({ badges: newBadges });
                          }}
                        >
                          {opt.badge}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col> */}

                <Col xs={24} md={12}>
                  <Form.Item
                    className='form-item-label'
                    label={`${translate('sell.VEHICLE_TYPE')}*`}
                    name='vehicletype'
                    rules={[
    { required: true, message: translate('sell.VEHICLE_TYPE_REQUIRED') },
  ]}
  required={false}
                  >
                    <Select
        placeholder={translate('sell.SELECT_VEHICLE_TYPE')}
        value={selectedVehicleType || undefined}
        onChange={(val) => {
          setSelectedVehicleType(val);
          form.setFieldsValue({ vehicletype: val });
          
          // Auto-deselect Body Type if Vehicle Type is Bike or Truck
          if (val === 'Bike' || val === 'Truck') {
            setSelectedBodyType(undefined);
            form.setFieldsValue({ bodyType: undefined });
          }
        }}
      >
        {updateData?.vehicle_types?.map((hp1) => (
              <Option key={hp1.id} value={hp1.vechile_type}>
                {hp1.vechile_type}
              </Option>
            ))
          }
      </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label-small'
                    label={`${translate('sell.KILOMETERS')}*`}
                    name='kilometers'
                    rules={[
  
  {
    validator: (_, value) => {
      const numberValue = Number(value);
      if (value === undefined || value === null || value === '') {
        return Promise.reject(new Error(translate('sell.KILOMETERS_REQUIRED')));
      }
      
      // Check condition-based validation
      if (selectedCondition === 'Used' && numberValue <= 0) {
        return Promise.reject(new Error(translate('sell.KILOMETERS_GREATER_THAN_ZERO')));
      }
      
      // For "New" condition, 0 is allowed
      if (selectedCondition === 'New' && numberValue < 0) {
        return Promise.reject(new Error(translate('sell.KILOMETERS_CANNOT_BE_NEGATIVE')));
      }
     
      return Promise.resolve();
    },
  },
]}

  required={false}
                    validateTrigger='onBlur'
                  >
                      <Input
    className='full-width-input'
    type='tel'
    inputMode='numeric'
    pattern='[0-9]*'
    placeholder={translate('sell.ENTER_KILOMETERS')}
    onChange={(e) => {
      const digitsOnly = (e.target.value || '').replace(/\D/g, '');

      // Remove leading zeros to prevent entries like 0001, but allow single 0
      const sanitizedValue = digitsOnly === '0' ? '0' : digitsOnly.replace(/^0+/, '');
      
      // Check if user is trying to enter 0 while condition is "Used"
      if (sanitizedValue === '0' && selectedCondition === 'Used') {
        const messageContent = translate('sell.KILOMETERS_MORE_THAN_ZERO_USED');
        messageApi.open({
          type: 'warning',
          content: messageContent,
        });
        return; // Prevent setting the value
      }
      
      form.setFieldsValue({ kilometers: sanitizedValue });
      
      // Auto-select "New" condition if kilometers is 0 and no condition is selected
      if ((sanitizedValue === '0' || sanitizedValue === '') && !selectedCondition) {
        setSelectedCondition('New');
        form.setFieldsValue({ condition: 'New' });
      }
      
      // Verify the field was set
      setTimeout(() => {
        const currentValue = form.getFieldValue('kilometers');
      }, 100);
    }}
  />
                  </Form.Item>
                </Col>
              
                <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label-small'
                    label={`${translate('sell.LOCATION')}*`}
                    name='region'
                    rules={[
    { required: true, message: translate('sell.LOCATION_REQUIRED') },
  ]}
  required={false}
                  >
                    <RegionInput 
                      selectedRegion={selectedRegion}
                      onOpen={() => setRegionModalOpen(true)}
                      translate={translate}
                    />
                  </Form.Item>
                  <Modal
                    open={regionModalOpen}
                    onCancel={() => setRegionModalOpen(false)}
                    footer={null}
                    title={
                      <div className='modal-title-row'>
                        <span>{translate('sell.WHERE_IS_LOCATION')}</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder={translate('sell.SEARCH_BY_TYPING')}
                      value={regionSearch}
                      onChange={(e) => setRegionSearch(e.target.value)}
                      className='modal-search'
                    />
                    <div className='modal-list-scrollable'>
                      {updateData?.locations
                        ?.filter((opt) =>
                          opt?.location
                            ?.toLowerCase()
                            ?.includes(regionSearch?.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt?.location}
                            className={`modal-option${
                              selectedRegion === opt?.location
                                ? ' selected'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedRegion(opt?.location);
                              setRegionModalOpen(false);
                              form.setFieldsValue({ region: opt?.location });
                            }}
                          >
                            {opt?.location}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label-small'
                    label={translate('sell.WARRANTY_DATE')}
                    name='warrantyDate'
                  >
                    <DatePicker className='full-width-input' format='MM/DD/YYYY' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    className='form-item-label-small'
                    label={translate('sell.ACCIDENT_HISTORY')}
                    name='accidentHistory'
                  >
                    <Select placeholder={translate('sell.SELECT_ACCIDENT_HISTORY')}>
                      {updateData?.accident_histories?.map((hist) => (
                        <Option key={hist.id} value={hist.accident_history}>
                          {hist.accident_history}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    className='form-item-label'
                    label={`${translate('sell.REGIONAL_SPECS')}*`}
                     name='regionalSpecs'
                     rules={[
    { required: true, message: translate('sell.REGIONAL_SPECS_REQUIRED') },
  ]}
  required={false}
                  >
                    <RegionalSpecsInput 
                      selectedRegionalSpecs={selectedRegionalSpecs}
                      onOpen={() => setRegionalSpecsModalOpen(true)}
                      translate={translate}
                    />
                  </Form.Item>
                  <Modal
                    open={regionalSpecsModalOpen}
                    onCancel={() => setRegionalSpecsModalOpen(false)}
                    footer={null}
                    title={
                      <div className='modal-title-row'>
                        <span>{translate('sell.WHAT_IS_REGIONAL_SPECS')}</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder={translate('sell.SEARCH_BY_TYPING')}
                      value={regionalSpecsSearch}
                      onChange={(e) => setRegionalSpecsSearch(e.target.value)}
                      className='modal-search'
                    />
                    <div className='modal-list-scrollable'>
                      {updateData?.regional_specs
                        ?.filter((opt) =>
                          opt?.regional_spec
                            ?.toLowerCase()
                            ?.includes(regionalSpecsSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.regional_spec}
                            className={`modal-option${
                              selectedRegionalSpecs === opt.regional_spec
                                ? ' selected'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedRegionalSpecs(opt.regional_spec);
                              setRegionalSpecsModalOpen(false);
                              form.setFieldsValue({
                                regionalSpecs: opt.regional_spec,
                              });
                            }}
                          >
                            {opt.regional_spec}
                          </div>
                        ))}
                    </div>
                  </Modal>
                </Col>
              </Row>
            </Card>
            <Card style={{
        whiteSpace: 'normal',  // Allow text wrapping
        wordBreak: 'break-word', // Break long words if needed
        fontSize: window.innerWidth <= 768 ? '14px' : '16px', // Responsive font
        lineHeight: '1.4',
      }}
       title={translate('sell.ADDITIONAL_DETAILS')} className='card-additional-details'>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label-small'
                    label={`${translate('sell.NUMBER_OF_SEATS')}*`}
                    name='seats'
                    rules={[
    { required: true, message: translate('sell.SEATS_REQUIRED') },
  ]}
  required={false}
                  >
                    <Input
                      value={selectedSeats}
                      className='hidden-input'
                      readOnly
                    />
                    <div className='option-box-group'>
                      {updateData?.number_of_seats?.map((opt) => (
                        <div
                          key={opt.no_of_seats}
                          className={`option-box${
                            selectedSeats === opt.no_of_seats ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedSeats(opt.no_of_seats);
                            form.setFieldsValue({ seats: opt.no_of_seats });
                          }}
                        >
                          {opt.no_of_seats}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                  <Form.Item
                    className='form-item-label-small'
                    label={translate('sell.NUMBER_OF_DOORS')}
                    name='doors'
                  >
                    <div className='option-box-group'>
                      {updateData?.number_of_doors?.map((opt) => (
                        <div
                          key={opt.no_of_doors}
                          className={`option-box${
                            selectedDoors === opt.no_of_doors ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedDoors(opt.no_of_doors);
                            form.setFieldsValue({ doors: opt.no_of_doors });
                          }}
                        >
                          {opt.no_of_doors}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={7}>
                  <Form.Item
                    className='form-item-label-small'
                    label={`${translate('sell.FUEL_TYPE')}*`}
                    name='fuelType'
                    rules={[
    { required: true, message: translate('sell.FUEL_TYPE_REQUIRED') },
  ]}
  required={false}
                  >
                    <Input
                      value={selectedFuelType}
                      className='hidden-input'
                      readOnly
                    />
                    <div className='option-box-group'>
                      {updateData?.fuel_types?.map((opt) => (
                        <div
                          key={opt.fuel_type}
                          className={`option-box${
                            selectedFuelType === opt.fuel_type ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedFuelType(opt.fuel_type);
                            form.setFieldsValue({ fuelType: opt.fuel_type });
                          }}
                        >
                          {opt.fuel_type}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label-small'
                    label={`${translate('sell.TRANSMISSION_TYPE')}*`}
                    name='transmissionType'
                    rules={[
    { required: true, message: translate('sell.TRANSMISSION_REQUIRED') },
  ]}
  required={false}
                  >
                    <Input
                      value={selectedTransmissionType}
                      className='hidden-input'
                      readOnly
                    />
                    <div className='option-box-group'>
                      {updateData?.transmission_types?.map((opt) => (
                        <div
                          key={opt.transmission_type}
                          className={`option-box${
                            selectedTransmissionType === opt.transmission_type ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedTransmissionType(opt.transmission_type);
                            form.setFieldsValue({ transmissionType: opt.transmission_type });
                          }}
                        >
                          {opt.transmission_type}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    className='form-item-label-small'
                    label={translate('sell.DRIVE_TYPE')}
                    name='driveType'
                  >
                    <div className='option-box-group'>
                      {updateData?.drive_types?.map((opt) => (
                        <div
                          key={opt.drive_type}
                          className={`option-box${
                            selectedDriveType === opt.drive_type ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedDriveType(opt.drive_type);
                            form.setFieldsValue({ driveType: opt.drive_type });
                          }}
                        >
                          {opt.drive_type}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              <Col xs={24} md={6}>
  <Form.Item
  className='form-item-label-small'
  label={translate('sell.ENGINE_CC')}
  name='engineCC'
>
  <Input
    className='input-font-14'
    placeholder={translate('sell.ENTER_ENGINE_CC')}
    type='text'
    inputMode='decimal' // Allows numeric + decimal point keyboard on mobile
    onChange={(e) => {
      let value = e.target.value;

      // Allow only numbers and a single decimal point
      value = value.replace(/[^0-9.]/g, '');

      // Prevent multiple decimal points
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      form.setFieldsValue({ engineCC: value });
    }}
    onPaste={(e) => {
      const pasted = (e.clipboardData?.getData('Text') || '');

      // Allow only numbers and a single decimal point
      let cleanValue = pasted.replace(/[^0-9.]/g, '');

      // Prevent multiple decimal points in pasted value
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = parts[0] + '.' + parts.slice(1).join('');
      }

      if (cleanValue !== pasted) {
        e.preventDefault();
        const current = form.getFieldValue('engineCC') || '';
        form.setFieldsValue({ engineCC: `${current}${cleanValue}` });
      }
    }}
    onKeyDown={(e) => {
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'
      ];

      if (allowedKeys.includes(e.key)) return;

      // Allow digits and one decimal point
      if (!/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
      }

      const currentValue = e.currentTarget.value;

      // Prevent multiple decimal points
      if (e.key === '.' && currentValue.includes('.')) {
        e.preventDefault();
      }
    }}
  />
</Form.Item>

</Col>

 <Col xs={24} md={6}>
  <Form.Item
    className='form-item-label-small'
    label={translate('sell.CONSUMPTION')}
    name='consumption'
  >
    <Input
      className='input-font-14'
      placeholder={translate('sell.ENTER_CONSUMPTION')}
      type='tel'
      inputMode='numeric'
      pattern='[0-9]*'
      onChange={(e) => {
        const digitsOnly = (e.target.value || '').replace(/\D/g, '');
        form.setFieldsValue({ consumption: digitsOnly }); 
      }}
      onPaste={(e) => {
        const pasted = (e.clipboardData?.getData('Text') || '');
        const digitsOnly = pasted.replace(/\D/g, '');
        if (digitsOnly !== pasted) {
          e.preventDefault();
          const current = form.getFieldValue('consumption') || ''; 
          form.setFieldsValue({ consumption: `${current}${digitsOnly}` });
        }
      }}
      onKeyDown={(e) => {
        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
        if (allowed.includes(e.key)) return;
        if (!/^[0-9]$/.test(e.key)) e.preventDefault();
      }}
    />
  </Form.Item>
</Col>


              </Row>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label-small'
                    label={translate('sell.EXTRA_FEATURES')}
                    name='extraFeatures'
                  >
                    <Select mode='multiple' 
                      placeholder={translate('sell.CHOOSE')}
                      allowClear 
                       optionFilterProp='children'
                      showSearch   >
                      {updateData?.extra_features?.map((int1) => (
                        <Option key={int1.id} value={int1.extra_feature}>
                          {int1.extra_feature}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col xs={24} md={6}>
                  <Form.Item
                    className='form-item-label-small'
                    label='Interior'
                    name='interior'
                  >
                    <Select placeholder='Choose'
                     value={selectedInterior || undefined}
                    onChange={(val) => {
                   setSelectedInterior(val);
                  //  form.setFieldsValue({ horsepower: val });
                   }}>
                      {updateData?.interiors?.map((int) => (
                        <Option key={int.id} value={int.interior}>
                          {int.interior}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col> */}

                 
<Col xs={24} md={6}>
  <Form.Item
    className='form-item-label'
    label={translate('sell.INTERIOR_COLOR')}
    name='interiorColor'
  >
    <Select
      placeholder={translate('sell.SELECT_INTERIOR_COLOR')}
      className='full-width-input'
      value={selectedInteriorColor || undefined}
      onChange={(value) => {
        setSelectedInteriorColor(value);
        form.setFieldsValue({ interiorColor: value });
      }}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={filteredColors1?.map((opt) => ({
        value: opt.interior_color,
        label: opt.interior_color,
      }))}
    />
  </Form.Item>
</Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={18}>
                  <Form.Item
                    className='form-item-label-small'
                    label={translate('sell.NUMBER_OF_CYLINDERS')}
                    name='cylinders'
                  >
                    <div className='option-box-group'>
                      {updateData?.number_of_cylinders?.map((opt) => (
                        <div
                          key={opt.no_of_cylinders}
                          className={`option-box${
                            selectedCylinders === opt.no_of_cylinders ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedCylinders(opt.no_of_cylinders);
                            form.setFieldsValue({ cylinders: opt.no_of_cylinders });
                          }}
                        >
                          {opt.no_of_cylinders}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Form.Item className='form-item-margin-top'>
              <div className='submit-btn-group'>
                {extras && extras.id ? (
                  <>
                   <Button
                      size='small'
                      className='btn-outline-blue'
                      onClick={handleEvaluateCar}
                      type='default'
                    >
                      {translate('sell.EVALUATE_CAR')}
                    </Button>

                    <Button
                      size='small'
                      className='btn-outline-blue'
                      onClick={() => handleFinish('draft')}
                      type='default'
                    >
                      {translate('sell.SAVE_DRAFT')}
                    </Button>
                  <Button
                    className={`btn-update-car ${loading ? '' : 'enabled'}`}
                    size='small'
                    type='primary'
                    onClick={handleUpdateCar}
                    disabled={loading}
                  >
                    {translate('sell.UPDATE_CAR')}
                  </Button>
                  </>
                 ) : (
                  <>
                    <Button
                      size='small'
                      className='btn-outline-blue'
                      onClick={handleEvaluateCar}
                      type='default'
                    >
                      {translate('sell.EVALUATE_CAR')}
                    </Button>

                    <Button
                      size='small'
                      className='btn-outline-blue'
                      onClick={() => handleFinish('draft')}
                      type='default'
                    >
                      {translate('sell.SAVE_DRAFT')}
                    </Button>
                    <Button
                      className={`btn-create ${loading ? '' : 'enabled btn-solid-blue'}`}
                      size='small'
                      type='primary'
                      onClick={() => handleFinish('create')}
                      disabled={loading}
                    >
                      {translate('sell.CREATE')}
                    </Button>
                  </>
                )}
              </div>
            </Form.Item>
          </Form>
        </Card>
        {/* Conditionally render the modal */}
      {showModal && <CarPostingModal onClose={() => setShowModal(false)} handleAddNew={handleAddNew} mode={modalMode} />}
      </div>
    </>
  );
};

export default Sell;