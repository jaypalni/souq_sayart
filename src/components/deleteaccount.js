// // src/components/DeleteAccount.js

// import React, { useState, useEffect, useRef } from 'react';
// import { message, Layout, Menu, Avatar, Button, Switch, Modal } from 'antd';
// import { AiOutlineLeft } from 'react-icons/ai';
// import { useNavigate, Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { userAPI } from '../services/api';
// import { handleApiResponse, handleApiError } from '../utils/apiUtils';
// import { clearCustomerDetails } from '../redux/actions/authActions';
// import '../assets/styles/signupOtp.css';
// import '../assets/styles/myProfile.css';

// // Images
// import profileIcon from '../assets/images/Profile_icon.svg';
// import subsriptionIcon from '../assets/images/Subscriptions_icon.png';
// import messageIcon from '../assets/images/Messages_icon.png';
// import notificationIcon from '../assets/images/Notification_icon.png';
// import searchesIcon from '../assets/images/Capa_1.png';
// import paymentIcon from '../assets/images/Payment_icon.png';
// import blockIcon from '../assets/images/Block_icon.png';
// import dealerIcon from '../assets/images/Dealer_icon.png';
// import favoriteIcon from '../assets/images/Favorites_icon.png';
// import whatsupIcon from '../assets/images/Whatsup.png';
// import logoutIcon from '../assets/images/Logout_icon.png';
// import deleteIcon from '../assets/images/Delete_icon.png';


// const OTP_LENGTH = 4;

// const DeleteAccount = ({ onBack }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
//   const [timer, setTimer] = useState(30);
//   const [isTimerRunning, setIsTimerRunning] = useState(true);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isContinueDisabled, setIsContinueDisabled] = useState(false);
//   const [messageApi, contextHolder] = message.useMessage();
//   const [whatsappNotification, setWhatsappNotification] = useState(false);
//   const [whatsappLoading, setWhatsappLoading] = useState(false);

// //   const inputRefs = Array.from({ length: OTP_LENGTH }, () => useRef());
// const inputRefs = useRef([]);

// const handleWhatsappToggle = async (checked) => {
//     try {
//       setWhatsappLoading(true);
//       const whatsappValue = checked ? '1' : '0';
//       const response = await userAPI.updateProfile({ whatsapp: whatsappValue });
//       const result = handleApiResponse(response);
      
//       if (result) {
//         setWhatsappNotification(checked);
//         messageApi.open({
//           type: 'success',
//           content: 'WhatsApp notification preference updated successfully!',
//         });
//       }
//     } catch (error) {
//       setWhatsappNotification(!checked);
//       const errorData = handleApiError(error);
//       messageApi.open({
//         type: 'error',
//         content: errorData?.message || 'Failed to update WhatsApp preference',
//       });
//     } finally {
//       setWhatsappLoading(false);
//     }
//   };

// const menuItems = [
//     {
//       key: 'Personal Informations',
//       label: (
//         <Link
//           to="/myProfile"
//           style={{
//             fontSize: '14px',
//             fontWeight: 700,
//             color: '#0A0A0B',
//           }}
//         >
//           {' '}
//           Personal Informations
//         </Link>
//       ),
//     },
//     {
//       key: 'profile',
//       icon: <img src={profileIcon} alt="Profile" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Profile
//         </Link>
//       ),
//     },
//     {
//       key: 'subscriptions',
//       icon: <img src={subsriptionIcon} alt="Profile" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile/subscriptions"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Subscriptions
//         </Link>
//       ),
//     },
//     {
//       key: 'messages',
//       icon: <img src={messageIcon} alt="Message" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile/messages"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Messages
//         </Link>
//       ),
//     },
//     {
//       key: 'notifications',
//       icon: <img src={notificationIcon} alt="Notification" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile/notifications"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Manage Notifications
//         </Link>
//       ),
//     },
//     {
//       key: 'searches',
//       icon: <img src={searchesIcon} alt="Searches" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile/searches"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Saved Searches
//         </Link>
//       ),
//     },
//     {
//       key: 'payments',
//       icon: <img src={paymentIcon} alt="Payment" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile/payments"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Payments
//         </Link>
//       ),
//     },
//     {
//       key: 'blocked',
//       icon: <img src={blockIcon} alt="Block" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile/blocked"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Blocked users
//         </Link>
//       ),
//     },
//     {
//       key: 'dashboard',
//       icon: <img src={dealerIcon} alt="Dealor" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile/dashboard"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Dealership Dashboard
//         </Link>
//       ),
//     },
//     {
//       key: 'favorites',
//       icon: <img src={favoriteIcon} alt="Favorite" style={{ width: 16, height: 16 }} />,
//       label: (
//         <Link
//           to="/myProfile/favorites"
//           style={{
//             fontSize: '12px',
//             fontWeight: 400,
//             color: '#0A0A0B',
//           }}
//         >
//           Favorites
//         </Link>
//       ),
//     },
//     {
//       key: 'whatsapp',
//       icon: <img src={whatsupIcon} alt="Whatsup" style={{ width: 16, height: 16 }}/>,
//       label: (
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>WhatsApp</span>
//           <Switch 
//             size="small" 
//             checked={whatsappNotification}
//             onChange={handleWhatsappToggle}
//             loading={whatsappLoading}
//           />
//         </div>
//       ),
//     },
//   ];

