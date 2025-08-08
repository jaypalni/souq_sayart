import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import '../assets/styles/sellYourCar.css';
import carBg from '../assets/images/Car_icon.png';

const SellYourCar = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { customerDetails } = useSelector((state) => state.customerDetails);

  const handleGetStarted = () => {
    // Check if user is logged in - check multiple auth indicators
    const token = localStorage.getItem('token');
    const isLoggedIn = isAuthenticated || user || customerDetails || token;
    
    if (!isLoggedIn) {
      // User is not logged in, show message and redirect to login
      messageApi.open({
        type: "warning",
        content: "Please login to sell your car",
      });
      navigate('/login');
      return;
    }
    
    // User is logged in, navigate to sell page
    navigate('/sell');
  };

  return (
    <div
      className="sell-your-car-section"
      style={{ width: "100%",backgroundImage: `url(${carBg})`  }}
    >
      {contextHolder}
      <div className="sell-your-car-overlay">
        <h2 className="sell-your-car-title">Sell Your Car</h2>
        <p className="sell-your-car-desc">
          Find your saved searches right here. Get alerts for new listings.
        </p>
        <button className="sell-your-car-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SellYourCar; 