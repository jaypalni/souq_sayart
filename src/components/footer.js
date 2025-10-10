/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import footerLogo from '../assets/images/souqLogo_blue.svg';
import '../assets/styles/footer.css';
import fb_icon from '../assets/images/fb_icon.svg';
import x_icon from '../assets/images/x_icon.svg';
import insta_icon from '../assets/images/insta_icon.svg';
import whatsapp_icon from '../assets/images/whatsapp_icon.svg';

const Footer = () => {
  const navigate = useNavigate();
   const location = useLocation();
  const socialIcons = [
    { name: 'Facebook', icon: fb_icon },
    { name: 'X', icon: x_icon },
    { name: 'Instagram', icon: insta_icon },
    { name: 'WhatsApp', icon: whatsapp_icon },
  ];

  const appBadges = [
    {
      alt: 'Get it on Google Play',
      src: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg',
      style: { height: 40, marginRight: 8 },
      link: 'https://play.google.com/store/apps/',
    },
    {
      alt: 'Download on the App Store',
      src: 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg',
      style: { height: 40 },
      link: 'https://apps.apple.com/app/id1234567890',
    },
  ];

  const footerdata = [
    {
      catogory: 'Quick Links',
      items: ['Buy', 'Sell', 'My Listings', 'Evaluate My Car'],
    },
    {
      catogory: 'Account',
      items: ['My Profile', 'Messages', 'Contact Us', 'Payments'],
    },
    {
      catogory: 'Help Center',
      items: ['FAQs', 'Privacy Policy', 'Terms & Conditions'],
    },
  ];

   const handleItemClick = (sub) => {
    if (sub === 'Terms & Conditions') {
      navigate('/tandc'); 
    } else if (sub === 'Privacy Policy') {
      navigate('/privacypolicy'); 
    } else if (sub === 'FAQs') {
      navigate('/faqs'); 
    } else if (sub === 'Contact Us') {
      navigate('/contactus'); 
    } else if (sub === 'My Profile') {
      navigate('/myProfile'); 
    } else {
      console.log(`${sub} clicked`);
    }
  };

   const getPathForItem = (sub) => {
    switch (sub) {
      case 'Terms & Conditions':
        return '/tandc';
      case 'Privacy Policy':
        return '/privacypolicy';
      case 'FAQs':
        return '/faqs';
      case 'Contact Us':
        return '/contactus';
      case 'My Profile':
        return '/myProfile';
      default:
        return '';
    }
  };

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

              {item.items.map((sub) => {
                const itemPath = getPathForItem(sub);
                const isActive = location.pathname === itemPath;

                return (
                  <div
                    key={`${item.catogory}-${sub}`}
                    className={`footer-cat-map ${isActive ? 'active-footer-link' : ''}`}
                    onClick={() => handleItemClick(sub)}
                    style={{
                      cursor: ['Terms & Conditions', 'Privacy Policy', 'FAQs', 'Contact Us', 'My Profile'].includes(sub)
                        ? 'pointer'
                        : 'default',
                    }}
                  >
                    {sub}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="footer-app-col">
            <div className="footer-download">Download Our App on</div>
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
        Souq Sayarat@2025. All Right Reserved.
      </div>
    </div>
  );
};

export default Footer;