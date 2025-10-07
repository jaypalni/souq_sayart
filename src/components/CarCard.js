import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tag, Dropdown, Menu, Modal } from 'antd';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { COLORS } from '../utils/constants';
import boost_icon from '../assets/images/boost_icon.svg';
import bluecar_icon from '../assets/images/blackcar_icon.png';
import { PiChatDotsLight } from 'react-icons/pi';
import { FaRegHeart } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import '../assets/styles/mycarslisting.css';

const STATUS_ACTIVE = 'Active';
const STATUS_SOLD = 'Sold';

const CarCard = ({ car, value, filterStatus, handleDelete, navigate }) => {
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;

  const getTagProps = () => {
    const mapping = {
      'Active-Sport': { bg: COLORS.activeTagBg, color: COLORS.activeTagColor, label: 'Active' },
      'Active-Base': { bg: COLORS.pendingTagBg, color: COLORS.pendingTagColor, label: 'Pending Approval' },
      'Sold': { bg: COLORS.soldTagBg, color: COLORS.soldTagColor, label: 'Sold' },
    };

    let key;
    if (value === STATUS_ACTIVE) key = `Active-${filterStatus}`;
    else if (value === STATUS_SOLD) key = STATUS_SOLD;
    else key = 'Default';

    return mapping[key] || { bg: COLORS.pendingTagBg, color: COLORS.pendingTagColor, label: car.approval || 'Unknown' };
  };

  const tagProps = getTagProps();

  // ✅ Status label logic
  let displayLabel = { label: '', isVisible: true, bg: '', color: '' };

  if (car.approval?.toLowerCase() === 'pending') {
    if (car.draft === 1) {
      displayLabel = { label: '', isVisible: false, bg: '', color: '' };
    } else {
      displayLabel = { label: 'Approval Pending', isVisible: true, bg: '#FFEDD5', color: '#D67900' };
    }
  } else if (car.approval?.toLowerCase() === 'approved') {
    displayLabel = { label: 'Active', isVisible: true, bg: '#A4F4E7', color: '#0B7B69' };
  } else if (car.approval?.toLowerCase() === 'rejected') {
    displayLabel = { label: 'Rejected', isVisible: true, bg: '#FDECEC', color: '#DC3545' };
  } else {
    displayLabel = { label: car.approval || 'Unknown', isVisible: true, bg: '#F5F5F5', color: '#333' };
  }

  const CARD_WIDTH = 'auto';
  const imageSrc = car.car_image && car.car_image.trim() !== '' ? `${BASE_URL}${car.car_image}` : bluecar_icon;

  const toggleDropdown = (nextId) => {
    setActiveDropdownId(activeDropdownId === nextId ? null : nextId);
  };

  const handleCardClick = () => {
    navigate(`/carDetails/${car.id}`, { state: { previousPage: 'My Listings' } });
  };

  return (
    <>
      {/* 🚘 Car Card */}
      <div className="car-card">
        <div className="car-card-content clickable-area" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          <img src={imageSrc} alt="car" className={`car-card-image ${value === STATUS_SOLD ? 'sold' : ''}`} />
          <div className="car-card-details">
            <div className="car-card-header">
              <h3 className="car-card-title">{car.ad_title}</h3>

              {car.approval?.toLowerCase() === 'approved' && (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="delete"
                        onClick={(e) => {
                          e.domEvent.stopPropagation();
                          handleDelete(car.id);
                        }}
                        style={{ color: '#E4626F', fontSize: '16px', fontWeight: '500' }}
                      >
                        Delete Listing
                      </Menu.Item>

                      <Menu.Item
                        key="edit"
                        onClick={(e) => {
                          e.domEvent.stopPropagation();
                          navigate('/sell', { state: { extras: car } });
                        }}
                        style={{ color: '#0A0A0B', fontSize: '16px', fontWeight: '500' }}
                      >
                        Edit Listing
                      </Menu.Item>

                      <Menu.Item
                        key="sold"
                        onClick={(e) => e.domEvent.stopPropagation()}
                        style={{ color: '#0A0A0B', fontSize: '16px', fontWeight: '500' }}
                      >
                        Mark As Sold
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="car-card-dropdown-btn"
                  >
                    <HiOutlineDotsVertical />
                  </button>
                </Dropdown>
              )}
            </div>

            <div className="car-card-price">{'IQD ' + Number(car.price).toLocaleString()}</div>

            {/* ✅ Status Tag + Reason */}
            {displayLabel.isVisible && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag
                  className="car-card-tag"
                  style={{
                    backgroundColor: displayLabel.bg,
                    color: displayLabel.color,
                    border: 'none',
                  }}
                >
                  {displayLabel.label}
                </Tag>

                {/* ✅ Show Reason button for Rejected status */}
                {car.approval?.toLowerCase() === 'rejected' && car.rejection_reason && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsReasonModalVisible(true);
                    }}
                    style={{
                      color: '#D67900',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '14px',
                    }}
                  >
                    Reason
                  </span>
                )}
              </div>
            )}

            {/* ✅ Boost Button */}
            {car.approval?.toLowerCase() === 'approved' && (
              <div
                className="car-card-boost"
                onClick={(e) => e.stopPropagation()}
                style={{ cursor: 'pointer' }}
              >
                <span className="car-card-boost-text">Boost</span>
                <img src={boost_icon} alt="boost" className="car-card-boost-icon" />
              </div>
            )}
          </div>
        </div>

        {/* ✅ Footer */}
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
            {car.approval?.toLowerCase() === 'approved' ? (
              <div className="car-card-stats-row">
                <span className="car-card-stat">
                  <PiChatDotsLight size={14} /> {car.chat_count || 0} Chats
                </span>
                <span className="car-card-stat">
                  <FaRegHeart size={14} /> {car.like_count || 0} Likes
                </span>
                <span className="car-card-stat">
                  <LuEye size={14} /> {car.views || 0} Views
                </span>
              </div>
            ) : (
              <>
                <Button type="default" onClick={() => handleDelete(car.id)} className="car-card-delete-btn">
                  Delete
                </Button>

                {!(value === 'Active' && car.approval?.toLowerCase() === 'pending') && (
                  <Button
                    type="primary"
                    onClick={() => navigate('/sell', { state: { extras: car } })}
                    className="car-card-edit-btn"
                  >
                    Edit
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Rejection Reason Modal */}
      <Modal
        title="Rejection Details"
        open={isReasonModalVisible}
        onCancel={() => setIsReasonModalVisible(false)}
        footer={null}
      >
        <p>
          <strong>Reason:</strong> {car.rejection_reason || 'No reason provided'}
        </p>
        {car.admin_rejection_comment && (
          <p>
            <strong>Admin Comment:</strong> {car.admin_rejection_comment}
          </p>
        )}
      </Modal>
    </>
  );
};

CarCard.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    ad_title: PropTypes.string.isRequired,
    car_image: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    approval: PropTypes.string,
    rejection_reason: PropTypes.string,
    admin_rejection_comment: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  value: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default CarCard;
