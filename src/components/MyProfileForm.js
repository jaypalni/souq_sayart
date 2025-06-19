import React, { useState, useRef } from "react";
import { Form, Input, Button, Radio, Row, Col, Avatar, message } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const initialProfile = {
  firstName: "Ralph",
  lastName: "Doe",
  email: "Ralphdoe@gmail.com",
  dob: "03 / 12 / 1986",
  dealer: "no",
  company: "Telmdob",
  owner: "Jack Doe",
  address: "02930000000",
  phone: "9100000000",
  reg: "000000000000",
  facebook: "Telmdob",
  instagram: "Telmdob agency",
  avatar: "",
};

const MyProfileForm = () => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef();

  const onFinish = (values) => {
    setProfile({ ...values, avatar: avatarUrl });
    setEditMode(false);
    message.success("Profile updated!");
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
    if (e.target.value === "no") {
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

  return (
    <div className="myprofile-main">
      <div className="myprofile-header">My Profile</div>
      <div className="myprofile-card">
        <Row gutter={24} align="middle" style={{ marginBottom: 16 }}>
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
                      color: "#1890ff",
                      fontWeight: 700,
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
                  {profile.firstName} {profile.lastName}
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
          disabled={!editMode}
          className={editMode ? "edit-mode-form" : ""}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="First Name*" name="firstName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Last Name*" name="lastName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Date of Birth*" name="dob">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Form.Item label="Are You a Dealer?*" name="dealer">
                <Radio.Group onChange={handleDealerChange}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {form.getFieldValue("dealer") === "yes" && (
              <>
                <Col span={6}>
                  <Form.Item label="Company Name" name="company">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Owner's Name" name="owner">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Company Address" name="address">
                    <Input />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Phone Number" name="phone">
                <Input />
              </Form.Item>
            </Col>
            {form.getFieldValue("dealer") === "yes" && (
              <>
                <Col span={6}>
                  <Form.Item label="Company Registration Number CR" name="reg">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Facebook Page (Optional)" name="facebook">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Instagram Company Profile (Optional)"
                    name="instagram"
                  >
                    <Input />
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
              style={{ marginRight: 16 }}
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
                  onClick={() => form.submit()}
                  style={{ marginRight: 8 }}
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
                //icon={<EditOutlined />}
                shape="round"
                type="primary"
                onClick={onEdit}
              >
                Save Changes
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MyProfileForm;
