/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { carAPI } from '../services/api';

const CarUpload = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await carAPI.uploadOptionDetails(values);
      message.success('Car details uploaded successfully!');
      form.resetFields();
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Failed to upload car details',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-upload-container">
      <h2>Upload Car Details</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="car-upload-form"
      >
        <Form.Item
          name="make"
          label="Car Make"
          rules={[{ required: true, message: 'Please enter car make' }]}
        >
          <Input placeholder="Enter car make" />
        </Form.Item>

        <Form.Item
          name="model"
          label="Car Model"
          rules={[{ required: true, message: 'Please enter car model' }]}
        >
          <Input placeholder="Enter car model" />
        </Form.Item>

        <Form.Item
          name="year"
          label="Year"
          rules={[{ required: true, message: 'Please enter year' }]}
        >
          <Input type="number" placeholder="Enter year" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Upload Car Details
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CarUpload;