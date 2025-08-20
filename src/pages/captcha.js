/**
 * @file captcha.js
 * @description Page component for CAPTCHA verification and validation.
 * @version 1.0.0
 * @date 2025-08-19
 * @author Palni
 *
 * Copyright (c) 2025 Palni.
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Captcha = () => {
  const [setVerified] = useState(false);
  const handleCaptchaChange = (value) => {
    setVerified(!!value);

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
