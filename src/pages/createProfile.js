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
import { PlusCircleFilled, TruckFilled, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { registerUser } from '../redux/actions/authActions';
import whatsappIcon from '../assets/images/Whatsup.svg';
import TermsAndconditions from './termsAndconditions';

const { Title, Text } = Typography;

const CreateProfile = () => {
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
  const isLoggedIn = customerDetails?.first_name;

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/landing');
    }
  }, []);

  useEffect(() => {
    const accesstoken = localStorage.getItem('token');

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

  const onFinishFailed = ({ errorFields }) => {
    const dobErr = errorFields.find((f) => f.name[0] === 'dob');
    const errorMessage = dobErr ? dobErr.errors[0] : undefined;
    setDobError(errorMessage);
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

  const MSG_REG_SUCCESS = 'Registration successful!';
  const MSG_REG_FAILED = 'Registration failed';

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
      return '1';
    }
    return '0';
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
      messageApi.open({ type: 'success', content: MSG_REG_SUCCESS });
      navigate('/landing');
      return;
    }
    messageApi.open({ type: 'error', content: result.error || MSG_REG_FAILED });
  };

  const handleNonValidationError = (error) => {
    const errorData = handleApiError(error);
    messageApi.open({ type: 'error', content: errorData.message });
    message.error(errorData.message || 'Registration failed. Please try again.');
  };

  const onClickContinue = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const phoneNumber = localStorage.getItem('phone_number');
      const payload = buildRegistrationPayload(values, imageUrl, phoneNumber);
      const result = await dispatch(registerUser(payload));
      handleRegistrationOutcome(result);
    } catch (error) {
      if (error.errorFields) {
        onFinishFailed(error);
      } else {
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
          Create Your Account
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
        >
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}
                  >
                    First Name<span style={{ color: '#637D92' }}>*</span>
                  </span>
                }
                name="firstName"
                rules={[
                  { required: true, message: 'First name is required' },
                  {
                    pattern: /^[A-Za-z]+$/,
                    message: 'First name should contain only letters',
                  },
                  {
                    max: 50,
                    message: 'First name cannot exceed 50 characters',
                  },
                ]}
                style={{ marginBottom: 12 }}
                required={false}
              >
                <Input placeholder="First Name" size="middle" maxLength={50} />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}
                  >
                    First Name<span style={{ color: '#637D92' }}>*</span>
                  </span>
                }
                name="lastName"
                rules={[
                  { required: true, message: 'Last name is required' },
                  {
                    pattern: /^[A-Za-z]+$/,
                    message: 'Last name should contain only letters',
                  },
                  {
                    max: 50,
                    message: 'Last name cannot exceed 50 characters',
                  },
                ]}
                style={{ marginBottom: 12 }}
                required={false}
              >
                <Input placeholder="Last Name" size="middle" maxLength={50} />
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
                    Email
                  </span>
                }
                name="email"
                required={false}
              >
                <Input placeholder="Email" size="middle" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}
                  >
                    Date Of Birth*
                  </span>
                }
                name="dob"
                rules={[
                  {
                    required: true,
                    message: 'this field is mandatory please fill it',
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
                  format="DD / MM / YYYY"
                  placeholder="DD / MM / YYYY"
                  size="middle"
                  disabledDate={(current) =>
                    current && current > moment().endOf('day')
                  }
                  inputReadOnly={true}
                />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 400, color: '#637D92', fontSize: 12 }}
                >
                  Are You A Dealer?*
                </span>
              }
              name="isDealer"
              rules={[
                {
                  required: true,
                  message: 'Please select if you are a dealer',
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
                  Yes
                </Radio>
                <Radio value={false}>No</Radio>
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
                        Company Name*
                      </span>
                    }
                    name="companyName"
                    rules={[
                      {
                        required: isDealer,
                        message: 'Company name is required',
                      },
                    ]}
                    required={false}
                  >
                    <Input placeholder="Company Name" size="middle" />
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
                        Owner's Name*
                      </span>
                    }
                    name="ownerName"
                    rules={[
                      { required: isDealer, message: 'Owner name is required' },
                    ]}
                    required={false}
                  >
                    <Input placeholder="Owner's Name" size="middle" />
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
                        Company Address*
                      </span>
                    }
                    name="companyAddress"
                    rules={[
                      {
                        required: isDealer,
                        message: 'Company address is required',
                      },
                    ]}
                    required={false}
                  >
                    <Input placeholder="Company Address" size="middle" />
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
                        Phone Number*
                      </span>
                    }
                    name="phoneNumber"
                    rules={[
                      {
                        required: isDealer,
                        message: 'Phone number is required',
                      },
                      {
                        pattern: /^\d{8,15}$/,
                        message: 'Enter a valid phone number',
                      },
                    ]}
                    required={false}
                  >
                    <Input placeholder="Phone Number" size="middle" />
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
                        Company Registration Number CR*
                      </span>
                    }
                    name="companyCR"
                    rules={[
                      { required: isDealer, message: 'CR number is required' },
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
                        Facebook Page (Optional)
                      </span>
                    }
                    name="facebookPage"
                    required={false}
                  >
                    <Input placeholder="Name" size="middle" />{' '}
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
                        Instagram Company Profile (Optional)
                      </span>
                    }
                    name="instagramProfile"
                    required={false}
                  >
                    <Input placeholder="Name" size="middle" />{' '}
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
                        Upload Documents
                      </span>
                    }
                    name="uploadDocuments"
                    required={false}
                  >
                    <Input
                      type="file"
                      placeholder="Documents"
                      size="middle"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                    />{' '}
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
  onChange={handleChange}
  style={switchStyle}
                  />
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
              Create account
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
              By registering you agree with our terms & conditions and privacy
              policy
            </button>

            
          </Text>
        </Form>
      </div>
      <Modal
        title="Terms & Conditions"
        visible={showModal}
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
      >
        <TermsAndconditions />
      </Modal>
    </div>
  );
};

export default CreateProfile;