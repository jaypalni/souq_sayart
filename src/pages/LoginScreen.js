import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Footer from "../components/footer";
import footerLogo from "../assets/images/souqLogo_blue.svg";
import Car_icon from "../assets/images/Car_icon.png";
import { authAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";
import "../assets/styles/loginScreen.css";

const countryOptions = [
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
];

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onClickContinue = async () => {
    console.log("continue");
    try {
      // Validate form before submission
      console.log(selectedCountry, phone);
      setLoading(true);

      // Call login API
      const response = await authAPI.login({
        // email:selectedCountry,
        phone_number: phone,
      });

      const data = handleApiResponse(response);
      console.log("verifyOtp", data);
      if (data) {
        // Store token in localStorage
        //localStorage.setItem('token', data.token);

        // Store user data if available
        if (data) {
          localStorage.setItem("userData", JSON.stringify(data));
        }

        message.success(data.message);

        // Redirect to dashboard or home page
        navigate("/verifyOtp");
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ minHeight: "50vh", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}

      {/* Login Form */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 0",
        }}
      >
        <div
          style={{
            width: 400,
            background: "#fff",
            borderRadius: 8,
            padding: 32,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "#0A0A0B",
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 700,
            }}
          >
            Login
          </h2>
          <p style={{ color: "#0A0A0B", fontSize: 14, fontFamily: "Roboto" }}>
            Enter Your Phone Number to login to our app
          </p>
          <div style={{ margin: "20px 0" }}>
            {/* Single label for both fields */}
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 500,
                color: "#637D92",
                textAlign: "left",
                fontSize: 12,
              }}
            >
              Enter Your Phone Number
            </label>
            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              {/* Country code dropdown */}
              <div style={{ position: "relative", width: 102, height: 52 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: 8,
                    padding: "8px 12px",
                    background: "#E7EBEf",
                  }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span
                    style={{ fontSize: 18, marginRight: 5, marginLeft: 12 }}
                  >
                    {selectedCountry.flag}
                  </span>
                  <span style={{ fontSize: 16 }}>{selectedCountry.code}</span>
                </div>
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: 42,
                      left: 0,
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      zIndex: 10,
                      minWidth: 120,
                    }}
                  >
                    {countryOptions.map((country) => (
                      <div
                        key={country.code}
                        style={{
                          padding: "6px 12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          setSelectedCountry(country);
                          setDropdownOpen(false);
                        }}
                      >
                        <span style={{ fontSize: 18, marginRight: 6 }}>
                          {country.flag}
                        </span>
                        <span style={{ fontSize: 15 }}>{country.code}</span>
                        <span
                          style={{ marginLeft: 6, color: "#888", fontSize: 13 }}
                        >
                          {country.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Phone number input */}
              <input
                className="login-box"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => {
                  const numb = e.target.value;
                  if (/^\d*$/.test(numb)) {
                    setPhone(numb);
                  }
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              style={{
                background: "#ffffff",
                color: "#0090d4",
                border: "1px solid #008ad5",
                borderRadius: 20,
                padding: "2px 24px",
                cursor: "pointer",
                fontFamily: "Roboto",
                fontWeight: 400,
                fontSize: 14,
                height: 35,
              }}
              onClick={() => {
                dispatch({ type: "SET_LOGIN", payload: false });
                navigate("/landing");
              }}
            >
              Continue as guest
            </button>
            <button
              style={{
                background: "#0090d4",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "2px 40px",
                cursor: "pointer",
                fontFamily: "Roboto",
                fontWeight: 700,
                fontSize: 14,
              }}
              onClick={() => onClickContinue()}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
