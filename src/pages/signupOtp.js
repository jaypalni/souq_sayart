import React, { useState, useRef, useEffect } from "react";
import "../assets/styles/signupOtp.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { verifyOTP } from "../redux/actions/authActions";
import { message } from "antd";

const SignupOtp = () => {
  const dispatch = useDispatch();
  const { customerDetailsLoading, customerDetailsError } = useSelector((state) => state.customerDetails);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [istimer, setisTimer] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const [otperrormsg, setOtpErrorMsg] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const reqstid = localStorage.getItem("requestid");
    console.log("Access Token", reqstid);

    if (reqstid == "undefined" || reqstid === "" || reqstid === null) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (timer > 0) {
      setisTimer(true);
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setisTimer(false);
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

  const handleResend = async () => {
    if (timer === 0) setTimer(60);

    try {
      const usermobilenumber = localStorage.getItem("phone_number");
      setLoading(true);

      const response = await authAPI.resendotp({
        phone_number: usermobilenumber,
      });

      const data = handleApiResponse(response);

      if (data) {
        localStorage.setItem("userData", JSON.stringify(data));
        messageApi.open({
          type: "success",
          content: data.message,
        });
        // message.success(data.message || "OTP has been resent successfully.");
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData.message,
      });
      // message.error(
      //   errorData.message || "Failed to resend OTP. Please try again."
      // );
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = () => {
    if (otp.some((digit) => digit === "" || !/^\d$/.test(digit))) {
      setError("Please enter the OTP.");
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
    console.log("=== OTP VERIFICATION START ===");
    console.log("OTP digits:", otp.join(""));
    
    if (!validateOtp()) {
      console.log("OTP validation failed");
      return;
    }

    try {
      setLoading(true);
      console.log("Loading set to true");

      const userData = JSON.parse(localStorage.getItem("userData"));
      console.log("User data from localStorage:", userData);
      
      const otpDigits = otp.join("");
      const otpPayload = {
        otp: otpDigits,
        request_id: userData.request_id,
      };
      console.log("OTP payload:", otpPayload);
      
      console.log("Dispatching verifyOTP action...");
      const result = await dispatch(verifyOTP(otpPayload));
      console.log("verifyOTP result:", result);

      if (result.success) {
        console.log("OTP verification successful");
        localStorage.setItem("token", result.data.access_token);
        message.success("OTP verified successfully!");

        if (result.data.is_registered) {
          navigate("/landing", { replace: true });
        } else {
          navigate("/createProfile", { replace: true });
        }
      } else {
        console.log("OTP verification failed:", result.error);
        message.error(result.error || "OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      message.error("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
      console.log("Loading set to false");
    }
  };

  return (
    <div className="otp-container">
      {contextHolder}
      <h2 className="otp-title">Login</h2>
      <p className="otp-desc">
        Enter the verification code sent to your phone number
      </p>
      <div className="otp-inputs">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={inputRefs[idx]}
            type="tel"
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
            Resend in{" "}
            <span className="otp-timer-count">{formatTime(timer)}</span>
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
          disabled={!istimer}
          className="otp-btn otp-btn-filled"
          type="button"
          onClick={handleContinue}
          style={{ cursor: istimer ? "pointer" : "default" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SignupOtp;
