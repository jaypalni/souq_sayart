import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Car_icon from "../assets/images/Car_icon.png";
import banner_icon from "../assets/images/homecar_icon.png";

const countryOptions = [
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
];

const Banner = () => {
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/verifyOtp" ||
    location.pathname === "/createProfile";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Profile Banner - Only show on login pages */}
      {isLoginPage && (
        <div
          style={{
            background: "#008ad5",
            color: "#fff",
            padding: "32px 0 16px 0",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 35px" }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 700,
                fontSize: 25,
                fontFamily: "Roboto",
              }}
            >
              My Profile
            </h2>
            <p
              style={{
                margin: 0,
                marginTop: 5,
                fontFamily: 400,
                fontSize: 12,
                fontFamily: "Roboto",
              }}
            >
              Post Your Listing in just 3 simple steps
            </p>
          </div>
        </div>
      )}

      {/* Car Image Banner */}
      <div
        style={{
          width: "100%",
          height: isLoginPage ? 200 : 526,
          background: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Placeholder for car image */}
        <img
          src={isLoginPage ? Car_icon : banner_icon}
          alt="Car"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 70%",
            opacity: isLoginPage ? 0.7 : 1,
          }}
        />
        <h1
          style={{
            position: "absolute",
            color: "#fff",
            fontWeight: 700,
            fontSize: 32,
            fontFamily: 'Roboto',
          }}
        >
          {isLoginPage ? "Welcome To Souq Sayarat" : ""}
        </h1>
      </div>
    </div>
  );
};

export default Banner;
