import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Typography,
  message,
  Switch,
  Upload,
} from "antd";
import { PlusCircleFilled, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { authAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import whatsappIcon from "../assets/images/Whatsup.svg";
const { Title, Text } = Typography;

const CreateProfile = () => {
  const [isDealer, setIsDealer] = useState(true);
  const [form] = Form.useForm();
  const [dobError, setDobError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [checked, setChecked] = useState(false);
  const [uploadedDocUrl, setUploadedDocUrl] = useState("");

  const handleChange = (value) => {
    setChecked(value);
  };

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
      delete values.uploadDocuments;
    }
    setDobError("");
    console.log("Form values:", values);
    message.success("Form submitted successfully!");
  };

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  console.log("Selected file:", file);

  if (file) {
    const localUrl = URL.createObjectURL(file);
    setUploadedDocUrl(localUrl);
    form.setFieldsValue({ uploadDocuments: localUrl });
  }

  try {
    setLoading(true);

    // Prepare FormData
    const formData = new FormData();
    formData.append("images", file);

    // Upload the image
    const carResponse = await authAPI.uploadimages(formData);
    const userdoc = handleApiResponse(carResponse);

    if (userdoc?.attachment_url) {
      console.log("Uploaded attachment URL:", userdoc.attachment_url);
      form.setFieldsValue({ uploadedImageUrl: userdoc.attachment_url });
      setUploadedDocUrl(userdoc.attachment_url); 
    }

    message.success(userdoc.message || ' details uploaded successfully!');
    form.resetFields();
   
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to upload details');
  } finally {
    setLoading(false);
  }
};


  const handleBeforeUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const onFinishFailed = ({ errorFields }) => {
    const dobErr = errorFields.find((f) => f.name[0] === "dob");
    setDobError(dobErr ? dobErr.errors[0] : "");
  };

  const getInitials = () => {
    const first = form.getFieldValue("firstName") || "";
    const last = form.getFieldValue("lastName") || "";
    return (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();
  };

  const onClickContinue = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formattedDOB = values.dob.format("YYYY-MM-DD");
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
        profile_pic: imageUrl || "",
        phone_number: values.phoneNumber || "",
        is_dealer: values.isDealer,
        whatsapp: checked ? "1" : "0",
        document: uploadedDocUrl || "",
      };
      console.log("12345789", payload);
      const response = await authAPI.register(payload);
      const data = handleApiResponse(response);

      console.log("12345", data);

      message.success(data.message);
      navigate("/landing");
    } catch (error) {
      if (error.errorFields) {
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
        padding: "16px",
      }}
    >
      <div
        className="bg-white p-4 rounded"
        style={{ minWidth: 320, maxWidth: 480, width: "100%" }}
      >
        <Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontWeight: 700,
            fontSize: 20,
          }}
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
          <Upload showUploadList={false} beforeUpload={handleBeforeUpload}>
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
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                getInitials() || <UserOutlined />
              )}

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
          </Upload>
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
                label={
                  <span
                    style={{ fontWeight: 400, color: "#637D92", fontSize: 12 }}
                  >
                    First Name<span style={{ color: "#637D92" }}>*</span>
                  </span>
                }
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
                style={{ marginBottom: 12 }}
                required={false}
              >
                <Input placeholder="First Name" size="middle" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: "#637D92", fontSize: 12 }}
                  >
                    Last Name*
                  </span>
                }
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
                required={false}
              >
                <Input placeholder="Last Name" size="middle" />
              </Form.Item>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: "#637D92", fontSize: 12 }}
                  >
                    Email
                  </span>
                }
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Valid email is required",
                  },
                ]}
                required={false}
              >
                <Input placeholder="Email" size="middle" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 400, color: "#637D92", fontSize: 12 }}
                  >
                    Date Of Birth*
                  </span>
                }
                name="dob"
                rules={[
                  {
                    required: true,
                    message: "this field is mandatory please fill it",
                  },
                ]}
                required={false}
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
                  size="middle"
                  disabledDate={(current) =>
                    current && current > moment().endOf("day")
                  }
                />
              </Form.Item>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 400, color: "#637D92", fontSize: 12 }}
                >
                  Are You A Dealer?*
                </span>
              }
              name="isDealer"
              rules={[
                {
                  required: true,
                  message: "Please select if you are a dealer",
                },
              ]}
              required={false}
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
                      uploadDocuments: undefined,
                    });
                  }
                }}
              >
                <Radio value={false} style={{ marginRight: 24 }}>
                  Yes
                </Radio>
                <Radio value={true}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {!isDealer && (
            <>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#637D92",
                          fontSize: 12,
                        }}
                      >
                        Company Name*
                      </span>
                    }
                    name="companyName"
                    rules={[
                      {
                        required: isDealer,
                        message: "Company name is required",
                      },
                    ]}
                    required={false}
                  >
                    <Input placeholder="Company Name" size="middle" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#637D92",
                          fontSize: 12,
                        }}
                      >
                        Owner's Name*
                      </span>
                    }
                    name="ownerName"
                    rules={[
                      { required: isDealer, message: "Owner name is required" },
                    ]}
                    required={false}
                  >
                    <Input placeholder="Owner's Name" size="middle" />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#637D92",
                          fontSize: 12,
                        }}
                      >
                        Company Address*
                      </span>
                    }
                    name="companyAddress"
                    rules={[
                      {
                        required: isDealer,
                        message: "Company address is required",
                      },
                    ]}
                    required={false}
                  >
                    {/* {" "} */}
                    <Input placeholder="Company Address" size="middle" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#637D92",
                          fontSize: 12,
                        }}
                      >
                        Phone Number*
                      </span>
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
                    required={false}
                  >
                    <Input placeholder="Phone Number" size="middle" />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#637D92",
                          fontSize: 12,
                        }}
                      >
                        Company Registration Number CR*
                      </span>
                    }
                    name="companyCR"
                    rules={[
                      { required: isDealer, message: "CR number is required" },
                    ]}
                    required={false}
                  >
                    {/* {" "} */}
                    <Input placeholder="000000000000" size="middle" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#637D92",
                          fontSize: 12,
                        }}
                      >
                        Facebook Page (Optional)
                      </span>
                    }
                    name="facebookPage"
                    required={false}
                  >
                    {/* {" "} */}
                    <Input placeholder="Name" size="middle" />{" "}
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#637D92",
                          fontSize: 11,
                        }}
                      >
                        Instagram Company Profile (Optional)
                      </span>
                    }
                    name="instagramProfile"
                    required={false}
                  >
                    {/* {" "} */}
                    <Input placeholder="Name" size="middle" />{" "}
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#637D92",
                          fontSize: 12,
                        }}
                      >
                        Upload Documents
                      </span>
                    }
                    name="uploadDocuments"
                    required={false}
                  >
                    {/* {" "} */}
                    <Input
                      placeholder="Documents"
                      size="middle"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />{" "}
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span
                    style={{ fontWeight: 700, color: "#0A0A0B", fontSize: 13 }}
                  >
                    <img
                      src={whatsappIcon}
                      alt="Whatsapp Icon"
                      style={{ width: 18, height: 18, marginRight: 5 }}
                    />
                    Whatsapp
                  </span>

                  <Switch
                    checked={checked}
                    onChange={handleChange}
                    style={{
                      backgroundColor: checked ? "#008AD5" : "#ccc",
                    }}
                  />
                </div>
              </div>
            </>
          )}
          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                marginTop: 20,
                width: 200,
                height: 35,
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 16,
                background: "#008AD5",
              }}
              onClick={onClickContinue}
            >
              Create account
            </Button>
          </Form.Item>

          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 4,
              fontSize: 13,
            }}
          >
            <a
              // href="https://example.com"
              // target="_blank"
              // rel="noopener noreferrer"
              onClick={() => navigate("/termsAndconditions")}
              style={{ color: "#1890ff", textDecoration: "none" }}
            >
              By registering you agree with our terms & conditions and privacy
              policy
            </a>
          </Text>
        </Form>
      </div>
    </div>
  );
};

export default CreateProfile; 