// useEffect(() => {
//   inputRefs.current = Array(OTP_LENGTH)
//     .fill(null)
//     .map(() => React.createRef());
// }, []);

 

//   /** Format timer into MM:SS */
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   /** OTP Input Change Handler */
//   const handleChange = (e, idx) => {
//     const val = e.target.value.replace(/\D/g, '');
//     const newOtp = [...otp];
//     if (val) {
//       newOtp[idx] = val[val.length - 1];
//       setOtp(newOtp);
//       setError('');
//       if (idx < OTP_LENGTH - 1) {
//         inputRefs[idx + 1].current.focus();
//       }
//     } else {
//       newOtp[idx] = '';
//       setOtp(newOtp);
//     }
//   };

//   /** Handle Backspace */
//   const handleKeyDown = (e, idx) => {
//     if (e.key === 'Backspace') {
//       if (otp[idx]) {
//         const newOtp = [...otp];
//         newOtp[idx] = '';
//         setOtp(newOtp);
//       } else if (idx > 0) {
//         inputRefs[idx - 1].current.focus();
//       }
//     }
//   };

//   /** Validate OTP */
//   const validateOtp = () => {
//     if (otp.some((digit) => digit === '' || !/^\d$/.test(digit))) {
//       setError('Please enter the OTP.');
//       return false;
//     }
//     setError('');
//     return true;
//   };

//   /** API Call: Delete Account with OTP */
//   const handleOTPDelete = async () => {
//     if (!validateOtp()) return;

//     try {
//       setLoading(true);
//       setIsContinueDisabled(true);

//       const otpDigits = otp.join('');
//       const requestId = localStorage.getItem('requestId');

//       const otpPayload = {
//         otp: otpDigits,
//         request_id: requestId,
//       };

//       const result = await userAPI.getDeleteOtp(otpPayload);
//       const data = handleApiResponse(result);

//       if (data?.status_code === 200) {
//         await messageApi.open({
//           type: 'success',
//           content: data?.message,
//           duration: 1,
//         });
//         localStorage.clear();
//         dispatch(clearCustomerDetails());
//         dispatch({ type: 'CLEAR_USER_DATA' });
//         navigate('/');
//       } else {
//         setIsContinueDisabled(false);
//         messageApi.open({
//           type: 'error',
//           content: data?.error || 'Invalid OTP. Please try again.',
//         });
//       }
//     } catch (err) {
//       console.error('OTP Delete Error:', err);
//       setIsContinueDisabled(false);
//       messageApi.open({
//         type: 'error',
//         content: err?.message || 'Something went wrong!',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** API Call: Resend OTP */
//   const handleResend = async () => {
//     if (!isTimerRunning) {
//       setTimer(30);
//       setIsTimerRunning(true);
//     }
//     try {
//       setLoading(true);
//       const response = await userAPI.getDelete();
//       const data = handleApiResponse(response);
//       if (data) {
//         localStorage.setItem('requestId', data.request_id);
//         messageApi.open({
//           type: 'success',
//           content: data.message,
//         });
//       }
//     } catch (err) {
//       const errorData = handleApiError(err);
//       messageApi.open({
//         type: 'error',
//         content: errorData.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /** Timer countdown */
//   useEffect(() => {
//     let interval;
//     if (isTimerRunning && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             setIsTimerRunning(false);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isTimerRunning, timer]);

//   return (
//     <>
//       <div className="page-header">
//         {contextHolder}
//         <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>My Profile</div>
//         <div style={{ fontSize: 11 }}>Post an ad in just 3 simple steps</div>
//       </div>
//       <Layout style={{ background: '#fff' }}>
//         <Sider
//           width={260}
//           collapsible
//           collapsed={collapsed}
//           trigger={null}
//           style={{
//             background: '#fff',
//             borderRight: '1px solid #f0f0f0',
//             padding: '32px 0 0 0',
//           }}
//         >
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 4, padding: '0 24px' }}>
//             <Avatar
//               size={48}
//               style={{
//                 background: '#e3f1ff',
//                 color: '#1890ff',
//                 fontWeight: 700,
//               }}
//             >
//               RD
//             </Avatar>
//             {!collapsed && <div style={{ fontWeight: 600 }}>{customerDetails.first_name + ' ' + customerDetails.last_name}</div>}
//           </div>

