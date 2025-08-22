/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Radio, Row, Col, Avatar, message } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { userAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import '../assets/styles/model.css';

const YES = 'yes';
const NO = 'no';
const DEFAULT_AVATAR_BG = '#e3f1ff';
const DEFAULT_AVATAR_COLOR = '#008AD5';
const MSG_FETCH_SUCCESS = 'Fetched successfully';
const MSG_PROFILE_UPDATED = 'Profile updated!';
const MSG_FETCH_FAILED = 'Failed to load profile';
const MSG_UPDATE_FAILED = 'Failed to update profile.';

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

  const handleConfirm = () => {
    alert('Confirmed!');
    setModalOpen(false);
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
  setAvatarUrl(user.avatar || '');
  setDealerValue(user.dealer || NO);
  message.success(successMsg || MSG_FETCH_SUCCESS);
};

const mapUserToProfile = (user) => ({
  first_name: user.first_name || '',
  last_name: user.last_name || '',
  email: user.email || '',
  dob: user.date_of_birth || '',
  dealer: user.dealer || NO,
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
  dob: user.date_of_birth || '',
  dealer: user.is_dealer ? YES : NO,
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

  const onClickContinue = async () => {
  try {
    setLoading(true);
    const values = await form.validateFields();
    
    const payload = {
      first_name: values.first_name || '',
      last_name: values.last_name || '',
      email: values.email || '',
      date_of_birth: values.dob || '',
      is_dealer: values.dealer === 'yes',
      company_name: values.company || '',
      owner_name: values.owner || '',
      company_address: values.address || '',
      company_phone_number: values.phone || '',
      company_registration_number: values.reg || '',
      facebook_page: values.facebook || '',
      instagram_company_profile: values.instagram || '',
      profile_pic: avatarUrl || '',
      whatsapp: values.phone || '',
      location: values.address || '',
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
      messageApi.open({
        type: 'success',
        content: result.message || 'Profile updated successfully',
      });
    }
  } catch (error) {
    handleSubmitError(error, onFinishFailed);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="myprofile-main">
      {contextHolder}
      <div className="myprofile-header">My Profile</div>
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
                  <Avatar
                    size={64}
                    src={avatarUrl || undefined}
                    style={{
                      background: '#e3f1ff',
                      color: '#008AD5',
                      fontWeight: 400,
                      fontSize: 26,
                      marginRight: 16,
                      cursor: editMode ? 'pointer' : 'default',
                    }}
                  >
                    RD
                  </Avatar>
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
                    Email
                  </span>
                }
                name="email"
              >
                <Input
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
                name="dob"
              >
                <Input
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#4A5E6D',
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
                    name="Company Address"
                  >
                    <Input
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
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose }) => {
   if (!isOpen) {
     return null; 
   }

  return (
    <div className="small-popup-container">
      <div className="small-popup">
        <span
          className="popup-close-icon"
          role="button"
          tabIndex={0}
          aria-label="Close"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onClose();
          }}
        >
          &times;
        </span>
        <p className="popup-text">
          Are you sure you want to change your number?
        </p>
        <div className="popup-buttons">
          <button className="popup-btn-no" onClick={onClose}>
            No
          </button>
          <button className="popup-btn-yes" onClick={onClose}>
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
};


export default MyProfileForm;