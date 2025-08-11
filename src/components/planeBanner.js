import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Car_icon from "../assets/images/Car_icon.png";


const countryOptions = [
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
];

const PlaneBanner = () => {
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/" ||
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
            <h2 style={{ margin: 0 }}>My Profile</h2>
            <p style={{ margin: 0 }}>
              Post Your Listing in just 3 simple steps
            </p>
          </div>
        </div>
      )}

      {/* Plan Banner */}
      <div
        style={{
          width: "100%",
          height: 155,
          background: "#008ad5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
        }}
      > 
        <h1
          style={{
            position: "absolute",
            color: "#fff",
            fontWeight: 700,
            fontSize: 32,
          }}
        >
          {isLoginPage ? "Welcome To Souq Siyarate" : ""}
        </h1>
      </div>
    </div>
  );
};

export default PlaneBanner;
