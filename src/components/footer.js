import React from "react";
import footerLogo from "../assets/images/souqLogo_blue.svg";
import "../assets/styles/footer.css";

import fb_icon from "../assets/images/fb_icon.svg";
import x_icon from "../assets/images/x_icon.svg";
import insta_icon from "../assets/images/insta_icon.svg";
import whatsapp_icon from "../assets/images/whatsapp_icon.svg";

const Footer = () => {
  // Social icons as emoji placeholders (replace with images if available)
  const socialIcons = [
    { name: "Facebook", icon: fb_icon },
    { name: "X", icon: x_icon },
    { name: "Instagram", icon: insta_icon },
    { name: "WhatsApp", icon: whatsapp_icon },
  ];

  // App store badges (replace src with actual badge images if available)
  const appBadges = [
    {
      alt: "Get it on Google Play",
      src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
      style: { height: 40, marginRight: 8 },
    },
    {
      alt: "Download on the App Store",
      src: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
      style: { height: 40 },
    },
  ];

  const footerdata = [
    {
      catogory: "Quick Links",
      items: ["Buy", "Sell", "My Listings", "Evaluate My Car"],
    },
    {
      catogory: "Account",
      items: ["My Profile", "Messages", "Contact us", "Payments"],
    },
    {
      catogory: "Help Center",
      items: ["FAQs", "Privacy Policy", "Terms & Conditions"],
    },
  ];

  return (
    <div
      style={{
        //background: "#fcfcfc",
        // borderTop: "1px solid #eee",
        padding: "40px 0 0 0",
        marginTop: 40,
      }}
    >
      <div className="footer-main-row">
        {/* Logo and Social */}
        <div className="footer-logo-col">
          <img  className="footerLogoImg" src={footerLogo} alt="Souq Logo" />
          <div className="footer-names">
            {socialIcons.map((icon) => (
              <img key={icon.name} src={icon.icon} alt={icon.name} />
            ))}
          </div>
        </div>
        {/* Footer Columns */}
        <div className="footer-columns-col">
          {footerdata.map((item) => (
            <div className="footer-col-cat" key={item.catogory}>
              <div className="footer-col-cat-data">{item.catogory}</div>
              {item.items.map((sub, idx) => (
                <div key={idx} className="footer-cat-map">
                  {sub}
                </div>
              ))}
            </div>
          ))}
          {/* App Download Column */}
          <div className="footer-app-col">
            <div className="footer-download">Download Our App on</div>
            <div className="footer-app-badge">
              {appBadges.map((badge) => (
                <img
                  key={badge.alt}
                  src={badge.src}
                  alt={badge.alt}
                  style={badge.style}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="footer-copyright">
        Souq Siyarat@2024. All Right Reserved. Powered by TEDMOB
      </div>
    </div>
  );
};

export default Footer;
