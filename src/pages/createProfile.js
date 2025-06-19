import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Typography,
  message,
} from "antd";
import { UserOutlined, PlusCircleFilled } from "@ant-design/icons";
import moment from "moment";
import { authAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";

const { Title, Text } = Typography;

const CreateProfile = () => {
  const [isDealer, setIsDealer] = useState(true);
  const [form] = Form.useForm();
  const [dobError, setDobError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Form values:", values);
    if (!values.isDealer) {
      delete values.companyName;
      delete values.ownerName;
      delete values.companyAddress;
      delete values.phoneNumber;
      delete values.companyCR;
      delete values.facebookPage;
      delete values.instagramProfile;
    }
    setDobError("");
    console.log("Form values:", values);
    message.success("Form submitted successfully!");
  };

  const onFinishFailed = ({ errorFields }) => {
    const dobErr = errorFields.find((f) => f.name[0] === "dob");
    setDobError(dobErr ? dobErr.errors[0] : "");
  };

  // Helper to get initials from form values
  const getInitials = () => {
    const first = form.getFieldValue("firstName") || "";
    const last = form.getFieldValue("lastName") || "";
    return (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();
  };

  // API CALL

  const onClickContinue = async () => {
    try {
      setLoading(true);
      // Validate form and get values
      const values = await form.validateFields();

      // Format date of birth
      const formattedDOB = values.dob.format("YYYY-MM-DD");

      // Construct payload
      const payload = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        date_of_birth: formattedDOB,
        user_type: values.isDealer ? "dealer" : "individual",
        company_name: values.companyName || "",
        owner_name: values.ownerName || "",
        company_address: values.companyAddress || "",
        company_phone_number: values.phoneNumber || "",
        company_registration_number: values.companyCR || "",
        facebook_page: values.facebookPage || "",
        instagram_company_profile: values.instagramProfile || "",
        profile_pic: "https://example.com/profile_pics/default.jpg",
        phone_number: values.phoneNumber || "",
        is_dealer: values.isDealer,
      };

      // Call API
      const response = await authAPI.register(payload);
      const data = handleApiResponse(response);

      message.success(data.message);
      navigate("/landing");
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        onFinishFailed(error);
      } else {
        const errorData = handleApiError(error);
        message.error(
          errorData.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        padding: "16px", // add some padding for small devices
      }}
    >
      <div
        className="bg-white p-4 rounded"
        style={{ minWidth: 320, maxWidth: 480, width: "100%" }}
      >
        <Title
          level={3}
          style={{ textAlign: "center", marginBottom: 24, fontWeight: 700 }}
        >
          Create Your Account
        </Title>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "#e6f4ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#1890ff",
              position: "relative",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {getInitials() || <UserOutlined />}
            <PlusCircleFilled
              style={{
                position: "absolute",
                bottom: 6,
                right: 6,
                fontSize: 28,
                color: "#1890ff",
                background: "#fff",
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
          </div>
        </div>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ isDealer: true }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>First Name*</span>}
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input placeholder="First Name" size="large" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Last Name*</span>}
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input placeholder="Last Name" size="large" />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Email</span>}
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Valid email is required",
              },
            ]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Date Of Birth*</span>}
                name="dob"
                rules={[
                  {
                    required: true,
                    message: "this field is mandatory please fill it",
                  },
                ]}
                validateStatus={dobError ? "error" : ""}
                help={dobError || ""}
              >
                <DatePicker
                  style={{
                    width: "100%",
                    borderColor: dobError ? "#ff4d4f" : undefined,
                  }}
                  format="DD / MM / YYYY"
                  placeholder="DD / MM / YYYY"
                  size="large"
                  disabledDate={(current) =>
                    current && current > moment().endOf("day")
                  }
                />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Are You A Dealer?*</span>}
            name="isDealer"
            rules={[
              { required: true, message: "Please select if you are a dealer" },
            ]}
          >
            <Radio.Group
              onChange={(e) => {
                setIsDealer(e.target.value);
                if (!e.target.value) {
                  form.setFieldsValue({
                    companyName: undefined,
                    ownerName: undefined,
                    companyAddress: undefined,
                    phoneNumber: undefined,
                    companyCR: undefined,
                    facebookPage: undefined,
                    instagramProfile: undefined,
                  });
                }
              }}
            >
              <Radio value={true} style={{ marginRight: 24 }}>
                Yes
              </Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          {isDealer && (
            <>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>Company Name*</span>
                    }
                    name="companyName"
                    rules={[
                      {
                        required: isDealer,
                        message: "Company name is required",
                      },
                    ]}
                  >
                    <Input placeholder="Company Name" size="large" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>Owner's Name*</span>
                    }
                    name="ownerName"
                    rules={[
                      { required: isDealer, message: "Owner name is required" },
                    ]}
                  >
                    <Input placeholder="Owner's Name" size="large" />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>Company Address*</span>
                    }
                    name="companyAddress"
                    rules={[
                      {
                        required: isDealer,
                        message: "Company address is required",
                      },
                    ]}
                  >
                    {/* {" "} */}
                    <Input placeholder="Company Address" size="large" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>Phone Number*</span>
                    }
                    name="phoneNumber"
                    rules={[
                      {
                        required: isDealer,
                        message: "Phone number is required",
                      },
                      {
                        pattern: /^\d{8,15}$/,
                        message: "Enter a valid phone number",
                      },
                    ]}
                  >
                    <Input placeholder="Phone Number" size="large" />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>
                        Company Registration Number CR*
                      </span>
                    }
                    name="companyCR"
                    rules={[
                      { required: isDealer, message: "CR number is required" },
                    ]}
                  >
                    {/* {" "} */}
                    <Input placeholder="000000000000" size="large" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 500 }}>
                        Facebook Page (Optional)
                      </span>
                    }
                    name="facebookPage"
                  >
                    {/* {" "} */}
                    <Input placeholder="Name" size="large" />{" "}
                  </Form.Item>
                </div>
              </div>
              <Form.Item
                label={
                  <span style={{ fontWeight: 500 }}>
                    Instagram Company Profile (Optional)
                  </span>
                }
                name="instagramProfile"
              >
                {/* {" "} */}
                <Input placeholder="Name" size="large" />{" "}
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                marginTop: 16,
                height: 44,
                borderRadius: 24,
                fontWeight: 600,
                fontSize: 18,
                background: "#1890ff",
              }}
              onClick={onClickContinue} // Only use this
            >
              Create account
            </Button>
          </Form.Item>

          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 8,
              fontSize: 13,
            }}
          >
            By registering you agree with our{" "}
            <a href="#" style={{ color: "#1890ff" }}>
              terms & conditions
            </a>{" "}
            and{" "}
            <a href="#" style={{ color: "#1890ff" }}>
              privacy policy
            </a>
          </Text>
        </Form>
      </div>
    </div>
  );
};

export default CreateProfile;
