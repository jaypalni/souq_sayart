/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/styles/header.css';
import '../assets/styles/header-mobile.css';
import '../assets/styles/header-tablet.css';
import '../assets/styles/header-medium.css';
import '../assets/styles/header-large.css';
import '../assets/styles/header-extra-large.css';
import iconWhite from '../assets/images/souqLogo.svg';
import NotifiyImg from '../assets/images/bell.svg';
import MessagesImg from '../assets/images/messages.svg';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Select, message, Dropdown,  Modal, Button } from 'antd';
import { logoutUser, clearCustomerDetails } from '../redux/actions/authActions';
import { useToken } from '../hooks/useToken';
import { userAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { updateCustomerDetails } from '../redux/actions/authActions';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const dispatch = useDispatch();
  const { currentLanguage, changeLanguage, translate } = useLanguage();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const [activeMenu, setActiveMenu] = useState('');
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const token = useToken();
   const [logoutModalOpen, setLogoutModalOpen] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuList = [
    {
      id: '',
      name: translate('header.BUY'),
      path: '/landing',
      displayName: '',
      requiresAuth: false,
    },
    {
      id: '',
      name: translate('header.SELL'),
      path: '/sell',
      displayName: '',
      requiresAuth: true,
    },
    {
      id: '',
      name: translate('header.MY_LISTINGS'),
      path: '/myListings',
      displayName: '',
      requiresAuth: true,
    },
    {
      id: '',
      name: translate('header.EVALUATE_MY_CAR'),
      path: '/evaluate',
      displayName: '',
      requiresAuth: false,
    },
  ];
  const navigate = useNavigate();
  const { Option } = Select;
  
useEffect(()=>{
  // getUserDisplayName()
  Userdataapi()
},[])

useEffect(() => {
  const current = menuList.find(
    (item) => location.pathname.startsWith(item.path) && item.name !== 'Evaluate My Car'
  );
  if (current) {
    setActiveMenu(current.name);
  } else {
    setActiveMenu(''); // clear when evaluate is opened
  }
}, [location.pathname]);


const Userdataapi = async () => {
  try {
    const response = await userAPI.getProfile({});
    
    const result = handleApiResponse(response);
    
    dispatch(updateCustomerDetails({
      first_name: result?.data?.first_name,
      last_name: result?.data?.last_name,
      profile_pic: result?.data?.profile_pic,
      email:result?.data?.email,
      company_name: result?.data?.company_name,
      dealer: result?.data?.is_dealer,
    }));
  
  } catch (error) {
    // Silent error handling
  }
};

  const getUserDisplayName = () => {
    
    if (isAuthenticated && customerDetails) {
      const firstName = customerDetails.first_name || user.firstName || '';
      return firstName.trim();
    }

    if (customerDetails) {
      const firstName =
        customerDetails.first_name || customerDetails.firstName || '';
      return firstName.trim();
    }

    if (localStorage.getItem('isGuest') === 'true') {
      return translate('header.GUEST');
    }

    return null;
  };

  const userMenuItems = [
    {
      key: 'myProfile',
      label: translate('header.MY_PROFILE'),
      icon: <UserOutlined />,
      onClick: () => navigate('/myProfile'),
    },
    {
      key: 'settings',
      label: translate('header.SETTINGS'),
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
    },
    {
      key: 'changePassword',
      label: translate('header.CHANGE_PASSWORD'),
      onClick: () => navigate('/changePassword'),
    },
    {
      type: 'divider',
    },
    {
       key: 'logout',
      label: translate('header.LOGOUT'),
      onClick: () => setLogoutModalOpen(true), 
    },
  ];

  const comingsoonMessage = (value) => {
    if (value.requiresAuth) {
      // Token is now available from Redux state
      const isGuest = localStorage.getItem('isGuest');
      const isLoggedIn = isAuthenticated || getUserDisplayName() || token;

      if (!isLoggedIn || isGuest) {
        messageApi.open({
          type: 'warning',
          content: translate('header.PLEASE_LOGIN'),
        });
        localStorage.removeItem('isGuest');
        navigate('/login');
        return;
      }
    }

    if (value.name === translate('header.EVALUATE_MY_CAR')) {
      messageApi.open({
        type: 'success',
        content: translate('header.COMING_SOON'),
      });
      return;
    }

    navigate(value.path);
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await dispatch(logoutUser());
      dispatch(clearCustomerDetails());
      dispatch({ type: 'CLEAR_USER_DATA' });

      messageApi.open({
        type: 'success',
        content: translate('header.LOGGED_OUT_SUCCESS'),
      });

      setLogoutModalOpen(false); // close modal
      navigate('/');
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: translate('header.LOGOUT_FAILED'),
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuClick = (item) => {
    closeMobileMenu();
    comingsoonMessage(item);
  };

  return (
    <>
      <div className="header">
        {contextHolder}
        <div className="row remove_gutter">
          <div className="col-3 d-flex">
            <button 
              type="button" 
              className="headerLogo header-logo-button" 
              onClick={() => navigate('/')}
            >
              <img src={iconWhite} alt="Logo" />
            </button>
            
            {/* Mobile Icons - Left side */}
            {getUserDisplayName() && (
              <div className="mobile-icons-left">
                <div className="mobile-icon-container">
                  <button
                    type="button"
                    className="mobile-message-icon"
                    onClick={() => {
                      // Add message functionality here
                    }}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                    aria-label="Open messages"
                  >
                    <img
                      src={MessagesImg}
                      alt="Messages"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </button>
                </div>
                <div className="mobile-icon-container">
                  <button
                    type="button"
                    className="mobile-notification-icon"
                    onClick={() => {
                      // Add notification functionality here
                    }}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                    aria-label="Open notifications"
                  >
                    <img
                      src={NotifiyImg}
                      alt="Notifications"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </button>
                </div>
              </div>
            )}
            
            {/* Hamburger Menu Button - Right side */}
            <button 
              type="button" 
              className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </button>
          </div>
          <div className="col-5 d-flex align-items-center  justify-content-center">
            {menuList.map((item) => (
  <button
    type="button"
    className={`menuItem mx-3 menu-item-button ${
      activeMenu === item.name ? 'active-menu' : ''
    }`}
    key={item.name}
    onClick={() => {
  if (item.name !== 'Evaluate My Car') {
    setActiveMenu(item.name);
  }
  comingsoonMessage(item);
}}

    aria-label={`Navigate to ${item.name}`}
  >
    {item.name}
  </button>
))}
          </div>
          <div className="col-4 d-flex align-items-center justify-content-center">
            {getUserDisplayName() && (
              <>
                <div className="menuLeft mx-1">
                  <img
                    className="headerLogo message-icon"
                    src={MessagesImg}
                  />
                </div>
                <div className="menuLeft mx-2">
                  <img
                  height={200}
                  width={30}
                    className=" notification-icon"
                    src={NotifiyImg}
                  />
                </div>
              </>
            )}
            {getUserDisplayName() && getUserDisplayName() !== 'Guest' ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div
                  className="menuLeft mx-2 user-dropdown"
                >
                  <UserOutlined className="user-dropdown-icon" />
                  {getUserDisplayName()}
                  <span className="user-dropdown-arrow">▼</span>
                </div>
              </Dropdown>
            ) : (
              <button
                type="button"
                className="menuLeft mx-2 login-button"
                onClick={() => {
                  localStorage.removeItem('isGuest');
                  navigate('/login');
                }}
                aria-label="Sign up or Login"
              >
                {translate('header.SIGN_UP_LOGIN')}
              </button>
            )}
         
           <div className="menuLeft mx-2">
      <div 
        className="contct_us_btn" 
        onClick={() => navigate('/contactus')}
        style={{ cursor: 'pointer' }}
      >
{translate('header.CONTACT_US')}
      </div>
    </div>
            <div
              className="menuLeft mx-1 language-select-container"
            >
              <Select
                value={currentLanguage}
                bordered={false}
                className='laguageSelect language-select'
                dropdownStyle={{
                  backgroundColor: 'white',
                  boxShadow: 'none',
                }}
                onChange={changeLanguage}
              >
                <Option value="en">English</Option>
                <Option value="ar">أرابيك</Option>
                <Option value="ku">کوردی</Option>
              </Select>
            </div>
          </div>
        </div>

        <Modal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={null}
        title={
          <div className="brand-modal-title-row">
            <span
              className="modal-title-text"
            >
              {translate('header.LOGOUT_CONFIRM')}
            </span>
          </div>
        }
        width={350}
      >
        <div
          className="modal-button-container"
        >
          <Button
            onClick={() => setLogoutModalOpen(false)}
            className="modal-cancel-button"
          >
            {translate('common.CANCEL')}
          </Button>
          <Button
            type="primary"
            onClick={handleLogout}
            className="modal-confirm-button"
          >
            {translate('common.CONFIRM')}
          </Button>
        </div>
      </Modal>

      {/* Mobile Menu Overlay */}
      <button 
        type="button"
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
        aria-label="Close mobile menu"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1000
        }}
      />

      {/* Mobile Menu Panel */}
      <div className={`mobile-menu-panel ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <img src={iconWhite} alt="Logo" className="mobile-menu-logo" />
          {/* <button 
            type="button" 
            className="mobile-menu-close"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            ×
          </button> */}
        </div>

        <div className="mobile-menu-items">
          {menuList.map((item) => (
            <button
              key={item.name}
              type="button"
              className="mobile-menu-item"
              onClick={() => handleMobileMenuClick(item)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Menu User Section */}
        <div className="mobile-menu-user-section">
          {getUserDisplayName() && getUserDisplayName() !== 'Guest' ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="mobile-menu-user-dropdown">
                <UserOutlined className="mobile-menu-user-icon" />
                {getUserDisplayName()}
                <span className="mobile-menu-dropdown-arrow">▼</span>
              </div>
            </Dropdown>
          ) : (
            <button
              type="button"
              className="mobile-menu-login"
              onClick={() => {
                closeMobileMenu();
                localStorage.removeItem('isGuest');
                navigate('/login');
              }}
            >
              {translate('header.SIGN_UP_LOGIN')}
            </button>
          )}
        </div>

        {/* Mobile Menu Language Select */}
        <div className="mobile-menu-language-section">
          <Select
            value={currentLanguage}
            bordered={false}
            className="mobile-menu-language-select"
            dropdownStyle={{
              backgroundColor: 'white',
              boxShadow: 'none',
            }}
            onChange={changeLanguage}
          >
            <Option value="en">English</Option>
            <Option value="ar">العربية</Option>
            <Option value="ku">کوردی</Option>
          </Select>
        </div>

        <div className="mobile-menu-actions">
          <button 
            type="button" 
            className="mobile-menu-contact"
            onClick={() => {
              closeMobileMenu();
              // Add contact us functionality here
            }}
          >
            {translate('header.CONTACT_US')}
          </button>
        </div>
      </div>

      </div>
    </>
  );
};
export default Header;