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

// const { TextArea } = Input;
const { Option } = Select;
// const MAX_LEN = 1000;

const ExteriorColorInput = ({
  selectedColor,
  selectedColorImage,
  placeholder = 'Beige',
  onOpen,
  BASE_URL,
}) => {
  const hasImage = !!selectedColorImage;

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
      type="button"
      className={`exterior-color-input${!selectedColor ? ' placeholder' : ''}`}
      onClick={onOpen}
    >
      <div className="exterior-color-left">
        {hasImage && imageSrc ? (
          <img
            src={imageSrc}
            alt={selectedColor || 'color swatch'}
            className="color-swatch-input"
          />
        ) : (
          <span className="color-swatch-placeholder" aria-hidden="true" />
        )}
      </div>

      <span className="brand-text">
        {selectedColor || placeholder}
      </span>

      <RightOutlined className="color-arrow" />
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

const InteriorColorInput = ({ selectedInteriorColor, onOpen }) => (
  <button
    type="button"
    className={`interior-color-input${!selectedInteriorColor ? ' placeholder' : ''}`}
    onClick={onOpen}
  >
    <span className="interior-color-text">
      {selectedInteriorColor || 'Beige'}
    </span>
    <RightOutlined className="color-arrow" />
  </button>
);

InteriorColorInput.propTypes = {
  selectedInteriorColor: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
};

const TrimInput = ({ selectedTrim, onOpen }) => (
  <button
    type="button"
    className={`trim-input${!selectedTrim ? ' placeholder' : ''}`}
    onClick={onOpen}
  >
    <span className="trim-text">
      {selectedTrim || 'B200'}
    </span>
    <RightOutlined className="trim-arrow" />
  </button>
);

TrimInput.propTypes = {
  selectedTrim: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
};

const BrandInput = ({ selectedBrand, selectedModel, selectedTrim, selectedBrandImage, onOpen, BASE_URL, brandOptions }) => {
  const selectedBrandObj = brandOptions.find((b) => b.value === selectedBrand);

  let imageSrc = null;
  if (selectedBrandObj?.image) {
    imageSrc = `${BASE_URL}${selectedBrandObj.image}`;
  } else if (selectedBrandImage) {
    imageSrc = `${BASE_URL}${selectedBrandImage}`;
  }

  return (
    <button
      type="button"
      className={`brand-input${!selectedBrand ? ' placeholder' : ''}`}
      onClick={onOpen}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={selectedBrand || 'brand'}
          className="brand-input-img"
        />
      )}

      <span className="brand-text">
        {(() => {
          if (selectedBrand) {
            const parts = [selectedBrand];
            if (selectedModel) parts.push(selectedModel);
            if (selectedTrim) parts.push(selectedTrim);
            const displayText = parts.join(' - ');
            return displayText;
          }
          return 'Brand and Model of your car';
        })()}
      </span>

      <RightOutlined className="brand-arrow" />
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
};

const YearInput = ({ selectedYear, onOpen }) => (
  <button
    type="button"
    className={`year-input${!selectedYear ? ' placeholder' : ''}`}
    onClick={onOpen}
  >
    <span className="year-text">
      {selectedYear || 'Select Year'}
    </span>
    <RightOutlined className="year-arrow" />
  </button>
);

YearInput.propTypes = {
  selectedYear: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
};

const RegionInput = ({ selectedRegion, onOpen }) => (
  <button
    type="button"
    className={`region-input${!selectedRegion ? ' placeholder' : ''}`}
    onClick={onOpen}
  >
    <span className="region-text">
      {selectedRegion || 'Select Region'}
    </span>
    <RightOutlined className="region-arrow" />
  </button>
);

RegionInput.propTypes = {
  selectedRegion: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
};

const RegionalSpecsInput = ({ selectedRegionalSpecs, onOpen }) => (
  <button
    type="button"
    className={`regionalspecs-input${
      !selectedRegionalSpecs ? ' placeholder' : ''
    }`}
    onClick={onOpen}
  >
    <span className="regionalspecs-text">
      {selectedRegionalSpecs || 'Select Specs'}
    </span>
    <RightOutlined className="regionalspecs-arrow" />
  </button>
);

