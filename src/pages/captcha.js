import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Captcha = () => {
  const [verified, setVerified] = useState(false);
  const handleCaptchaChange = (value) => {
    setVerified(!!value);

    // Send token to Flutter WebView
    if (window.Captcha) {
      window.Captcha.postMessage(value);
    }
  };
  return (
    <>
      <ReCAPTCHA
        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
        onChange={handleCaptchaChange}
      />
    </>
  );
};

export default Captcha;
