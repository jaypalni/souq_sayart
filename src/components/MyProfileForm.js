/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Radio, Row, Col, message, Upload, Switch, DatePicker } from 'antd';

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

// Helper functions to reduce complexity
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

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const toWhatsappFlag = (whatsappChecked) => {
  return whatsappChecked ? '1' : '0';
};

// Extracted PhoneChangeForm component
const PhoneChangeForm = ({ 
  phone, 
  setPhone, 
  selectedCountry, 
  setSelectedCountry, 
  countryOptions, 
  setCountryOptions, 
  dropdownOpen, 
  setDropdownOpen, 
  emailerrormsg, 
  checked, 
  whatsapphandleChange, 
  switchStyle, 
  onContinue, 
  handlePhoneChange 
}) => {
  return (
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
             onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

PhoneChangeForm.propTypes = {
  phone: PropTypes.string.isRequired,
  setPhone: PropTypes.func.isRequired,
  selectedCountry: PropTypes.shape({
    id: PropTypes.number,
    country_code: PropTypes.string,
    country_flag_image: PropTypes.string,
    country_name: PropTypes.string,
  }),
  setSelectedCountry: PropTypes.func.isRequired,
  countryOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    country_code: PropTypes.string.isRequired,
    country_flag_image: PropTypes.string.isRequired,
    country_name: PropTypes.string.isRequired,
  })).isRequired,
  setCountryOptions: PropTypes.func.isRequired,
  dropdownOpen: PropTypes.bool.isRequired,
  setDropdownOpen: PropTypes.func.isRequired,
  emailerrormsg: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  whatsapphandleChange: PropTypes.func.isRequired,
  switchStyle: PropTypes.object.isRequired,
  onContinue: PropTypes.func.isRequired,
  handlePhoneChange: PropTypes.func.isRequired,
};

// Extracted OTPForm component
const OTPForm = ({ 
  otp, 
  handleChange, 
  handleKeyDown, 
  error, 
  inputRefs, 
  OTP_INPUT_IDS, 
  isTimerRunning, 
  timer, 
  formatTime, 
  handleResend, 
  handleContinue 
}) => {
  const buildOtpInputClass = (digit, error) => {
    let inputClass = 'otp-input';

    if (digit) {
      inputClass += ' filled';
    }

    if (error && (digit === '' || !/^\d$/.test(digit))) {
      inputClass += ' otp-input-error';
    }

    return inputClass;
  };

  const renderTimerContent = (isTimerRunning, timer, formatTime, handleResend) => {
    if (isTimerRunning) {
      return (
        <span>
          Resend in{' '}
          <span className="otp-timer-count">{formatTime(timer)}</span>
        </span>
      );
    } else {
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
    }
  };

  return (
    <div style={{ justifyContent: 'flex-start'}}>
      <p className="otp-desc">
        Enter the verification code sent to your phone number
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, marginBottom: 12 }}>
        {otp.map((digit, idx) => {
          const inputClass = buildOtpInputClass(digit, error);
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
        {renderTimerContent(isTimerRunning, timer, formatTime, handleResend)}
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
  );
};

OTPForm.propTypes = {
  otp: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  inputRefs: PropTypes.arrayOf(PropTypes.object).isRequired,
  OTP_INPUT_IDS: PropTypes.arrayOf(PropTypes.string).isRequired,
  isTimerRunning: PropTypes.bool.isRequired,
  timer: PropTypes.number.isRequired,
  formatTime: PropTypes.func.isRequired,
  handleResend: PropTypes.func.isRequired,
  handleContinue: PropTypes.func.isRequired,
};

// Extracted ProfileForm component
const ProfileForm = ({ 
  form, 
  profile, 
  editMode, 
  onFinish, 
  handleDealerChange, 
  fileInputRef, 
  handleFileChange, 
  setModalOpen, 
  onEdit, 
  onCancel,
  triggerAvatarUpload,
  handleBeforeUpload,
  renderAvatarContent,
  setAvatarUrl
}) => {
  const renderDealerFields = (form, editMode) => {
    if (form.getFieldValue('dealer') !== 'yes') {
      return null;
    }
    
    return (
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
                Owner's Name
              </span>
            }
            name="owner"
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
    );
  };

  const renderAdditionalDealerFields = (form, editMode, fileInputRef, handleFileChange) => {
    if (form.getFieldValue('dealer') !== 'yes') {
      return null;
    }
    
    return (
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
    );
  };

  const renderActionButtons = (editMode, onEdit, onCancel) => {
    if (editMode) {
      return (
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
      );
    }
    return (
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
    );
  };

  return (
    <div className="myprofile-card">
      <Row gutter={24} align="middle" style={{ marginBottom: 0 }}>
        <Col span={24}>
          <div className="profile-header-row">
            <div className="profile-avatar-name">
              <div
                className={`profile-avatar-upload${
                  editMode ? ' editable' : ''
                }`}
                onClick={editMode ? triggerAvatarUpload : undefined}
                onKeyDown={editMode ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerAvatarUpload();
                  }
                } : undefined}
                tabIndex={editMode ? 0 : -1}
                role={editMode ? 'button' : undefined}
                aria-label={editMode ? 'Upload profile picture' : undefined}
                style={{ cursor: editMode ? 'pointer' : 'default' }}
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
          {renderDealerFields(form, editMode)}
        </Row>

        <Row gutter={16}>
          {renderAdditionalDealerFields(form, editMode, fileInputRef, handleFileChange)}
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
          {renderActionButtons(editMode, onEdit, onCancel)}
        </div>
      </Form>
    </div>
  );
};

