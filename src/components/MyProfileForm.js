import React, { useState, useRef, useEffect } from "react";
import { Form, Input, Button, Radio, Row, Col, Avatar, message } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { userAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";

const MyProfileForm = () => {
  // const [form] = Form.useForm();
  // const [editMode, setEditMode] = useState(false);
  // const [profile, setProfile] = useState(initialProfile);
  // const [avatarUrl, setAvatarUrl] = useState("");
  // const fileInputRef = useRef();
  // const [dealerValue, setDealerValue] = useState(profile.dealer);

  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef();
  const [dealerValue, setDealerValue] = useState("no");

  const [loading, setLoading] = useState(false);
  const [newuserData, setUsersData] = useState({});
  const [dobError, setDobError] = useState("");

  const onFinishFailed = ({ errorFields }) => {
    const dobErr = errorFields.find((f) => f.name[0] === "dob");
    setDobError(dobErr ? dobErr.errors[0] : "");
  };

  // const onFinish = (values) => {
  //   setProfile({ ...values, avatar: avatarUrl });
  //   setEditMode(false);
  //   message.success("Profile updated!");
  // };
  const onFinish = async (values) => {
    setProfile({ ...values, avatar: avatarUrl });
    setEditMode(false);
    message.success("Profile updated!");
    await onClickContinue(); // Call update API here
  };

  const onEdit = () => {
    setEditMode(true);
    form.setFieldsValue(profile);
  };

  const onCancel = () => {
    setEditMode(false);
    setAvatarUrl(profile.avatar || "");
    form.setFieldsValue(profile);
  };

  const handleDealerChange = (e) => {
    const value = e.target.value;
    setDealerValue(value);

    if (value === "no") {
      form.setFieldsValue({
        company: "",
        owner: "",
        address: "",
        reg: "",
        facebook: "",
        instagram: "",
      });
    } else {
      form.setFieldsValue({
        company: profile.company,
        owner: profile.owner,
        address: profile.address,
        reg: profile.reg,
        facebook: profile.facebook,
        instagram: profile.instagram,
      });
    }
  };

  const triggerAvatarUpload = () => {
    if (editMode && fileInputRef.current) fileInputRef.current.click();
  };

  // API Call

  useEffect(() => {
    Userdataapi();
  }, []);

  const Userdataapi = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile({});
      const users_data = handleApiResponse(response);
      if (users_data?.data) {
        const user = users_data.data;

        // Build profile from API data
        const userProfile = {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          dob: user.date_of_birth || "",
          dealer: user.dealer || "no",
          company: user.company_name || "",
          owner: user.owner_name || "",
          address: user.company_address || "",
          phone: user.phone_number || "",
          reg: user.company_registration_number || "",
          facebook: user.facebook_page || "",
          instagram: user.instagram_company_profile || "",
          avatar: user.profile_image || "",
        };

        setUsersData(user); // Save raw response if needed
        setProfile(userProfile); // Set form data
        form.setFieldsValue(userProfile); // Update form fields
        setAvatarUrl(user.avatar || "");
        setDealerValue(user.dealer || "no");

        message.success(users_data.message || "Fetched successfully");
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load profile");
      setUsersData({});
    } finally {
      setLoading(false);
    }
  };

  // Update Profile API Call

  const onClickContinue = async () => {
    try {
      setLoading(true);

      const values = await form.validateFields();

      const formData = new FormData();

      formData.append("first_name", values.first_name || "");
      formData.append("last_name", values.last_name || "");
      formData.append("location", ""); // Add actual File object here if available
      formData.append("whatsapp", "efrg"); // Change if needed
      //  formData.append("whatsapp", values.phone || "");

      console.log("Sending FormData payload", formData);

      const response = await userAPI.updateProfile(formData);

      const result = handleApiResponse(response);

      if (result?.data) {
        const user = result.data;

        const updatedProfile = {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          dob: user.date_of_birth || "",
          dealer: user.is_dealer ? "yes" : "no",
          company: user.company_name || "",
          owner: user.owner_name || "",
          address: user.company_address || "",
          phone: user.phone_number || "",
          reg: user.company_registration_number || "",
          facebook: user.facebook_page || "",
          instagram: user.instagram_company_profile || "",
          avatar: user.profile_image || "",
        };

        setUsersData(user);
        setProfile(updatedProfile);
        form.setFieldsValue(updatedProfile);
        setAvatarUrl(user.profile_image || "");
        setDealerValue(user.is_dealer ? "yes" : "no");

        setEditMode(false);
        message.success(result.message || "Profile updated!");
      }
    } catch (error) {
      if (error.errorFields) {
        onFinishFailed(error);
      } else {
        const errorData = handleApiError(error);
        message.error(errorData.message || "Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="myprofile-main">
      <div className="myprofile-header">My Profile</div>
      <div className="myprofile-card">
        <Row gutter={24} align="middle" style={{ marginBottom: 0 }}>
          <Col span={24}>
            <div className="profile-header-row">
              <div className="profile-avatar-name">
                <div
                  className={`profile-avatar-upload${
                    editMode ? " editable" : ""
                  }`}
                  onClick={triggerAvatarUpload}
                >
                  <Avatar
                    size={64}
                    src={avatarUrl || undefined}
                    style={{
                      background: "#e3f1ff",
                      color: "#008AD5",
                      fontWeight: 400,
                      fontSize: 26,
                      marginRight: 16,
                      cursor: editMode ? "pointer" : "default",
                    }}
                  >
                    RD
                  </Avatar>
                  {editMode && (
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setAvatarUrl(ev.target.result);
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  )}
                </div>
                <span className="profile-username">
                  {/* {newuserData.first_name} {newuserData.last_name} */}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Form
          form={form}
          layout="vertical"
          initialValues={profile}
          onFinish={onFinish}
          // disabled={!editMode}
          className={editMode ? "" : "edit-mode-form"}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#637D92",
                    }}
                  >
                    First Name*
                  </span>
                }
                name="first_name"
              >
                <Input
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#4A5E6D",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#637D92",
                    }}
                  >
                    Last Name*
                  </span>
                }
                name="last_name"
              >
                <Input
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#4A5E6D",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#637D92",
                    }}
                  >
                    Email
                  </span>
                }
                name="email"
              >
                <Input
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#4A5E6D",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#637D92",
                    }}
                  >
                    Date of Birth*
                  </span>
                }
                name="dob"
              >
                <Input
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#4A5E6D",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} align="middle">
            <Col span={24}>
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#637D92",
                    }}
                  >
                    Are You a Dealer?*
                  </span>
                }
                name="dealer"
              >
                <Radio.Group disabled onChange={handleDealerChange}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            {/* Conditional fields shown in same row horizontally */}
            {form.getFieldValue("dealer") === "yes" && (
              <>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#637D92",
                        }}
                      >
                        Company Name
                      </span>
                    }
                    name="company"
                  >
                    <Input
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#4A5E6D",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#637D92",
                        }}
                      >
                        Owner's Name
                      </span>
                    }
                    name="owner"
                  >
                    <Input
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#4A5E6D",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#637D92",
                        }}
                      >
                        Company Address
                      </span>
                    }
                    name="Company Address"
                  >
                    <Input
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#4A5E6D",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#637D92",
                        }}
                      >
                        Phone Number
                      </span>
                    }
                    name="phone"
                  >
                    <Input
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#4A5E6D",
                      }}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>

          <Row gutter={16}>
            {form.getFieldValue("dealer") === "yes" && (
              <>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#637D92",
                        }}
                      >
                        Company Registration Number CR
                      </span>
                    }
                    name="reg"
                  >
                    <Input
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#4A5E6D",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#637D92",
                        }}
                      >
                        Facebook Page (Optional)
                      </span>
                    }
                    name="facebook"
                  >
                    <Input
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#4A5E6D",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#637D92",
                        }}
                      >
                        Instagram Company Profile (Optional)
                      </span>
                    }
                    name="instagram"
                  >
                    <Input
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#4A5E6D",
                      }}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <div className="profile-btns profile-btns-bottom">
            <Button
              className="btn-outline-blue"
              //icon={<PhoneOutlined />}
              shape="round"
              style={{
                marginRight: 16,
                color: "#008AD5",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Change Phone Number
            </Button>
            {editMode ? (
              <>
                <Button
                  className="btn-solid-blue"
                  icon={<CheckOutlined />}
                  shape="round"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 8 }}
                  //onClick={(() => onClickContinue)}
                >
                  Update
                </Button>
                <Button
                  className="btn-outline-blue"
                  icon={<CloseOutlined />}
                  shape="round"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                className="btn-solid-blue"
                icon={<EditOutlined />}
                shape="round"
                type="primary"
                onClick={onEdit}
                style={{
                  color: "#FAFAFA",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MyProfileForm;
