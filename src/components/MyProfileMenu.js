/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Avatar, Button, Switch, Modal } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, MenuOutlined, CloseOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCustomerDetails } from '../redux/actions/authActions';
import { userAPI, authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
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
import '../assets/styles/myProfileMenu.css';
import { useLanguage } from '../contexts/LanguageContext';

const { Sider } = Layout;

const MyProfileMenu = ({ 
  selectedKey = 'profile', 
  onMenuClick, 
  showManageAccount = true,
  isDeleteDisabled = false,
  onDeleteClick,
  onLogoutClick 
}) => {
  const { translate } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [whatsappNotification, setWhatsappNotification] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setDeleteData] = useState([]);
  const [isDealer, setIsDealer] = useState(null); // null initially

  
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch profile data for WhatsApp toggle
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await userAPI.getProfile({});
        const profileData = handleApiResponse(response);
        if (profileData) {
          setWhatsappNotification(profileData?.data?.whatsapp);
          setIsDealer(profileData?.data?.is_dealer);
        }
      } catch (error) {
        // Handle error silently
      }
    };
    fetchProfileData();
  }, []);

  // WhatsApp toggle handler
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
          content: translate('myProfilePage.WHATSAPP_UPDATED_SUCCESS'),
        });
      }
    } catch (error) {
      setWhatsappNotification(!checked);
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData?.message || translate('myProfilePage.WHATSAPP_UPDATE_FAILED'),
      });
    } finally {
      setWhatsappLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await authAPI.logout({});
      const data1 = handleApiResponse(response);
      localStorage.clear();
      dispatch(clearCustomerDetails());
      dispatch({ type: 'CLEAR_USER_DATA' });
      messageApi.open({
        type: 'success',
        content: data1?.message,
      });
      if (onLogoutClick) {
        onLogoutClick();
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData?.error,
      });
    }
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDelete();
      const data1 = handleApiResponse(response);
      localStorage.removeItem('otpEndTime'); 
      localStorage.removeItem('fromLogin');
      localStorage.removeItem('userData'); 

      if (data1) {
        setDeleteData(data1);
        localStorage.setItem('requestId', data1.request_id);
        localStorage.setItem('fromLogin', 'true');
        messageApi.open({
          type: 'success',
          content: data1?.message,
        });
        navigate('/deleteaccount-otp');
      }
    } catch (error) {
      setDeleteData([]);
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Menu items configuration
  const menuItems = [
    ...(!collapsed ? [{
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
          {translate('myProfilePage.PERSONAL_INFORMATIONS')}
        </Link>
      ),
    }] : []),
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
          {translate('myProfilePage.PROFILE')}
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
          {translate('myProfilePage.SUBSCRIPTIONS')}
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
          {translate('myProfilePage.MESSAGES')}
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
          {translate('myProfilePage.MANAGE_NOTIFICATIONS')}
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
          {translate('myProfilePage.SAVED_SEARCHES')}
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
          {translate('myProfilePage.PAYMENTS')}
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
          {translate('myProfilePage.BLOCKED_USERS')}
        </Link>
      ),
    },
    ...(isDealer === 1
    ? [
        {
          key: 'dealerdashboard',
          icon: <img src={dealerIcon} alt="Dealer" style={{ width: 16, height: 16 }} />,
          label: (
            <Link
              to="/myProfile/dealerdashboard"
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: '#0A0A0B',
              }}
            >
              {translate('myProfilePage.DEALERSHIP_DASHBOARD')}
            </Link>
          ),
        },
      ]
    : []),
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
          {translate('myProfilePage.FAVORITES')}
        </Link>
      ),
    },
    {
      key: 'whatsapp',
      icon: <img src={whatsupIcon} alt="Whatsup" style={{ width: 16, height: 16 }}/>,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{translate('myProfilePage.WHATSAPP')}</span>
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
    { 
      key: 'logout', 
      icon: <img src={logoutIcon} alt="Logout" style={{ width: 16, height: 16 }} />, 
      label: translate('myProfilePage.LOGOUT')
    },
    {
      key: 'delete',
      icon: <img src={deleteIcon} alt="Delete" style={{ width: 16, height: 16 }} />,
      label: translate('myProfilePage.DELETE_ACCOUNT'),
      disabled: isDeleteDisabled, 
    },
  ];

  const handleMenuClick = ({ key }) => {
    // Close mobile menu when any menu item is clicked
    setMobileMenuOpen(false);
    
    if (key === 'logout') {
      setLogoutModalOpen(true);
    } else if (key === 'delete' && !isDeleteDisabled) {
      setDeleteModalOpen(true);
    }
    
    if (onMenuClick) {
      onMenuClick({ key });
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleOverlayClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {contextHolder}
      
      {/* Mobile Menu Button */}
      <button 
        type="button"
        className="mobile-menu-button" 
        onClick={handleMobileMenuToggle}
        aria-label="Open profile menu"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
      >
        <ProfileOutlined />
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <button 
          type="button"
          className="mobile-menu-overlay" 
          onClick={handleOverlayClick}
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
      )}

      {/* Desktop Sider */}
      <Sider
        width={260}
        collapsible
        collapsed={collapsed}
        trigger={null}
        className="desktop-sider"
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          padding: '32px 0 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 4, padding: '0 24px' }}>
          <Avatar
            size={48} 
            src={customerDetails?.profile_pic ? `${BASE_URL}${customerDetails.profile_pic}` : undefined}
            style={{
              background: '#e3f1ff',
              color: '#1890ff',
              fontWeight: 700,
            }}
          >
            {!customerDetails?.profile_pic && (customerDetails?.first_name?.[0] || 'U')}
          </Avatar>
          
          {!collapsed && (
            <div style={{ fontWeight: 600 }}>
              {customerDetails?.first_name && customerDetails?.last_name 
                ? `${customerDetails.first_name} ${customerDetails.last_name}`
                : translate('myProfilePage.USER')
              }
            </div>
          )}
        </div>

        <Menu 
          mode="inline" 
          selectedKeys={[selectedKey]} 
          style={{ borderRight: 0 }} 
          items={menuItems} 
        />

        {showManageAccount && (
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
              {translate('myProfilePage.MANAGE_ACCOUNT')}
            </div>
            <Menu
              mode="inline"
              style={{ borderRight: 0, fontWeight: 400, fontSize: '12px' }}
              items={manageItems}
              onClick={handleMenuClick}
            />
          </div>
        )}

        <Button
          type="text"
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          style={{ position: 'absolute', top: 10, right: -18, zIndex: 999 }}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        />
      </Sider>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <div className="mobile-menu-user-info">
              <Avatar
                size={48} 
                src={customerDetails?.profile_pic ? `${BASE_URL}${customerDetails.profile_pic}` : undefined}
                className="mobile-menu-avatar"
              >
                {!customerDetails?.profile_pic && (customerDetails?.first_name?.[0] || 'U')}
              </Avatar>
              
              <div className="mobile-menu-user-name">
                {customerDetails?.first_name && customerDetails?.last_name 
                  ? `${customerDetails.first_name} ${customerDetails.last_name}`
                  : translate('myProfilePage.USER')
                }
              </div>
            </div>
            
            {/* Close Button - Absolutely positioned in top-right corner */}
            <button 
              className="mobile-menu-close-btn"
              onClick={handleMobileMenuToggle}
            >
              <CloseOutlined />
            </button>
          </div>

          <div className="mobile-menu-items">
            <Menu 
              mode="inline" 
              selectedKeys={[selectedKey]} 
              className="mobile-menu-main-menu"
              items={menuItems}
              onClick={handleMenuClick}
            />

            {showManageAccount && (
              <div className="mobile-menu-manage-section">
                <div className="mobile-menu-manage-title">
                  {translate('myProfilePage.MANAGE_ACCOUNT')}
                </div>
                <Menu
                  mode="inline"
                  className="mobile-menu-manage-menu"
                  items={manageItems}
                  onClick={handleMenuClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={null}
        title={
          <div className="brand-modal-title-row">
            <span style={{ textAlign: 'center', margin: '15px 0px 0px 15px', fontWeight: 700 }}>
              {translate('myProfilePage.LOGOUT_CONFIRMATION')}
            </span>
          </div>
        }
        width={350}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '2px', marginTop: '15px' }}>
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
            {translate('myProfilePage.CANCEL')}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setLogoutModalOpen(false);
              handleLogout();
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
            {translate('myProfilePage.CONFIRM')}
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        title={
          <div className="brand-modal-title-row">
            <span style={{ textAlign: 'center', marginTop: '15px', fontWeight: 700 }}>
              {translate('myProfilePage.DELETE_ACCOUNT_WARNING')}
            </span>
          </div>
        }
        width={500}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '2px', marginTop: '25px' }}>
          <Button
            onClick={() => setDeleteModalOpen(false)}
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
            {translate('myProfilePage.CANCEL')}
          </Button>
          <Button
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={() => {
              setDeleteModalOpen(false);
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
            {translate('myProfilePage.CONTINUE')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

MyProfileMenu.propTypes = {
  selectedKey: PropTypes.string,
  onMenuClick: PropTypes.func,
  showManageAccount: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool,
  onDeleteClick: PropTypes.func,
  onLogoutClick: PropTypes.func,
};

export default MyProfileMenu;
