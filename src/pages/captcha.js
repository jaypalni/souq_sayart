/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
const Captcha = () => {
  const [verified, setVerified] = useState(false);
  const handleCaptchaChange = (value) => {
    setVerified(!!value);
    // Always send a safe string to Flutter
    if (window.Captcha) {
      window.Captcha.postMessage(value ? String(value) : '');
    }
  };
  return (
    <ReCAPTCHA
      sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // test key
      onChange={handleCaptchaChange}
    />
  );
};
export default Captcha;