/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState,useRef, useEffect} from 'react';
import { Layout, Button, Modal, message } from 'antd';
import { AiOutlineLeft } from 'react-icons/ai';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { userAPI } from '../services/api';
import MyProfileForm from '../components/MyProfileForm';
import MyProfileMenu from '../components/MyProfileMenu';
import '../assets/styles/myProfile.css';
import SavedSearches from '../components/savedSearches';
import Favorites from '../components/favorites';
import ChangePhoneNumber from '../components/changephonenumber';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useSelector,useDispatch } from 'react-redux';
import { clearCustomerDetails } from '../redux/actions/authActions';

const { Content } = Layout;

const MyProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const selectedKey = location.pathname.split('/')[2] || 'profile';
  const [messageApi, contextHolder] = message.useMessage();
 
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Debug Redux state
  console.log('MyProfile Redux state:', {
    customerDetails,
    user,
    isAuthenticated
  });
  
  // Helper function to get user data from either source
  const getUserData = () => {
    return customerDetails || user || {};
  };
  
  const userData = getUserData();
  console.log('MyProfile userData:', userData);
   const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
   const [isDeleteContinueDisabled, setIsDeleteContinueDisabled] = useState(false);
   

 useEffect(() => {
    const timer = setTimeout(() => {
      setIsDeleteDisabled(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  // Menu handlers
  const handleMenuClick = ({ key }) => {
    // Handle any additional menu logic if needed
  };

  const handleDeleteClick = () => {
    // Delete modal is now handled by MyProfileMenu component
  };

  const handleLogoutClick = () => {
    userlogout();
  };


  

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
    const requestId = localStorage.getItem('requestId');

    const otpPayload = {
      otp: otpDigits,
      request_id: requestId,
    };

    const result = await userAPI.getDeleteOtp(otpPayload);
    const data1 = handleApiResponse(result);

    if (data1?.status_code === 200) {
     setIsDeleteContinueDisabled(true);
      await messageApi.open({
        type: 'success',
        content: data1?.message,
        duration: 1, 
      });
      localStorage.clear();
      dispatch(clearCustomerDetails());
      dispatch({ type: 'CLEAR_USER_DATA' });
      navigate('/');
    } else {
      setIsDeleteContinueDisabled(false);
      messageApi.open({
        type: 'error',
        content: data1?.error,
      });
    }
  } catch (err) {
    console.error('OTP Delete Error:', err);

    let errorMessage = 'Something went wrong!';
    if (err?.response?.data?.error) {
      
      errorMessage = err.response.data.error;
    } else if (err.message) {
      
      errorMessage = err.message;
    }

    setIsDeleteContinueDisabled(false);
    messageApi.open({
      type: 'error',
      content: errorMessage,
    });
  } finally {
    setIsDeleteContinueDisabled(false);
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
             localStorage.setItem('requestId',data.request_id)
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
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>My Profile</div>
                  <div style={{ fontSize: 11 }}>Post an ad in just 3 simple steps</div>
     </div>
      <Layout style={{ background: '#fff' }}>
        <MyProfileMenu
          selectedKey={selectedKey}
          onMenuClick={handleMenuClick}
          showManageAccount={true}
          isDeleteDisabled={isDeleteDisabled}
          onDeleteClick={handleDeleteClick}
          onLogoutClick={handleLogoutClick}
        />
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
    </div >
    <div style={{display:'flex',gap:'15px'}}>
 <button
        type="button"
        onClick={() => {
           setOtp(['', '', '', '']);
    setError('');
    setTimer(30);
    setIsTimerRunning(false);
           setShowOtpStep(false);
           setIsDeleteDisabled(false);
        }}
         style={{
              width: 120,
              height:35,
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
      </button>

      <button
  className="otp-btn otp-btn-filled"
  type="button"
  onClick={() => {
    setIsDeleteContinueDisabled(true); // Disable immediately
    handleOTPDelete();                 // Then run delete logic
  }}
  disabled={isDeleteContinueDisabled}  // Button respects state
  style={{ height: 35 }}
>
  {isDeleteContinueDisabled ? 'Processing...' : 'Continue'}
</button>

    </div>
     
    
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

    </>
  );

};

export default MyProfile;