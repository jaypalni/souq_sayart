/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Radio, Row, Col, message, Upload, DatePicker } from 'antd';

import {
  EditOutlined,
} from '@ant-design/icons';
import { userAPI, authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import '../assets/styles/model.css';
import dayjs from 'dayjs';
import { PlusCircleFilled, UserOutlined } from '@ant-design/icons';
import '../assets/styles/signupOtp.css';
import '../assets/styles/myProfile.css'
import { AiOutlineLeft } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateCustomerDetails } from '../redux/actions/authActions';

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
  return whatsappChecked ? 1 : 0;
};



// Extracted ProfileForm component
const ProfileForm = ({ 
  form, 
  profile, 
  editMode, 
  onFinish, 
  onFinishFailed,
  handleDealerChange, 
  fileInputRef, 
  handleFileChange, 
  setModalOpen, 
  onEdit, 
  onCancel,
  handleBeforeUpload,
  renderAvatarContent,
  setAvatarUrl,
  imageUrl,
  avatarUrl,
  uploadedDocUrl,
  handleDocumentDownload
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
                className="form-label-text"
              >
                Company Name*
              </span>
            }
            required={false}
            name="company"
             rules={[
                      {  required: true,
                        message: 'Company name is required',
                      },
                       {
                    max: 100,
                    message: 'Company name cannot exceed 100 characters',
                  },
                    ]}
          >
            <Input
             disabled={!editMode}
              className="form-input-text"
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
           required={false} 
  label={
    <span
      style={{
        fontSize: '12px',
        fontWeight: 400,
        color: '#637D92',
      }}
    >
      Owner's Name*
    </span>
  }
  name="owner"
  rules={[
    {
      required: true,
      message: 'Owner name is required',
    },
    {
      pattern: /^[a-zA-Z\s'-]{1,100}$/,
      message:
        'Owner name can only contain letters'
    },
  ]}
>
  <Input
    disabled={!editMode}
    style={{
      fontSize: '12px',
      fontWeight: 400,
      color: '#4A5E6D',
    }}
    maxLength={100} // enforce max length at input level
  />
</Form.Item>

        </Col>
        <Col span={6}>
          <Form.Item
            label={
              <span
                className="form-label-text"
              >
                Company Address*
              </span>
            }
            name="address"
            required={false}
            rules={[
                      {  required: true,
                        message: 'Company address is required',
                      },
                      {
                    max: 500,
                    message: 'Company Address cannot exceed 500 characters',
                  },
                    ]}
          >
            <Input
             disabled={!editMode}
              className="form-input-text"
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={
              <span
                className="form-label-text"
              >
                Company Phone Number*
              </span>
            }
            name="phone"
            required={false}
           rules={[
                  { required: true, message: 'Company Phone Number is required' },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'Company Phone Number should contain only numbers',
                  },
                  {
                    max: 13,
                    message: 'Company Phone Number cannot exceed 13 numbers',
                  },
                    {
                    min: 6,
                    message: 'Company Phone Number minimum 6 numbers',
                  },
                ]}
          >
            <Input
            disabled={!editMode}
              className="form-input-text"
             
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const renderAdditionalDealerFields = (form, editMode, fileInputRef, handleFileChange, uploadedDocUrl, handleDocumentDownload) => {
    if (form.getFieldValue('dealer') !== 'yes') {
      return null;
    }
    
    return (
      <>
        <Col span={8}>
          <Form.Item
            label={
              <span
                className="form-label-text"
              >
                Company Registration Number CR*
              </span>
            }
            name="reg"
            required={false}
         rules={[
                  { required: true, message: 'Company Registration Number  is required' },]}
          >
            <Input
             disabled={!editMode}
              className="form-input-text"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={
              <span
                className="form-label-text"
              >
                Facebook Page (Optional)
              </span>
            }
            name="facebook"
          >
            <Input
            disabled={!editMode}
              className="form-input-text"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={
              <span
                className="form-label-text"
              >
                Instagram Company Profile (Optional)
              </span>
            }
            name="instagram"
          >
            <Input
            disabled={!editMode}
              className="form-input-text"
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
                                Upload Documents*
                              </span>
                            }
                            name="uploadDocuments"
                            required={false}
                             rules={[
                                {
                                  required: true,
                                  message: 'Please upload your company documents',
                                },
                              ]}
                          >
                            <div>
                              {uploadedDocUrl && (
                                <div className="document-upload-container">
                                  <div
                                    className="document-upload-content"
                                    onClick={() => handleDocumentDownload(uploadedDocUrl)}
                                  >
                                    <span className="document-icon">📄</span>
                                    <span className="document-filename">
                                      {uploadedDocUrl.split('/').pop() || 'Download Document'}
                                    </span>
                                    <span className="document-download-text">
                                      Click to download
                                    </span>
                                  </div>
                                </div>
                              )}
                                                          <Input
                                disabled={!editMode}
                                type="file"
                                placeholder="Documents"
                                size="middle"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf"
                              />
                            </div>
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
            className="btn-solid-blue btn-back"
            shape="round"
            type="primary"
            htmlType="submit"
           
          >
            Save Changes
          </Button>
        </>
      );
    }

    return (
      <Button
        className="btn-solid-blue btn-edit-text"
        icon={<EditOutlined />}
        shape="round"
        type="primary"
        onClick={onEdit}
      >
        Edit Profile
      </Button>
    );
  };

  return (
    <div className="myprofile-card">
      <Row gutter={24} align="middle" className="profile-header-row">
        <Col span={24}>
          <div className="profile-header-row">
            <div className="profile-avatar-name">
              <div
                className={`profile-avatar-upload${
                  editMode ? ' editable' : ''
                }`}
                style={{ cursor: editMode ? 'pointer' : 'default' }}
              >
               <div
        className="avatar-container"
      >
        <Upload 
          showUploadList={false} 
          beforeUpload={handleBeforeUpload}
          disabled={!editMode}
        >
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
              cursor: editMode ? 'pointer' : 'default',
            }}
          >
            {renderAvatarContent()}

       {  editMode &&  <PlusCircleFilled
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
            />}
          </div>
        </Upload>
      </div>
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
        onFinishFailed={onFinishFailed}
        className={editMode ? '' : 'edit-mode-form'}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              required={false} 
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
               rules={[
                  { required: true, message: 'First name is required' },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: 'First name should contain only letters',
                  },
                  {
                    max: 50,
                    message: 'First name cannot exceed 50 characters',
                  },
                ]}
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
            required={false} 
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
               rules={[
                  { required: true, message: 'Last name is required' },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: 'Last name should contain only letters',
                  },
                  {
                    max: 50,
                    message: 'Last name cannot exceed 50 characters',
                  },
                ]}
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
  rules={[
    {
      type: 'email',
      message: 'Please enter a valid email address',
      validator: (_, value) => {
        if (!value || value?.trim() === '') {
          return Promise.resolve();
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value)
          ? Promise.resolve()
          : Promise.reject('Please enter a valid email address');
      },
    },
  ]}
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
required={false} 
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
      className="radio-group-container"
    onChange={() => {}}
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
              <Radio.Group onChange={handleDealerChange} disabled={!editMode}>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {renderDealerFields(form, editMode)}
        </Row>

        <Row gutter={16}>
          {renderAdditionalDealerFields(form, editMode, fileInputRef, handleFileChange, uploadedDocUrl, handleDocumentDownload)}
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
  onFinishFailed: PropTypes.func.isRequired,
  handleDealerChange: PropTypes.func.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  handleBeforeUpload: PropTypes.func.isRequired,
  renderAvatarContent: PropTypes.func.isRequired,
  setAvatarUrl: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  avatarUrl: PropTypes.string,
};

