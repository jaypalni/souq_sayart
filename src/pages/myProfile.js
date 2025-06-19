import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button } from 'antd';
import { UserOutlined, CreditCardOutlined, MessageOutlined, BellOutlined, SearchOutlined, StarOutlined, DashboardOutlined, HeartOutlined, LogoutOutlined, DeleteOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MyProfileForm from '../components/MyProfileForm';
import '../assets/styles/myProfile.css';
import ManageNotifications from '../components/ManageNotifications';
import SavedSearches from '../components/savedSearches';
import BlockedContacts from '../components/BlockedContacts';
import Subscriptions from '../components/Subscriptions';
import Messages from '../components/Messages';
import Payments from '../components/Payments';
const { Sider, Content } = Layout;

const menuItems = [
  { key: 'profile', icon: <UserOutlined />, label: <Link to="/myProfile">Profile</Link> },
  { key: 'subscriptions', icon: <CreditCardOutlined />, label: <Link to="/myProfile/subscriptions">Subscriptions</Link> },
  { key: 'messages', icon: <MessageOutlined />, label: <Link to="/myProfile/messages">Messages</Link> },
  { key: 'notifications', icon: <BellOutlined />, label: <Link to="/myProfile/notifications">Manage Notifications</Link> },
  { key: 'searches', icon: <SearchOutlined />, label: <Link to="/myProfile/searches">Saved Searches</Link> },
  { key: 'payments', icon: <CreditCardOutlined />, label: <Link to="/myProfile/payments">Payments</Link> },
  { key: 'blocked', icon: <StarOutlined />, label: <Link to="/myProfile/blocked">Blocked users</Link> },
  { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/myProfile/dashboard">Dealership Dashboard</Link> },
  { key: 'favorites', icon: <HeartOutlined />, label: <Link to="/myProfile/favorites">Favorites</Link> },
];

const manageItems = [
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
  { key: 'delete', icon: <DeleteOutlined />, label: 'Delete Account' },
];

const MyProfile = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const selectedKey = location.pathname.split('/')[2] || 'profile';

  return (
    <>
     <div className='page-header'>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Sell Your Car In IRAQ</div>
        <div style={{ fontSize: 11 }}>Post an ad in just 3 simple steps</div>
      </div>
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Sider
        width={260}
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{ background: '#fff', borderRight: '1px solid #f0f0f0', padding: '32px 0 0 0' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={48} style={{ background: '#e3f1ff', color: '#1890ff', fontWeight: 700 }}>RD</Avatar>
          {!collapsed && <div style={{ marginTop: 8, fontWeight: 600 }}>Ralph Doe</div>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          items={menuItems}
        />
        <div style={{ marginTop: 32 }}>
          <div style={{ padding: '0 24px', color: '#888', fontWeight: 500, fontSize: 13, marginBottom: 8 }}>Manage Account</div>
          <Menu mode="inline" style={{ borderRight: 0 }} items={manageItems} />
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
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<ManageNotifications />} />
            <Route path="searches" element={<SavedSearches />} />
            <Route path="blocked" element={<BlockedContacts />} />
            <Route path="payments" element={<Payments />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
    </>
  );
};

export default MyProfile;