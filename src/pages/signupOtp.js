/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import '../assets/styles/signupOtp.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { verifyOTP } from '../redux/actions/authActions';
import { message } from 'antd';

const SignupOtp = () => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [error, setError] = useState('');
  const [, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useSelector((state) => state.auth);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const isLoggedIn = customerDetails && user;
  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/landing');
    }
  }, [isLoggedIn, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

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


  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs[idx - 1].current.focus();
      } else {
        // No action needed when at first field with empty value
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

 const handleContinue = async () => {
  if (!validateOtp()) {
    return;
  }

  try {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const otpDigits = otp.join('');
    const otpPayload = {
      otp: otpDigits,
      request_id: userData.request_id,
    };
    const result = await dispatch(verifyOTP(otpPayload));

    if (result.success) {
      localStorage.setItem('token', result.data.access_token);

      messageApi.open({
        type: 'success',
        content: result.message,
      });

      if (result.data.is_registered) {
        navigate('/landing');
      } else {
        navigate('/createProfile');
      }
    } else {
      messageApi.open({
        type: 'error',
        content: result.error,
      });
    }
  } catch (err) { // renamed here
    message.error('OTP verification failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleResend = async () => {
  if (!isTimerRunning) {
    setTimer(60);
    setIsTimerRunning(true);
  }

  try {
    const usermobilenumber = localStorage.getItem('phone_number');
    setLoading(true);

    const response = await authAPI.resendotp({
      phone_number: usermobilenumber,
    });
    const data = handleApiResponse(response);

    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
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
return (
  <div className="otp-container">
    {contextHolder}
    <h2 className="otp-title">Login</h2>
    <p className="otp-desc">
      Enter the verification code sent to your phone number
    </p>

    <div className="otp-inputs">
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
            onPaste={handlePaste}
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
           marginLeft: 4,
          marginBottom: 4,
          textAlign: 'center',
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

    <div className="otp-btn-row">
      <button className="otp-btn otp-btn-outline" type="button">
        Continue as guest
      </button>
      <button
        className="otp-btn otp-btn-filled"
        type="button"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  </div>
);

};

export default SignupOtp;