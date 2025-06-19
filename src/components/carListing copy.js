import React from 'react';
import { Tag } from 'antd';
import {  FaCogs, FaGlobe, FaMapMarkerAlt, FaRegHeart } from 'react-icons/fa';
import { TbManualGearbox } from "react-icons/tb";

import { CheckCircleFilled } from '@ant-design/icons';
import '../assets/styles/carListing.css';
import redcar_icon from "../assets/images/redcar_icon.jpg";
import bluecar_icon from "../assets/images/blackcar_icon.png";

const carData = [
  {
    image: redcar_icon,
    title: '2021 Porsche 992 Turbo S',
    price: '$30,435',
    engine: '6 Cyl 3.0L Petrol',
    transmission: 'Automatic',
    location: 'Lebanon',
    country: 'US',
    mileage: '55000',
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: '2021 Porsche 992 Turbo S',
    price: '$30,435',
    engine: '6 Cyl 3.0L Petrol',
    transmission: 'Automatic',
    location: 'Lebanon',
    country: 'US',
    mileage: '55000',
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: '2021 Porsche 992 Turbo S',
    price: '$30,435',
    engine: '6 Cyl 3.0L Petrol',
    transmission: 'Automatic',
    location: 'Lebanon',
    country: 'US',
    mileage: '55000',
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: '2021 Porsche 992 Turbo S',
    price: '$30,435',
    engine: '6 Cyl 3.0L Petrol',
    transmission: 'Automatic',
    location: 'Lebanon',
    country: 'US',
    mileage: '55000',
    featured: true,
    certified: true,
  },
];

const CarListing = () => {
  return (
    <div className="car-listing-container">
      <div className="car-listing-header">
        <span>Featured Car</span>
        <a href="#" className="car-listing-seeall">See All</a>
      </div>
      <div className="car-listing-flex-row">
        {carData.map((car, idx) => (
          <div className="car-listing-card" key={idx}>
            <div className="car-listing-image-wrapper">
              <img src={car.image} alt={car.title} className="car-listing-image" />
              <div className="car-listing-badges">
                {car.featured && <div  className="car-listing-badge blue-bg">Featured</div>}
                {car.certified && <div className="car-listing-badge orenge-bg"><CheckCircleFilled /> Certified Dealer</div>}
              </div>
              <div className="car-listing-fav"><FaRegHeart /></div>
            </div>
            <div className="car-listing-content">
              <div className='d-flex'>
              <div className="car-listing-title">{car.title}</div>
              <div className="car-listing-price">{car.price}</div>
              </div>
              <div className='car-listing-engine'>{car.engine}</div>
              <div className="car-listing-details row">
                <div className='col-5'> <span><TbManualGearbox /> {car.transmission}</span></div>
            
                <div className='col-3'>
                <span><FaGlobe /> {car.country}</span> </div>
                <div className='col-4'>
                <span><FaMapMarkerAlt />{car.mileage} </span>
                </div>
                
                <div className="car-listing-location">{car.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarListing; 