//           <Menu mode="inline" selectedKeys={['profile']} style={{ borderRight: 0 }} items={menuItems} />

//           <div style={{ marginTop: 32 }}>
//             <div
//               style={{
//                 padding: '0 24px',
//                 color: '#0A0A0B',
//                 fontWeight: 700,
//                 fontSize: 15,
//                 marginBottom: 8,
//               }}
//             >
//               Manage Account
//             </div>
//             <Menu
//               mode="inline"
//               style={{ borderRight: 0, fontWeight: 400, fontSize: '12px' }}
//               items={manageItems}
//               onClick={({ key }) => {
//                 if (key === 'logout') setLogoutModalOpen(true);
//                 if (key === 'delete') setDeleteModalOpen(true);
//               }}
//             />
//           </div>

//           <Button
//             type="text"
//             className="sidebar-toggle-btn"
//             onClick={() => setCollapsed(!collapsed)}
//             style={{ position: 'absolute', top: 10, right: -18, zIndex: 1000 }}
//             icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//           />
//         </Sider>
//         <Layout>
//           <Content style={{ padding: '40px 40px 0 40px', background: '#fff' }}>
//             <div className='myprofile-main'>
//               <div className='myprofile-header' style={{ display: 'flex', alignItems: 'center' }}>
//                 <AiOutlineLeft
//                   onClick={() => navigate('/myProfile/change-phone')}
//                   style={{ fontSize: '18px', cursor: 'pointer', marginRight: '10px' }}
//                 />
//                 Enter OTP Sent To Your New Number
//               </div>
              
//               <div style={{ justifyContent: 'flex-start' }}>
//                 <p className="otp-desc">
//                   Enter the verification code sent to your phone number
//                 </p>

//                 <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, marginBottom: 12 }}>
//                   {otp.map((digit, idx) => {
//                     const inputClass = buildOtpInputClass(digit, error);
//                     const inputKey = OTP_INPUT_IDS[idx];
//                     return (
//                       <input
//                         key={inputKey}
//                         ref={inputRefs[idx]}
//                         type="tel"
//                         className={inputClass}
//                         maxLength={1}
//                         value={digit}
//                         onChange={(e) => handleChange(e, idx)}
//                         onKeyDown={(e) => handleKeyDown(e, idx)}
//                       />
//                     );
//                   })}
//                 </div>

//                 {error && (
//                   <div
//                     className="otp-error"
//                     style={{
//                       color: '#ff4d4f',
//                       marginTop: 8,
//                       marginBottom: 4,
//                       textAlign: 'center',
//                     }}
//                   >
//                     {error}
//                   </div>
//                 )}

//                 <div className="otp-timer">
//                   {renderTimerContent(isTimerRunning, timer, formatTime, handleResend)}
//                 </div>
                
//                 <button
//                   className="otp-btn otp-btn-filled"
//                   type="button"
//                   onClick={handleContinue}
//                   style={{ height: 35 }}
//                   disabled={loading}
//                 >
//                   {loading ? 'Verifying...' : 'Continue'}
//                 </button>
//               </div>
//             </div>
//           </Content>
//         </Layout>
//       </Layout>

//       <Modal
//         open={logoutModalOpen}
//         onCancel={() => setLogoutModalOpen(false)}
//         footer={null}
//         title={<div className="brand-modal-title-row"><span style={{textAlign:'center',margin:'15px 0px 0px 15px',fontWeight: 700}}>Are you sure you want to log out?</span></div>}
//         width={350}
//       >
//         <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '2px',marginTop:'15px' }}>
//           <Button
//             onClick={() => setLogoutModalOpen(false)}
//             style={{
//               width: 120,
//               backgroundColor: '#ffffff',
//               color: '#008AD5',
//               borderColor: '#008AD5',
//               borderWidth: 1,
//               fontSize: '16px',
//               fontWeight: 700,
//               borderRadius: '24px',
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="primary"
//             onClick={handleLogout}
//             style={{
//               width: 120,
//               backgroundColor: '#008AD5',
//               color: '#ffffff',
//               fontSize: '16px',
//               fontWeight: 700,
//               borderRadius: '24px',
//             }}
//           >
//             Confirm
//           </Button>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default DeleteAccount;


/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { message, Layout, Menu, Avatar, Button, Switch, Modal } from 'antd';
import { AiOutlineLeft } from 'react-icons/ai';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { userAPI, authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useSelector, useDispatch } from 'react-redux';
import { clearCustomerDetails } from '../redux/actions/authActions';
import '../assets/styles/signupOtp.css';
import '../assets/styles/myProfile.css';
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

