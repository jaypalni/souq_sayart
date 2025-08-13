import React, { useState } from "react";
import "../assets/styles/header.css";
import iconWhite from "../assets/images/souqLogo.svg";
import NotifiyImg from "../assets/images/bell.svg";
import MessagesImg from "../assets/images/messages.svg";
import { CiBellOn } from "react-icons/ci";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Select, message, Dropdown } from "antd";
import { logoutUser, clearCustomerDetails } from "../redux/actions/authActions";
const Header = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  // const menuList = [
  //   { id: "", name: "Buy", path: "/landing", displayName: "" },
  //   { id: "", name: "Sell", path: "/sell", displayName: "" },
  //   { id: "", name: "My Listings", path: "/myListings", displayName: "" },
  //   { id: "", name: "Evaluate My Car", path: "/evaluate", displayName: "" },
  // ];
  const userdetails = useSelector((state) => state.userData);
  const { customerDetails, customerDetailsLoading, customerDetailsError } =
    useSelector((state) => state.customerDetails);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const menuList = [
    {
      id: "",
      name: "Buy",
      path: "/landing",
      displayName: "",
      requiresAuth: false,
    },
    {
      id: "",
      name: "Sell",
      // path: "/sell",
      displayName: "",
      requiresAuth: true,
    },
    {
      id: "",
      name: "My Listings",
      // path: "/myListings",
      displayName: "",
      requiresAuth: true,
    },
    {
      id: "",
      name: "Evaluate My Car",
      path: "/evaluate",
      displayName: "",
      requiresAuth: false,
    },
  ];
  const navigate = useNavigate();
  const { Option } = Select;

  // Function to get user display name
  const getUserDisplayName = () => {
    // Check if user is authenticated and has user data
    if (isAuthenticated && user) {
      const firstName = user.first_name || user.firstName || "";
      return firstName.trim();
    }

    // Check if customer details are available
    if (customerDetails) {
      const firstName =
        customerDetails.first_name || customerDetails.firstName || "";
      return firstName.trim();
    }

    return null;
  };

  // Dropdown menu items for logged-in user
  const userMenuItems = [
    {
      key: "myProfile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/myProfile"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
    },
    {
      key: "changePassword",
      label: "Change Password",
      onClick: () => navigate("/changePassword"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      onClick: async () => {
        try {
          // Clear all localStorage data
          localStorage.clear();

          // Dispatch logout action to clear Redux state
          await dispatch(logoutUser());

          // Clear customer details from Redux
          dispatch(clearCustomerDetails());

          // Clear user data from Redux
          dispatch({ type: "CLEAR_USER_DATA" });

          messageApi.open({
            type: "success",
            content: "Logged out successfully",
          });

          // Navigate to login screen
          navigate("/login");
        } catch (error) {
          console.error("Logout error:", error);
          messageApi.open({
            type: "error",
            content: "Logout failed",
          });
        }
      },
    },
  ];

  const comingsoonMessage = (value) => {
    // Check if the menu item requires authentication
    if (value.requiresAuth) {
      // Check if user is logged in - check multiple auth indicators
      const token = localStorage.getItem("token");
      const isLoggedIn = isAuthenticated || getUserDisplayName() || token;

      if (!isLoggedIn) {
        // User is not logged in, redirect to login
        messageApi.open({
          type: "warning",
          content: "Please login to access this feature",
        });
        navigate("/login");
        return;
      }
    }

    // Handle special cases
    if (value.name === "Evaluate My Car") {
      messageApi.open({
        type: "success",
        content: "Coming soon",
      });
      return;
    }

    // Navigate to the respective screen
    navigate(value.path);
  };


  return (
    <>
      <div className="header">
        {contextHolder}
        <div className="row remove_gutter">
          <div className="col-3 d-flex">
            <img className="headerLogo" src={iconWhite} />
          </div>
          <div className="col-5 d-flex align-items-center  justify-content-center">
            {menuList.map((item) => (
              <div
                className="menuItem mx-3 "
                key={item.name}
                onClick={() => {
                  comingsoonMessage(item);
                }}
                style={{ cursor: "pointer" }}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="col-4 d-flex align-items-center justify-content-center">
            {getUserDisplayName() && (
              <>
                <div className="menuLeft mx-1">
                  <img
                    className="headerLogo"
                    src={MessagesImg}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                      marginBottom: "8px",
                      marginLeft: "0px",
                    }}
                  />
                </div>
                <div className="menuLeft mx-2">
                  <img
                    className="headerLogo"
                    src={NotifiyImg}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                      marginBottom: "8px",
                      marginLeft: "0px",
                    }}
                  />
                </div>
              </>
            )}
            {getUserDisplayName() ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div
                  className="menuLeft mx-2"
                  style={{
                    cursor: "pointer",
                    fontFamily: "Roboto",
                    fontSize: 14,
                    fontWeight: "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <UserOutlined style={{ fontSize: "16px" }} />
                  {getUserDisplayName()}
                  <span style={{ fontSize: "12px" }}>▼</span>
                </div>
              </Dropdown>
            ) : (
              <div
                className="menuLeft mx-2"
                onClick={() => navigate(`/login`)}
                style={{
                  cursor: "pointer",
                  fontFamily: "Roboto",
                  fontSize: 14,
                  fontWeight: "400",
                }}
              >
                Sign up / Login
              </div>
            )}
            <div className="menuLeft mx-2">
              <div className="contct_us_btn">Contact Us</div>
            </div>
            <div
              className="menuLeft mx-1"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#FAFAFA",
              }}
            >
              <Select
                defaultValue="En"
                bordered={false}
                style={{
                  width: 90,
                  color: "#FAFAFA",
                  backgroundColor: "transparent",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
                dropdownStyle={{
                  backgroundColor: "white",
                  boxShadow: "none",
                }}
                onChange={(value) => console.log("Selected:", value)}
              >
                <Option value="En">English</Option>
                <Option value="Ar">Arabic</Option>
                <Option value="Ku">Kurdish</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
