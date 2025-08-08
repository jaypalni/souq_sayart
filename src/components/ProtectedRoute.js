import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();

  // Check if user is logged in - check multiple auth indicators
  const token = localStorage.getItem("token");
  const isLoggedIn = customerDetails;

  if (!isLoggedIn) {
    messageApi.open({
      type: "warning",
      content: "Please login to access this page",
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
