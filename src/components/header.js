/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useEffect, useState } from 'react';
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
const Header = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const token = useToken();
   const [logoutModalOpen, setLogoutModalOpen] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuList = [
    {
      id: '',
      name: 'Buy',
      path: '/landing',
      displayName: '',
      requiresAuth: false,
    },
    {
      id: '',
      name: 'Sell',
      path: '/sell',
      displayName: '',
      requiresAuth: true,
    },
    {
      id: '',
      name: 'My Listings',
      path: '/myListings',
      displayName: '',
      requiresAuth: true,
    },
    {
      id: '',
      name: 'Evaluate My Car',
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

const Userdataapi = async () => {
  try {
    
    // If no Redux data, fetch from API
    console.log('No Redux data, fetching from API');
    const response = await userAPI.getProfile({});
    
    const result = handleApiResponse(response);
console.log('s224',result)
dispatch(updateCustomerDetails({
          first_name: result?.data?.first_name,
          last_name: result?.data?.last_name,
          profile_pic: result?.data?.profile_pic,
          email:result?.data?.email,
          company_name: result?.data?.company_name,
          dealer: result?.data?.is_dealer,

        }));
  
  } catch (error) {
    
   
  } finally {
    
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
      return 'Guest';
    }

    return null;
  };

  const userMenuItems = [
    {
      key: 'myProfile',
      label: 'My Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/myProfile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
    },
    {
      key: 'changePassword',
      label: 'Change Password',
      onClick: () => navigate('/changePassword'),
    },
    {
      type: 'divider',
    },
    {
       key: 'logout',
      label: 'Logout',
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
          content: 'Please login to access this feature',
        });
        localStorage.removeItem('isGuest');
        navigate('/login');
        return;
      }
    }

    if (value.name === 'Evaluate My Car') {
      messageApi.open({
        type: 'success',
        content: 'Coming soon',
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
        content: 'Logged out successfully',
      });

      setLogoutModalOpen(false); // close modal
      navigate('/');
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Logout failed',
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
                      console.log('Messages clicked');
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
                      console.log('Notifications clicked');
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
                className="menuItem mx-3 menu-item-button"
                key={item.name}
                onClick={() => {
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
                Sign Up / Login
              </button>
            )}
            <div className="menuLeft mx-2">
              <div className="contct_us_btn">Contact Us</div>
            </div>
            <div
              className="menuLeft mx-1 language-select-container"
            >
              <Select
                defaultValue="En"
                bordered={false}
                className='laguageSelect language-select'
                dropdownStyle={{
                  backgroundColor: 'white',
                  boxShadow: 'none',
                }}
                onChange={(value) => console.log('Selected:', value)}
              >
                <Option value="En">English</Option>
                <Option value="Ar">أرابيك</Option>
                <Option value="Ku">کوردی</Option>
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
              Are you sure you want to log out?
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
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleLogout}
            className="modal-confirm-button"
          >
            Confirm
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
              Sign up / Login
            </button>
          )}
        </div>

        {/* Mobile Menu Language Select */}
        <div className="mobile-menu-language-section">
          <Select
            defaultValue="En"
            bordered={false}
            className="mobile-menu-language-select"
            dropdownStyle={{
              backgroundColor: 'white',
              boxShadow: 'none',
            }}
            onChange={(value) => console.log('Selected:', value)}
          >
            <Option value="En">English</Option>
            <Option value="Ar">أرابيك</Option>
            <Option value="Ku">کوردی</Option>
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
            Contact Us
          </button>
        </div>
      </div>

      </div>
    </>
  );
};
export default Header;