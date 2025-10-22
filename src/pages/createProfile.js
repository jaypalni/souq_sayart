/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Typography,
  message,
  Switch,
  Upload,
  Modal,
} from 'antd';
import { PlusCircleFilled, UserOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { registerUser } from '../redux/actions/authActions';
import whatsappIcon from '../assets/images/Whatsup.svg';
import TermsAndconditions from './termsAndconditions';
import dayjs from 'dayjs';
import { usePhoneNumber } from '../hooks/usePhoneNumber';
import { useToken } from '../hooks/useToken';
import { useLanguage } from '../contexts/LanguageContext';



const { Title, Text } = Typography;

const CreateProfile = () => {
  const { translate } = useLanguage();
  const dispatch = useDispatch();
  const [isDealer, setIsDealer] = useState(false);
  const [form] = Form.useForm();
  const [dobError, setDobError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [checked, setChecked] = useState(false);
  const [uploadedDocUrl, setUploadedDocUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const [messageApi, contextHolder] = message.useMessage();
   const { customerDetails } = useSelector((state) => state.customerDetails);
   const { phoneNumber: phoneFromRedux } = useSelector(state => state.auth);
   const phoneNumber = usePhoneNumber();
   const token = useToken();
  const isLoggedIn = customerDetails;
  
  // Get phone number from Redux sources (primary) with minimal localStorage fallback
  const phoneFromUser = customerDetails?.phone_number;
  
  // Minimal localStorage fallback only if Redux is empty
  const phoneFromLocalStorage = (!phoneFromRedux && !phoneFromUser) ? 
    (localStorage.getItem('phone_number') || localStorage.getItem('phonenumber')) : null;
  
  // Use Redux sources first, then minimal fallback
  const phoneToUse = phoneFromRedux || phoneFromUser || phoneFromLocalStorage;
  
  // Check if phone number is valid
  const isPhoneNumberValid = phoneToUse && phoneToUse !== 'unknown' && phoneToUse !== 'undefined';
  
  console.log('CreateProfile phone number sources:', {
    phoneFromRedux,
    phoneNumber,
    phoneFromUser,
    phoneFromLocalStorage,
    phoneToUse
  });
  
  // Debug Redux state
  console.log('CreateProfile Redux state:', {
    auth: useSelector(state => state.auth),
    customerDetails: useSelector(state => state.customerDetails)
  });
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Only redirect if user is already registered (has complete profile)
    // Don't redirect if coming from OTP verification for unregistered users
    const fromOtpVerification = localStorage.getItem('fromOtpVerification');
    const isUserRegistered = customerDetails?.is_registered === true;
    
    console.log('CreateProfile useEffect - isLoggedIn:', isLoggedIn);
    console.log('CreateProfile useEffect - fromOtpVerification:', fromOtpVerification);
    console.log('CreateProfile useEffect - isUserRegistered:', isUserRegistered);
    console.log('CreateProfile useEffect - customerDetails:', customerDetails);
    
    if (isLoggedIn && isUserRegistered && !fromOtpVerification) {
      console.log('User is already registered, redirecting to landing');
      navigate('/landing');
    } else {
      console.log('User needs to complete profile, staying on createProfile page');
    }
    
    // Cleanup function to clear flag when component unmounts
    return () => {
      // Only clear if user navigates away without completing registration
      // (This will be overridden by successful registration)
      const timeoutId = setTimeout(() => {
        localStorage.removeItem('fromOtpVerification');
      }, 100);
      
      return () => clearTimeout(timeoutId);
    };
  }, []);
  useEffect(() => {
    const accesstoken = token;
    if (
      accesstoken === 'undefined' ||
      accesstoken === '' ||
      accesstoken === null
    ) {
      navigate('/');
    }
  });

  const handleChange = (value) => {
    setChecked(value);
  };

  const onFinish = (values) => {
    if (!values.isDealer) {
      delete values.companyName;
      delete values.ownerName;
      delete values.companyAddress;
      delete values.phoneNumber;
      delete values.companyCR;
      delete values.facebookPage;
      delete values.instagramProfile;
      delete values.uploadDocuments;
    }
    setDobError('');
    message.success('Form submitted successfully!');
  };

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // ✅ Correct validation for allowed file types - only PDF documents
  const allowedTypes = ['application/pdf'];
  const isAllowedType = allowedTypes.includes(file.type);

  if (!isAllowedType) {
    messageApi.open({
      type: 'error',
      content: translate('createProfile.UPLOAD_FAILED_PDF_ONLY'),
    });
    return;
  }

  // ✅ Check file size (10 MB max)
  const isLt10M = file.size / 1024 / 1024 <= 10;
  if (!isLt10M) {
    messageApi.open({
      type: 'error',
      content: translate('createProfile.DOCUMENT_SIZE_LIMIT'),
    });
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('attachment', file);

    const carResponse = await authAPI.uploadimages(formData);
    const userdoc = handleApiResponse(carResponse);

    if (userdoc?.attachment_url) {
      setUploadedDocUrl(userdoc.attachment_url);
      form.setFieldsValue({ uploadedImageUrl: userdoc.attachment_url });
      messageApi.open({
        type: 'success',
        content: userdoc.message,
      });
    }
  } catch (error) {
    if (error?.message === 'Network Error') {
                messageApi.open({
                  type: 'error',
                  content: translate('filters.OFFLINE_ERROR'),
                });
              }else{
                 const errorData = handleApiError(error);
    messageApi.open({
      type: 'error',
      content: errorData.message,
    });
              }
  } finally {
    setLoading(false);
  }
};



  const handleBeforeUpload = async (file) => {
  const isImage =
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg';

  if (!isImage) {
    messageApi.open({
      type: 'error',
      content: translate('createProfile.UPLOAD_FAILED_IMAGE_ONLY'),
    });
    return Upload.LIST_IGNORE;
  }

  // Check file size (5 MB max for profile images)
  const isLt5M = file.size / 1024 / 1024 <= 5;
  if (!isLt5M) {
    messageApi.open({
      type: 'error',
      content: translate('createProfile.PROFILE_IMAGE_SIZE_LIMIT'),
    });
    return Upload.LIST_IGNORE;
  }

  const previewUrl = URL.createObjectURL(file);
  setImageUrl(previewUrl);

  const formData = new FormData();
  formData.append('attachment', file);

  try {
    const response = await authAPI.uploadimages(formData);
    const userdoc = handleApiResponse(response);

    if (userdoc?.attachment_url) {
      setImageUrl(userdoc.attachment_url);
      messageApi.open({
        type: 'success',
        content: userdoc.message,
      });
      return Upload.LIST_IGNORE; 
    } else {
      message.error(userdoc.message || 'Upload failed');
      return Upload.LIST_IGNORE;
    }
  } catch (error) {
    if (error?.message === 'Network Error') {
                messageApi.open({
                  type: 'error',
                  content: translate('filters.OFFLINE_ERROR'),
                });
              }else{
               const errorData = handleApiError(error);
    messageApi.open({
      type: 'error',
      content: errorData.message,
    });
    return Upload.LIST_IGNORE;
              }
  }
};


  const onFinishFailed = ({ errorFields }) => {
    const dobErr = errorFields.find((f) => f.name[0] === 'dob');
    const errorMessage = dobErr ? dobErr.errors[0] : undefined;
   
    return errorMessage;
  };

  const getInitials = () => {
    const first = form.getFieldValue('firstName') || '';
    const last = form.getFieldValue('lastName') || '';
    return (first[0] || '').toUpperCase() + (last[0] || '').toUpperCase();
  };

  const renderAvatarContent = () => {
    if (imageUrl) {
      return (
        <img
          src={`${BASE_URL}${imageUrl}`}
          alt="avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }
    const initials = getInitials();
    if (initials) {
      return initials;
    }
    return <UserOutlined />;
  };

  const MSG_REG_SUCCESS = translate('createProfile.REGISTRATION_SUCCESS');
  const MSG_REG_FAILED = translate('createProfile.REGISTRATION_FAILED');

  const safeString = (value) => {
    if (value) {
      return value;
    }
    return '';
  };

  const switchStyle = {
    backgroundColor: checked ? '#008AD5' : '#ccc',
  };
  const toUserType = (isDealerFlag) => {
    if (isDealerFlag) {
      return 'dealer';
    }
    return 'individual';
  };

  const toWhatsappFlag = (whatsappChecked) => {
    if (whatsappChecked) {
      return 1;
    }
    return 0;
  };

  const buildRegistrationPayload = (values, profileImageUrl, phoneNumberValue) => ({
    first_name: values.firstName,
    last_name: values.lastName,
    email: values.email,
    date_of_birth: values.dob.format('YYYY-MM-DD'),
    user_type: toUserType(values.isDealer),
    company_name: safeString(values.companyName),
    owner_name: safeString(values.ownerName),
    company_address: safeString(values.companyAddress),
    company_phone_number: safeString(values.phoneNumber),
    company_registration_number: safeString(values.companyCR),
    facebook_page: safeString(values.facebookPage),
    instagram_company_profile: safeString(values.instagramProfile),
    profile_pic: safeString(profileImageUrl),
    phone_number: safeString(phoneNumberValue),
    is_dealer: values.isDealer,
    whatsapp: toWhatsappFlag(checked),
    document: safeString(uploadedDocUrl),
  });

  const handleRegistrationOutcome = (result) => {
  if (result.success) {
    console.log('Registration successful, result:', result);
    console.log('User data after registration:', result.data);

    localStorage.removeItem('fromOtpVerification');
    messageApi.open({ type: 'success', content: MSG_REG_SUCCESS });
    navigate('/landing');
    return;
  }

  // If result.message indicates a network error or user is offline
  const isOffline = result?.message === 'Network Error' || !navigator.onLine;

  if (isOffline) {
    messageApi.open({
      type: 'error',
      content: translate('filters.OFFLINE_ERROR'),
    });
  } else {
    messageApi.open({
      type: 'error',
      content: result.error || MSG_REG_FAILED,
    });
  }
};

  const handleNonValidationError = (error) => {
    const errorData = handleApiError(error);
    messageApi.open({ type: 'error', content: errorData.message });
    message.error(errorData.message || 'Registration failed. Please try again.');
  };

  const onClickContinue = async () => {
  try {
    if (!isPhoneNumberValid) {
      messageApi.error(translate('createProfile.PHONE_NUMBER_MISSING'));
      return;
    }

    setLoading(true);
    const values = await form.validateFields();
    const payload = buildRegistrationPayload(values, imageUrl, phoneToUse);

    console.log('Registration payload:', payload);
    const result = await dispatch(registerUser(payload));

    handleRegistrationOutcome(result);
  } catch (error) {
    // Check for network issues
    const isOffline = error?.message === 'Network Error' || !navigator.onLine;

    if (isOffline) {
      messageApi.open({
        type: 'error',
        content: translate('filters.OFFLINE_ERROR'),
      });
    } else if (error.errorFields) {
      // Form validation error
      onFinishFailed(error);
    } else {
      // Other API errors
      handleNonValidationError(error);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        padding: '16px',
      }}
    >
      {contextHolder}
      <div
        className="bg-white p-4 rounded"
        style={{ minWidth: 320, maxWidth: 480, width: '100%' }}
      >
        <Title
          level={3}
          style={{
            textAlign: 'center',
            marginBottom: 24,
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          {translate('createProfile.PAGE_TITLE')}
        </Title>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Upload showUploadList={false} beforeUpload={handleBeforeUpload}>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: '#e6f4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                color: '#1890ff',
                position: 'relative',
                fontWeight: 700,
                marginBottom: 8,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {renderAvatarContent()}

              <PlusCircleFilled
                style={{
                  position: 'absolute',
                  bottom: 6,
                  right: 6,
                  fontSize: 28,
                  color: '#1890ff',
                  background: '#fff',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                }}
              />
            </div>
          </Upload>
        </div>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ isDealer: false }}
          onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}
                  >
                    {translate('createProfile.FIRST_NAME')}<span style={{ color: '#637D92' }}>*</span>
                  </span>
                }
                name="firstName"
                rules={[
                  { required: true, message: translate('createProfile.FIRST_NAME_REQUIRED') },
                  {
                    max: 50,
                    message: translate('createProfile.FIRST_NAME_MAX_LENGTH'),
                  },
                  {
      pattern: /^[A-Za-z\s]+$/, 
      message: translate('createProfile.FIRST_NAME_LETTERS_ONLY'),
    },
                ]}
                style={{ marginBottom: 12 }}
                required={false}
              >
                <Input placeholder={translate('createProfile.FIRST_NAME')} size="middle" maxLength={50} />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}
                  >
                    {translate('createProfile.LAST_NAME')}<span style={{ color: '#637D92' }}>*</span>
                  </span>
                }
                name="lastName"
                rules={[
                  { required: true, message: translate('createProfile.LAST_NAME_REQUIRED') },
                  {
                    max: 50,
                    message: translate('createProfile.LAST_NAME_MAX_LENGTH'),
                  },
                  {
      pattern: /^[A-Za-z\s]+$/, // Allows only letters and spaces
      message: translate('createProfile.LAST_NAME_LETTERS_ONLY'),
    },
                ]}
                style={{ marginBottom: 12 }}
                required={false}
              >
                <Input placeholder={translate('createProfile.LAST_NAME')} size="middle" maxLength={50} />
              </Form.Item>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}
                  >
                    {translate('createProfile.EMAIL')}
                  </span>
                }
                name="email"
                required={false}
                 rules={[
                    {
                      type: 'email',
                      message: translate('createProfile.EMAIL_INVALID'),
                      validator: (_, value) => {
                        if (!value || value?.trim() === '') {
                          return Promise.resolve();
                        }
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return emailRegex.test(value)
                          ? Promise.resolve()
                          : Promise.reject(new Error(translate('createProfile.EMAIL_INVALID')));
                      },
                    },
                  ]}
              >
                <Input placeholder={translate('createProfile.EMAIL')} size="middle" />
              </Form.Item>
            </div>
            <div className="col-md-6">
             <Form.Item
  label={
    <span style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}>
      {translate('createProfile.DATE_OF_BIRTH')}*
    </span>
  }
  name="dob"
  rules={[
    {
      required: true,
      message: translate('createProfile.DATE_OF_BIRTH_REQUIRED'),
    },
    {
      validator: (_, value) => {
        if (!value) {
          return Promise.resolve(); // Required rule already handles empty state
        }

        const today = dayjs();
        const age = today.diff(value, 'year');

        if (age < 18) {
          return Promise.reject(
            new Error(translate('createProfile.DATE_OF_BIRTH_AGE_REQUIRED'))
          );
        }

        return Promise.resolve();
      },
    },
  ]}
  required={false}
  validateStatus={dobError ? 'error' : undefined}
  help={dobError || undefined}
