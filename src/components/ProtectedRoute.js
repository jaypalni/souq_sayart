/**
 * @file ProtectedRoute.js
 * @description Route protection component for authenticated user access.
 * @version 1.0.0
 * @date 2025-08-19
 * @author Palni
 *
 * Copyright (c) 2025 Palni.
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const ProtectedRoute = ({ children }) => {
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();

  const isLoggedIn = customerDetails;

  if (!isLoggedIn) {
    messageApi.open({
      type: 'warning',
      content: 'Please login to access this page',
    });

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default ProtectedRoute;
