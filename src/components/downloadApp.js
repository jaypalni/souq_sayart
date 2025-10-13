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
import { useLanguage } from '../contexts/LanguageContext';

const DownloadApp = () => {
  const { translate } = useLanguage();
  
  return (
    <div className="download-app-section">
      <div className="download-app-left">
        <h2 className="download-app-title">{translate('downloadApp.TITLE')}</h2>
        <p className="download-app-desc">
          {translate('downloadApp.DESCRIPTION')}
        </p>
        <div className="download-app-badges">
          <a
            href="https://play.google.com/store/apps/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={googlePlay}
              alt={translate('downloadApp.GET_IT_ON_GOOGLE_PLAY')}
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
              alt={translate('downloadApp.DOWNLOAD_ON_APP_STORE')}
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