/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import '../assets/styles/login.css';

const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onClickContinue = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await authAPI.login({
        email: values.email,
        password: values.password,
      });

      const data = handleApiResponse(response);

      if (data && data.token) {
        localStorage.setItem('token', data.token);

        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }

        message.success('Login successful!');
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-container">
      <h2>Login to Your Account</h2>
      <Form
        form={form}
        layout="vertical"
        className="login-form"
        onFinish={onClickContinue}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="login-button"
          >
            Continue
          </Button>
        </Form.Item>

        <div className="login-links">
          <a href="/forgot-password">Forgot Password?</a>
          <a href="/signup">Create Account</a>
        </div>
      </Form>
    </Card>
  );
};

export default LoginForm;