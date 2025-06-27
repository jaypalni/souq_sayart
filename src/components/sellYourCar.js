import React from 'react';
import '../assets/styles/sellYourCar.css';
import carBg from '../assets/images/Car_icon.png';

const SellYourCar = () => {
  return (
    <div
      className="sell-your-car-section"
      style={{ width: "100%",backgroundImage: `url(${carBg})`  }}
    >
      <div className="sell-your-car-overlay">
        <h2 className="sell-your-car-title">Sell Your Car</h2>
        <p className="sell-your-car-desc">
          Find your saved searches right here. Get alerts for new listings.
        </p>
        <button className="sell-your-car-btn">Get Started</button>
      </div>
    </div>
  );
};

export default SellYourCar; 