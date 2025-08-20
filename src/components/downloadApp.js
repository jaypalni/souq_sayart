/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import '../assets/styles/downloadApp.css';
import googlePlay from '../assets/images/windowsDownload.png';
import appStore from '../assets/images/appleDownload.png';
import appMockup from '../assets/images/downloadMobiles.png';

const DownloadApp = () => {
  return (
    <div className="download-app-section">
      <div className="download-app-left">
        <h2 className="download-app-title">Download Our Souq App</h2>
        <p className="download-app-desc">
          Lorem ipsum dolor sit amet consectetur. Commodo dignissim in nibh vel
          rhoncus. Nullam sit faucibus eu massa nulla turpis leo habitasse.
        </p>
        <div className="download-app-badges">
          <a
            href="https://play.google.com/store/apps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={googlePlay}
              alt="Get it on Google Play"
              className="download-app-badge"
            />
          </a>

          <a
            href="https://apps.apple.com/app/id1234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={appStore}
              alt="Download on the App Store"
              className="download-app-badge"
            />
          </a>
        </div>
      </div>
      <div className="download-app-right">
        <img src={appMockup} alt="App Mockup" className="download-app-image" />
      </div>
    </div>
  );
};

export default DownloadApp;