const { Sider, Content } = Layout;

const manageItems = [
  { key: 'logout', icon: <img src={logoutIcon} alt="Logout" style={{ width: 16, height: 16 }} />, label: 'Logout' },
  { key: 'delete', icon: <img src={deleteIcon} alt="Delete" style={{ width: 16, height: 16 }} />, label: 'Delete Account' },
];

const DeleteAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [error, setError] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [, setDeleteModalOpen] = useState(false);
  const [whatsappNotification, setWhatsappNotification] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);
  const intervalRef = useRef(null);
  const { customerDetails } = useSelector((state) => state.customerDetails);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await userAPI.getProfile({});
        const profileData = handleApiResponse(response);
        if (profileData) {
          setWhatsappNotification(profileData?.data?.whatsapp);
        }
      } catch (error) {
        // Handle error silently
      }
    };

    fetchProfileData();
  }, []);

  const handleWhatsappToggle = async (checked) => {
    try {
      setWhatsappLoading(true);
      const whatsappValue = checked ? '1' : '0';
      const response = await userAPI.updateProfile({ whatsapp: whatsappValue });
      const result = handleApiResponse(response);
      
      if (result) {
        setWhatsappNotification(checked);
        messageApi.open({
          type: 'success',
          content: 'WhatsApp notification preference updated successfully!',
        });
      }
    } catch (error) {
      setWhatsappNotification(!checked);
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData?.message || 'Failed to update WhatsApp preference',
      });
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    userlogout();
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
          Profile
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
          Subscriptions
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
          Messages
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
          Manage Notifications
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
          Saved Searches
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
          Payments
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
          Blocked users
        </Link>
      ),
    },
    {
      key: 'dashboard',
      icon: <img src={dealerIcon} alt="Dealor" style={{ width: 16, height: 16 }} />,
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
          Favorites
        </Link>
      ),
    },
    {
      key: 'whatsapp',
      icon: <img src={whatsupIcon} alt="Whatsup" style={{ width: 16, height: 16 }}/>,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>WhatsApp</span>
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

  useEffect(() => {
    // Start timer when component mounts
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimer(60);
    setIsTimerRunning(true);

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

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    }
    setError('');
    return true;
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
    //    setIsDeleteContinueDisabled(true);
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
        // setIsDeleteContinueDisabled(false);
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
  
    //   setIsDeleteContinueDisabled(false);
      messageApi.open({
        type: 'error',
        content: errorMessage,
      });
    } finally {
    //   setIsDeleteContinueDisabled(false);
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

  const buildOtpInputClass = (digit, error) => {
    let inputClass = 'otp-input';

    if (digit) {
      inputClass += ' filled';
    }

    if (error && (digit === '' || !/^\d$/.test(digit))) {
      inputClass += ' otp-input-error';
    }

    return inputClass;
  };

  const renderTimerContent = (isTimerRunning, timer, formatTime, handleResend) => {
    if (isTimerRunning) {
      return (
        <span>
          Resend in{' '}
          <span className="otp-timer-count">{formatTime(timer)}</span>
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

  return (
    <>
      <div className="page-header">
        {contextHolder}
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>My Profile</div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 4, padding: '0 24px' }}>
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
            {!collapsed && <div style={{ fontWeight: 600 }}>{customerDetails.first_name + ' ' + customerDetails.last_name}</div>}
          </div>

          <Menu mode="inline" selectedKeys={['profile']} style={{ borderRight: 0 }} items={menuItems} />

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
            <div className='myprofile-main'>
              <div className='myprofile-header' style={{ display: 'flex', alignItems: 'center' }}>
                <AiOutlineLeft
                  onClick={() => navigate('/myProfile')}
                  style={{ fontSize: '18px', cursor: 'pointer', marginRight: '10px' }}
                />
                Enter OTP to Delete Account
              </div>
              
              <div style={{ justifyContent: 'flex-start' }}>
                <p className="otp-desc">
                  Enter the verification code sent to your phone number
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, marginBottom: 12 }}>
                  {otp.map((digit, idx) => {
                    const inputClass = buildOtpInputClass(digit, error);
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
                      textAlign: 'center',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="otp-timer">
                  {renderTimerContent(isTimerRunning, timer, formatTime, handleResend)}
                </div>
                
                <button
                  className="otp-btn otp-btn-filled"
                  type="button"
                  onClick={handleOTPDelete}
                  style={{ height: 35 }}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>

      <Modal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={null}
        title={<div className="brand-modal-title-row"><span style={{textAlign:'center',margin:'15px 0px 0px 15px',fontWeight: 700}}>Are you sure you want to log out?</span></div>}
        width={350}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '2px',marginTop:'15px' }}>
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
    </>
  );
};

export default DeleteAccount;
