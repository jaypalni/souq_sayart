/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Layout, Button, Modal } from 'antd';
import { AiOutlineLeft } from 'react-icons/ai';
import { userAPI, authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useSelector, useDispatch } from 'react-redux';
import { clearCustomerDetails } from '../redux/actions/authActions';
import { usePhoneNumber } from '../hooks/usePhoneNumber';
import MyProfileMenu from '../components/MyProfileMenu';
import '../assets/styles/signupOtp.css';
import '../assets/styles/myProfile.css';

const { Content } = Layout;

const ChangePhoneOtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);
  const intervalRef = useRef(null);
  
 const handlestate = useSelector((state) => state.auth);
  const handleMenuClick = ({ key }) => {
  };
  const handleDeleteClick = () => {
  };

  const handleLogoutClick = () => {
    userlogout();
  };

 useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsDeleteDisabled(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  // Initialize timer on component mount
  useEffect(() => {
    const now = Date.now();
    const savedEndTime = Number(localStorage.getItem('otpEndTime')) || 0;

    let remaining = Math.ceil((savedEndTime - now) / 1000);

    if (!savedEndTime || remaining <= 0) {
      const newEndTime = now + 60 * 1000;
      localStorage.setItem('otpEndTime', newEndTime);
      remaining = 60;
    }

    setTimer(remaining);
    setIsTimerRunning(remaining > 0);
  }, []);

  // Countdown interval
  useEffect(() => {
    if (!isTimerRunning) return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning]);
  
  // Logout functions

  const userlogout = async () => {
    try {
      setLoading(true);
      const response = await authAPI.logout({});
      const data1 = handleApiResponse(response);
      localStorage.clear();
      dispatch(clearCustomerDetails());
      dispatch({ type: 'CLEAR_USER_DATA' });
      messageApi.open({ type: 'success', content: data1?.message });

      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: 'error', content: errorData?.error });
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    const newOtp = [...otp];
    if (val) {
      newOtp[idx] = val[val.length - 1];
      setOtp(newOtp);
      setError('');
      if (idx < OTP_LENGTH - 1) inputRefs[idx + 1].current.focus();
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
      } else if (idx > 0) inputRefs[idx - 1].current.focus();
    }
  };

  const validateOtp = () => {
    if (otp.some((digit) => digit === '' || !/^\d$/.test(digit))) {
      setError('Please enter the OTP.');
      return false;
    }
    setError('');
    return true;
  };

  const handleContinue = async () => {
    if (!validateOtp()) return;

    try {
      setLoading(true);
      const otpDigits = otp.join('');
      const requestId = localStorage.getItem('request_id');

      const otpPayload = { otp: otpDigits, request_id: requestId };
      const result = await userAPI.chnagenumberverifyOtp(otpPayload);

      if (result?.data?.success) {
        messageApi.open({ type: 'success', content: result?.data?.message });
        localStorage.removeItem('request_id');
        // Phone number is now stored in Redux state
        navigate('/myProfile');
      } else {
        messageApi.open({ type: 'error', content: result?.data?.error });
      }
    } catch (err) {
      message.error('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      if (!handlestate?.phone_login) {
        messageApi.open({ type: 'error', content: 'Phone number not found. Please start over.' });
        navigate('/myProfile/change-phone');
        return;
      }

      const response = await userAPI.changephonenumber({ phone_number: handlestate.phone_login, whatsapp: 0 });
      const data = handleApiResponse(response);

      if (data) {
        messageApi.open({ type: 'success', content: data.message });
        if (data.request_id) localStorage.setItem('request_id', data.request_id);

        // Reset timer
        const newEndTime = Date.now() + 60 * 1000;
        localStorage.setItem('otpEndTime', newEndTime);
        setTimer(60);
        setIsTimerRunning(true);
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: 'error', content: errorData.message });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const buildOtpInputClass = (digit, error) => {
    let inputClass = 'otp-input';
    if (digit) inputClass += ' filled';
    if (error && (digit === '' || !/^\d$/.test(digit))) inputClass += ' otp-input-error';
    return inputClass;
  };

  const renderTimerContent = (isTimerRunning, timer, formatTime, handleResend) => {
    if (isTimerRunning) {
      return (
        <span>
          Resend in <span className="otp-timer-count">{formatTime(timer)}</span>
        </span>
      );
    } else {
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
    }
  };


  const handlePaste = (e) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); // only digits
  if (!pasteData) return;

  const digits = pasteData.split('').slice(0, OTP_LENGTH); // take only OTP_LENGTH digits
  const newOtp = [...otp];

  digits.forEach((digit, i) => {
    newOtp[i] = digit;
    if (inputRefs[i]?.current) {
      inputRefs[i].current.value = digit; // update input directly
    }
  });

  setOtp(newOtp);

  // move focus to last filled field
  const nextIndex = digits.length < OTP_LENGTH ? digits.length : OTP_LENGTH - 1;
  if (inputRefs[nextIndex]?.current) {
    inputRefs[nextIndex].current.focus();
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
          selectedKey="profile"
          onMenuClick={handleMenuClick}
          showManageAccount={true}
          isDeleteDisabled={isDeleteDisabled}
          onDeleteClick={handleDeleteClick}
          onLogoutClick={handleLogoutClick}
        />
        <Layout>
          <Content style={{ padding: '40px 40px 0 40px', background: '#fff' }}>
            <div className='myprofile-main'>
              <div className='myprofile-header' style={{ display: 'flex', alignItems: 'center' }}>
                <AiOutlineLeft onClick={() => navigate('/myProfile/change-phone')} style={{ fontSize: '18px', cursor: 'pointer', marginRight: '10px' }} />
                Enter OTP Sent To Your New Number
              </div>

              <p className="otp-desc">Enter the verification code sent to your phone number</p>

              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, marginBottom: 12 }}>
                {otp.map((digit, idx) => (
                  <input
                    key={OTP_INPUT_IDS[idx]}
                    ref={inputRefs[idx]}
                    type="tel"
                    className={buildOtpInputClass(digit, error)}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              {error && <div className="otp-error" style={{ color: '#ff4d4f', marginTop: 8, marginBottom: 4, textAlign: 'start' }}>{error}</div>}

              <div className="otp-timer">{renderTimerContent(isTimerRunning, timer, formatTime, handleResend)}</div>

              <button className="otp-btn otp-btn-filled" type="button" onClick={handleContinue} style={{ height: 35 }} disabled={loading}>
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </div>
          </Content>
        </Layout>
      </Layout>

    </>
  );
};

export default ChangePhoneOtpPage;