>
  <DatePicker
    style={{
      width: '100%',
      borderColor: dobError && '#ff4d4f',
    }}
    format="DD/MM/YYYY"
    placeholder="DD / MM / YYYY"
    size="middle"
    disabledDate={(current) =>
      current && current > dayjs().endOf('day') // Prevent future dates
    }
    allowClear
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }}
  />
</Form.Item>

            </div>
          </div>
          <div className="row g-3">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                     padding: 20,
                  }}
                >
                  <span
                    style={{ fontWeight: 700, color: '#0A0A0B', fontSize: 13 }}
                  >
                    <img
                      src={whatsappIcon}
                      alt="Whatsapp Icon"
                      style={{ width: 18, height: 18, marginRight: 5 }}
                    />
                    {' '}
                    {translate('createProfile.WHATSAPP')}
                  </span>

                  <Switch
  checked={checked}
  onChange={handleChange}
  style={switchStyle}
                  />
                </div>
              </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}
                >
                  {translate('createProfile.ARE_YOU_DEALER')}*
                </span>
              }
              name="isDealer"
              rules={[
                {
                  required: true,
                  message: translate('createProfile.ARE_YOU_DEALER_REQUIRED'),
                },
              ]}
              required={false}
            >
              <Radio.Group
                onChange={(e) => {
                  setIsDealer(e.target.value);
                  if (!e.target.value) {
                    form.setFieldsValue({
                      companyName: undefined,
                      ownerName: undefined,
                      companyAddress: undefined,
                      phoneNumber: undefined,
                      companyCR: undefined,
                      facebookPage: undefined,
                      instagramProfile: undefined,
                      uploadDocuments: undefined,
                    });
                  }
                }}
              >
                <Radio value={true} style={{ marginRight: 24 }}>
                  {translate('createProfile.YES')}
                </Radio>
                <Radio value={false}>{translate('createProfile.NO')}</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {isDealer && (
            <>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: '#637D92',
                          fontSize: 12,
                        }}
                      >
                        {translate('createProfile.COMPANY_NAME')}*
                      </span>
                    }
                    name="companyName"
                    rules={[
                      {
                        required: isDealer,
                        message: translate('createProfile.COMPANY_NAME_REQUIRED'),
                      },
                       {
                    max: 100,
                    message: translate('createProfile.COMPANY_NAME_MAX_LENGTH'),
                  },
                    ]}
                    required={false}
                  >
                    <Input placeholder={translate('createProfile.COMPANY_NAME')} size="middle" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: '#637D92',
                          fontSize: 12,
                        }}
                      >
                        {translate('createProfile.OWNER_NAME')}*
                      </span>
                    }
                    name="ownerName"
                    rules={[
                      { required: isDealer, message: translate('createProfile.OWNER_NAME_REQUIRED') },
                      {
                    max: 100,
                    message: translate('createProfile.OWNER_NAME_MAX_LENGTH'),
                  },
                    ]}
                    required={false}
                  >
                    <Input placeholder={translate('createProfile.OWNER_NAME')} size="middle" />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: '#637D92',
                          fontSize: 12,
                        }}
                      >
                        {translate('createProfile.COMPANY_ADDRESS')}*
                      </span>
                    }
                    name="companyAddress"
                    rules={[
                      {
                        required: isDealer,
                        message: translate('createProfile.COMPANY_ADDRESS_REQUIRED'),
                      },
                      {
                    max: 500,
                    message: translate('createProfile.COMPANY_ADDRESS_MAX_LENGTH'),
                  },
                    ]}
                    required={false}
                  >
                    <Input placeholder={translate('createProfile.COMPANY_ADDRESS')} size="middle" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: '#637D92',
                          fontSize: 12,
                        }}
                      >
                        {translate('createProfile.PHONE_NUMBER')}*
                      </span>
                    }
                    name="phoneNumber"
                    rules={[
                      
                      {
                        required: isDealer,
                        message: translate('createProfile.PHONE_NUMBER_REQUIRED'),
                      },
                      {
                        pattern: /^\d{8,15}$/,
                        message: translate('createProfile.PHONE_NUMBER_INVALID'),
                      },
                    ]}
                    required={false}
                  >
                    <Input placeholder={translate('createProfile.PHONE_NUMBER')} size="middle" />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: '#637D92',
                          fontSize: 12,
                        }}
                      >
                        {translate('createProfile.COMPANY_CR')}*
                      </span>
                    }
                    name="companyCR"
                    rules={[
                      { required: isDealer, message: translate('createProfile.COMPANY_CR_REQUIRED') },
                       {
                    max: 100,
                    message: translate('createProfile.COMPANY_CR_MAX_LENGTH'),
                  },
                    ]}
                    required={false}
                  >
                    <Input placeholder="000000000000" size="middle" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: '#637D92',
                          fontSize: 12,
                        }}
                      >
                        {translate('createProfile.FACEBOOK_PAGE')}
                      </span>
                    }
                    name="facebookPage"
                    rules={[
    {
      validator: (_, value) => {
        if (!value || value.trim() === '') {
          return Promise.resolve(); 
        }
        if (!value.includes('facebook.com')) {
          return Promise.reject(new Error(translate('createProfile.FACEBOOK_INVALID')));
        }
        return Promise.resolve();
      },
    },
  ]}
                    required={false}
                  >
                    <Input placeholder="Name" size="middle" />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: '#637D92',
                          fontSize: 11,
                        }}
                      >
                        {translate('createProfile.INSTAGRAM_PROFILE')}
                      </span>
                    }
                    name="instagramProfile"
                     rules={[
    {
      validator: (_, value) => {
        if (!value || value.trim() === '') {
          return Promise.resolve(); 
        }
        if (!value.includes('instagram.com')) {
          return Promise.reject(new Error(translate('createProfile.INSTAGRAM_INVALID')));
        }
        return Promise.resolve();
      },
    },
  ]}
                    required={false}
                  >
                    <Input placeholder="Name" size="middle" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
  label={
    <span
      style={{
        fontWeight: 400,
        color: '#637D92',
        fontSize: 12,
      }}
    >
      {translate('createProfile.UPLOAD_DOCUMENTS')}*
    </span>
  }
  name="uploadDocuments"
  rules={[
    {
      required: isDealer,
      message: translate('createProfile.UPLOAD_DOCUMENTS_REQUIRED'),
    },
  ]}
  required={false}
