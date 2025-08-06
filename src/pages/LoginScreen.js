import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";
import "../assets/styles/loginScreen.css";
import ReCAPTCHA from "react-google-recaptcha";
// import socket from "../socket";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await authAPI.countrycode();
        const data = handleApiResponse(response);
        if (data && data.length > 0) {
          setCountryOptions(data);
          setSelectedCountry(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };
    fetchCountries();
  }, []);

  // const [msg, setMsg] = useState("");

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Connected to WebSocket");
  //   });

  //   socket.on("newMessage", (data) => {
  //     console.log("New message:", data);
  //     setMsg(data);
  //   });

  //   return () => {
  //     socket.off("newMessage");
  //   };
  // }, []);

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setVerified(!!value);
  };

  const onClickContinue = async () => {
    console.log("continue");
    try {
      console.log(selectedCountry, phone);
      setLoading(true);

      const response = await authAPI.login({
        captcha_token: verified,
        phone_number: `${selectedCountry.country_code}${phone}`,
      });

      const data = handleApiResponse(response);
      if (data) {
        localStorage.setItem("token", data.access_token);

        if (data) {
          localStorage.setItem("userData", JSON.stringify(data));
        }

        message.success(data.message);
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
                    background: "#E7EBEF",
                  }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {selectedCountry && (
                    <>
                      <img
                        src={`http://192.168.2.72:5001/${selectedCountry.country_flag_image}`}
                        alt="flag"
                        style={{ width: 20, height: 14, marginRight: 6 }}
                      />
                      <span style={{ fontSize: 16 }}>
                        {selectedCountry.country_code}
                      </span>
                    </>
                  )}
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
                        key={country.id}
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
                        <img
                          src={`http://your-base-url/${country.country_flag_image}`}
                          alt="flag"
                          style={{ width: 20, height: 14, marginRight: 6 }}
                        />
                        <span style={{ fontSize: 15 }}>
                          {country.country_code}
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
          <div style={{ margin: "10px 0px 20px 0px" }}>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleCaptchaChange}
            />
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
                padding: "2px 52px",
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
