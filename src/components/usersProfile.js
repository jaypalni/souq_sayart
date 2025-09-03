/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState } from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { Pagination, Select } from 'antd';
import { BsChatLeftDots } from 'react-icons/bs';
import '../assets/styles/userProfile.css';
import Share_icon from '../assets/images/share_icon.svg';
import Bluetick_icon from '../assets/images/bluetick_svg.svg';
import Pinlocation_icon from '../assets/images/pinlocation_icon.svg';
import Allcarslistdata from '../components/Allcarslistdata';
import redcar_icon from '../assets/images/redcar_icon.jpg';
import bluecar_icon from '../assets/images/blackcar_icon.png';

const { Option } = Select;

const LOCATIONS = ['Baghdad', 'Beirut', 'Dubai', 'Riyadh', 'Cairo'];
const DEFAULT_LOCATION = '';
const DEFAULT_PRICE = '$30,435';
const DEFAULT_ENGINE = '6 Cyl 3.0L Petrol';
const DEFAULT_MILEAGE = '55000';
const COUNTRY_US = 'US';
const COUNTRY_LEBANON = 'Lebanon';

const carData = [
  {
    image: redcar_icon,
    title: '2021 Porsche 992 Turbo S',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: COUNTRY_LEBANON,
    country: COUNTRY_US,
    mileage: DEFAULT_MILEAGE,
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: '2025 Mercedes-Benz Citan',
    price: '$40,035',
    engine: DEFAULT_ENGINE,
    transmission: 'Manual',
    location: COUNTRY_LEBANON,
    country: COUNTRY_US,
    mileage: '7500',
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: '2022 Toyota Camry',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: COUNTRY_LEBANON,
    country: COUNTRY_US,
    mileage: DEFAULT_MILEAGE,
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: '2021 Porsche 992 Turbo S',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Manual',
    location: COUNTRY_LEBANON,
    country: 'India',
    mileage: DEFAULT_MILEAGE,
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: '2021 Maruti Suzuki Swift',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: COUNTRY_LEBANON,
    country: 'London',
    mileage: '35490',
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: '2021 Skoda Octavia',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: COUNTRY_LEBANON,
    country: COUNTRY_US,
    mileage: DEFAULT_MILEAGE,
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: '2024 Hyundai Tucson',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: 'Dubai',
    country: 'Dubai',
    mileage: '55989',
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: '2018 Toyota Camry',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: COUNTRY_LEBANON,
    country: COUNTRY_US,
    mileage: '65789',
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: '2002 Honda Accord',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: 'Venezuela',
    country: 'Venezuela',
    mileage: '894894',
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: '2019 Toyota Ipsum',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: COUNTRY_LEBANON,
    country: COUNTRY_US,
    mileage: DEFAULT_MILEAGE,
    featured: true,
    certified: true,
  },
 
  ...Array(5).fill({
    image: redcar_icon,
    title: '2021 Porsche 992 Turbo S',
    price: DEFAULT_PRICE,
    engine: DEFAULT_ENGINE,
    transmission: 'Automatic',
    location: COUNTRY_LEBANON,
    country: COUNTRY_US,
    mileage: DEFAULT_MILEAGE,
    featured: true,
    certified: true,
  }),
];

const UsersProfile = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  const handleChange = () => {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#008ad5',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          height: 55,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 35px' }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 400,
              color: '#fff',
              marginTop: 15,
            }}
          >
            Home &gt; New Cars &gt; Profile
          </p>
        </div>
      </div>

      <div style={{ marginTop: 25, marginLeft: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#cce6f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              color: '#007acc',
            }}
          >
            M
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 'bold', fontSize: 20 }}>Moe</span>
              <span style={{ color: '#008ad5', fontSize: 18 }}>
                <img
                  src={Bluetick_icon}
                  alt="Share"
                  style={{
                    width: 13.33,
                    height: 13.33,
                    cursor: 'pointer',
                    marginRight: 24,
                  }}
                />
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              35 Published ads
            </div>
            <div style={{ fontSize: 14, color: 'gray' }}>
              Joined on 04/10/2024
            </div>
          </div>

          <div style={{ marginLeft: 55 }}>
            <img
              src={Share_icon}
              alt="Share"
              style={{
                width: 24,
                height: 24,
                cursor: 'pointer',
                marginRight: 1,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="blue-btn">
            <BsChatLeftDots /> Message
          </button>
          <button className="green-btn">
            <FaWhatsapp /> Whatsapp
          </button>
          <button className="dark-btn">
            <FaPhoneAlt /> Call
          </button>
        </div>

        {/* Location Selector */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 600, color: '#555' }}>
            <img
              src={Pinlocation_icon}
              alt="Share"
              style={{
                width: 24,
                height: 24,
                cursor: 'pointer',
                marginRight: 4,
              }}
            />
            {'Address'}
          </div>
          <div style={{ marginTop: 10 }}>
            <label htmlFor="location-select" style={{ color: '#008ad5', fontWeight: 'bold' }}>
              Location
            </label>

            <div className="custom-select-wrapper">
              <Select
                id="location-select"
                value={location}
                onChange={(value) => {
                  setLocation(value);
                  handleChange('Location', value);
                }}
              >
                {LOCATIONS.map((l) => (
                  <Option key={l} value={l}>
                    {l}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Car List */}
      <div
        className="row"
        style={{ marginLeft: '100px', marginRight: '100px', marginTop: '25px' }}
      >
        {carData.map((car, idx) => (
          <Allcarslistdata key={`car-${car.title}-${idx}`} car={car} idx={idx} />
        ))}
      </div>

      {/* Pagination */}
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Pagination defaultCurrent={1} total={30} />
      </div>
    </div>
  );
};

export default UsersProfile;
