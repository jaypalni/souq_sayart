/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Input, Button, Radio, Row, Col, Avatar, message, Upload, Switch, DatePicker } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { userAPI, authAPI } from '../services/api';
import whatsappIcon from '../assets/images/Whatsup.svg';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import '../assets/styles/model.css';
import dayjs from 'dayjs';
import { PlusCircleFilled, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/signupOtp.css';
import '../assets/styles/myProfile.css'

const YES = 'yes';
const NO = 'no';
const MSG_FETCH_SUCCESS = 'Fetched successfully';
const MSG_PROFILE_UPDATED = 'Profile updated!';
const MSG_FETCH_FAILED = 'Failed to load profile';
const MSG_UPDATE_FAILED = 'Failed to update profile.';
const CACHE_KEY = 'geoDataCache';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const INDIA_TZ_OFFSET_MINUTES = -330;

const MyProfileForm = () => {
const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef();
  const [, setDealerValue] = useState(YES);
  const [messageApi, contextHolder] = message.useMessage();
  const [, setLoading] = useState(false);
  const [, setUsersData] = useState({});
  const [, setDobError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadedDocUrl, setUploadedDocUrl] = useState('');
   const [showChangePhoneForm, setShowChangePhoneForm] = useState(false);
   const [isChangingPhone, setIsChangingPhone] = useState(false);
     const [dropdownOpen, setDropdownOpen] = useState(false);
     const [selectedCountry, setSelectedCountry] = useState(null);
      const [countryOptions, setCountryOptions] = useState([]);
      const [phone, setPhone] = useState('');
      const [emailerrormsg, setEmailErrorMsg] = useState('');
      const [showOtpForm, setShowOtpForm] = useState(false);
      const [otp, setOtp] = useState(['', '', '', '']);
      const [timer, setTimer] = useState(60);
        const [isTimerRunning, setIsTimerRunning] = useState(true);
        const [error, setError] = useState('');
        const inputRefs = [useRef(), useRef(), useRef(), useRef()];
       const OTP_LENGTH = 4;
        const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);
        const intervalRef = useRef(null);
         const [checked, setChecked] = useState(false);

        
        const navigate = useNavigate();

      const handlePhoneChange = (e) => {
    const numb = e.target.value;
    setEmailErrorMsg('');

    if (!/^\d*$/.test(numb)) {
      return;
    }

    setPhone(numb);
  };

  const switchStyle = {
    backgroundColor: checked ? '#008AD5' : '#ccc',
  };

  const isIndiaLocale = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const tzLower = tz.toLowerCase();
    const tzOffset = new Date().getTimezoneOffset();
    const langs = [navigator.language, ...(navigator.languages || [])].filter(Boolean);

    return (
      tzLower === 'asia/kolkata' ||
      tzLower === 'asia/calcutta' ||
      tzOffset === INDIA_TZ_OFFSET_MINUTES ||
      langs.some((l) => String(l).toLowerCase().includes('-in'))
    );
  };

  const fetchCountries = async () => {
        try {
          const response = await authAPI.countrycode();
          const data = handleApiResponse(response);
  
          if (!data || data.length === 0) {
            return;
          }
  
          setCountryOptions(data);
  
          const geoData = await getGeoData();
          const defaultCountry = getDefaultCountry(data, geoData);
          setSelectedCountry(defaultCountry || data[0]);
        } catch {
          // Ignore API errors silently
        }
      };

  const getDefaultCountry = (data, geoData) => {
    if (geoData) {
      const userCountryCode = geoData.country_calling_code;
      const match = data.find(
        (country) =>
          country.country_code === userCountryCode ||
          country.country_name?.toLowerCase() === geoData.country_name?.toLowerCase(),
      );
      if (match) {
        return match;
      }
    }

    if (isIndiaLocale()) {
      return (
        data.find((c) => c.country_code === '+91') ||
        data.find((c) => c.country_name?.toLowerCase() === 'india')
      );
    }

    return null;
  };

  const getGeoData = async () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.ts && Date.now() - parsed.ts < MAX_AGE_MS && parsed?.data) {
          return parsed.data;
        }
      }

      const geoRes = await fetch('https://ipapi.co/json/');
      if (!geoRes.ok) {
        throw new Error(`Geo API error: ${geoRes.status}`);
      }
      const geoData = await geoRes.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: geoData }));
      return geoData;
    } catch {
      return null;
    }
  };

