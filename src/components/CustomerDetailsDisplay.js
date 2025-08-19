/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React from "react";
import { useSelector } from "react-redux";
import { Card, Typography, Spin, Alert } from "antd";

const { Title, Text } = Typography;

const CustomerDetailsDisplay = () => {
  const { customerDetails, customerDetailsLoading, customerDetailsError } =
    useSelector((state) => state.customerDetails);

  if (customerDetailsLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
        <Text>Loading customer details...</Text>
      </div>
    );
  }

  if (customerDetailsError) {
    return (
      <Alert
        message="Error"
        description={customerDetailsError}
        type="error"
        showIcon
      />
    );
  }

  if (!customerDetails) {
    return (
      <Card>
        <Title level={4}>Customer Details</Title>
        <Text>No customer details available</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Title level={4}>Customer Details</Title>
      <div style={{ marginTop: "16px" }}>
        {Object.entries(customerDetails).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "8px" }}>
            <Text strong>{key}: </Text>
            <Text>{String(value)}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CustomerDetailsDisplay;