RegionalSpecsInput.propTypes = {
  selectedRegionalSpecs: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
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
  // const [desc, setDesc] = useState(form.getFieldValue('description') || '');
  const [description, setDescription] = useState(form.getFieldValue('description') || '');
  const MAX_LEN = 1000;
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [colorModalOpenInterior, setColorModalOpenInterior] = useState(false);
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
  const [selectedBadges, setSelectedBadges] = useState([]);
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
  const [selectedInterior, setSelectedInterior] = useState([]);
  const { state } = useLocation();
  const extras = state?.extras ?? [];
  const populatedRef = useRef(false);
  const { TextArea } = Input;
  const [showModal, setShowModal] = useState(false);



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

  // Finally close the modal
  setShowModal(false);
};


  
  const toUploadFileList = (imagePath) => {
  if (!imagePath) return [];
  const url = imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
  const name = url.split('/').pop() || `img-${Date.now()}`;
  return [
    {
      uid: `server-${Date.now()}`,
      name,
      status: 'done',
      url,
    },
  ];
};

 // Helper function to validate and extract data
const validateAndExtractData = (extras) => {
  if (!extras || (Array.isArray(extras) && extras.length === 0)) {
    return null;
  }
  const data = Array.isArray(extras) ? extras[0] : extras;
  if (!data || typeof data !== 'object') return null;
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
  kilometers: data.kilometers ?? data.mileage ?? 0,
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
  seats: data.number_of_seats ?? data.no_of_seats ?? '',
  extraFeatures: (() => {
    if (Array.isArray(data.extra_features)) {
      return data.extra_features;
    }
    return data.extra_features ? [data.extra_features] : [];
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
  const imagePath = data.image_url || data.car_image || '';
  const mediaFileList = toUploadFileList(imagePath);
  if (typeof setMediaFileList === 'function') setMediaFileList(mediaFileList);
  form.setFieldsValue({ media: mediaFileList });
};

// Helper function to set brand-related state
const setBrandState = (data, imagePath, setSelectedBrand, setSelectedBrandImage, setMake) => {
  if (typeof setSelectedBrand === 'function') {
    setSelectedBrand(data.make ?? data.brand ?? '');
    if (typeof setSelectedBrandImage === 'function') {
      setSelectedBrandImage(data.image_url ?? imagePath ?? '');
    }
    if (typeof setMake === 'function') setMake(data.make ?? data.brand ?? '');
  }
};

// Helper function to set color-related state
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
  let modelValue = data.model ?? data.model_name ?? data.car_model ?? data.vehicle_model ?? data.trim ?? '';
  if (!modelValue && data.ad_title) {
    // If ad_title contains "Brand - Model" format, extract the model part
    const titleParts = data.ad_title.split(' - ');
    if (titleParts.length > 1) {
      modelValue = titleParts[1]; // Take the second part as model
    }
  }
  
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
  if (typeof setSelectedSeats === 'function') setSelectedSeats(data.number_of_seats ?? data.no_of_seats ?? '');
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

  const imagePath = data.image_url || data.car_image || '';
  
  // Set media files
  setMediaFiles(data, setMediaFileList, form);
  
  // Set form values
  const formValues = buildFormValues(data);
  form.setFieldsValue(formValues);
  
  // Set ad title state from extras data
  const adTitleValue = data.ad_title ?? data.adTitle ?? '';
  setAdTitle(adTitleValue);

  // Set brand state
  setBrandState(data, imagePath, setSelectedBrand, setSelectedBrandImage, setMake);

  // Set color state
  setColorState(data, setSelectedColor, setSelectedColorImage);

  // Set basic vehicle state
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
  setBasicVehicleState(data, basicSetters);

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

  const handleChange = (e) => {
  let v = e.target.value || '';
  if (v.length > MAX_LEN) {
    v = v.slice(0, MAX_LEN);
    message.warning(`Description truncated to ${MAX_LEN} characters.`);
  }
  setDescription(v);
  form.setFieldsValue({ description: v });
};


const handlePaste = (e) => {
  const pasted = (e.clipboardData || window.clipboardData).getData('text') || '';
  const available = MAX_LEN - description.length;

  if (pasted.length > available) {
    e.preventDefault();
    const toInsert = pasted.slice(0, Math.max(0, available));
    const newVal = (description + toInsert).slice(0, MAX_LEN);

    setDescription(newVal);
    form.setFieldsValue({ description: newVal });
    message.info(`Pasted content truncated to fit ${MAX_LEN} characters.`);
  }
};


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

  const fetchUpdateOptionsData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.uploadOptionDetails({});
      const data1 = handleApiResponse(response);
      if (data1) {
        setUpdateData(data1?.data);
      }

      message.success(data1.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to Make car data');
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

useEffect(()=>{
setSelectedTrim(null)
setSelectedModel(null)
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
useEffect(()=>{
setSelectedTrim(null)
},[selectedModel])
  const fetchTrimCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.trimDetails(make, modalName, yearData);
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

  const fetchYearData = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getYearData(make, modalName);
      const data1 = handleApiResponse(response);

      if (data1) {
        setYearData(data1?.data);
      }

      message.success(data1.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to Year car data');
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

      message.success(data1.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to Year car data');
      setHorsePower([]);
    } finally {
      setLoading(false);
    }
  };

const handleBeforeUpload = async (files, mode, valuesParam = null) => {
  if (!files || files.length === 0) {
    console.error('No files provided to handleBeforeUpload');
    return Upload.LIST_IGNORE;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('attachment', file);
  });

  try {
    const response = await carAPI.postuploadcarimages(formData, 'car');
    const userdoc = handleApiResponse(response);

    if (userdoc?.attachment_url?.length > 0) {

      messageApi.open({
        type: 'success',
        content: userdoc.message || 'All images uploaded successfully',
      });

      // Pass valuesParam to avoid re-validating in handlePostData if provided
      await handlePostData(userdoc.attachment_url, '1', mode === 'draft', valuesParam);

      return Upload.LIST_IGNORE;
    } else {
      message.error(userdoc.message || 'Upload failed');
      return Upload.LIST_IGNORE;
    }
  } catch (error) {
    console.error('Upload error:', error);
    const errorData = handleApiError(error);
    messageApi.open({
      type: 'error',
      content: errorData.message || 'Upload failed',
    });
    return Upload.LIST_IGNORE;
  }
};

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

const handlePostData = async (uploadedImages = [], text = '', isDraft = false, valuesParam = null) => {
  try {
    const values = valuesParam ?? (await form.validateFields());

    const payload = {
      make: make || '',
      model: modalName || '',
      year: selectedYear || '',
      price: values.price || '',
      description: values?.description || '',
      ad_title: values?.adTitle || '',
      exterior_color: selectedColor || '',
      interior_color: selectedInteriorColor || '',
      mileage: values?.kilometers || '',
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
      warranty_date: values?.warrantyDate || '',
      accident_history: values?.accidentHistory || '',
      number_of_seats: values?.seats || '',
      number_of_doors: values?.doors || '',
      drive_type: values?.driveType || '',
      engine_cc: values?.engineCC || '',
      extra_features: values?.extraFeatures || [],
      consumption: values?.consumption || '',
      no_of_cylinders: values?.cylinders || '',
      horse_power: values?.horsepower || '',
      payment_option: '',
      draft: isDraft, // ✅ Boolean stays boolean
      car_images: uploadedImages,
    };

    setLoading(true);

    const response = await carAPI.createCar(payload); // Make sure your API expects JSON here
    const data1 = handleApiResponse(response);

    if (data1) {
      setAddData(data1?.data);
    }

    const messageContent = typeof data1.message === 'object' 
      ? JSON.stringify(data1.message) 
      : data1.message;
    messageApi.open({
      type: 'success',
      content: messageContent,
    });

    if (text === '1') {
      // navigate('/landing');
      setShowModal(true); // ✅ Show modal when text is "1"
        console.log('Added Success');
    } else {
      form.resetFields();
    }
  } catch (error) {
    const errorData = handleApiError(error);
    const messageText = typeof errorData === 'object' 
      ? JSON.stringify(errorData) 
      : (errorData || 'An error occurred');
    messageApi.open({ type: 'error', content: messageText });
    setAddData([]);
  } finally {
    setLoading(false);
  }
};

const handleFinish = async (mode) => {
  try {
    if (mode === 'draft') {
      const values = form.getFieldsValue(); 
      const images = values.media?.map((file) => file.originFileObj).filter(Boolean) || [];

      if (images.length === 0) {
        await handlePostData([], '1', true, values);
        return;
      }
      await handleBeforeUpload(images, 'draft', values);
      return;
    }

    const values = await form.validateFields();
    const images = values.media?.map((file) => file.originFileObj) || [];

    if (images.length === 0) {
      message.error('Please upload at least one image.');
      return;
    }

    await handleBeforeUpload(images, 'final');
  } catch (err) {
    if (err?.errorFields) {
      // Ant validation error object -> show a concise message
      messageApi.open({ type: 'error', content: 'Please fill required fields before submitting.' });
    } else {
      const errText = typeof err === 'object' 
        ? JSON.stringify(err) 
        : String(err);
      messageApi.open({ type: 'error', content: errText });
    }
  }
};

const handleUpdateCar = async () => {
  try {
    setLoading(true);
    const values = await form.validateFields();
    const images = values.media?.map((file) => file.originFileObj) || [];

    if (images.length === 0) {
      message.error('Please upload at least one image.');
      return;
    }

    // Upload images first
    const uploadedImages = await handleImageUpload(images);
    
    // Build update data
    const updateData = buildUpdateData(values, uploadedImages);
    
    // Call update API
    const response = await carAPI.updateCar(extras.id, updateData);
    const data = handleApiResponse(response);

    if (data) {
      messageApi.open({
        type: 'success',
        content: data.message || 'Car updated successfully',
      });
      
      // Navigate back to my listings
      navigate('/myListings');
    }
  } catch (err) {
    if (err?.errorFields) {
      messageApi.open({ type: 'error', content: 'Please fill required fields before submitting.' });
    } else {
      const errorData = handleApiError(err);
      messageApi.open({ type: 'error', content: errorData.message || 'Failed to update car' });
    }
  } finally {
    setLoading(false);
  }
};

const buildUpdateData = (values, uploadedImages) => {
  return {
    ad_title: values.adTitle || '',
    description: values.description || '',
    exterior_color: selectedColor || '',
    interior_color: selectedInteriorColor || '',
    trim: selectedTrim || '',
    regional_specs: selectedRegionalSpecs || '',
    body_type: selectedBodyType || '',
    vechile_type: selectedVehicleType || '',
    condition: selectedCondition || '',
    kilometers: values.kilometers || '',
    location: selectedRegion || '',
    year: selectedYear || '',
    warranty_date: values.warranty_date ? moment(values.warranty_date).format('YYYY-MM-DD') : '',
    accident_history: values.accident_history || 'NoAccidents',
    number_of_seats: selectedSeats || '',
    number_of_doors: selectedDoors || '',
    fuel_type: selectedFuelType || '',
    transmission_type: selectedTransmissionType || '',
    drive_type: selectedDriveType || '',
    engine_cc: values.engine_cc || '',
    horse_power: selectedHorsepower || '',
    make: make || '',
    model: selectedModel || '',
    price: selectedPrice || '',
    extra_features: selectedBadges || [],
    car_images: uploadedImages || [],
    is_whatsapp: values.is_whatsapp || false,
    draft: false,
    consumption: values.consumption || '',
    no_of_cylinders: selectedCylinders || ''
  };
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

  const filteredColors1 = updateData?.colours?.filter((opt) =>
    opt.colour?.toLowerCase().includes(colorSearch?.toLowerCase())
  );




  const handleEvaluateCar = () => {
     messageApi.open({
        type: 'success',
        content: 'Coming soon',
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
    const filteredList = newFileList?.filter((file) => {
      return (file.size || file.originFileObj?.size) / 1024 / 1024 < 5;
    });
    setMediaFileList(filteredList);
    form.setFieldsValue({ media: filteredList });
  };
  const beforeMediaUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must be smaller than 5MB!');
      return Promise.reject(new Error('File must be smaller than 5MB!'));
    }
    return Promise.resolve(true);
  };
  const mediaUploadButton = (
    <button 
      className="media-upload-button"
      type="button"
      aria-label="Add media file"
    >
      <PlusOutlined className="media-upload-icon" />
      <div className="media-upload-text">
        Add Media
      </div>
    </button>
  );

  return (
    <>
      <div className="page-header">
        {contextHolder}
        <div className="page-header-title">
          Sell Your Car In IRAQ
        </div>
        <div className="page-header-subtitle">Post an ad in just 3 simple steps</div>
      </div>
      <div className="sell-container">
        <Card
          title="Car Description"
          className="card-description"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            scrollToFirstError
            initialValues={{ condition: '', year: undefined }}
          >
            <Row gutter={24}>
              <Col xs={24} md={10}>
                <Form.Item
                  name="media"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      required: true,
                      message: 'Please add at least one media file!',
                    },
                  ]}
                >
                  {mediaFileList.length === 0 ? (
                    <div
                      className="custom-upload-area"
                      onClick={() =>
                        document.getElementById('hidden-upload-input').click()
                      }
                    >
                      <img
                        src={addMediaSvg}
                        alt="Add Media"
                        className="custom-upload-icon"
                      />
                      <Button
                        className="custom-upload-btn"
                        type="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          document
                            .getElementById('hidden-upload-input')
                            .click();
                        }}
                      >
                        Add Media
                      </Button>
                      <div className="custom-upload-info">
                        5MB maximum file size accepted in the following format :
                        jpg , jpeg, png, gif, mp4
                      </div>
                      <input
                        id="hidden-upload-input"
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.gif,.mp4"
                        className="hidden-input"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          const newFileList = files?.map((file, idx) => ({
                            uid: `${Date.now()}-${idx}`,
                            name: file.name,
                            status: 'done',
                            originFileObj: file,
                          }));
                          setMediaFileList(newFileList);
                          form.setFieldsValue({ media: newFileList });
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
    beforeUpload={(file, fileList) => {
      const totalFiles = mediaFileList.length + fileList.length;

      if (totalFiles > 15) {
        messageApi.error('We only accept up to 15 images.');
        return Upload.LIST_IGNORE; // ❌ Prevents adding extra files
      }

      return true; // ✅ Allow upload
    }}
    showUploadList={{
      showRemoveIcon: true,
      showPreviewIcon: true,
    }}
    multiple
    maxCount={15}
    accept=".jpg,.jpeg,.png,.gif,.mp4"
    customRequest={({ file, onSuccess }) => {
      setTimeout(() => onSuccess('ok'), 0);
    }}
  >
    {mediaFileList.length < 15 && mediaUploadButton}
  </Upload>

  {mediaFileList.length > 0 && (
    <div className="media-info-text">
      Tap on the images to edit them, or press, hold and move for reordering
    </div>
  )}

  {mediaPreviewImage && (
    <Image
      className="media-preview-hidden"
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
                  className="form-item-label"
                  label="Ad Title"
                  name="adTitle"
                >
                   <Input
    placeholder="Ad Title"
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
  label="Description"
  name="description"
>
  <div className="description-container">
    <TextArea
      rows={4}
      placeholder="Enter Description..."
      value={description} // ✅ Controlled by single state
      onChange={handleChange}
      onPaste={handlePaste}
    />
    {/* Live Counter */}
    <div className={`description-counter ${description.length === MAX_LEN ? 'max-length' : ''}`}>
      {description.length}/{MAX_LEN}
    </div>
  </div>
</Form.Item>

              </Col>
            </Row>

            <Card
              title="Enter Your Car Information"
              className="card-car-info"
            >
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
  className="no-asterisk form-item-label-small"
  label="Car Information"
  name="brand"
  rules={[
    {
      validator: (_, value) => {
        console.log('Car Information validation:', { selectedBrand, selectedModel, value });
        // Check if we have at least brand selected
        if (!selectedBrand) {
          return Promise.reject(new Error('Please select the car brand'));
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
    className="hidden-input"
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
  />
</Form.Item>

                  <Modal
                    open={brandModalOpen}
                    onCancel={() => setBrandModalOpen(false)}
                    footer={null}
                    title={
                      <div className="modal-title-row">
                        <span>What is the brand of your car? </span>
                      </div>
                    }
                    width={600}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="modal-search"
                    />
                    <div className="brand-modal-grid">
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
                              setSelectedBrand(opt.name);
                              setMake(opt.name);  
                              setBrandModalOpen(false);
                              // Update brand field with current model and trim
                              const parts = [opt.name];
                              if (selectedModel) parts.push(selectedModel);
                              if (selectedTrim) parts.push(selectedTrim);
                              form.setFieldsValue({ 
                                brand: parts.join(' - '),
                                brandImage: opt.image,
                              });
                              setSelectedBrandImage(opt.image);
                              setBrandNameOpen(true);
                            }}
                          >
                            <img
                              src={`${BASE_URL}${opt.image}`}
                              alt={opt.value}
                              className="brand-option-img"
                            />
                            <span className="brand-option-label">
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
                      <div className="modal-title-row">
                        <span>What is the Model of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="modal-search"
                    />
                    <div className="modal-list">
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
                    className="form-item-label"
                    label="Exterior Color"
                    name="exteriorColor"
                    rules={[
    { required: true, message: 'Please select exterior color!' },
  ]}
  required={false}
                  >
                    <ExteriorColorInput
                    selectedColor={selectedColor}
                    selectedColorImage={selectedColorImage}
                    onOpen={() => setColorModalOpen(true)}
                    placeholder="Beige"
                    BASE_URL={BASE_URL}
                  />
                  </Form.Item>
                  <Modal
                    open={colorModalOpen}
                    onCancel={() => setColorModalOpen(false)}
                    footer={null}
                    title={
                      <div className="modal-title-row">
                        <span>What is the exterior color of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      className="modal-search"
                    />
                    <div className="color-modal-grid">
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
                              className="color-swatch-modal"
                            />
                          <span className="color-option-label">
                            {opt.colour}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Modal>
                </Col>
                 <Col xs={24} md={6}>
                  <Form.Item
                    className="form-item-label-small"
                    label="Year"
                     name="year"
                     rules={[
    { required: true, message: 'Please select condition!' },
  ]}
  required={false}
                  >
                    <YearInput 
                      selectedYear={selectedYear}
                      onOpen={() => setYearModalOpen(true)}
                    />
                  </Form.Item>
                  <Modal
                    open={yearModalOpen}
                    onCancel={() => setYearModalOpen(false)}
                    footer={null}
                    title={
                      <div className="modal-title-row">
                        <span>What is the Year of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={yearSearch}
                      onChange={(e) => setYearSearch(e.target.value)}
                      className="modal-search"
                    />
                    <div className="modal-list-scrollable">
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
                    className="form-item-label"
                    label="Trim"
                    name="trim"
                  >
                    <TrimInput 
                      selectedTrim={selectedTrim}
                      onOpen={() => setTrimModalOpen(true)}
                    />
                  </Form.Item>
                  <Modal
                    open={trimModalOpen}
                    onCancel={() => setTrimModalOpen(false)}
                    footer={null}
                    title={
                      <div className="modal-title-row">
                        <span>What is the Trim of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={trimSearch}
                      onChange={(e) => setTrimSearch(e.target.value)}
                      className="modal-search"
                    />
                    <div className="modal-list">
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
                              // Update brand field with current brand, model, and trim
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
      className="form-item-label"
      label="Body Type"
      name="bodyType"
      rules={[
    { required: true, message: 'Please select body type!' },
  ]}
  required={false}
    >
      <Input
        value={selectedBodyType}
        className="hidden-input"
        readOnly
       
      />
      <div className="option-box-group">
        {updateData?.body_types?.map((opt) => (
          <div
            key={opt.body_type}
            className={`option-box${selectedBodyType === opt.body_type ? ' selected' : ''}`}
            onClick={() => {
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
      className="form-item-label"
      label="Condition"
      name="condition"
      rules={[
    { required: true, message: 'Please select condition!' },
  ]}
  required={false}
    >
      <Input
        value={selectedCondition}
        className="hidden-input"
        readOnly
      />
      <div className="option-box-group">
        {updateData?.car_conditions?.map((opt) => (
          <div
            key={opt.car_condition}
            className={`option-box${selectedCondition === opt.car_condition ? ' selected' : ''}`}
            onClick={() => {
              setSelectedCondition(opt.car_condition);
              form.setFieldsValue({ condition: opt.car_condition });
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
    className="form-item-label-large"
    label="Price"
    name="price"
    rules={[
      { required: true, message: 'Please enter the price' },
      {
        validator: (_, value) => {
          if (!value || Number(value) <= 1000) {
            return Promise.reject(new Error('Price must be greater than IQD 1000'));
          }
          return Promise.resolve();
        },
      },
    ]}
  >
    <Input
      className="custom-placeholder full-width-input"
      type="tel"
      inputMode="numeric"
      pattern="[0-9]*"
      value={
        selectedPrice
          ? selectedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : ''
      }
      placeholder="Enter price..."
      onChange={(e) => {
        const digitsOnly = (e.target.value || '').replace(/\D/g, '');
        const sanitizedValue = digitsOnly.replace(/^0+/, '');
        setSelectedPrice(sanitizedValue);
        form.setFieldsValue({ price: sanitizedValue });
      }}
    />
  </Form.Item>
</Col>

  <Col xs={24} md={6}>
    <Form.Item
      className="form-item-label"
      label="Horsepower (HP)"
      name="horsepower"rules={[
    { required: true, message: 'Please select horse power!' },
  ]}
  required={false}
    >
      <Select
        showSearch
        placeholder="Select horsepower"
        optionFilterProp="children"
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
                <Col xs={24} md={12}>
                  <Form.Item
                    className="form-item-label"
                    label="Badges"
                    name="badges"
                  >
                    <div className="option-box-group">
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
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    className="form-item-label"
                    label="Vehicle Type"
                    name="vehicletype"
                    rules={[
    { required: true, message: 'Please select vehicle type!' },
  ]}
  required={false}
                  >
                    <Select
        placeholder="Select vehicle type"
        value={selectedVehicleType || undefined}
        onChange={(val) => {
          setSelectedVehicleType(val);
          form.setFieldsValue({ vehicletype: val });
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
                    className="form-item-label-small"
                    label="Kilometers"
                    name="kilometers"
                    rules={[
    { required: true, message: 'Please enter kilometers!' },
    {
      validator: (_, value) => {
        if (!value || Number(value) <= 0) {
          return Promise.reject(new Error('Kilometers must be greater than 0'));
        }
        return Promise.resolve();
      },
    },
  ]}
  required={false}
                    validateTrigger="onBlur"
                  >
                      <Input
    className="full-width-input"
    type="tel"
    inputMode="numeric"
    pattern="[0-9]*"
    placeholder="Enter kilometers"
    onChange={(e) => {
      const digitsOnly = (e.target.value || '').replace(/\D/g, '');

      // Remove leading zeros to prevent entries like 0001
      const sanitizedValue = digitsOnly.replace(/^0+/, '');

      form.setFieldsValue({ kilometers: sanitizedValue });
    }}
  />
                  </Form.Item>
                </Col>
              
                <Col xs={24} md={6}>
                  <Form.Item
                    className="form-item-label-small"
                    label="Region"
                    name="region"
                    rules={[
    { required: true, message: 'Please select region!' },
  ]}
  required={false}
                  >
                    <RegionInput 
                      selectedRegion={selectedRegion}
                      onOpen={() => setRegionModalOpen(true)}
                    />
                  </Form.Item>
                  <Modal
                    open={regionModalOpen}
                    onCancel={() => setRegionModalOpen(false)}
                    footer={null}
                    title={
                      <div className="modal-title-row">
                        <span>Where is the Location of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={regionSearch}
                      onChange={(e) => setRegionSearch(e.target.value)}
                      className="modal-search"
                    />
                    <div className="modal-list-scrollable">
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
                    className="form-item-label-small"
                    label="Warranty Date (Optional)"
                    name="warrantyDate"
                  >
                    <DatePicker className="full-width-input" format="MM/DD/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    className="form-item-label-small"
                    label="Accident History"
                    name="accidentHistory"
                  >
                    <Select placeholder="Select The accident history of your car">
                      {updateData?.accident_histories?.map((hist) => (
                        <Option key={hist.id} value={hist.id}>
                          {hist.accident_history}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    className="form-item-label"
                    label="Regional Specs"
                     name="regionalSpecs"
                     rules={[
    { required: true, message: 'Please select regional specs!' },
  ]}
  required={false}
                  >
                    <RegionalSpecsInput 
                      selectedRegionalSpecs={selectedRegionalSpecs}
                      onOpen={() => setRegionalSpecsModalOpen(true)}
                    />
                  </Form.Item>
                  <Modal
                    open={regionalSpecsModalOpen}
                    onCancel={() => setRegionalSpecsModalOpen(false)}
                    footer={null}
                    title={
                      <div className="modal-title-row">
                        <span>What is the Regional Specs of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={regionalSpecsSearch}
                      onChange={(e) => setRegionalSpecsSearch(e.target.value)}
                      className="modal-search"
                    />
                    <div className="modal-list-scrollable">
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
            <Card title="Additional Details" className="card-additional-details">
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    className="form-item-label-small"
                    label="Number of seats"
                    name="seats"
                    rules={[
    { required: true, message: 'Please select number of seats!' },
  ]}
  required={false}
                  >
                    <Input
                      value={selectedSeats}
                      className="hidden-input"
                      readOnly
                    />
                    <div className="option-box-group">
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
                    className="form-item-label-small"
                    label="Number of doors"
                    name="doors"
                  >
                    <div className="option-box-group">
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
                    className="form-item-label-small"
                    label="Fuel Type"
                    name="fuelType"
                    rules={[
    { required: true, message: 'Please select fuel type!' },
  ]}
  required={false}
                  >
                    <Input
                      value={selectedFuelType}
                      className="hidden-input"
                      readOnly
                    />
                    <div className="option-box-group">
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
                    className="form-item-label-small"
                    label="Transmission Type"
                    name="transmissionType"
                    rules={[
    { required: true, message: 'Please select transmission type!' },
  ]}
  required={false}
                  >
                    <Input
                      value={selectedTransmissionType}
                      className="hidden-input"
                      readOnly
                    />
                    <div className="option-box-group">
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
                    className="form-item-label-small"
                    label="Drive Type"
                    name="driveType"
                  >
                    <div className="option-box-group">
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
    className="form-item-label-small"
    label="Engine CC"
    name="engineCC"
  >
    <Input
      className="input-font-14"
      placeholder="Enter Engine CC..."
      type="tel"
      inputMode="numeric"
      pattern="[0-9]*"
      onChange={(e) => {
        const digitsOnly = (e.target.value || '').replace(/\D/g, '');
        form.setFieldsValue({ engineCC: digitsOnly }); // ✅ Correct field updated
      }}
      onPaste={(e) => {
        const pasted = (e.clipboardData?.getData('Text') || '');
        const digitsOnly = pasted.replace(/\D/g, '');
        if (digitsOnly !== pasted) {
          e.preventDefault();
          const current = form.getFieldValue('engineCC') || ''; // ✅ Correct field
          form.setFieldsValue({ engineCC: `${current}${digitsOnly}` });
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

 <Col xs={24} md={6}>
  <Form.Item
    className="form-item-label-small"
    label="Consumption"
    name="consumption"
  >
    <Input
      className="input-font-14"
      placeholder="Enter Consumption..."
      type="tel"
      inputMode="numeric"
      pattern="[0-9]*"
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
                    className="form-item-label-small"
                    label="Extra Features"
                    name="extraFeatures"
                  >
                    <Select mode="multiple" 
                      placeholder="Choose"
                      allowClear 
                       optionFilterProp="children"
                      showSearch   >
                      {updateData?.extra_features?.map((int1) => (
                        <Option key={int1.id} value={int1.extra_feature}>
                          {int1.extra_feature}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    className="form-item-label-small"
                    label="Interior"
                    name="interior"
                  >
                    <Select placeholder="Choose"
                     value={selectedInterior || undefined}
                    onChange={(val) => {
                   setSelectedInterior(val);
                   form.setFieldsValue({ horsepower: val });
                   }}>
                      {updateData?.interiors?.map((int) => (
                        <Option key={int.id} value={int.interior}>
                          {int.interior}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                 <Col xs={24} md={6}>
                  <Form.Item
                    className="form-item-label"
                    label="Interior Color"
                    name="interiorColor"
                  >
                    <InteriorColorInput 
                      selectedInteriorColor={selectedInteriorColor}
                      onOpen={() => setColorModalOpenInterior(true)}
                    />
                  </Form.Item>
                  <Modal
                    open={colorModalOpenInterior}
                    onCancel={() => setColorModalOpenInterior(false)}
                    footer={null}
                    title={
                      <div className="modal-title-row">
                        <span>What is the interior color of your car?</span>
                      </div>
                    }
                    width={500}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      placeholder="Search By Typing"
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      className="modal-search"
                    />
                    <div className="color-modal-grid">
                      {filteredColors1?.map((opt) => (
                        <div
                          key={opt.colour}
                          className={`color-option${
                            selectedInteriorColor === opt.colour ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedInteriorColor(opt.colour);
                            setColorModalOpenInterior(false);
                            form.setFieldsValue({ exteriorColor: opt.colour });
                          }}
                        > 
                          <img
                              src={`${BASE_URL}${opt.colour_image}`}
                              alt={opt.value}
                              className="color-swatch-modal"
                            />
                          <span className="color-option-label">
                            {opt.colour}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Modal>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={18}>
                  <Form.Item
                    className="form-item-label-small"
                    label="Number of Cylinders"
                    name="cylinders"
                  >
                    <div className="option-box-group">
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
            <Form.Item className="form-item-margin-top">
              <div className="submit-btn-group">
                {extras && extras.id ? (
                  // Update mode - show Update Car button
                  <Button
                    className={`btn-update-car ${loading ? '' : 'enabled'}`}
                    size="small"
                    type="primary"
                    onClick={handleUpdateCar}
                    disabled={loading}
                  >
                    Update Car
                  </Button>
                ) : (
                  // Create mode - show original buttons
                  <>
                    <Button
                      size="small"
                      className="btn-outline-blue"
                      onClick={handleEvaluateCar}
                      type="default"
                    >
                      Evaluate Car
                    </Button>

                    <Button
                      size="small"
                      className="btn-outline-blue"
                      onClick={() => handleFinish('draft')}
                      type="default"
                    >
                      Save as draft
                    </Button>
                    <Button
                      className={`btn-create ${loading ? '' : 'enabled btn-solid-blue'}`}
                      size="small"
                      type="primary"
                      htmlType="submit"
                      disabled={loading}
                    >
                      Create
                    </Button>
                    <Button
                      size="small"
                      className="btn-solid-blue"
                      type="submit"
                    >
                      Create & New
                    </Button>
                  </>
                )}
              </div>
            </Form.Item>
          </Form>
        </Card>
        {/* Conditionally render the modal */}
      {showModal && <CarPostingModal onClose={() => setShowModal(false)} handleAddNew={handleAddNew} />}
      </div>
    </>
  );
};

export default Sell;