const handleConfirm = async () => {
  try {
    const response = await authAPI.countrycode();
    const data = handleApiResponse(response);

    if (!data || data.length === 0) {
      throw new Error('No countries found');
    }

    // Get geo info
    const geoData = await getGeoData();
    const defaultCountry = getDefaultCountry(data, geoData);

    setSelectedCountry(defaultCountry || data[0]);
    setCountryOptions(data);

    // proceed to phone change UI
    setModalOpen(false);
    setEditMode(false);
    setShowChangePhoneForm(true);
    setIsChangingPhone(true);
  } catch (err) {
    console.error('Error fetching country:', err);
  }
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

 const handleChange = (e, idx) => {
  const val = e.target.value.replace(/\D/g, '');

  const newOtp = [...otp];
  if (val) {
    newOtp[idx] = val[val.length - 1];
    setOtp(newOtp);
    setError('');
    if (idx < OTP_LENGTH - 1) {
      inputRefs[idx + 1].current.focus();
    }
  } else {
    newOtp[idx] = '';
    setOtp(newOtp);
  }
};

const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs[idx - 1].current.focus();
      } else {
        // No action needed when at first field with empty value
      }
    }
  };

   const validateOtp = () => {
    if (otp.some((digit) => digit === '' || !/^\d$/.test(digit))) {
      setError('Please enter the OTP.');
      return false;
    }else{
setError('');
    return true;
    }
  };

  const onContinue = async () => {
      if (phone === '') {
        setEmailErrorMsg('Phone number is required!');
        return;
      }

      try {
        setLoading(true);
        const savePhone = `${selectedCountry.country_code}${phone}`;
        localStorage.setItem('phonenumber', savePhone);
  
        const response = await userAPI.changephonenumber({
          phone_number: savePhone,
          is_whatsapp: toWhatsappFlag(checked),
        });
  
        const data = handleApiResponse(response);
        if (data) {
          messageApi.open({ type: 'success', content: data.message });
           if (data.request_id) {
        localStorage.setItem('request_id', data.request_id);
      }
           setShowChangePhoneForm(false);
          setShowOtpForm(true);
           if (intervalRef.current) clearInterval(intervalRef.current); 
        setTimer(30); 
        setIsTimerRunning(true);

        intervalRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setIsTimerRunning(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        }
      } catch (error) {
        const errorData = handleApiError(error);
        messageApi.open({ type: 'error', content: errorData.message });
      } finally {
        setLoading(false);
      }
    };

   const handleContinue = async () => {
  if (!validateOtp()) {
    return;
  }

  try {
    setLoading(true);
    const otpDigits = otp.join('');
    const requestId = localStorage.getItem('request_id'); 

    const otpPayload = {
      otp: otpDigits,
      request_id: requestId,
    };

    const result = await userAPI.chnagenumberverifyOtp(otpPayload);

    console.log('Verify otp', result);

    if (result?.data?.success) {
      localStorage.setItem('token', result.data?.access_token);

      messageApi.open({
        type: 'success',
        content: result?.data?.message,
      });

      setShowChangePhoneForm(false);
      setShowOtpForm(false);
    } else {
      messageApi.open({
        type: 'error',
        content: result?.data?.error,
      });
      console.log('Verify otp failed', error);
    }
  } catch (err) {
    message.error('OTP verification failed. Please try again.');
    console.log('Verify otp failed2', error);
  } finally {
    setLoading(false);
  }
};

  
  const handleResend = async () => {
    if (!isTimerRunning) {
      setTimer(30);
      setIsTimerRunning(true);
    }
  
    try {
      const usermobilenumber = localStorage.getItem('phone_number');
      setLoading(true);
  
      const response = await authAPI.resendotp({
        phone_number: usermobilenumber,
      });
      const data = handleApiResponse(response);
  
      if (data) {
        localStorage.setItem('userData', JSON.stringify(data));
        messageApi.open({
          type: 'success',
          content: data.message,
        });
      }
    } catch (err) {
      const errorData = handleApiError(err);
      messageApi.open({
        type: 'error',
        content: errorData.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = ({ errorFields }) => {
    const dobErr = errorFields.find((f) => f.name[0] === 'dob');
    setDobError(dobErr ? dobErr.errors[0] : '');
  };

  const onFinish = async (values) => {
    setProfile({ ...values, avatar: avatarUrl });
    setEditMode(false);
    message.success(MSG_PROFILE_UPDATED);
    await onClickContinue();
  };

  const onEdit = () => {
    setEditMode(true);
    form.setFieldsValue(profile);
  };

  const onCancel = () => {
    setEditMode(false);
    setAvatarUrl(profile.avatar || '');
    form.setFieldsValue(profile);
  };

  const handleDealerChange = (e) => {
    const value = e.target.value;
    setDealerValue(value);

    if (value === NO) {
      form.setFieldsValue({
        company: '',
        owner: '',
        address: '',
        reg: '',
        facebook: '',
        instagram: '',
      });
    } else {
      form.setFieldsValue({
        company: profile.company,
        owner: profile.owner,
        address: profile.address,
        reg: profile.reg,
        facebook: profile.facebook,
        instagram: profile.instagram,
      });
    }
  };

  const triggerAvatarUpload = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };


  useEffect(() => {
    Userdataapi();
  }, []);

const Userdataapi = async () => {
  try {
    setLoading(true);
    const response = await userAPI.getProfile({});
    const users_data = handleApiResponse(response);

    if (users_data?.data) {
      populateUserProfile(users_data.data, users_data.message);
    }
  } catch (error) {
    handleApiError(error, MSG_FETCH_FAILED);
    setUsersData({});
  } finally {
    setLoading(false);
  }
};


const populateUserProfile = (user, successMsg) => {
  const userProfile = mapUserToProfile(user); 
  setUsersData(user);
  setProfile(userProfile);
  form.setFieldsValue(userProfile);
  setAvatarUrl(user.profile_image || '');
  setDealerValue(userProfile.dealer);
  message.success(successMsg || MSG_FETCH_SUCCESS);
};


const mapUserToProfile = (user) => ({
  first_name: user.first_name || '',
  last_name: user.last_name || '',
  email: user.email || '',
  dob: user.date_of_birth ? dayjs(user.date_of_birth) : null,
  dealer: user.is_dealer === 1 ? YES : NO,
  company: user.company_name || '',
  owner: user.owner_name || '',
  address: user.company_address || '',
  phone: user.phone_number || '',
  reg: user.company_registration_number || '',
  facebook: user.facebook_page || '',
  instagram: user.instagram_company_profile || '',
  avatar: user.profile_image || '',
});

const mapApiUserToProfile = (user) => ({
  first_name: user.first_name || '',
  last_name: user.last_name || '',
  email: user.email || '',
 dob: user.date_of_birth ? dayjs(user.date_of_birth) : null,
  dealer: user.is_dealer === 1 ? YES : NO, 
  company: user.company_name || '',
  owner: user.owner_name || '',
  address: user.company_address || '',
  phone: user.phone_number || '',
  reg: user.company_registration_number || '',
  facebook: user.facebook_page || '',
  instagram: user.instagram_company_profile || '',
  avatar: user.profile_image || '',
});

const applyUpdatedUser = (user, successMsg, form, setUsersData, setProfile, setAvatarUrl, setDealerValue, setEditMode) => {
  const updatedProfile = mapApiUserToProfile(user);
  setUsersData(user);
  setProfile(updatedProfile);
  form.setFieldsValue(updatedProfile);
  setAvatarUrl(user.profile_image || '');
  setDealerValue(user.is_dealer ? YES : NO);
  setEditMode(false);
  message.success(successMsg || MSG_PROFILE_UPDATED);
};

const handleSubmitError = (error, onFinishFailed) => {
  if (error.errorFields) {
    onFinishFailed(error);
    return;
  }
  const errorData = handleApiError(error);
  message.error(errorData.message || MSG_UPDATE_FAILED);
};

 const getInitials = () => {
    const first = form.getFieldValue('firstName') || '';
    const last = form.getFieldValue('lastName') || '';
    return (first[0] || '').toUpperCase() + (last[0] || '').toUpperCase();
  };

    const whatsapphandleChange = (value) => {
    setChecked(value);
  };

  const toWhatsappFlag = (whatsappChecked) => {
    if (whatsappChecked) {
      return '1';
    }
    return '0';
  };
const renderAvatarContent = () => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
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

   const handleFileChange = async (e) => {
      const file = e.target.files[0];
  
      if (!file) {
        return;
      }
  
      const isPDF = file.type === 'application/pdf';
  
      if (!isPDF) {
        messageApi.open({
          type: 'error',
          content: 'Upload failed. Only .pdf documents are allowed.',
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
        const errorData = handleApiError(error);
        messageApi.open({
          type: 'error',
          content: errorData.message,
        });
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
        content:
          'Upload failed. Only .png, .jpeg, or .jpg images are allowed for profile picture.',
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
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.message,
      });
      message.error('Upload failed due to network error');
      return Upload.LIST_IGNORE; 
    }
  };

  const onClickContinue = async () => {
  try {
    setLoading(true);
    const values = await form.validateFields();

    const formattedDob = values.dob 
  ? dayjs(values.dob).format('YYYY-MM-DD') 
  : '';
    
    const payload = {
      first_name: values.first_name || '',
      last_name: values.last_name || '',
      email: values.email || '',
      date_of_birth: formattedDob,
      is_dealer: values.dealer === 'yes',
      company_name: values.company || '',
      owner_name: values.owner || '',
      company_address: values.address || '',
      company_phone_number: values.phone || '',
      company_registration_number: values.reg || '',
      facebook_page: values.facebook || '',
      instagram_company_profile: values.instagram || '',
      profile_pic: imageUrl || '',
      whatsapp: values.phone || '',
      location: values.address || '',
      document: uploadedDocUrl
    };

    const response = await userAPI.updateProfile(payload);
    const result = handleApiResponse(response);
    if (result?.data) {
      applyUpdatedUser(
        result.data,
        result.message,
        form,
        setUsersData,
        setProfile,
        setAvatarUrl,
        setDealerValue,
        setEditMode,
      );
    }
    messageApi.open({
        type: 'success',
        content: result.message || 'Profile updated successfully',
      });
  } catch (error) {
    handleSubmitError(error, onFinishFailed);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className='myprofile-main'>
      {contextHolder}
     <div className='myprofile-header' style={{ display: 'flex', alignItems: 'center' }}>
  {showOtpForm ? (
    <>
      <ArrowLeftOutlined
        onClick={() => {
          setShowOtpForm(false);
          setShowChangePhoneForm(true); 
        }}
        style={{ fontSize: '18px', cursor: 'pointer', marginRight: '10px' }}
      />
      Enter OTP Sent To Your New Number
    </>
  ) : showChangePhoneForm ? (
    <>
      <ArrowLeftOutlined
        onClick={() => {
          setIsChangingPhone(false);
          setShowChangePhoneForm(false);
        }}
        style={{ fontSize: '18px', cursor: 'pointer', marginRight: '10px' }}
      />
      Change Mobile Number
    </>
  ) : (
    editMode ? 'Edit Profile' : 'My Profile'
  )}
</div>
      {showChangePhoneForm ? (
        <div
        style={{
          flex: 1,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 0',
        }}
      >
        <div
          style={{
            width: 400,
            background: '#fff',
            borderRadius: 8,
            textAlign: 'left',
            marginLeft: -530,
          }}
        >
          <p style={{ color: '#0A0A0B', fontSize: 14, fontFamily: 'Roboto' }}>
           Enter Your New Phone Number to change
          </p>
          <div style={{ margin: '20px 0' }}>
            <label
              style={{
                display: 'block',
                marginBottom: 6,
                fontWeight: 500,
                color: '#637D92',
                textAlign: 'left',
                fontSize: 12,
              }}
              htmlFor="phone-input"
            >
              Enter Your Phone Number
            </label>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ position: 'relative', width: 100, height: 57 }}>
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: 8,
                    padding: '8px 12px',
                    background: '#E7EBEF',
                    border: 'none',
                    width: '80%',
                    height: '80%',
                  }}
                  aria-expanded={dropdownOpen}
                  aria-controls="country-menu"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {selectedCountry && (
                    <>
                      <img
                        src={`http://192.168.2.72:5001${selectedCountry.country_flag_image}`}
                        alt="flag"
                        style={{ width: 20, height: 14, marginRight: 6 }}
                      />
                      <span style={{ fontSize: 16 }}>
                        {selectedCountry.country_code}
                      </span>
                    </>
                  )}
                </button>
                {dropdownOpen && (
                  <div
                    id="country-menu"
                    style={{
                      position: 'absolute',
                      top: 42,
                      left: 0,
                      background: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: 4,
                      zIndex: 10,
                      minWidth: 120,
                    }}
                  >
                    {countryOptions.map((country) => (
                      <button
                        type="button"
                        key={country.id}
                        style={{
                          padding: '6px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                        }}
                        onClick={() => {
                          setSelectedCountry(country);
                          setDropdownOpen(false);
                        }}
                      >
                        <img
                          src={`http://192.168.2.72:5001${country.country_flag_image}`}
                          alt="flag"
                          style={{ width: 20, height: 14, marginRight: 6 }}
                        />
                        <span style={{ fontSize: 15 }}>
                          {country.country_code}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                className="login-box"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={handlePhoneChange}
                id="phone-input"
              />
            </div>

            <div className="emailerror-msg" style={{ marginLeft: 110 }}>
              {emailerrormsg}
            </div>
          </div>
          <div style={{marginBottom: 12}}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
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
                    Whatsapp
                  </span>

                  <Switch
  checked={checked}
  onChange={whatsapphandleChange}
  style={switchStyle}
                  />
                </div>
              </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              style={{
                background: '#0090d4',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '2px 52px',
                cursor: 'pointer',
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontSize: 14,
              }}
               onClick={() => {
   
    onContinue();
  }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      ) : showOtpForm ? (
  <div style={{ justifyContent: 'flex-start'}}>
    {contextHolder}
    <p className="otp-desc">
      Enter the verification code sent to your phone number
    </p>

    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, marginBottom: 12 }}>
      {otp.map((digit, idx) => {
        let inputClass = 'otp-input';

        if (digit) {
          inputClass += ' filled';
        }

        if (error && (digit === '' || !/^\d$/.test(digit))) {
          inputClass += ' otp-input-error';
        }

        const inputKey = OTP_INPUT_IDS[idx];
        return (
          <input
            key={inputKey}
            ref={inputRefs[idx]}
            type="tel"
            className={inputClass}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        );
      })}
    </div>

    {error && (
      <div
        className="otp-error"
        style={{
          color: '#ff4d4f',
          marginTop: 8,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        {error}
      </div>
    )}

    <div className="otp-timer">
      {(() => {
        if (isTimerRunning) {
          return (
            <span>
              Resend in{' '}
              <span className="otp-timer-count">{formatTime(timer)}</span>
            </span>
          );
        }
       return (
  <button
    type="button"
    className="otp-resend"
    onClick={handleResend}
    style={{ cursor: 'pointer', color: '#0090d4', background: 'transparent', border: 'none', padding: 0 }}
  >
    Resend
  </button>
);

      })()}
    </div>
      <button
        className="otp-btn otp-btn-filled"
        type="button"
        onClick={handleContinue}
        style={{height: 35}}
      >
        Continue
      </button>
    
  </div>

      ) : (
        <>

          <div className="myprofile-card">
        <Row gutter={24} align="middle" style={{ marginBottom: 0 }}>
          <Col span={24}>
            <div className="profile-header-row">
              <div className="profile-avatar-name">
                <div
                  className={`profile-avatar-upload${
                    editMode ? ' editable' : ''
                  }`}
                  onClick={triggerAvatarUpload}
                  role="button"
                  tabIndex={editMode ? 0 : -1}
                  aria-label="Upload avatar"
                  onKeyDown={(e) => {
                    if (editMode && (e.key === 'Enter' || e.key === ' ')) {
                      triggerAvatarUpload();
                    }
                  }}
                >
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

                  {editMode && (
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target?.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setAvatarUrl(ev.target?.result || '');
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  )}
                </div>
                <span className="profile-username">
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Form
          form={form}
          layout="vertical"
          initialValues={profile}
          onFinish={onFinish}
          className={editMode ? '' : 'edit-mode-form'}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#637D92',
                    }}
                  >
                    First Name*
                  </span>
                }
                name="first_name"
              >
                <Input
                disabled={!editMode}
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#4A5E6D',
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#637D92',
                    }}
                  >
                    Last Name*
                  </span>
                }
                name="last_name"
              >
                <Input
                disabled={!editMode}
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#4A5E6D',
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span
                  disabled={!editMode}
                    style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#637D92',
                    }}
                  >
                    Email
                  </span>
                }
                name="email"
              >
                <Input
                disabled={!editMode}
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#4A5E6D',
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
  <Form.Item
    label={
      <span
        style={{
          fontSize: '12px',
          fontWeight: 400,
          color: '#637D92',
        }}
      >
        Date of Birth*
      </span>
    }
    name='dob'
    rules={[{ required: true, message: 'Please select your date of birth' }]}
    className={!editMode?'datePicker':''}
  >
    {/* <div className={!editMode?'datePicker':''}> */}
    <DatePicker
      disabled={!editMode}
      format='ddd, DD MMM YYYY' 
      style={{
        width: '100%',
        fontSize: '12px',
        fontWeight: 400,
        color: '#000000',
      }}
      onChange={(date) => {
        console.log('Selected Date:', date ? dayjs(date).format('ddd, DD MMM YYYY') : null);
      }}
    />
    {/* </div> */}
  </Form.Item>
</Col>
          </Row>
          <Row gutter={16} align="middle">
            <Col span={24}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#637D92',
                    }}
                  >
                    Are You a Dealer?*
                  </span>
                }
                name="dealer"
              >
                <Radio.Group onChange={handleDealerChange}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {form.getFieldValue('dealer') === 'yes' && (
              <>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#637D92',
                        }}
                      >
                        Company Name
                      </span>
                    }
                    name="company"
                  >
                    <Input
                    disabled={true}
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4A5E6D',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#637D92',
                        }}
                      >
                        Owner's Name
                      </span>
                    }
                    name="owner"
                  >
                    <Input
                    disabled={true}
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4A5E6D',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#637D92',
                        }}
                      >
                        Company Address
                      </span>
                    }
                    name="address"
                  >
                    <Input
                    disabled={!editMode}
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4A5E6D',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#637D92',
                        }}
                      >
                        Phone Number
                      </span>
                    }
                    name="phone"
                  >
                    <Input
                    disabled={!editMode}
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4A5E6D',
                      }}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>

          <Row gutter={16}>
            {form.getFieldValue('dealer') === 'yes' && (
              <>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#637D92',
                        }}
                      >
                        Company Registration Number CR
                      </span>
                    }
                    name="reg"
                  >
                    <Input
                    disabled={true}
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4A5E6D',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#637D92',
                        }}
                      >
                        Facebook Page (Optional)
                      </span>
                    }
                    name="facebook"
                  >
                    <Input
                    disabled={!editMode}
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4A5E6D',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#637D92',
                        }}
                      >
                        Instagram Company Profile (Optional)
                      </span>
                    }
                    name="instagram"
                  >
                    <Input
                    disabled={!editMode}
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#4A5E6D',
                      }}
                    />
                  </Form.Item>
                </Col>
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
                                        Upload Documents
                                      </span>
                                    }
                                    name="uploadDocuments"
                                    required={false}
                                  >
                                    <Input
                                    disabled={true}
                                      type="file"
                                      placeholder="Documents"
                                      size="middle"
                                      ref={fileInputRef}
                                      onChange={handleFileChange}
                                      accept=".pdf"
                                    />{' '}
                                  </Form.Item>
                                </div>
              </>
            )}
          </Row>
          <div className="profile-btns profile-btns-bottom">
            <Button
              className="btn-outline-blue"
              shape="round"
              style={{
                marginRight: 16,
                color: '#008AD5',
                fontWeight: 600,
                fontSize: '14px',
              }}
              onClick={() => setModalOpen(true)}
            >
              Change Phone Number
            </Button>
            {editMode && (
              <>
                <Button
                  className="btn-solid-blue"
                  icon={<CheckOutlined />}
                  shape="round"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 8 }}
                >
                  Update
                </Button>
                <Button
                  className="btn-outline-blue"
                  icon={<CloseOutlined />}
                  shape="round"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </>
            )}
            {!editMode && (
              <Button
                className="btn-solid-blue"
                icon={<EditOutlined />}
                shape="round"
                type="primary"
                onClick={onEdit}
                style={{
                  color: '#FAFAFA',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Edit Profile
              </Button>
            )}
            <ConfirmModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={handleConfirm}
            />
          </div>
        </Form>
      </div>
        </>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
      
    </div>

    
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='small-popup-container'>
      <div className='small-popup'>
        <span
          className='popup-close-icon'
          role='button'
          tabIndex={0}
          aria-label='Close'
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onClose();
          }}
        >
          &times;
        </span>
        <p className='popup-text'>
          Are you sure you want to change your number?
        </p>
        <div className='popup-buttons'>
          <button className='popup-btn-no' onClick={onClose}>
            No
          </button>
          <button className='popup-btn-yes' onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};


export default MyProfileForm;