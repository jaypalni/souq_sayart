/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import mercedesImg from '../assets/images/mercedes.png';
import miniImg from '../assets/images/mini.png';
import bmwImg from '../assets/images/bmw.png';
import hummerImg from '../assets/images/hummer.png';
import lamborghiniImg from '../assets/images/lamborghini.png';
import addMediaSvg from '../assets/images/addMedia.svg';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { fetchMakeCars, fetchModelCars } from '../commonFunction/fetchMakeCars';

const { TextArea } = Input;
const { Option } = Select;

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
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [make, setMake] = useState('');
  const [yearData, setYearData] = useState([]);
  const [horsePower, setHorsePower] = useState([]);
  const [trimData, setTrimData] = useState([]);
  const [updateData, setUpdateData] = useState();
  const [,setAddData] = useState();
  const [,setDraftData] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [colorModalOpenInterior, setColorModalOpenInterior] = useState(false);
  const [colorSearch, setColorSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState();
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
  const [createSelecetd, setCreateSelecetd] = useState('');
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

const handlePostData = async (text) => {
  try {
    const values = await form.validateFields();
    const formData = new FormData();
    formData.append('make', make || '');
    formData.append('model', modalName || '');
    formData.append('year', selectedYear || '');
    formData.append('price', values.price || '');
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
    formData.append('warranty_date', values?.warrantyDate || '');
    formData.append('accident_history', values?.accidentHistory || '');
    formData.append('number_of_seats', values?.seats || '');
    formData.append('number_of_doors', values?.doors || '');
    formData.append('drive_type', values?.driveType || '');
    formData.append('engine_cc', values?.engineCC || '');
   formData.append('extra_features', JSON.stringify(values?.extraFeatures || []));
    formData.append('consumption', values?.consumption || '');
    formData.append('no_of_cylinders', values?.cylinders || '');
    formData.append('horse_power', values?.horsepower || '');
    formData.append('payment_option', '');
    formData.append('draft', '');

    // ✅ Append actual files
    // if (values.media && values.media.length > 0) {
    //   values.media.forEach((file) => {
    //     const fileObj = file.originFileObj || file;
    //     console.log('Uploading file:', fileObj);

    //     if (fileObj instanceof File) {
    //       formData.append('car_image[]', fileObj); // or 'car_image' depending on API
    //     } else {
    //       console.error('Invalid file detected:', fileObj);
    //     }
    //   });
    // } else {
    //   console.error('No files found in values.media');
    // }

    // // Debugging
    // console.log('Final FormData:');
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    const imageUrls = [
      '/api/search/upload-attachment/bmw_logo_20250905_122011_ce396f74.png',
    ];
    imageUrls.forEach((url) => {
      formData.append('car_images[]', url); 
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setLoading(true);

    const response = await carAPI.createCar(formData);
    const data1 = handleApiResponse(response);

    console.log('API Response:', data1);

    if (data1) {
      setAddData(data1?.data);
    }

    if (text === '1') {
      navigate('/landing');
    } else {
      form.resetFields();
    }

    messageApi.open({
      type: 'success',
      content: typeof data1.message === 'object'
        ? JSON.stringify(data1.message)
        : data1.message,
    });

  } catch (error) {
    const errorData = handleApiError(error);
    messageApi.open({
      type: 'error',
      content: typeof errorData === 'object'
        ? JSON.stringify(errorData)
        : errorData,
    });
    setAddData([]);
  } finally {
    setLoading(false);
  }
};


  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleFinish = (values) => {
    const images = values.media?.map((file) => file.originFileObj);
     handlePostData(createSelecetd)

    message.success('Form submitted! Check console for output.');
  };

  const ExteriorColorInput = () => (
    <div
      className={`exterior-color-input${!selectedColor ? ' placeholder' : ''}`}
      onClick={() => setColorModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedColor || 'Beige'}
      </span>
      <RightOutlined className="color-arrow" />
    </div>
  );

  const InteriorColorInput = () => (
    <div
      className={`exterior-color-input${!selectedInteriorColor ? ' placeholder' : ''}`}
      onClick={() => setColorModalOpenInterior(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedInteriorColor || 'Beige'}
      </span>
      <RightOutlined className="color-arrow" />
    </div>
  );

  const filteredColors = updateData?.colours?.filter((opt) =>
    opt.colour?.toLowerCase().includes(colorSearch?.toLowerCase())
  );

  const filteredColors1 = updateData?.interior_colours?.filter((opt) =>
    opt.interior_colour?.toLowerCase().includes(colorSearch?.toLowerCase())
  );

  const TrimInput = () => (

    <div
      className={`trim-input${!selectedTrim ? ' placeholder' : ''}`}
      onClick={() => setTrimModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedTrim || 'B200'}
      </span>
      <RightOutlined className="trim-arrow" />
    </div>
  );

const BrandInput = () => {
  const selectedBrandObj = brandOptions.find((b) => b.value === selectedBrand);

  const imageSrc =
    selectedBrandObj?.image
      ? `${BASE_URL}${selectedBrandObj.image}`
      : selectedBrandImage
      ? `${BASE_URL}${selectedBrandImage}`
      : null;

  return (
    <div
      className={`brand-input${!selectedBrand ? ' placeholder' : ''}`}
      onClick={() => setBrandModalOpen(true)}
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={selectedBrand || 'brand'}
          className="brand-input-img"
          style={{
            width: 32,
            height: 32,
            objectFit: 'contain',
          }}
        />
      )}

      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {selectedBrand
          ? `${selectedBrand}${selectedModel ? ' - ' + selectedModel : ''}`
          : 'brand and model of your car'}
      </span>

      <RightOutlined className="brand-arrow" style={{ marginLeft: 'auto' }} />
    </div>
  );
};



  const YearInput = () => (
    <div
      className={`year-input${!selectedYear ? ' placeholder' : ''}`}
      onClick={() => setYearModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedYear || '2023'}
      </span>
      <RightOutlined className="year-arrow" />
    </div>
  );

  const RegionInput = () => (
    <div
      className={`region-input${!selectedRegion ? ' placeholder' : ''}`}
      onClick={() => setRegionModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedRegion || 'Select Region'}
      </span>
      <RightOutlined className="region-arrow" />
    </div>
  );

  const RegionalSpecsInput = () => (
    <div
      className={`regionalspecs-input${
        !selectedRegionalSpecs ? ' placeholder' : ''
      }`}
      onClick={() => setRegionalSpecsModalOpen(true)}
    >
      <span
        style={{
          fontSize: 14,
        }}
      >
        {selectedRegionalSpecs || 'Select Specs'}
      </span>
      <RightOutlined className="regionalspecs-arrow" />
    </div>
  );

  const handleEvaluateCar = () => {
    message.info('Evaluate Car clicked');
  };
  
  const handleSaveDraft = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', modalName);
    formData.append('year', selectedYear);
    formData.append('price', '');
    formData.append('description', values?.description);
    formData.append('ad_title', values?.adTitle);
    formData.append('exterior_color', selectedColor);
    formData.append('mileage', values?.kilometers);
    formData.append('fuel_type', values?.fuelType);
    formData.append('transmission_type', values?.transmissionType);
    formData.append('body_type', values?.bodyType);
    formData.append('condition', values?.condition);
    formData.append('location', selectedRegion);
    formData.append('interior', values?.interior);
    formData.append('trim', selectedTrim);
    formData.append('regional_specs', selectedRegionalSpecs);
    formData.append('badges', values?.badges);
    formData.append('warranty_date', values?.warrantyDate);
    formData.append('accident_history', values?.accidentHistory);
    formData.append('number_of_seats', values?.seats);
    formData.append('number_of_doors', values?.doors);
    formData.append('drive_type', values?.driveType);
    formData.append('engine_cc', values?.engineCC);
    formData.append('extra_features', values?.extraFeatures);
    formData.append('consumption', values?.consumption);
    formData.append('no_of_cylinders', values?.cylinders);
    formData.append('payment_option', '');
    formData.append('draft', '');

    values.media?.forEach((file) => {
      // formData.append('car_image', file.originFileObj);
      formData.append('car_images', ['/api/search/upload-attachment/Screenshot_3_20250909_093054_ea3e7016.png'])
    });
    try {
      setLoading(true);
      const response = await carAPI.saveDraftCar(formData);
      const data1 = handleApiResponse(response);

      if (data1) {
        setDraftData(data1);
      }

      message.success(data1.message || 'Saved Draft Data successfully');
      navigate('/landing');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to Save Draft car data');
      setDraftData([]);
    } finally {
      setLoading(false);
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
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
      return Promise.reject();
    }
    return true;
  };
  const mediaUploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined style={{ fontSize: 32, color: '#1890ff' }} />
      <div
        style={{
          marginTop: 8,
          fontWeight: 500,
          color: '#008AD5',
          fontSize: 16,
        }}
      >
        Add Media
      </div>
    </button>
  );

  return (
    <>
      <div className="page-header">
        {contextHolder}
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          Sell Your Car In IRAQ
        </div>
        <div style={{ fontSize: 11 }}>Post an ad in just 3 simple steps</div>
      </div>
      <div className="sell-container">
        <Card
          title="Car Description"
          style={{
            borderRadius: 8,
            boxShadow: '0 2px 8px #f0f1f2',
            marginBottom: 24,
            border: '1px solid #e5e6e8',
            padding: 24,
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            scrollToFirstError
            initialValues={{ condition: '', year: new Date().getFullYear() }}
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
                        style={{ display: 'none' }}
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
                        beforeUpload={beforeMediaUpload}
                        showUploadList={{
                          showRemoveIcon: true,
                          showPreviewIcon: true,
                        }}
                        multiple
                        maxCount={8}
                        accept=".jpg,.jpeg,.png,.gif,.mp4"
                        customRequest={({ file, onSuccess }) =>
                          setTimeout(() => onSuccess('ok'), 0)
                        }
                      >
                        {mediaFileList.length < 8 && mediaUploadButton}
                      </Upload>
                      {mediaFileList.length > 0 && (
                        <div
                          className="media-info-text"
                          style={{ marginTop: '8px', color: '#666' }}
                        >
                          Tap on the images to edit them, or press, hold and
                          move for reordering{' '}
                        </div>
                      )}
                      {mediaPreviewImage && (
                        <Image
                          wrapperStyle={{ display: 'none' }}
                          preview={{
                            visible: mediaPreviewOpen,
                            onVisibleChange: (visible) =>
                              setMediaPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setMediaPreviewImage(''),
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
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#0A0A0B',
                  }}
                  label="Ad Title"
                  name="adTitle"
                >
                  <Input placeholder="Ad Title" />
                </Form.Item>
                <Form.Item
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#0A0A0B',
                  }}
                  label="Description"
                  name="description"
                >
                  <TextArea rows={4} placeholder="Choose" />
                </Form.Item>
              </Col>
            </Row>

            <Card
              title="Enter Your Car Information"
              style={{
                marginTop: 15,
                marginBottom: 32,
                padding: 24,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Car Information"
                    name="brand"
                  >
                    <BrandInput />
                  </Form.Item>
                  <Modal
                    open={brandModalOpen}
                    onCancel={() => setBrandModalOpen(false)}
                    footer={null}
                    title={
                      <div className="brand-modal-title-row">
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
                      className="brand-modal-search"
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
                              form.setFieldsValue({ brand: opt.name,brandImage: opt.image, });
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
                      <div className="trim-modal-title-row">
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
                      className="trim-modal-search"
                    />
                    <div className="trim-modal-list">
                      {carModels
                        ?.filter((opt) =>
                          opt.model_name
                            .toLowerCase()
                            .includes(trimSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.model_name}
                            className={`trim-modal-option${
                              selectedModel === opt.model_name
                                ? ' selected'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedModel(opt.model_name);
                              setModalName(opt.model_name);
                              form.setFieldsValue({ trim: opt.model_name });
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
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: '#0A0A0B',
                    }}
                    label="Exterior Color"
                    name="exteriorColor"
                    required={false}
                    rules={[{ required: true, message: 'Please select the Exterior Color' }]}
                  >
                    <ExteriorColorInput />
                  </Form.Item>
                  <Modal
                    open={colorModalOpen}
                    onCancel={() => setColorModalOpen(false)}
                    footer={null}
                    title={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
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
                      style={{ marginBottom: 16, borderRadius: 8 }}
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
                          }}
                        >
                          <span
                            className="color-swatch-modal"
                            style={{
                              background: opt.color,
                              border: opt.border || '1px solid #d9d9d9',
                            }}
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Year"
                    name="year"
                     required={false}
                     rules={[{ required: true, message: 'Please select the Year' }]}
                  >
                    <YearInput />
                  </Form.Item>
                  <Modal
                    open={yearModalOpen}
                    onCancel={() => setYearModalOpen(false)}
                    footer={null}
                    title={
                      <div className="year-modal-title-row">
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
                      className="year-modal-search"
                    />
                    <div className="year-modal-list">
                      {yearData
                        ?.filter((opt) => opt.year.includes(yearSearch))
                        ?.map((opt) => (
                          <div
                            key={opt.year}
                            className={`year-modal-option${
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
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: '#0A0A0B',
                    }}
                    label="Trim"
                    name="trim"
                  >
                    <TrimInput />
                  </Form.Item>
                  <Modal
                    open={trimModalOpen}
                    onCancel={() => setTrimModalOpen(false)}
                    footer={null}
                    title={
                      <div className="trim-modal-title-row">
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
                      className="trim-modal-search"
                    />
                    <div className="trim-modal-list">
                      {trimData
                        ?.filter((opt) =>
                          opt?.trim_name
                            ?.toLowerCase()
                            ?.includes(trimSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.trim_name}
                            className={`trim-modal-option${
                              selectedTrim === opt.value ? ' selected' : ''
                            }`}
                            onClick={() => {
                              setSelectedTrim(opt.trim_name);
                              setTrimModalOpen(false);
                              form.setFieldsValue({ trim: opt.trim_name });
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
      style={{
        fontWeight: 500,
        fontSize: 12,
        color: '#0A0A0B',
      }}
      label="Body Type"
      name="bodyType"
      required={false}
      rules={[{ required: true, message: 'Please select the Body Type' }]}
    >
      <div className="option-box-group">
        {updateData?.body_types.map((opt) => (
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
      style={{
        fontWeight: 500,
        fontSize: 12,
        color: '#0A0A0B',
      }}
      label="Condition"
      name="condition"
      required={false}
      rules={[{ required: true, message: 'Please select the car condition' }]}
    >
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
      style={{
        fontWeight: 500,
        fontSize: 12,
        color: '#0A0A0B',
      }}
      label="Price"
      name="price"
      required={false}
      rules={[{ required: true, message: 'Please select the Price' }]}
    >
     <Input
  style={{ width: '100%' }}
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  value={selectedPrice ? selectedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
  placeholder="Enter price"
  onChange={(e) => {
    const digitsOnly = (e.target.value || '').replace(/\D/g, '');
    // optionally enforce a max length: digitsOnly.slice(0, 10)
    setSelectedPrice(digitsOnly);
    form.setFieldsValue({ price: digitsOnly });
  }}
/>

    </Form.Item>
  </Col>

  <Col xs={24} md={6}>
    <Form.Item
      style={{
        fontWeight: 500,
        fontSize: 12,
        color: '#0A0A0B',
      }}
      label="Horsepower (HP)"
      name="horsepower"
     required={false}
     rules={[{ required: true, message: 'Please select the Horse Power' }]}
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
        {horsePower.map((hp) => (
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
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: '#0A0A0B',
                    }}
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
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: '#0A0A0B',
                    }}
                    label="Vehicle Type"
                    name="vehicletype"
                    required={false}
                    rules={[{ required: true, message: 'Please select the Vehicle Type' }]}
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
              <Option key={hp1.id} value={hp1.id}>
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Kilometers"
                    name="kilometers"
                    rules={[
                      { required: true, message: 'Please enter kilometers!' },
                    ]}
                    required={false}
                    validateTrigger="onBlur"
                  >
                     <Input
    style={{ fontSize: 14 }}
    placeholder="20"
    type="tel"
    inputMode="numeric"
    pattern="[0-9]*"
    onChange={(e) => {
      // strip any non-digit characters
      const digitsOnly = (e.target.value || '').replace(/\D/g, '');
      form.setFieldsValue({ consumption: digitsOnly });
    }}
    onPaste={(e) => {
      const pasted = (e.clipboardData?.getData('Text') || '');
      const digitsOnly = pasted.replace(/\D/g, '');
      if (digitsOnly !== pasted) {
        // prevent messy paste and insert cleaned digits
        e.preventDefault();
        const current = form.getFieldValue('consumption') || '';
        form.setFieldsValue({ consumption: `${current}${digitsOnly}` });
      }
    }}
    onKeyDown={(e) => {
      // allow navigation / control keys
      const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
      if (allowed.includes(e.key)) return;
      // block non-digit keys
      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    }}
  />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: '#0A0A0B',
                    }}
                    label="Regional Specs"
                    name="regionalSpecs"
                     required={false}
                     rules={[{ required: true, message: 'Please select the Regional Specs'}]}
                  >
                    <RegionalSpecsInput />
                  </Form.Item>
                  <Modal
                    open={regionalSpecsModalOpen}
                    onCancel={() => setRegionalSpecsModalOpen(false)}
                    footer={null}
                    title={
                      <div className="regionalspecs-modal-title-row">
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
                      className="regionalspecs-modal-search"
                    />
                    <div className="regionalspecs-modal-list">
                      {updateData?.regional_specs
                        ?.filter((opt) =>
                          opt?.regional_spec
                            ?.toLowerCase()
                            ?.includes(regionalSpecsSearch.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt.regional_spec}
                            className={`regionalspecs-modal-option${
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
              
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Region"
                    name="region"
                    required={false}
                    rules={[{ required: true, message: 'Please select the Region' }]}
                  >
                    <RegionInput />
                  </Form.Item>
                  <Modal
                    open={regionModalOpen}
                    onCancel={() => setRegionModalOpen(false)}
                    footer={null}
                    title={
                      <div className="region-modal-title-row">
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
                      className="region-modal-search"
                    />
                    <div className="region-modal-list">
                      {updateData?.locations
                        ?.filter((opt) =>
                          opt?.location
                            ?.toLowerCase()
                            ?.includes(regionSearch?.toLowerCase())
                        )
                        ?.map((opt) => (
                          <div
                            key={opt?.location}
                            className={`region-modal-option${
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Warranty Date (Optional)"
                    name="warrantyDate"
                  >
                    <DatePicker style={{ width: '100%' }} format="MM/DD/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Regional Specs"
                    name="regionalSpecs2"
                     required={false}
                     rules={[{ required: true, message: 'Please select the Regional Specs' }]}
                  >
                    <Select placeholder="Select the specs of your car">
                      {updateData?.regional_specs?.map((spec) => (
                        <Option key={spec.id} value={spec.id}>
                          {spec.regional_spec}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="Additional Details" style={{ padding: ' 0px 24px' }}>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Number of seats"
                    name="seats"
                    required={false}
                    rules={[{ required: true, message: 'Please select the Seats' }]}
                  >
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Fuel Type"
                    name="fuelType"
                    required={false}
                    rules={[{ required: true, message: 'Please select the Fuel Type' }]}
                  >
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Transmission Type"
                    name="transmissionType"
                    required={false}
                    rules={[{ required: true, message: 'Please select the Transmission Type' }]}
                  >
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Engine CC"
                    name="engineCC"
                  >
                     <Input
    style={{ fontSize: 14 }}
    placeholder="20"
    type="tel"
    inputMode="numeric"
    pattern="[0-9]*"
    onChange={(e) => {
      // strip any non-digit characters
      const digitsOnly = (e.target.value || '').replace(/\D/g, '');
      form.setFieldsValue({ consumption: digitsOnly });
    }}
    onPaste={(e) => {
      const pasted = (e.clipboardData?.getData('Text') || '');
      const digitsOnly = pasted.replace(/\D/g, '');
      if (digitsOnly !== pasted) {
        // prevent messy paste and insert cleaned digits
        e.preventDefault();
        const current = form.getFieldValue('consumption') || '';
        form.setFieldsValue({ consumption: `${current}${digitsOnly}` });
      }
    }}
    onKeyDown={(e) => {
      // allow navigation / control keys
      const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
      if (allowed.includes(e.key)) return;
      // block non-digit keys
      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    }}
  />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
  style={{
    fontWeight: 500,
    fontSize: 10,
    color: '#0A0A0B',
  }}
  label="Consumption (1/100 km)"
  name="consumption"
>
  <Input
    style={{ fontSize: 14 }}
    placeholder="20"
    type="tel"
    inputMode="numeric"
    pattern="[0-9]*"
    onChange={(e) => {
      // strip any non-digit characters
      const digitsOnly = (e.target.value || '').replace(/\D/g, '');
      form.setFieldsValue({ consumption: digitsOnly });
    }}
    onPaste={(e) => {
      const pasted = (e.clipboardData?.getData('Text') || '');
      const digitsOnly = pasted.replace(/\D/g, '');
      if (digitsOnly !== pasted) {
        // prevent messy paste and insert cleaned digits
        e.preventDefault();
        const current = form.getFieldValue('consumption') || '';
        form.setFieldsValue({ consumption: `${current}${digitsOnly}` });
      }
    }}
    onKeyDown={(e) => {
      // allow navigation / control keys
      const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
      if (allowed.includes(e.key)) return;
      // block non-digit keys
      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    }}
  />
                  </Form.Item>
 
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Extra Features"
                    name="extraFeatures"
                  >
                    <Select mode="multiple" 
                      placeholder="Choose"
                      allowClear 
                       optionFilterProp="children"
                      showSearch   >
                      {updateData?.extra_features?.map((int1) => (
                        <Option key={int1.id} value={int1.id}>
                          {int1.extra_feature}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
                    label="Interior"
                    name="interior"
                  >
                    <Select placeholder="Choose">
                      {updateData?.interiors?.map((int) => (
                        <Option key={int.id} value={int.id}>
                          {int.interior}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                 <Col xs={24} md={6}>
                  <Form.Item
                    style={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: '#0A0A0B',
                    }}
                    label="Interior Color"
                    name="interiorColor"
                  >
                    <InteriorColorInput />
                  </Form.Item>
                  <Modal
                    open={colorModalOpenInterior}
                    onCancel={() => setColorModalOpenInterior(false)}
                    footer={null}
                    title={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
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
                      style={{ marginBottom: 16, borderRadius: 8 }}
                    />
                    <div className="color-modal-grid">
                      {filteredColors1?.map((opt) => (
                        <div
                          key={opt.interior_colour}
                          className={`color-option${
                            selectedInteriorColor === opt.interior_colour ? ' selected' : ''
                          }`}
                          onClick={() => {
                            setSelectedInteriorColor(opt.interior_colour);
                            setColorModalOpenInterior(false);
                            form.setFieldsValue({ exteriorColor: opt.interior_colour });
                          }}
                        >
                          <span
                            className="color-swatch-modal"
                            style={{
                              background: opt.color,
                              border: opt.border || '1px solid #d9d9d9',
                            }}
                          />
                          <span className="color-option-label">
                            {opt.interior_colour}
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
                    style={{
                      fontWeight: 500,
                      fontSize: 10,
                      color: '#0A0A0B',
                    }}
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
            <Form.Item style={{ marginTop: 16 }}>
              <div className="submit-btn-group">
                <Button
                  size="small"
                  className="btn-outline-blue"
                  onClick={() => handleEvaluateCar}
                  type="default"
                >
                  Evaluate Car
                </Button>
                <Button
                  size="small"
                  className="btn-outline-blue"
                  onClick={() => handleSaveDraft}
                  type="default"
                >
                  Save as draft
                </Button>
                <Button
                style={{
                background: loading ? '#ccc' : '#0090d4',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '2px 52px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontSize: 14,
                opacity: loading ? 0.7 : 1,
              }}
                  size="small"
                  className="btn-solid-blue"
                  type="primary"
                  htmlType="submit"
                  onClick={() => setCreateSelecetd('1')}
                  disabled={loading}
                >
                  Create
                </Button>
                <Button
                  size="small"
                  className="btn-solid-blue"
                  onClick={() => setCreateSelecetd('2')}
                  type="submit"
                >
                  Create & New
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Sell;