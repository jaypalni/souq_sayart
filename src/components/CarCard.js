
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tag } from 'antd';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import boost_icon from '../assets/images/boost_icon.svg';

const STATUS_ACTIVE = 'Active';
const STATUS_SOLD = 'Sold';

const CarCard = ({ car, value, filterStatus, handleDelete, navigate }) => {
  const [activeDropdownId, setActiveDropdownId] = useState(null);
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
    if (key === 'Default') {
      return { bg: COLORS.pendingTagBg, color: COLORS.pendingTagColor, label: car.status };
    }
    return mapping[key];
  };

  const tagProps = getTagProps();

  const CARD_WIDTH = '308px';

  // Precompute values to avoid ternaries in JSX
  const imageSrc = car.image || '/default-car.png';
  const imageHeight = value === STATUS_ACTIVE ? '144px' : '109px';

  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: BORDER_RADIUS.card,
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        backgroundColor: '#fff',
        width: CARD_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <img
          src={imageSrc}
          alt="car"
          style={{ width: 137, height: imageHeight, borderRadius: BORDER_RADIUS.card, objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px', marginRight: '10px' }}>
            <h3 style={{ margin: 0, fontSize: FONT_SIZES.large, fontWeight: 700 }}>{car.ad_title}</h3>
            {value === STATUS_ACTIVE && (
              <button
                onClick={() => setActiveDropdownId(activeDropdownId === car.id ? null : car.id)}
                style={{ height: '20px', width: '20px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <HiOutlineDotsVertical />
              </button>
            )}
          </div>

          <div style={{ color: COLORS.boostBg, fontWeight: 700, fontSize: FONT_SIZES.medium, marginTop: '4px' }}>
            {'$' + car.price}
          </div>

          <Tag
            color={tagProps.bg}
            style={{ color: tagProps.color, marginTop: '6px', display: 'inline-block', fontSize: FONT_SIZES.small, fontWeight: 700 }}
          >
            {tagProps.label}
          </Tag>

          {value === STATUS_ACTIVE && filterStatus === 'Sport' && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                backgroundColor: COLORS.boostBg,
                borderRadius: '14px',
                height: '30px',
                marginTop: '10px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#fff', fontSize: FONT_SIZES.small, fontWeight: 600 }}>Boost</span>
              <img src={boost_icon} alt="boost" style={{ width: '13px', height: '13px' }} />
            </div>
          )}
        </div>
      </div>

      <div>
        <div style={{ marginTop: '10px', color: COLORS.primary, fontSize: FONT_SIZES.small, fontWeight: 400 }}>
          {car.updated_at}
        </div>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <Button type="default" danger onClick={() => handleDelete(car.id)} style={{ flex: 1, borderRadius: BORDER_RADIUS.button }}>
            Delete
          </Button>
          <Button type="primary" onClick={() => navigate(`/carDetails/${car.id}`)} style={{ flex: 1, borderRadius: BORDER_RADIUS.button }}>
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
    image: PropTypes.string,
    ad_title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updated_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  value: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
