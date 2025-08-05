import React from "react";
import "../assets/styles/header.css";
import iconWhite from "../assets/images/souqLogo.svg";
import NotifiyImg from "../assets/images/bell.svg";
import MessagesImg from "../assets/images/messages.svg";
import { CiBellOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Select } from "antd";

const Header = () => {
  const menuList = [
    { id: "", name: "Buy", path: "/landing", displayName: "" },
    { id: "", name: "Sell", path: "/sell", displayName: "" },
    { id: "", name: "My Listings", path: "/myListings", displayName: "" },
    { id: "", name: "Evaluate My Car", path: "/evaluate", displayName: "" },
  ];

  const navigate = useNavigate();
  const { Option } = Select;
  return (
    <>
      <div className="header">
        <div className="row remove_gutter">
          <div className="col-3 d-flex">
            <img className="headerLogo" src={iconWhite}  />
          </div>
          <div className="col-5 d-flex align-items-center  justify-content-center">
            {menuList.map((item) => (
              <div
                className="menuItem mx-3 "
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                }}
                style={{ cursor: "pointer" }}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="col-4 d-flex align-items-center justify-content-center">
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
            <div
              className="menuLeft mx-2"
              onClick={() => navigate(`/myProfile`)}
              style={{
                cursor: "pointer",
                fontFamily: "Roboto",
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              Sign up / Login
            </div>
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
                  width: 60,
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
                <Option value="En">En</Option>
                <Option value="Ar">Ar</Option>
                <Option value="Ku">Ku</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
