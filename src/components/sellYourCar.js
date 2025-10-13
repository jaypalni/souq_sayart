/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import '../assets/styles/sellYourCar.css';
import carBg from '../assets/images/Car_icon.png';
import { useLanguage } from '../contexts/LanguageContext';

const SellYourCar = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { customerDetails } = useSelector((state) => state.customerDetails);

  const handleGetStarted = () => {
    const isLoggedIn = customerDetails;

    if (!isLoggedIn) {
      messageApi.open({
        type: 'warning',
        content: translate('sellYourCar.PLEASE_LOGIN_TO_SELL'),
      });
      navigate('/login');
      return;
    }
    navigate('/sell');
  };

  return (
    <div
      className="sell-your-car-section"
      style={{ width: '100%', backgroundImage: `url(${carBg})` }}
    >
      {contextHolder}
      <div className="sell-your-car-overlay">
        <h2 className="sell-your-car-title">{translate('sellYourCar.TITLE')}</h2>
        <p className="sell-your-car-desc">
          {translate('sellYourCar.DESCRIPTION')}
        </p>
        <button className="sell-your-car-btn" onClick={handleGetStarted}>
          {translate('sellYourCar.GET_STARTED')}
        </button>
      </div>
    </div>
  );
};

export default SellYourCar;