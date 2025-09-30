
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tag } from 'antd';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import boost_icon from '../assets/images/boost_icon.svg';
import '../assets/styles/mycarslisting.css';
import bluecar_icon from '../assets/images/blackcar_icon.png';

const STATUS_ACTIVE = 'Active';
const STATUS_SOLD = 'Sold';
const JUSTIFY_SPACE_BETWEEN = 'space-between';

const CarCard = ({ car, value, filterStatus, handleDelete, navigate }) => {
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const getTagProps = () => {
  const mapping = {
    'Active-Sport': { bg: COLORS.activeTagBg, color: COLORS.activeTagColor, label: 'Active' },
    'Active-Base': { bg: COLORS.pendingTagBg, color: COLORS.pendingTagColor, label: 'Pending Approval' },
    'Sold': { bg: COLORS.soldTagBg, color: COLORS.soldTagColor, label: 'Sold' },
  };
  

  let key;
  if (value === STATUS_ACTIVE) {
    key = `Active-${filterStatus}`;
  } else if (value === STATUS_SOLD) {
    key = STATUS_SOLD;
  } else {
    key = 'Default';
  }

  // Use fallback if key is not in mapping
  return mapping[key] || { bg: COLORS.pendingTagBg, color: COLORS.pendingTagColor, label: car.approval || 'Unknown' };
};

  const tagProps = getTagProps();

const displayLabel = car&&(  car?.approval === 'pending' || car?.approval === 'Pending'
    ? 'Approval Pending'
    : tagProps?.label);

  const CARD_WIDTH = 'auto';

  // Precompute values to avoid ternaries in JSX
  const imageSrc = car.car_image && car.car_image.trim() !== '' 
  ? `${BASE_URL}${car.car_image}` 
  : bluecar_icon;
  
  const imageHeight = value === STATUS_ACTIVE ? '144px' : '109px';

  const toggleDropdown = (nextId) => {
    if (activeDropdownId === nextId) {
      setActiveDropdownId(null);
      return;
    }
    setActiveDropdownId(nextId);
  };

   const handleCardClick = () => {
    navigate(`/carDetails/${car.id}`);
  };


  return (
    <div className="car-card">
      <div className="car-card-content clickable-area"
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
        >
       <img
  src={imageSrc}
  alt="car"
  className={`car-card-image ${value === STATUS_SOLD ? 'sold' : ''}`}
/>
        <div className="car-card-details">
          <div className="car-card-header">
            <h3 className="car-card-title">{car.ad_title}</h3>
            {value === STATUS_ACTIVE && car.status === 'approved' && (
              <button
                onClick={() => toggleDropdown(car.id)}
                className="car-card-dropdown-btn"
              >
                <HiOutlineDotsVertical />
              </button>
            )}
          </div>

          <div className="car-card-price">
            {'IQD ' + Number(car.price).toLocaleString()}
          </div>

          <Tag
            color={tagProps.bg}
            className="car-card-tag"
            style={{
              color: tagProps.color,
            }}
          >
            {displayLabel}
          </Tag>

          {value === STATUS_ACTIVE && filterStatus === 'Sport' && (
            <div className="car-card-boost">
              <span className="car-card-boost-text">Boost</span>
              <img src={boost_icon} alt="boost" className="car-card-boost-icon" />
            </div>
          )}
        </div>
      </div>

      <div className="car-card-footer">
        <div className="car-card-date">
          {car.updated_at
            ? new Date(car.updated_at).toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : ''}
        </div>
        <div className="car-card-actions">
          <Button
            type="default"
           onClick={() => handleDelete(car.id)}
            className="car-card-delete-btn"
          >
            Delete
          </Button>

          <Button
            type="primary"
            onClick={() => navigate('/sell', { state: { extras: car } })}
            className="car-card-edit-btn"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

CarCard.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string,
    car_image: PropTypes.string,
    ad_title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updated_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  value: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
