/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import '../assets/styles/cartypelist.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import rightarrow from '../assets/images/rightarrow_icon.svg';
import leftarrow from '../assets/images/leftarrow_icon.svg';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Searchemptymodal from '../components/searchemptymodal';
import PropTypes from 'prop-types';

const Arrow = (props) => {
  const { className, style, onClick, left } = props;
  return (
    <button
      type="button"
      className={className + ' car-type-arrow'}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        color: '#222',
        fontSize: 36,
        width: 48,
        height: 48,
        left: left ? -40 : 'unset',
        right: !left ? -40 : 'unset',
        zIndex: 3,
        cursor: 'pointer',
        border: 'none',
      }}
      onClick={onClick}
      aria-label={left ? 'Previous' : 'Next'}
    >
      {left ? (
        <img src={rightarrow} alt="leftarrow" />
      ) : (
        <img src={leftarrow} alt="rightarrow" />
      )}
    </button>
  );
};

Arrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  left: PropTypes.bool,
};

const CarTypeList = () => {
  const [, setLoading] = useState(false);
  const [carBodyTypes, setCarBodyTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bodyType, setBodyType] = useState('All Body Types');
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    nextArrow: <Arrow left={false} />,
    prevArrow: <Arrow left={true} />,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
    ],
  };

  const fetchBodyTypeCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getBodyCars({});
      const data1 = handleApiResponse(response);

      if (data1?.data) {
        setCarBodyTypes(data1.data);
      }

      message.success(data1.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to fetch body types');
      setCarBodyTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBodyTypeCars();
  }, []);

  const handleSearch = async (item) => {
    try {
      setLoading(true);

      const params = {
        make: '',
        model: '',
        body_type: item,
        location: '',
      };

      const response = await carAPI.getSearchCars(params);
      const data1 = handleApiResponse(response);
      if (data1) {
        const results = data1?.data?.cars || [];

        if (results.length === 0) {
          setIsModalOpen(true);
        } else {
          navigate('/allcars', {
            state: { cars: results, pagination: data1?.data?.pagination },
          });
          localStorage.setItem('searchcardata', JSON.stringify(params));
        }
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to search car data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-type-list-container">
      <h2 className="car-type-list-title">Body Types</h2>
      <Slider {...settings} className="car-type-slider">
        {carBodyTypes.map((type) => (
          <button
            type="button"
            key={type.id}
            className="car-type-item"
            onClick={() => handleSearch(type.body_type)}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <div className="car-type-icon">
              <img
                src={`http://13.202.75.187:5002${type.body_type_image}`}
                alt={type.body_type}
                width="96"
                height="36"
              />
            </div>
            <div className="car-type-name">{type.body_type}</div>
          </button>
        ))}
      </Slider>
      <Searchemptymodal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bodyType={bodyType}
        setBodyType={setBodyType}
        onSave={handleSearch}
      />
    </div>
  );
};

export default CarTypeList;