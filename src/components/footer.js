/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import footerLogo from '../assets/images/souqLogo_blue.svg';
import '../assets/styles/footer.css';
import fb_icon from '../assets/images/fb_icon.svg';
import x_icon from '../assets/images/x_icon.svg';
import insta_icon from '../assets/images/insta_icon.svg';
import whatsapp_icon from '../assets/images/whatsapp_icon.svg';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { translate } = useLanguage();
  
  const socialIcons = [
    { name: 'Facebook', icon: fb_icon },
    { name: 'X', icon: x_icon },
    { name: 'Instagram', icon: insta_icon },
    { name: 'WhatsApp', icon: whatsapp_icon },
  ];

  const appBadges = [
    {
      alt: translate('footer.GET_IT_ON_GOOGLE_PLAY'),
      src: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg',
      style: { height: 40, marginRight: 8 },
      link: 'https://play.google.com/store/apps/',
    },
    {
      alt: translate('footer.DOWNLOAD_ON_APP_STORE'),
      src: 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg',
      style: { height: 40 },
      link: 'https://apps.apple.com/app/id1234567890',
    },
  ];

  const footerdata = [
    {
      catogory: translate('footer.QUICK_LINKS'),
      items: [
        translate('footer.BUY'),
        translate('footer.SELL'),
        translate('footer.MY_LISTINGS'),
        translate('footer.EVALUATE_MY_CAR')
      ],
    },
    {
      catogory: translate('footer.ACCOUNT'),
      items: [
        translate('footer.MY_PROFILE'),
        translate('footer.MESSAGES'),
        translate('footer.CONTACT_US'),
        translate('footer.PAYMENTS')
      ],
    },
    {
      catogory: translate('footer.HELP_CENTER'),
      items: [
        translate('footer.FAQS'),
        translate('footer.PRIVACY_POLICY'),
        translate('footer.TERMS_CONDITIONS')
      ],
    },
  ];

  return (
    <div
      style={{
        padding: '40px 0 0 0',
        marginTop: 40,
      }}
    >
      <div className="footer-main-row">
        <div className="footer-logo-col">
          <img className="footerLogoImg" src={footerLogo} alt="Souq Logo" />
          <div className="footer-names">
            {socialIcons.map((icon) => (
              <img key={icon.name} src={icon.icon} alt={icon.name} />
            ))}
          </div>
        </div>
        <div className="footer-columns-col">
          {footerdata.map((item) => (
            <div className="footer-col-cat" key={item.catogory}>
              <div className="footer-col-cat-data">{item.catogory}</div>
              {item.items.map((sub) => (
                <div key={`${item.catogory}-${sub}`} className="footer-cat-map">
                  {sub}
                </div>
              ))}
            </div>
          ))}
          <div className="footer-app-col">
            <div className="footer-download">{translate('footer.DOWNLOAD_OUR_APP')}</div>

            <div className="footer-app-badge">
              {appBadges.map((badge) => (
                <a
                  key={badge.alt}
                  href={badge.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={badge.src} alt={badge.alt} style={badge.style} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        {translate('footer.COPYRIGHT')}
      </div>
    </div>
  );
};

export default Footer;