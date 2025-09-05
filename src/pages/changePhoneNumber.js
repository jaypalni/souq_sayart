/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { message, Layout, Menu, Avatar, Button, Switch, Modal } from 'antd';
import { AiOutlineLeft } from 'react-icons/ai';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { authAPI, userAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useSelector, useDispatch } from 'react-redux';
import { clearCustomerDetails } from '../redux/actions/authActions';
import '../assets/styles/signupOtp.css';
import '../assets/styles/myProfile.css';
import profileIcon from '../assets/images/Profile_icon.svg';
import subsriptionIcon from '../assets/images/Subscriptions_icon.png';
import messageIcon from '../assets/images/Messages_icon.png';
import notificationIcon from '../assets/images/Notification_icon.png';
import searchesIcon from '../assets/images/Capa_1.png';
import paymentIcon from '../assets/images/Payment_icon.png';
import blockIcon from '../assets/images/Block_icon.png';
import dealerIcon from '../assets/images/Dealer_icon.png';
import favoriteIcon from '../assets/images/Favorites_icon.png';
import whatsupIcon from '../assets/images/Whatsup.png';
import logoutIcon from '../assets/images/Logout_icon.png';
import deleteIcon from '../assets/images/Delete_icon.png';
import whatsappIcon from '../assets/images/Whatsup.svg';

const { Sider, Content } = Layout;
const CACHE_KEY = 'geoDataCache';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const INDIA_TZ_OFFSET_MINUTES = -330;

// Helper functions
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

const toWhatsappFlag = (whatsappChecked) => {
  return whatsappChecked ? 1 : 0;
};




const ChangePhoneNumberPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [phone, setPhone] = useState('');
  const [emailerrormsg, setEmailErrorMsg] = useState('');
  const [checked, setChecked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [, setDeleteData] = useState([]);
      const [timer, setTimer] = useState(30);
  const [whatsappNotification, setWhatsappNotification] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
       const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const { customerDetails } = useSelector((state) => state.customerDetails);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await userAPI.getProfile({});
        const profileData = handleApiResponse(response);
        if (profileData) {
          setWhatsappNotification(profileData?.data?.whatsapp);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleWhatsappToggle = async (checked) => {
    try {
      setWhatsappLoading(true);
      const whatsappValue = checked ? 1 : 0;
      const response = await userAPI.updateProfile({ whatsapp: whatsappValue });
      const result = handleApiResponse(response);
      
      if (result) {
        setWhatsappNotification(checked);
        messageApi.open({
          type: 'success',
          content: 'WhatsApp notification preference updated successfully!',
        });
      }
    } catch (error) {
      setWhatsappNotification(!checked);
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData?.message || 'Failed to update WhatsApp preference',
      });
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    userlogout();
  };

  const userlogout = async () => {
    try {
      setLoading(true);
      const response = await authAPI.logout({});
      const data1 = handleApiResponse(response);
      localStorage.clear();
      dispatch(clearCustomerDetails());
      dispatch({ type: 'CLEAR_USER_DATA' });
      messageApi.open({
        type: 'success',
        content: data1?.message,
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData?.error,
      });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      key: 'Personal Informations',
      label: (
        <Link
          to="/myProfile"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#0A0A0B',
          }}
        >
          {' '}
          Personal Informations
        </Link>
      ),
    },
    {
      key: 'profile',
      icon: <img src={profileIcon} alt="Profile" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Profile
        </Link>
      ),
    },
    {
      key: 'subscriptions',
      icon: <img src={subsriptionIcon} alt="Profile" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile/subscriptions"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Subscriptions
        </Link>
      ),
    },
    {
      key: 'messages',
      icon: <img src={messageIcon} alt="Message" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile/messages"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Messages
        </Link>
      ),
    },
    {
      key: 'notifications',
      icon: <img src={notificationIcon} alt="Notification" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile/notifications"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Manage Notifications
        </Link>
      ),
    },
    {
      key: 'searches',
      icon: <img src={searchesIcon} alt="Searches" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile/searches"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Saved Searches
        </Link>
      ),
    },
    {
      key: 'payments',
      icon: <img src={paymentIcon} alt="Payment" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile/payments"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Payments
        </Link>
      ),
    },
    {
      key: 'blocked',
      icon: <img src={blockIcon} alt="Block" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile/blocked"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Blocked users
        </Link>
      ),
    },
    {
      key: 'dashboard',
      icon: <img src={dealerIcon} alt="Dealor" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile/dashboard"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Dealership Dashboard
        </Link>
      ),
    },
    {
      key: 'favorites',
      icon: <img src={favoriteIcon} alt="Favorite" style={{ width: 16, height: 16 }} />,
      label: (
        <Link
          to="/myProfile/favorites"
          style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#0A0A0B',
          }}
        >
          Favorites
        </Link>
      ),
    },
    {
      key: 'whatsapp',
      icon: <img src={whatsupIcon} alt="Whatsup" style={{ width: 16, height: 16 }}/>,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>WhatsApp</span>
          <Switch 
            size="small" 
            checked={whatsappNotification}
            onChange={handleWhatsappToggle}
            loading={whatsappLoading}
          />
        </div>
      ),
    },
  ];
   const manageItems = [
  { key: 'logout', icon: <img src={logoutIcon} alt="Logout" style={{ width: 16, height: 16 }} />, label: 'Logout' },
   {
      key: 'delete',
      icon: <img src={deleteIcon} alt="Delete" style={{ width: 16, height: 16 }} />,
      label: 'Delete Account',
      disabled: false, 
    },
];

 useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsDeleteDisabled(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const initializeCountries = async () => {
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
      } catch (err) {
        messageApi.open({
          type: 'error',
          content: 'Failed to load country options',
        });
      }
    };

    initializeCountries();
  }, [messageApi]);

  const handlePhoneChange = (e) => {
    const numb = e.target.value;
    setEmailErrorMsg('');

    if (!/^\d*$/.test(numb)) {
      return;
    }

    setPhone(numb);
  };

  const onContinue = async () => {
    if (phone === '') {
      setEmailErrorMsg('Phone number is required!');
      return;
    }

    try {
      setLoading(true);
       localStorage.removeItem('otpEndTime'); 
      localStorage.removeItem('fromLogin');
      localStorage.removeItem('userData'); 
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
          localStorage.setItem('fromLogin', 'true');
        }
        // Navigate to OTP page
        navigate('/myProfile/change-phone-otp');
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: 'error', content: errorData.message });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getDelete();
        const data1 = handleApiResponse(response);
  
        if (data1) {
          setDeleteData(data1)
          localStorage.setItem('requestId',data1.request_id)
          messageApi.open({
            type: 'success',
            content: data1?.message,
          });
           navigate('/deleteaccount-otp')
        }
      } catch (error) {
        setDeleteData([])
        const errorData = handleApiError(error);
        messageApi.open({
          type: 'error',
          content: errorData?.message,
        });
      }
    }
  const switchStyle = {
    backgroundColor: checked ? '#008AD5' : '#ccc',
  };

   const whatsapphandleChange = (value) => {
    setChecked(value);
  };

  const toWhatsappFlag = (whatsappChecked) => {
    if (whatsappChecked) {
      return 1;
    }
    return 0;
  };

  return (
    <>
      <div className="page-header">
        {contextHolder}
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>My Profile</div>
        <div style={{ fontSize: 11 }}>Post an ad in just 3 simple steps</div>
      </div>
      <Layout style={{ background: '#fff' }}>
        <Sider
          width={260}
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            padding: '32px 0 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 4, padding: '0 24px' }}>
            <Avatar
              size={48}
              style={{
                background: '#e3f1ff',
                color: '#1890ff',
                fontWeight: 700,
              }}
            >
              RD
            </Avatar>
            {!collapsed && <div style={{ fontWeight: 600 }}>{customerDetails.first_name + ' ' + customerDetails.last_name}</div>}
          </div>

          <Menu mode="inline" selectedKeys={['profile']} style={{ borderRight: 0 }} items={menuItems} />

          <div style={{ marginTop: 32 }}>
            <div
              style={{
                padding: '0 24px',
                color: '#0A0A0B',
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              Manage Account
            </div>
           <Menu
                        mode="inline"
                        style={{ borderRight: 0, fontWeight: 400, fontSize: '12px' }}
                        items={manageItems}
                       onClick={({ key }) => {
                          if (key === 'logout') setLogoutModalOpen(true);
                          if (key === 'delete' && !isDeleteDisabled) setDeleteModalOpen(true); // Only open modal if not disabled
                        }}
                      />
          </div>

          <Button
            type="text"
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            style={{ position: 'absolute', top: 10, right: -18, zIndex: 1000 }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </Sider>
        <Layout>
          <Content style={{ padding: '40px 40px 0 40px', background: '#fff' }}>
            <div className='myprofile-main'>
              <div className='myprofile-header' style={{ display: 'flex', alignItems: 'center' }}>
                <AiOutlineLeft
                  onClick={() => navigate('/myProfile')}
                  style={{ fontSize: '18px', cursor: 'pointer', marginRight: '10px' }}
                />
                Change Mobile Number
              </div>
              
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
                                src={`${BASE_URL}${selectedCountry.country_flag_image}`}
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
                                  src={`${BASE_URL}${country.country_flag_image}`}
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
                    <div className="row g-3">
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                        padding: 10,
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
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>

      <Modal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={null}
        title={<div className="brand-modal-title-row"><span style={{textAlign:'center',margin:'15px 0px 0px 15px',fontWeight: 700}}>Are you sure you want to log out?</span></div>}
        width={350}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '2px',marginTop:'15px' }}>
          <Button
            onClick={() => setLogoutModalOpen(false)}
            style={{
              width: 120,
              backgroundColor: '#ffffff',
              color: '#008AD5',
              borderColor: '#008AD5',
              borderWidth: 1,
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '24px',
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleLogout}
            style={{
              width: 120,
              backgroundColor: '#008AD5',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '24px',
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
           <Modal
              open={deleteModalOpen}
              onCancel={() => setDeleteModalOpen(false)}
              footer={null}
              title={<div className="brand-modal-title-row"><span style={{textAlign:'center',marginTop:'15px',fontWeight: 700}}>Warning that all data (profile, listings, saved searches, favorites, etc.) will be permanently deleted.</span></div>}
              width={500}
            >
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '2px',marginTop:'25px' }}>
                <Button
                   onClick={() => {
                    setDeleteModalOpen(false);
                    setIsDeleteDisabled(false);
                  }}
                  style={{
                    width: 120,
                    backgroundColor: '#ffffff',
                    color: '#008AD5',
                    borderColor: '#008AD5',
                    borderWidth: 1,
                    fontSize: '16px',
                    fontWeight: 700,
                    borderRadius: '24px',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setIsDeleteDisabled(true);
                    // setShowOtpStep(true); 
                    setTimer(30);
                    setIsTimerRunning(true);
                    handleDelete();
                   
                  }}
                  style={{
                    width: 120,
                    backgroundColor: '#008AD5',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 700,
                    borderRadius: '24px',
                  }}
                >
                  Continue
                </Button>
              </div>
            </Modal>
    </>
  );
};

export default ChangePhoneNumberPage;
