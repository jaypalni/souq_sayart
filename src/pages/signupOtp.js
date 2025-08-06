import React, { useState, useRef, useEffect } from "react";
import "../assets/styles/signupOtp.css";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";

const SignupOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const newOtp = [...otp];
    newOtp[idx] = val[val.length - 1];
    setOtp(newOtp);
    setError("");
    if (idx < 3) inputRefs[idx + 1].current.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs[idx - 1].current.focus();
      }
    }
  };

  const handleResend = () => {
    if (timer === 0) setTimer(60);
  };

  const validateOtp = () => {
    if (otp.some((digit) => digit === "" || !/^\d$/.test(digit))) {
      setError("Please enter the 4-digit verification code.");
      return false;
    }
    setError("");
    return true;
  };

  // const handleContinue = (e) => {
  //   e.preventDefault();
  //   if (validateOtp()) {
  //     setError("");
  //     // Submit OTP logic here
  //     console.log("OTP submitted:", otp.join(""));
  //   }
  // };

  const handleContinue = async () => {
    console.log("continue");
    try {
      setLoading(true);

      const userData = JSON.parse(localStorage.getItem("userData"));
      const otpDigits = otp.join("");
      const response = await authAPI.verifyOtp({
        otp: otpDigits,
        request_id: userData.request_id,
      });

      const data = handleApiResponse(response);
      if (data) {
        localStorage.setItem("token", data.token);
        message.success(data.message);

        if (data.is_registered) {
          navigate("/landing");
        } else {
          navigate("/createProfile");
        }
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="otp-container">
      <h2 className="otp-title">Login</h2>
      <p className="otp-desc">
        Enter the verification code sent to your phone number
      </p>
      <div className="otp-inputs">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={inputRefs[idx]}
            type="number"
            className={`otp-input${digit ? " filled" : ""}${
              error && (digit === "" || !/^\d$/.test(digit))
                ? " otp-input-error"
                : ""
            }`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>
      {error && (
        <div
          className="otp-error"
          style={{
            color: "#ff4d4f",
            marginTop: 8,
            marginBottom: 4,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <div className="otp-timer">
        {timer > 0 ? (
          <span>
            Resend in <span className="otp-timer-count">{timer}s</span>
          </span>
        ) : (
          <span
            className="otp-resend"
            onClick={handleResend}
            style={{ cursor: "pointer", color: "#0090d4" }}
          >
            Resend
          </span>
        )}
      </div>
      <div className="otp-btn-row">
        <button className="otp-btn otp-btn-outline" type="button">
          Continue as guest
        </button>
        <button
          className="otp-btn otp-btn-filled"
          type="button"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SignupOtp;
