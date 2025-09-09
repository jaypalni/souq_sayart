import React, { useState, useRef, useEffect } from 'react';
import '../assets/styles/signupOtp.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { verifyOTP } from '../redux/actions/authActions';
import { message } from 'antd';
import { usePhoneNumber } from '../hooks/usePhoneNumber';
import { useToken } from '../hooks/useToken';

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

  const { user, phoneNumber: phoneFromRedux } = useSelector(state => state.auth);
  const { customerDetails } = useSelector(state => state.customerDetails);
  const phoneNumber = usePhoneNumber();
  const token = useToken();
  
  // Get phone number from multiple sources with fallback
  const phoneFromUser = user?.phone_number;
  const phoneFromCustomerDetails = customerDetails?.phone_number;
  const phoneFromLocalStorage = localStorage.getItem('phone_number') || localStorage.getItem('phonenumber');
  
  // Also check userData from localStorage (stored during login)
  let phoneFromUserData = null;
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    phoneFromUserData = userData.phone_number;
  } catch (e) {
    console.log('Error parsing userData:', e);
  }
  
  // Use the first available phone number
  const phoneToUse = phoneFromRedux || phoneNumber || phoneFromUser || phoneFromCustomerDetails || phoneFromUserData || phoneFromLocalStorage;
  
  // More specific check - only consider logged in if we have both user and customerDetails
  // AND we're not coming from the login flow
  const fromLogin = localStorage.getItem('fromLogin');
  const isLoggedIn = customerDetails && user && !fromLogin;
  
  console.log('OTP Screen render - Redux state:', {
    user,
    customerDetails,
    phoneFromRedux,
    token,
    isLoggedIn
  });
  
  console.log('OTP Screen phone number sources:', {
    phoneFromRedux,
    phoneNumber,
    phoneFromUser,
    phoneFromCustomerDetails,
    phoneFromUserData,
    phoneFromLocalStorage,
    phoneToUse
  });

  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);

  // Redirect if already logged in
  useEffect(() => {
    console.log('OTP Screen useEffect - isLoggedIn:', isLoggedIn);
    console.log('OTP Screen useEffect - fromLogin:', fromLogin);
    console.log('OTP Screen useEffect - user:', user);
    console.log('OTP Screen useEffect - customerDetails:', customerDetails);
    
    if (isLoggedIn) {
      console.log('Redirecting to landing because user is logged in');
      navigate('/landing');
    } else {
      console.log('User not logged in or coming from login flow, staying on OTP screen');
    }
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
    
    // Check if phone number is available
    if (!phoneToUse || phoneToUse === 'unknown' || phoneToUse === 'undefined') {
      messageApi.error('Phone number not found. Please go back and try again.');
      return;
    }

    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      const otpPayload = { 
        otp: otp.join(''), 
        request_id: userData.request_id,
        phone_number: phoneToUse // Add phone number to the payload
      };
      
      console.log('OTP Payload being sent:', otpPayload);
      console.log('Phone number being sent:', phoneToUse);
      
      const result = await dispatch(verifyOTP(otpPayload));

      console.log('OTP Verification Result:', result);
      console.log('Result data:', result.data);
      console.log('is_registered value:', result.data?.is_registered);
      console.log('Result success:', result.success);
      console.log('Result error:', result.error);

      if (result.success) {
        // Token is now managed by Redux, no need to set in localStorage
        messageApi.success(result.message);
        
        // Check for is_registered in different possible locations
        let isRegistered = result.data?.is_registered;
        
        console.log('Direct is_registered from API:', isRegistered);
        console.log('Type of is_registered:', typeof isRegistered);
        
        // If is_registered is explicitly false, use that
        if (isRegistered === false) {
          console.log('is_registered is explicitly false, user is not registered');
        } else if (isRegistered === true) {
          console.log('is_registered is explicitly true, user is registered');
        } else {
          // Only check other sources if is_registered is not explicitly set
          isRegistered = result.data?.user?.is_registered || 
                        result.data?.isRegistered ||
                        result.data?.user?.isRegistered;
          
          console.log('is_registered from other sources:', isRegistered);
          
          // If still not found, check if user has profile data
          if (isRegistered === undefined || isRegistered === null) {
            const user = result.data?.user;
            console.log('User object for profile check:', user);
            console.log('User profile fields:', {
              first_name: user?.first_name,
              last_name: user?.last_name,
              email: user?.email,
              phone_number: user?.phone_number
            });
            
            // If user has complete profile data, consider them registered
            isRegistered = user && (
              user.first_name && 
              user.last_name && 
              user.email && 
              user.phone_number
            );
            console.log('is_registered not found, checking user profile completeness:', isRegistered);
          }
          
          // Final fallback - if still undefined, default to false (not registered)
          if (isRegistered === undefined || isRegistered === null) {
            isRegistered = false;
            console.log('is_registered still undefined, defaulting to false');
          }
        }
        
        console.log('Final is_registered value:', isRegistered);
        
        // Clear the fromLogin flag after successful OTP verification
        localStorage.removeItem('fromLogin');
        
        // Navigate based on registration status
        if (isRegistered) {
          console.log('User is registered, navigating to landing');
          navigate('/landing');
        } else {
          console.log('User is not registered, navigating to create profile');
          // Set flag to indicate coming from OTP verification
          localStorage.setItem('fromOtpVerification', 'true');
          navigate('/createProfile');
        }
      } else {
        console.log('OTP verification failed, showing error:', result.error);
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
      
      // Get phone number from multiple sources with fallback
      const phoneFromUser = user?.phone_number;
      const phoneFromCustomerDetails = customerDetails?.phone_number;
      const phoneFromLocalStorage = localStorage.getItem('phone_number') || localStorage.getItem('phonenumber');
      
      // Also check userData from localStorage (stored during login)
      let phoneFromUserData = null;
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        phoneFromUserData = userData.phone_number;
      } catch (e) {
        console.log('Error parsing userData:', e);
      }
      
      // Use the first available phone number
      const phoneToUse = phoneFromRedux || phoneFromUser || phoneFromCustomerDetails || phoneFromUserData || phoneFromLocalStorage;
      
      console.log('Phone number sources:', {
        phoneFromRedux,
        phoneFromUser,
        phoneFromCustomerDetails,
        phoneFromUserData,
        phoneFromLocalStorage,
        phoneToUse
      });
      
      if (!phoneToUse) {
        messageApi.error('Phone number not found. Please start over.');
        return;
      }
      
      const response = await authAPI.resendotp({ phone_number: phoneToUse });
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
