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
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [messageApi, contextHolder] = message.useMessage();

  const { user } = useSelector(state => state.auth);
  const { customerDetails } = useSelector(state => state.customerDetails);
  const isLoggedIn = customerDetails && user;

  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate('/landing');
  }, [isLoggedIn, navigate]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize OTP timer
 useEffect(() => {
    const now = Date.now();
    const fromLogin = localStorage.getItem('fromLogin');
    const savedEndTime = Number(localStorage.getItem('otpEndTime'));

    if (fromLogin === 'true' || !savedEndTime || savedEndTime <= now) {
      const newEndTime = now + 60 * 1000;
      localStorage.setItem('otpEndTime', newEndTime);
      localStorage.removeItem('fromLogin');
      setTimer(60);
      setIsTimerRunning(true);
    } else {
      const remaining = Math.ceil((savedEndTime - now) / 1000);
      setTimer(remaining > 0 ? remaining : 0);
      setIsTimerRunning(remaining > 0);
    }
  }, []);


  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

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

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = [...otp];

    pasteData.split('').forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs[i]?.current) inputRefs[i].current.value = digit;
    });

    setOtp(newOtp);

    const nextIndex = pasteData.length < OTP_LENGTH ? pasteData.length : OTP_LENGTH - 1;
    if (inputRefs[nextIndex]?.current) inputRefs[nextIndex].current.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[idx]) {
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) inputRefs[idx - 1].current.focus();
    }
  };

  const validateOtp = () => {
    if (otp.some(d => d === '' || !/^\d$/.test(d))) {
      setError('Please enter the OTP.');
      return false;
    }
    setError('');
    return true;
  };

  // Continue button handler
  const handleContinue = async () => {
    if (!validateOtp()) return;

    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      const otpPayload = { otp: otp.join(''), request_id: userData.request_id };
      const result = await dispatch(verifyOTP(otpPayload));

      if (result.success) {
        localStorage.setItem('token', result.data.access_token);
        messageApi.success(result.message);
        navigate(result.data.is_registered ? '/landing' : '/createProfile');
      } else {
        messageApi.error(result.error);
      }
    } catch {
      message.error('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const phone_number = localStorage.getItem('phone_number');
      const response = await authAPI.resendotp({ phone_number });
      const data = handleApiResponse(response);

      if (data) {
        const newEndTime = Date.now() + 60 * 1000;
        localStorage.setItem('otpEndTime', newEndTime);
        localStorage.setItem('userData', JSON.stringify(data));
        setTimer(60);
        setIsTimerRunning(true);
        messageApi.success(data.message);
      }
    } catch (err) {
      const errorData = handleApiError(err);
      messageApi.error(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='otp-container'>
      {contextHolder}
      <h2 className='otp-title'>Login</h2>
      <p className='otp-desc'>Enter the verification code sent to your phone number</p>

      <div className='otp-inputs'>
        {otp.map((digit, idx) => {
          let inputClass = 'otp-input';
          if (digit) inputClass += ' filled';
          if (error && (digit === '' || !/^\d$/.test(digit))) inputClass += ' otp-input-error';

          return (
            <input
              key={OTP_INPUT_IDS[idx]}
              ref={inputRefs[idx]}
              type='tel'
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

      {error && <div className='otp-error' style={{ color: '#ff4d4f', textAlign: 'center', margin: '8px 0' }}>{error}</div>}

      <div className='otp-timer'>
        {isTimerRunning ? (
          <span>Resend in <span className='otp-timer-count'>{formatTime(timer)}</span></span>
        ) : (
          <button type='button' className='otp-resend' onClick={handleResend} style={{ cursor: 'pointer', color: '#0090d4', background: 'transparent', border: 'none', padding: 0 }}>Resend</button>
        )}
      </div>

      <div className='otp-btn-row'>
        <button className='otp-btn otp-btn-outline' type='button'>Continue as guest</button>
        <button
          className='otp-btn otp-btn-filled'
          type='button'
          onClick={handleContinue}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#ccc' : undefined }}
        >
          {loading ? 'Verifying...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default SignupOtp;
