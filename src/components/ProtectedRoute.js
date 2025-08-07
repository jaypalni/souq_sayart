import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();

  // Check if user is logged in
  const isLoggedIn = isAuthenticated || user || customerDetails;

  // If not logged in, show warning and redirect to login
  if (!isLoggedIn) {
    messageApi.open({
      type: 'warning',
      content: 'Please login to access this page',
    });
    
    // Redirect to login with the current path as return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the protected component
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default ProtectedRoute; 