const MyProfileForm = () => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef();
  const [, setDealerValue] = useState(YES);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [, setUsersData] = useState({});
  const [, setDobError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadedDocUrl, setUploadedDocUrl] = useState('');
  const navigate = useNavigate();
  
  // Get user data from Redux
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { user } = useSelector((state) => state.auth);
  
  // Debug Redux state
  console.log('MyProfileForm Redux state:', {
    customerDetails,
    user
  });
  
  // Helper function to get user data from either source
  const getUserData = () => {
    return customerDetails || user || {};
  };
  
  const userData = getUserData();
  console.log('MyProfileForm userData:', userData);

  const handleConfirm = () => {
      setModalOpen(false);
    navigate('/myProfile/change-phone');
};

  const onFinishFailed = ({ errorFields, values }) => {
    
    const dobErr = errorFields.find((f) => f.name[0] === 'dob');
    setDobError(dobErr ? dobErr.errors[0] : '');
    
   
  };

  const onFinish = async (values) => {
    
    try {
      await onClickContinue();
    } catch (error) {
      // Silent error handling
    }
  };

  const onEdit = () => {

    setEditMode(true);
    form.setFieldsValue(profile);
  };

  const onCancel = () => {

    setEditMode(false);
    setImageUrl(null); // Clear any new image selection
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



  useEffect(() => {
    Userdataapi();
  }, []);
  
  // Watch for changes in Redux user data
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      console.log('Redux user data changed, updating profile:', userData);
      populateUserProfile(userData, 'Profile updated from Redux');
    }
  }, [userData]);



