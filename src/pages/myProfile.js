/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button, Modal } from 'antd';
import {
  UserOutlined,
  CreditCardOutlined,
  MessageOutlined,
  BellOutlined,
  SearchOutlined,
  StarOutlined,
  DashboardOutlined,
  HeartOutlined,
  LogoutOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import MyProfileForm from '../components/MyProfileForm';
import '../assets/styles/myProfile.css';
import SavedSearches from '../components/savedSearches';
import Favorites from '../components/favorites';

const { Sider, Content } = Layout;

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
    icon: <UserOutlined />,
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
    icon: <CreditCardOutlined />,
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
    icon: <MessageOutlined />,
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
    icon: <BellOutlined />,
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
    icon: <SearchOutlined />,
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
    icon: <CreditCardOutlined />,
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
    icon: <StarOutlined />,
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
    icon: <DashboardOutlined />,
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
    icon: <HeartOutlined />,
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
];

const manageItems = [
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
  { key: 'delete', icon: <DeleteOutlined />, label: 'Delete Account' },
];

const MyProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const selectedKey = location.pathname.split('/')[2] || 'profile';

  const handleLogout = () => {
    setLogoutModalOpen(false);
    navigate('/LoginScreen');
  };

  return (
    <>
      <div className="page-header">
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          Sell Your Car In IRAQ
        </div>
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
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
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
            {!collapsed && (
              <div style={{ marginTop: 8, fontWeight: 600 }}>Ralph Doe</div>
            )}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ borderRight: 0 }}
            items={menuItems}
          />
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
                if (key === 'logout') {
                  setLogoutModalOpen(true);
                }
                if (key === 'delete') {
                }
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
            <Routes>
              <Route index element={<MyProfileForm />} />
              <Route path="searches" element={<SavedSearches />} />
              <Route path="favorites" element={<Favorites />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>

      <Modal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={null}
        title={
          <div className="brand-modal-title-row">
            <span>Are you sure to logout?</span>
          </div>
        }
        width={300}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            padding: '2px',
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
            No
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
            Yes
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MyProfile;