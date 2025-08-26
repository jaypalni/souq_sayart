/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import PropTypes from 'prop-types';
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

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};