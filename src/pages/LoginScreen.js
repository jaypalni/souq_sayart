import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";
import "../assets/styles/loginScreen.css";
import ReCAPTCHA from "react-google-recaptcha";
// import socket from "../socket";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [phonevalidation, setPhoneValidation] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailerrormsg, setEmailErrorMsg] = useState("");
  const [captchaerrormsg, setCaptchaErrorMsg] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const token = localStorage.getItem("token");

  const isLoggedIn = customerDetails && user;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/landing");
    }
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await authAPI.countrycode();
        const data = handleApiResponse(response);
        if (data && data.length > 0) {
          setCountryOptions(data);
          const getGeoData = async () => {
            try {
              const cacheKey = "geoDataCache";
              const cached = localStorage.getItem(cacheKey);
              if (cached) {
                const parsed = JSON.parse(cached);
                const maxAgeMs = 24 * 60 * 60 * 1000;
                if (
                  parsed?.ts &&
                  Date.now() - parsed.ts < maxAgeMs &&
                  parsed?.data
                ) {
                  return parsed.data;
                }
              }

              const geoRes = await fetch("https://ipapi.co/json/");
              if (!geoRes.ok)
                throw new Error(`Geo API error: ${geoRes.status}`);
              const geoData = await geoRes.json();
              localStorage.setItem(
                cacheKey,
                JSON.stringify({ ts: Date.now(), data: geoData })
              );
              return geoData;
            } catch (err) {
              return null;
            }
          };

          const geoData = await getGeoData();
          let defaultCountry = null;

          if (geoData) {
            const userCountryCode = geoData.country_calling_code;
            defaultCountry = data.find(
              (country) =>
                country.country_code === userCountryCode ||
                country.country_name?.toLowerCase() ===
                  geoData.country_name?.toLowerCase()
            );
          }

          if (!defaultCountry) {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const tzLower = tz ? tz.toLowerCase() : "";
            const tzOffset = new Date().getTimezoneOffset();
            const langs = [
              navigator.language,
              ...(navigator.languages || []),
            ].filter(Boolean);
            const isIndiaLocale =
              tzLower === "asia/kolkata" ||
              tzLower === "asia/calcutta" ||
              tzOffset === -330 ||
              langs.some((l) => {
                const ll = String(l).toLowerCase();
                return (
                  ll.endsWith("-in") || ll === "en-in" || ll.includes("-in")
                );
              });
            if (isIndiaLocale) {
              defaultCountry =
                data.find((c) => c.country_code === "+91") ||
                data.find((c) => c.country_name?.toLowerCase() === "india") ||
                null;
            }
          }

          if (!defaultCountry) {
            defaultCountry = data[0];
          }

          if (defaultCountry) {
            setSelectedCountry(defaultCountry);
          }
        }
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };
    fetchCountries();
  }, []);

  const handlePhoneChange = (e) => {
    const numb = e.target.value;
    setEmailErrorMsg("");

    if (/^\d*$/.test(numb)) {
      setPhone(numb);

      if (numb.length > 0) {
        setPhoneValidation("Phone number is required!");
      } else {
        setPhoneValidation("");
      }
    }
  };

  // const [msg, setMsg] = useState("");

  // useEffect(() => {
  //   socket.on("connect", () => {

  //   });

  //   socket.on("newMessage", (data) => {

  //     setMsg(data);
  //   });

  //   return () => {
  //     socket.off("newMessage");
  //   };
  // }, []);

  const handleCaptchaChange = (value) => {
    setVerified(!!value);
    setCaptchaErrorMsg("");
  };

  const onClickContinue = async () => {
    if (phone === "") {
      setEmailErrorMsg("Phone number is required!");
    } else if (verified == false) {
      setCaptchaErrorMsg("Captcha is required!");
    } else {
      try {
        setLoading(true);

        const response = await authAPI.login({
          captcha_token: verified,
          phone_number: `${selectedCountry.country_code}${phone}`,
        });
        const savephonenumber = `${selectedCountry.country_code}${phone}`;
        localStorage.setItem("phonenumber", savephonenumber);

        const data = handleApiResponse(response);
        if (data) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("requestid", data.request_id);
          localStorage.setItem(
            "phone_number",
            `${selectedCountry.country_code}${phone}`
          );

          if (data) {
            localStorage.setItem("userData", JSON.stringify(data));
          }

          messageApi.open({
            type: "success",
            content: data.message,
          });
          localStorage.setItem("fromLogin", "true");
          navigate("/verifyOtp");
        }
      } catch (error) {
        const errorData = handleApiError(error);
        messageApi.open({
          type: "error",
          content: errorData.message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{ minHeight: "50vh", display: "flex", flexDirection: "column" }}
    >
      {contextHolder}
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
                        src={`http://192.168.2.72:5001${selectedCountry.country_flag_image}`}
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
                          src={`http://192.168.2.72:5001${country.country_flag_image}`}
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
                onChange={handlePhoneChange}
              />
            </div>

            <div className="emailerror-msg" style={{ marginLeft: 110 }}>
              {emailerrormsg}
            </div>
          </div>
          <div style={{ margin: "10px 0px 10px 20px" }}>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleCaptchaChange}
            />
          </div>
          <div
            className="emailerror-msg"
            style={{ marginLeft: 10, marginBottom: 10 }}
          >
            {captchaerrormsg}
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