ProfileForm.propTypes = {
  form: PropTypes.object.isRequired,
  profile: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    dob: PropTypes.any,
    dealer: PropTypes.string,
    company: PropTypes.string,
    owner: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
    reg: PropTypes.string,
    facebook: PropTypes.string,
    instagram: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  editMode: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  handleDealerChange: PropTypes.func.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  triggerAvatarUpload: PropTypes.func.isRequired,
  handleBeforeUpload: PropTypes.func.isRequired,
  renderAvatarContent: PropTypes.func.isRequired,
  setAvatarUrl: PropTypes.func.isRequired,
};

const MyProfileForm = () => {
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
   const [, setIsChangingPhone] = useState(false);
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

  const handleConfirm = async () => {
    try {
      const response = await authAPI.countrycode();
      const data = handleApiResponse(response);

      if (!data || data.length === 0) {
        throw new Error('No countries found');
      }

      const geoData = await getGeoData();
      const defaultCountry = getDefaultCountry(data, geoData);

      setSelectedCountry(defaultCountry || data[0]);
      setCountryOptions(data);

      setModalOpen(false);
      setEditMode(false);
      setShowChangePhoneForm(true);
      setIsChangingPhone(true);
    } catch (err) {
      console.error('Error fetching country:', err);
    }
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
      }
    }
  };

   const validateOtp = () => {
    if (otp.some((digit) => digit === '' || !/^\d$/.test(digit))) {
      setError('Please enter the OTP.');
      return false;
    }
    setError('');
    return true;
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
    }
  } catch (err) {
    message.error('OTP verification failed. Please try again.');
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

const applyUpdatedUser = (user, successMsg, form, setUsersData, setProfile, setAvatarUrl, setDealerValue, setEditMode) => {
  const updatedProfile = mapUserToProfile(user);
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

  /**
   * Renders the header content based on current state
   * @param {Object} props - Header content props
   * @param {boolean} props.showOtpForm - Whether OTP form is shown
   * @param {boolean} props.showChangePhoneForm - Whether phone change form is shown
   * @param {boolean} props.editMode - Whether in edit mode
   * @param {Function} props.setShowOtpForm - Function to set OTP form visibility
   * @param {Function} props.setShowChangePhoneForm - Function to set phone change form visibility
   * @param {Function} props.setIsChangingPhone - Function to set changing phone state
   * @returns {JSX.Element} Header content
   */
  const renderHeaderContent = (props) => {
    const {
      showOtpForm,
      showChangePhoneForm,
      editMode,
      setShowOtpForm,
      setShowChangePhoneForm,
      setIsChangingPhone
    } = props;
  if (showOtpForm) {
    return (
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
    );
  }
  
  if (showChangePhoneForm) {
    return (
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
    );
  }
  
  if (editMode) {
    return 'Edit Profile';
  }
  
  return 'My Profile';
};

  /**
   * Renders the main content based on current state
   * @param {Object} props - Main content props
   * @param {boolean} props.showChangePhoneForm - Whether phone change form is shown
   * @param {boolean} props.showOtpForm - Whether OTP form is shown
   * @param {Object} props.form - Form instance
   * @param {Object} props.profile - User profile data
   * @param {boolean} props.editMode - Whether in edit mode
   * @param {Function} props.onFinish - Form submission handler
   * @param {Function} props.handleDealerChange - Dealer change handler
   * @param {Object} props.fileInputRef - File input reference
   * @param {Function} props.handleFileChange - File change handler
   * @param {Function} props.setModalOpen - Modal open state setter
   * @param {Function} props.onEdit - Edit mode handler
   * @param {Function} props.onCancel - Cancel handler
   * @param {Function} props.triggerAvatarUpload - Avatar upload trigger
   * @param {Function} props.handleBeforeUpload - Before upload handler
   * @param {Function} props.renderAvatarContent - Avatar content renderer
   * @param {Function} props.setAvatarUrl - Avatar URL setter
   * @param {string} props.phone - Phone number
   * @param {Function} props.setPhone - Phone setter
   * @param {Object} props.selectedCountry - Selected country
   * @param {Function} props.setSelectedCountry - Country setter
   * @param {Array} props.countryOptions - Country options
   * @param {Function} props.setCountryOptions - Country options setter
   * @param {boolean} props.dropdownOpen - Dropdown open state
   * @param {Function} props.setDropdownOpen - Dropdown state setter
   * @param {string} props.emailerrormsg - Email error message
   * @param {boolean} props.checked - WhatsApp checked state
   * @param {Function} props.whatsapphandleChange - WhatsApp change handler
   * @param {Object} props.switchStyle - Switch style object
   * @param {Function} props.onContinue - Continue handler
   * @param {Function} props.handlePhoneChange - Phone change handler
   * @param {Array} props.otp - OTP array
   * @param {Function} props.handleChange - OTP change handler
   * @param {Function} props.handleKeyDown - OTP key down handler
   * @param {string} props.error - Error message
   * @param {Array} props.inputRefs - Input references
   * @param {Array} props.OTP_INPUT_IDS - OTP input IDs
   * @param {boolean} props.isTimerRunning - Timer running state
   * @param {number} props.timer - Timer value
   * @param {Function} props.formatTime - Time formatter
   * @param {Function} props.handleResend - Resend handler
   * @param {Function} props.handleContinue - Continue handler
   * @returns {JSX.Element} Main content
   */
  const renderMainContent = (props) => {
    const {
      showChangePhoneForm,
      showOtpForm,
      form,
      profile,
      editMode,
      onFinish,
      handleDealerChange,
      fileInputRef,
      handleFileChange,
      setModalOpen,
      onEdit,
      onCancel,
      triggerAvatarUpload,
      handleBeforeUpload,
      renderAvatarContent,
      setAvatarUrl,
      phone,
      setPhone,
      selectedCountry,
      setSelectedCountry,
      countryOptions,
      setCountryOptions,
      dropdownOpen,
      setDropdownOpen,
      emailerrormsg,
      checked,
      whatsapphandleChange,
      switchStyle,
      onContinue,
      handlePhoneChange,
      otp,
      handleChange,
      handleKeyDown,
      error,
      inputRefs,
      OTP_INPUT_IDS,
      isTimerRunning,
      timer,
      formatTime,
      handleResend,
      handleContinue
    } = props;
  if (showChangePhoneForm) {
    return (
      <PhoneChangeForm 
        phone={phone} 
        setPhone={setPhone} 
        selectedCountry={selectedCountry} 
        setSelectedCountry={setSelectedCountry} 
        countryOptions={countryOptions} 
        setCountryOptions={setCountryOptions} 
        dropdownOpen={dropdownOpen} 
        setDropdownOpen={setDropdownOpen} 
        emailerrormsg={emailerrormsg} 
        checked={checked} 
        whatsapphandleChange={whatsapphandleChange} 
        switchStyle={switchStyle} 
        onContinue={onContinue} 
        handlePhoneChange={handlePhoneChange} 
      />
    );
  }
  
  if (showOtpForm) {
    return (
      <OTPForm 
        otp={otp} 
        handleChange={handleChange} 
        handleKeyDown={handleKeyDown} 
        error={error} 
        inputRefs={inputRefs} 
        OTP_INPUT_IDS={OTP_INPUT_IDS} 
        isTimerRunning={isTimerRunning} 
        timer={timer} 
        formatTime={formatTime} 
        handleResend={handleResend} 
        handleContinue={handleContinue} 
      />
    );
  }
  
  return (
    <ProfileForm 
      form={form} 
      profile={profile} 
      editMode={editMode} 
      onFinish={onFinish} 
      handleDealerChange={handleDealerChange} 
      fileInputRef={fileInputRef} 
      handleFileChange={handleFileChange} 
      setModalOpen={setModalOpen} 
      onEdit={onEdit} 
      onCancel={onCancel}
      triggerAvatarUpload={triggerAvatarUpload}
      handleBeforeUpload={handleBeforeUpload}
      renderAvatarContent={renderAvatarContent}
      setAvatarUrl={setAvatarUrl}
    />
  );
};

  return (
    <div className='myprofile-main'>
      {contextHolder}
     <div className='myprofile-header' style={{ display: 'flex', alignItems: 'center' }}>
  {renderHeaderContent({
    showOtpForm,
    showChangePhoneForm,
    editMode,
    setShowOtpForm,
    setShowChangePhoneForm,
    setIsChangingPhone
  })}
</div>
      {renderMainContent({
        showChangePhoneForm,
        showOtpForm,
        form,
        profile,
        editMode,
        onFinish,
        handleDealerChange,
        fileInputRef,
        handleFileChange,
        setModalOpen,
        onEdit,
        onCancel,
        triggerAvatarUpload,
        handleBeforeUpload,
        renderAvatarContent,
        setAvatarUrl,
        phone,
        setPhone,
        selectedCountry,
        setSelectedCountry,
        countryOptions,
        setCountryOptions,
        dropdownOpen,
        setDropdownOpen,
        emailerrormsg,
        checked,
        whatsapphandleChange,
        switchStyle,
        onContinue,
        handlePhoneChange,
        otp,
        handleChange,
        handleKeyDown,
        error,
        inputRefs,
        OTP_INPUT_IDS,
        isTimerRunning,
        timer,
        formatTime,
        handleResend,
        handleContinue
      })}

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
        <button
          className='popup-close-icon'
          type="button"
          onClick={onClose}
          aria-label='Close'
        >
          &times;
        </button>
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

MyProfileForm.propTypes = {};

export default MyProfileForm;