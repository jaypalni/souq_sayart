import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
import '../assets/styles/loginScreen.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { setPhoneLogin, loginSuccess, setToken, clearCustomerDetails } from '../redux/actions/authActions';
// import socket from '../socket';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [, setPhoneValidation] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailerrormsg, setEmailErrorMsg] = useState('');
  const [captchaerrormsg, setCaptchaErrorMsg] = useState('');
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
  const GEO_CACHE_KEY = 'geoDataCache';
  const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

  const fetchGeoDataFromAPI = async () => {
    const geoRes = await fetch('https://ipapi.co/json/');
    if (!geoRes.ok) throw new Error(`Geo API error: ${geoRes.status}`);
    return geoRes.json();
  };

  const getCachedGeoData = () => {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const isCacheValid = parsed?.ts && Date.now() - parsed.ts < MAX_CACHE_AGE_MS;
    return isCacheValid ? parsed.data : null;
  };

  const saveGeoDataToCache = (geoData) => {
    localStorage.setItem(
      GEO_CACHE_KEY,
      JSON.stringify({ ts: Date.now(), data: geoData })
    );
  };

  const getGeoData = async () => {
    const cachedData = getCachedGeoData();
    if (cachedData) return cachedData;

    try {
      const freshData = await fetchGeoDataFromAPI();
      saveGeoDataToCache(freshData);
      return freshData;
    } catch (err) {
      console.error('Geo data fetch error', err);
      return null;
    }
  };

  const findDefaultCountry = (countries, geoData) => {
    if (geoData) {
      const userCountryCode = geoData.country_calling_code;
      const matchedCountry = countries.find(
        (country) =>
          country.country_code === userCountryCode ||
          country.country_name?.toLowerCase() === geoData.country_name?.toLowerCase()
      );
      if (matchedCountry) return matchedCountry;
    }

    // Fallback: Detect India locale
    const tzLower = Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() || '';
    const tzOffset = new Date().getTimezoneOffset();
    const langs = [navigator.language, ...(navigator.languages || [])].filter(Boolean);

    const isIndiaLocale =
      tzLower === 'asia/kolkata' ||
      tzLower === 'asia/calcutta' ||
      tzOffset === -330 ||
      langs.some((l) => {
        const ll = String(l).toLowerCase();
        return ll.endsWith('-in') || ll === 'en-in' || ll.includes('-in');
      });

    if (isIndiaLocale) {
      return (
        countries.find((c) => c.country_code === '+91') ||
        countries.find((c) => c.country_name?.toLowerCase() === 'india') ||
        null
      );
    }

    // Final fallback: first country in list
    return countries[0];
  };

  const fetchCountries = async () => {
    try {
      const response = await authAPI.countrycode();
      const data = handleApiResponse(response);

      if (data?.length > 0) {
        setCountryOptions(data);

        const geoData = await getGeoData();
        const defaultCountry = findDefaultCountry(data, geoData);

        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
        }
      }
    } catch (error) {
      console.error('Failed to fetch countries', error);
    }
  };

  fetchCountries();
}, []);


  const handlePhoneChange = (e) => {
    const numb = e.target.value;
    setEmailErrorMsg('');

    if (/^\d*$/.test(numb)) {
      setPhone(numb);

      if (numb.length > 0) {
        setPhoneValidation('Phone number is required!');
      } else {
        setPhoneValidation('');
      }
    }
  };

  // const [msg, setMsg] = useState('');

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     console.log('Connected to WebSocket');
  //   });

  //   socket.on('newMessage', (data) => {
  //     console.log('New message:', data);
  //     setMsg(data);
  //   });

  //   return () => {
  //     socket.off('newMessage');
  //   };
  // }, []);

  const handleCaptchaChange = (value) => {
    console.log('Captcha value:', value);
    setVerified(!!value);
    setCaptchaErrorMsg('');
  };

  const onClickContinue = async () => {
    console.log('continue');
    if (phone === '') {
      setEmailErrorMsg('Phone number is required!');
    } else if (verified == false) {
      setCaptchaErrorMsg('Captcha is required!');
    } else {
      try {
        console.log('Captcha', verified);
        console.log(selectedCountry, phone);
        setLoading(true);

        localStorage.removeItem('otpEndTime'); 
        localStorage.removeItem('fromLogin');
        localStorage.removeItem('userData');
        localStorage.removeItem('customerDetails'); // Clear any existing customer details
        
        // Clear Redux state
        dispatch(clearCustomerDetails()); 

        const response = await authAPI.login({
          captcha_token: verified,
          phone_number: `${selectedCountry.country_code}${phone}`,
        });
        const phoneNumber = `${selectedCountry.country_code}${phone}`;

        const data = handleApiResponse(response);
        if (data) {
          console.log('Login response data:', data);
          
          // Update Redux state
          dispatch(setToken(data.access_token));
          dispatch(setPhoneLogin(phoneNumber));
        
          // Redux Persist handles token persistence
          localStorage.setItem('userData', JSON.stringify(data));
          localStorage.setItem('fromLogin', 'true');
        

          messageApi.open({
            type: 'success',
            content: data.message,
          });
          navigate('/verifyOtp');
        }
      } catch (error) {
        const errorData = handleApiError(error);
        messageApi.open({
          type: 'success',
          content: errorData.error,
        });
        messageApi.error(
          errorData.message || 'Login failed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div
      style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column' }}
    >
      {contextHolder}
      {/* Header */}

      {/* Login Form */}
      <div
        style={{
          flex: 1,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 0',
        }}
      >
        <div
          style={{
            width: 400,
            background: '#fff',
            borderRadius: 8,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: '#0A0A0B',
              fontSize: 20,
              fontFamily: 'Roboto',
              fontWeight: 700,
            }}
          >
            Login
          </h2>
          <p style={{ color: '#0A0A0B', fontSize: 14, fontFamily: 'Roboto' }}>
            Enter Your Phone Number to login to our website.
          </p>
          <div style={{ margin: '20px 0' }}>
            {/* Single label for both fields */}
            <label
              htmlFor="phone-number-input"
              style={{
                display: 'block',
                marginBottom: 6,
                fontWeight: 500,
                color: '#637D92',
                textAlign: 'left',
                fontSize: 12,
              }}
            >
              Enter Your Phone Number
            </label>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
              {/* Country code dropdown */}
              <div style={{ position: 'relative', width: 102, height: 52 }}>
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: 8,
                    padding: '8px 12px',
                    background: '#E7EBEF',
                    border: 'none',
                    width: '100%',
                    height: '100%',
                  }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="Select country code"
                  aria-expanded={dropdownOpen}
                >
                  {selectedCountry && (
                    <>
                      <img
                        src={`${BASE_URL}${selectedCountry.country_flag_image}`}
                        alt='flag'
                        style={{ width: 20, height: 14, marginRight: 6 }}
                      />
                      <span style={{ fontSize: 16 }}>
                        {selectedCountry.country_code}
                      </span>
                    </>
                  )}
                </button>
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 42,
                      left: 0,
                      background: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: 4,
                      zIndex: 10,
                      minWidth: 120,
                    }}
                  >
                    {countryOptions.map((country) => (
                      <button
                        key={country.id}
                        type="button"
                        style={{
                          padding: '6px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          border: 'none',
                          background: 'transparent',
                          width: '100%',
                          textAlign: 'left',
                        }}
                        onClick={() => {
                          setSelectedCountry(country);
                          setDropdownOpen(false);
                        }}
                        aria-label={`Select ${country.country_name || country.country_code}`}
                      >
                        <img
                        
                          src={`${BASE_URL}${country.country_flag_image}`}
                          alt='flag'
                          style={{ width: 20, height: 14, marginRight: 6 }}
                        />
                        <span style={{ fontSize: 15 }}>
                          {country.country_code}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Phone number input */}
              <input
                id="phone-number-input"
                className='login-box'
                type='tel'
                placeholder='Enter phone number'
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>

            <div className='emailerror-msg' style={{ marginLeft: 110 }}>
              {emailerrormsg}
            </div>
          </div>
          <div style={{ margin: '10px 0px 10px 20px' }}>
            <ReCAPTCHA
              sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
              onChange={handleCaptchaChange}
            />
          </div>
          <div
            className='emailerror-msg'
            style={{ marginLeft: 10, marginBottom: 10 }}
          >
            {captchaerrormsg}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              style={{
                background: '#ffffff',
                color: '#0090d4',
                border: '1px solid #008ad5',
                borderRadius: 20,
                padding: '2px 24px',
                cursor: 'pointer',
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontSize: 14,
                height: 35,
              }}
              onClick={() => {
                dispatch({ type: 'SET_LOGIN', payload: false });
                navigate('/landing');
              }}
            >
              Continue as guest
            </button>
            <button
              style={{
                background: loading ? '#ccc' : '#0090d4',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '2px 52px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontSize: 14,
                opacity: loading ? 0.7 : 1,
              }}
              onClick={() => onClickContinue()}
              disabled={loading}
            >
              {loading ? 'Loading' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