const Userdataapi = async () => {
  try {
    setLoading(true);
    
    // First, try to use Redux data if available
    if (userData && Object.keys(userData).length > 0) {
      console.log('Using Redux data for profile:', userData);
      populateUserProfile(userData, 'Profile loaded from Redux');
      return;
    }
    
    // If no Redux data, fetch from API
    console.log('No Redux data, fetching from API');
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
  setAvatarUrl(user.profile_image || user.profile_pic || '');
  setDealerValue(userProfile.dealer);
  setUploadedDocUrl(user.document || '');
  message.success(successMsg || MSG_FETCH_SUCCESS);
};

const BASE_URL = process.env.REACT_APP_API_URL;

const mapUserToProfile = (user) => {
  const profilePic = user.profile_pic || '';
  const fullAvatarUrl =
    profilePic && !profilePic.startsWith('http')
      ? `${BASE_URL}${profilePic}`
      : profilePic;

  return {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    dob: user.date_of_birth ? dayjs(user.date_of_birth) : null,
    dealer: user.is_dealer === 1 ? YES : NO,
    company: user.company_name || '',
    owner: user.owner_name || '',
    address: user.company_address || '',
    phone: user.company_phone_number || '',
    reg: user.company_registration_number || '',
    facebook: user.facebook_page || '',
    instagram: user.instagram_company_profile || '',
    avatar: fullAvatarUrl, 
  };
};


const applyUpdatedUser = (updateParams) => {
  const {
    user,
    successMsg,
    form,
    setUsersData,
    setProfile,
    setAvatarUrl,
    setDealerValue,
    setEditMode,
    setImageUrl
  } = updateParams;
  
  
  
  const updatedProfile = mapUserToProfile(user);
  
  setUsersData(user);
  setProfile(updatedProfile);
  form.setFieldsValue(updatedProfile);
  setAvatarUrl(user.profile_image || user.profile_pic || '');
  setDealerValue(user.is_dealer ? YES : NO);
  setUploadedDocUrl(user.document || '');
  
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
    const first = form.getFieldValue('first_name') || '';
    const last = form.getFieldValue('last_name') || '';
    return (first[0] || '').toUpperCase() + (last[0] || '').toUpperCase();
  };



  const renderAvatarContent = () => {
    // Priority: imageUrl (newly uploaded) > avatarUrl (current) > profile.avatar (saved)
    const displayImage = imageUrl || avatarUrl || profile.avatar;
   
    if (displayImage) {
      return (
        <img
          src={`${BASE_URL}${displayImage}`}
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

   const handleDocumentDownload = (documentUrl) => {
     try {
       const fullUrl = documentUrl.startsWith('http') 
         ? documentUrl 
         : `${process.env.REACT_APP_API_URL}${documentUrl}`;
       window.open(fullUrl, '_blank');
     } catch (error) {
       messageApi.open({
         type: 'error',
         content: 'Failed to open document. Please try again.',
       });
     }
  };

   const handleFileChange = async (e) => {
      const file = e.target.files[0];
  
      if (!file) return;
  
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        messageApi.open({
          type: 'error',
          content: 'Upload failed. Only .pdf documents are allowed.',
        });
        return;
      }

      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        messageApi.open({
          type: 'error',
          content: 'Document must be smaller than 10 MB.',
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
    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    
    const formData = new FormData();
    formData.append('attachment', file);

    try {
      setLoading(true);
    
      const response = await authAPI.uploadimages(formData);
     
      
      const userdoc = handleApiResponse(response);

      // Check for different possible field names
      const possibleImageFields = ['attachment_url', 'image_url', 'url', 'file_url', 'path', 'data'];
      let imageUrl = null;
      
      for (const field of possibleImageFields) {
        if (userdoc?.[field]) {
          imageUrl = userdoc[field];
          break;
        }
      }

      if (imageUrl) {
        // Ensure we have a complete URL
        let finalImageUrl = imageUrl;
        
        // If the URL is relative, make it absolute
        if (finalImageUrl.startsWith('/')) {
          finalImageUrl = finalImageUrl;
          
          
        }
        
        
        // Update both imageUrl and avatarUrl with the complete URL
        setImageUrl(finalImageUrl);
        setAvatarUrl(finalImageUrl);
      
        
        messageApi.open({
          type: 'success',
          content: userdoc.message || 'Profile image uploaded successfully',
        });
        return Upload.LIST_IGNORE; 
      } else {
       
        message.error(userdoc?.message || 'Upload failed - no image URL received');
        return Upload.LIST_IGNORE;
      }
    } catch (error) {
     
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData.message || 'Upload failed due to network error',
      });
      return Upload.LIST_IGNORE; 
    } finally {
      setLoading(false);
    }
  };

    const dispatch = useDispatch();


  const onClickContinue = async () => {
  try {
    
    setLoading(true);
    
   
    const values = await form.validateFields();
    
    // Check if required fields are filled
    if (!values.first_name || !values.last_name || !values.dob) {
      message.error('Please fill in all required fields (First Name, Last Name, Date of Birth)');
      return;
    }
 
    const formattedDob = values.dob 
  ? dayjs(values.dob).format('YYYY-MM-DD') 
  : '';
    
    const profilePicUrl = imageUrl || avatarUrl || '';

    
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
      profile_pic: profilePicUrl,
      location: values.address || '',
      document: uploadedDocUrl
    };
   
    const response = await userAPI.updateProfile(payload);
    
    const result = handleApiResponse(response);
      dispatch(updateCustomerDetails({
          first_name: result?.user?.first_name,
          last_name: result?.user?.last_name,
          profile_pic: result?.user?.profile_pic,
        }));
    if (result?.user) {
      

    try {
        const profileResponse = await userAPI.getProfile({});
        
        const profileResult = handleApiResponse(profileResponse);
        if (profileResult?.data) {
          applyUpdatedUser({
            user: profileResult.data,
            successMsg: result.message,
            form,
            setUsersData,
            setProfile,
            setAvatarUrl,
            setDealerValue,
            setEditMode,
            setImageUrl,
          });
        } else {
          applyUpdatedUser({
            user: result.data,
            successMsg: result.message,
            form,
            setUsersData,
            setProfile,
            setAvatarUrl,
            setDealerValue,
            setEditMode,
            setImageUrl,
          });
        }
      } catch (profileError) {
        applyUpdatedUser({
          user: result.data,
          successMsg: result.message,
          form,
          setUsersData,
          setProfile,
          setAvatarUrl,
          setDealerValue,
          setEditMode,
          setImageUrl,
        });
      }
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
   * @returns {JSX.Element} Header content
   */
  const renderHeaderContent = () => {
  if (editMode) {
    return (
      <>
        <AiOutlineLeft
          onClick={onCancel}
          style={{ fontSize: '18px', cursor: 'pointer', marginRight: '10px' }}
        />
        Edit Profile
      </>
    );
  }

  return 'My Profile';
};


  /**
   * Renders the main content based on current state
   * @returns {JSX.Element} Main content
   */
  const renderMainContent = () => {
  return (
    <ProfileForm 
      form={form} 
      profile={profile} 
      editMode={editMode} 
      onFinish={onFinish} 
      onFinishFailed={onFinishFailed}
      handleDealerChange={handleDealerChange} 
      fileInputRef={fileInputRef} 
      handleFileChange={handleFileChange} 
      setModalOpen={setModalOpen} 
      onEdit={onEdit} 
      onCancel={onCancel}
      handleBeforeUpload={handleBeforeUpload}
      renderAvatarContent={renderAvatarContent}
      setAvatarUrl={setAvatarUrl}
      imageUrl={imageUrl}
      avatarUrl={avatarUrl}
      uploadedDocUrl={uploadedDocUrl}
      handleDocumentDownload={handleDocumentDownload}
    />
  );
};

  return (
    <div className='myprofile-main'>
      {contextHolder}
     <div className='myprofile-header profile-header-container'>
  {renderHeaderContent()}
</div>
      {renderMainContent()}

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
          className= 'popup-close-icon'
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



// PropTypes for the main component
MyProfileForm.propTypes = {
  // This component doesn't accept external props
  // All state is managed internally
};

export default MyProfileForm;