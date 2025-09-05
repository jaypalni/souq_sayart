/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState } from 'react';
import '../assets/styles/header.css';
import iconWhite from '../assets/images/souqLogo.svg';
import NotifiyImg from '../assets/images/bell.svg';
import MessagesImg from '../assets/images/messages.svg';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Select, message, Dropdown,  Modal, Button } from 'antd';
import { logoutUser, clearCustomerDetails } from '../redux/actions/authActions';
const Header = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
   const [logoutModalOpen, setLogoutModalOpen] = useState(false);

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
      path: '',
      displayName: '',
      requiresAuth: true,
    },
    {
      id: '',
      name: 'My Listings',
      path: '',
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

  const getUserDisplayName = () => {
    if (isAuthenticated && user) {
      const firstName = user.first_name || user.firstName || '';
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
      const token = localStorage.getItem('token');
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

  return (
    <>
      <div className="header">
        {contextHolder}
        <div className="row remove_gutter">
          <div className="col-3 d-flex">
            <button 
              type="button" 
              className="headerLogo" 
              style={{cursor:'pointer', background: 'none', border: 'none', padding: 0}} 
              onClick={() => navigate('/')}
            >
              <img src={iconWhite} alt="Logo" />
            </button>
          </div>
          <div className="col-5 d-flex align-items-center  justify-content-center">
            {menuList.map((item) => (
              <button
                type="button"
                className="menuItem mx-3"
                key={item.name}
                onClick={() => {
                  comingsoonMessage(item);
                }}
                style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
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
                    className="headerLogo"
                    src={MessagesImg}
                    style={{
                      width: '20px',
                      height: '20px',
                      objectFit: 'contain',
                      marginBottom: '8px',
                      marginLeft: '0px',
                    }}
                  />
                </div>
                <div className="menuLeft mx-2">
                  <img
                    className="headerLogo"
                    src={NotifiyImg}
                    style={{
                      width: '20px',
                      height: '20px',
                      objectFit: 'contain',
                      marginBottom: '8px',
                      marginLeft: '0px',
                    }}
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
                  className="menuLeft mx-2"
                  style={{
                    cursor: 'pointer',
                    fontFamily: 'Roboto',
                    fontSize: 14,
                    fontWeight: '400',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <UserOutlined style={{ fontSize: '16px' }} />
                  {getUserDisplayName()}
                  <span style={{ fontSize: '12px' }}>▼</span>
                </div>
              </Dropdown>
            ) : (
              <button
                type="button"
                className="menuLeft mx-2"
                onClick={() => {
                  localStorage.removeItem('isGuest');
                  navigate('/login');
                }}
                style={{
                  cursor: 'pointer',
                  fontFamily: 'Roboto',
                  fontSize: 14,
                  fontWeight: '400',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  color: 'inherit',
                }}
                aria-label="Sign up or Login"
              >
                Sign up / Login
              </button>
            )}
            <div className="menuLeft mx-2">
              <div className="contct_us_btn">Contact Us</div>
            </div>
            <div
              className="menuLeft mx-1"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#fff',
              }}
            >
              <Select
                defaultValue="En"
                bordered={false}
                style={{
                  // width: 90,
                  color: '#FAFAFA',
                  backgroundColor: 'transparent',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
                className='laguageSelect'
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
              style={{
                textAlign: 'center',
                margin: '15px 0px 0px 15px',
                fontWeight: 700,
              }}
            >
              Are you sure you want to log out?
            </span>
          </div>
        }
        width={350}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            padding: '2px',
            marginTop: '15px',
          }}
        >
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

      </div>
    </>
  );
};
export default Header;