>
  <Input
    type="file"
    placeholder={translate('createProfile.UPLOAD_DOCUMENTS')}
    size="middle"
    ref={fileInputRef}
    onChange={handleFileChange}
    accept=".pdf"
  />
</Form.Item>

                </div>
              </div>
            </>
          )}
          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                marginTop: 20,
                width: 200,
                height: 35,
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 16,
                background: '#008AD5',
              }}
              onClick={onClickContinue}
            >
              {translate('createProfile.CREATE_ACCOUNT')}
            </Button>
          </Form.Item>

          <Text
            type="secondary"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 4,
              fontSize: 13,
            }}
          >
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={{
                color: '#1890ff',
                textDecoration: 'none',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: 0,
              }}
            >
              {translate('createProfile.TERMS_AND_CONDITIONS')}
            </button>

            
          </Text>
        </Form>
      </div>
      <Modal
  title="Terms & Conditions"
  visible={showModal} // If using AntD v5+, replace 'visible' with 'open'
  onCancel={closeModal}
  footer={[
    <Button key="close" onClick={closeModal}>
      Close
    </Button>,
    <Button
      key="accept"
      type="primary"
      onClick={() => {
        closeModal();
      }}
    >
      Accept
    </Button>,
  ]}
  style={{
    top: 50, // Controls distance from the top of the screen
  }}
  bodyStyle={{
    maxHeight: '400px',  // Fixed height for modal content
    overflowY: 'auto',   // Scroll only inside modal body
    paddingRight: '12px' // Adds space for scrollbar
  }}
>
  <TermsAndconditions />
</Modal>

    </div>
  );
};

export default CreateProfile;