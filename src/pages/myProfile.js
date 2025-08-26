/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState,useRef, useEffect} from 'react';
import { Layout, Menu, Avatar, Button, Modal, message } from 'antd';
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
import { AiOutlineLeft } from 'react-icons/ai';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { userAPI } from '../services/api';
import MyProfileForm from '../components/MyProfileForm';
import '../assets/styles/myProfile.css';
import SavedSearches from '../components/savedSearches';
import Favorites from '../components/favorites';
import ChangePhoneNumber from '../components/changephonenumber';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useDispatch } from 'react-redux';
import { clearCustomerDetails } from '../redux/actions/authActions';


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
  const dispatch = useDispatch();
  const [, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const selectedKey = location.pathname.split('/')[2] || 'profile';
  const [messageApi, contextHolder] = message.useMessage();
  const [, setDeleteData] = useState([]);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);


    useEffect(() => {
      const fromLogin = localStorage.getItem('fromLogin');
      const now = Date.now();
  
      if (fromLogin === 'true') {
        const newEndTime = now + 60 * 1000;
        localStorage.setItem('otpEndTime', newEndTime);
        localStorage.removeItem('fromLogin');
        setTimer(60);
        setIsTimerRunning(true);
      } else {
        const savedEndTime = localStorage.getItem('otpEndTime');
        if (savedEndTime) {
          const timeLeft = Math.floor((Number(savedEndTime) - now) / 1000);
          if (timeLeft > 0) {
            setTimer(timeLeft);
            setIsTimerRunning(true);
          } else {
            setTimer(0);
            setIsTimerRunning(false);
          }
        }
      }
    }, []);
  
    useEffect(() => {
      let interval;
      if (isTimerRunning && timer > 0) {
        interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsTimerRunning(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

  const handleLogout = () => {
    setLogoutModalOpen(false);
     
    userlogout();
  };

  const handleDelete = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getDelete();
        const data1 = handleApiResponse(response);
  
        if (data1) {
          setDeleteData(data1)
          messageApi.open({
            type: 'success',
            content: data1?.message,
          });
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

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs
          .toString()
          .padStart(2, '0')}`;
      };
    
     const handleChange = (e, idx) => {
      const val = e.target.value.replace(/\D/g, '');
    
      const newOtp = [...otp];
      if (val) {
        newOtp[idx] = val[val.length - 1];
        setOtp(newOtp);
        setError('');
        if (idx < OTP_LENGTH - 1) {
          inputRefs[idx + 1].current.focus();
        }
      } else {
        newOtp[idx] = '';
        setOtp(newOtp);
      }
    };
    
    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
          if (otp[idx]) {
            const newOtp = [...otp];
            newOtp[idx] = '';
            setOtp(newOtp);
          } else if (idx > 0) {
            inputRefs[idx - 1].current.focus();
          } else {
          }
        }
      };
    
       const validateOtp = () => {
        if (otp.some((digit) => digit === '' || !/^\d$/.test(digit))) {
          setError('Please enter the OTP.');
          return false;
        }else{
    setError('');
        return true;
        }
      };

     const handleOTPDelete = async () => {
      if (!validateOtp()) {
        return;
      }
    
      try {
        setLoading(true);
        const otpDigits = otp.join(''); 
    
        const otpPayload = {
          otp: otpDigits,
        };
    
        const result = await userAPI.getDeleteOtp(otpPayload);
  
    
        if (result?.data?.status_code === 200) {
           localStorage.clear();
    dispatch(clearCustomerDetails());
    dispatch({ type: 'CLEAR_USER_DATA' });
    
          messageApi.open({
            type: 'success',
            content: result?.data?.message,
          });
    
        setTimeout(() => {
    navigate('/');
  }, 1000);
        } else {
          messageApi.open({
            type: 'error',
            content: result?.data?.error,
          });
          console.log('Verify otp failed', error);
        }
      } catch (err) {
        message.error('OTP verification failed. Please try again.');
        console.log('Verify otp failed2', error);
      } finally {
        setLoading(false);
      }
    };
      
      const handleResend = async () => {
        if (!isTimerRunning) {
          setTimer(30);
          setIsTimerRunning(true);
        }
      
        try {
          setLoading(true);
      
          const response = await userAPI.getDelete();
          const data = handleApiResponse(response);
      
          if (data) {
            messageApi.open({
              type: 'success',
              content: data.message,
            });
          }
        } catch (err) {
          const errorData = handleApiError(err);
          messageApi.open({
            type: 'error',
            content: errorData.message,
          });
        } finally {
          setLoading(false);
        }
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

    return (
    <>
    <div className="page-header">
                  {contextHolder}
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Sell Your Car In IRAQ</div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 4,padding:'0 24px' }}>
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
  {!collapsed && <div style={{ fontWeight: 600 }}>Ralph Doe</div>}
</div>

          <Menu mode="inline" selectedKeys={[selectedKey]} style={{ borderRight: 0 }} items={menuItems} />

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
                if (key === 'delete') setDeleteModalOpen(true);
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
            {showOtpStep ? (
           
  <div style={{ justifyContent: 'flex-start'}}>
    {contextHolder}
    <div style={{display:'flex'}}> 
<AiOutlineLeft
        onClick={() => {
           setOtp(['', '', '', '']);
    setError('');
    setTimer(30);
    setIsTimerRunning(false);
           setShowOtpStep(false);
        }}
        style={{ fontSize: '25px', cursor: 'pointer', marginTop: '10px' }}
      />
    <h2>Enter OTP to Delete Account</h2>
    </div>
     
    <p className="otp-desc">
      Enter the verification code sent to your phone number
    </p>

    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, marginBottom: 12 }}>
      {otp.map((digit, idx) => {
        let inputClass = 'otp-input';

        if (digit) {
          inputClass += ' filled';
        }

        if (error && (digit === '' || !/^\d$/.test(digit))) {
          inputClass += ' otp-input-error';
        }

        const inputKey = OTP_INPUT_IDS[idx];
        return (
          <input
            key={inputKey}
            ref={inputRefs[idx]}
            type="tel"
            className={inputClass}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        );
      })}
    </div>

    {error && (
      <div
        className="otp-error"
        style={{
          color: '#ff4d4f',
          marginTop: 8,
          marginBottom: 4,
          textAlign: 'left',
        }}
      >
        {error}
      </div>
    )}

    <div className="otp-timer">
      {(() => {
        if (isTimerRunning) {
          return (
            <span>
              Resend in{' '}
              <span className="otp-timer-count">{formatTime(timer)}</span>
            </span>
          );
        }
       return (
  <button
    type="button"
    className="otp-resend"
    onClick={handleResend}
    style={{ cursor: 'pointer', color: '#0090d4', background: 'transparent', border: 'none', padding: 0 }}
  >
    Resend
  </button>
);

      })()}
    </div>
      <button
        className="otp-btn otp-btn-filled"
        type="button"
        onClick={handleOTPDelete}
        style={{height: 35}}
      >
        Continue
      </button>
    
  </div>

            ) : (
              <>

                <Routes>
                  <Route index element={<MyProfileForm />} />
                  <Route path="change-phone" element={<ChangePhoneNumber />} />
                  <Route path="searches" element={<SavedSearches />} />
                  <Route path="favorites" element={<Favorites />} />
                </Routes>
              </>
            )}
          </Content>
        </Layout>
      </Layout>

      <Modal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={null}
        title={<div className="brand-modal-title-row"><span>Are you sure you want to log out?</span></div>}
        width={400}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '2px' }}>
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

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        title={<div className="brand-modal-title-row"><span>Are you sure to Delete your account?</span></div>}
        width={300}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '2px' }}>
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
            No
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setDeleteModalOpen(false);
              setShowOtpStep(true); 
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
            Yes
          </Button>
        </div>
      </Modal>
    </>
  );

};

export default MyProfile;