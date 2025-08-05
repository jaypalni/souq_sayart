import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import "../assets/styles/login.css";


const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  

  const onClickContinue = async () => {
    try {
      // Validate form before submission
      const values = await form.validateFields();
      setLoading(true);

      // Call login API
      const response = await authAPI.login({
        email: values.email,
        password: values.password,
      });

      const data = handleApiResponse(response);

      if (data && data.token) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);

        // Store user data if available
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
        }

        message.success("Login successful!");

        // Redirect to dashboard or home page
        // window.location.href = '/dashboard';
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-container">
      <h2>Login to Your Account</h2>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        className="login-form"
        onFinish={onClickContinue}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
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
