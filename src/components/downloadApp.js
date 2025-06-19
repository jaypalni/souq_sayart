import React from 'react';
import '../assets/styles/downloadApp.css';
import googlePlay from '../assets/images/windowsDownload.svg';
import appStore from '../assets/images/appleDownload.svg';
import appMockup from '../assets/images/downloadMobiles.svg'; // This should be the right-side image

const DownloadApp = () => {
  return (
    <div className="download-app-section">
      <div className="download-app-left">
        <h2 className="download-app-title">Download Our Souq App</h2>
        <p className="download-app-desc">
          Lorem ipsum dolor sit amet consectetur. Commodo dignissim in nibh vel rhoncus. Nullam sit faucibus eu massa nulla turpis leo habitasse.
        </p>
        <div className="download-app-badges">
          <img src={googlePlay} alt="Get it on Google Play" className="download-app-badge" />
          <img src={appStore} alt="Download on the App Store" className="download-app-badge" />
        </div>
      </div>
      <div className="download-app-right">
        <img src={appMockup} alt="App Mockup" className="download-app-image" />
      </div>
    </div>
  );
};

export default DownloadApp; 