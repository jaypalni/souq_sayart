import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tag, Dropdown, Menu, Modal, message } from 'antd';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { COLORS } from '../utils/constants';
import boost_icon from '../assets/images/boost_icon.svg';
import bluecar_icon from '../assets/images/blackcar_icon.png';
import { PiChatDotsLight } from 'react-icons/pi';
import { FaRegHeart } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import '../assets/styles/mycarslisting.css';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

const STATUS_ACTIVE = 'Active';
const STATUS_SOLD = 'Sold';

const CarCard = ({ car, value, filterStatus, handleDelete, navigate, onRefresh }) => {
  const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
  const [isMarkAsSoldModalVisible, setIsMarkAsSoldModalVisible] = useState(false);
  const [, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [messageApi, contextHolder] = message.useMessage();

  
  const getDisplayLabel = () => {
    
    if (value === STATUS_SOLD) {
      return { label: 'Sold', isVisible: true, bg: '#D5F0FF', color: '#008AD5' };
    } 
    
    if (car.approval?.toLowerCase() === 'pending') {
      if (car.draft === 1) {
        return { label: '', isVisible: false, bg: '', color: '' };
      }
      return { label: 'Approval Pending', isVisible: true, bg: '#FFEDD5', color: '#D67900' };
    }
    
    if (car.approval?.toLowerCase() === 'approved') {
      return { label: 'Active', isVisible: true, bg: '#A4F4E7', color: '#0B7B69' };
    }
    
    if (car.approval?.toLowerCase() === 'rejected') {
      return { label: 'Rejected', isVisible: true, bg: '#FDECEC', color: '#DC3545' };
    }
    
    return { label: car.approval || 'Unknown', isVisible: true, bg: '#F5F5F5', color: '#333' };
  };

  const displayLabel = getDisplayLabel();
  const imageSrc = car.car_image && car.car_image.trim() !== '' ? `${BASE_URL}${car.car_image}` : bluecar_icon;

  const handleCardClick = () => {
    navigate(`/carDetails/${car.id}`, { state: { previousPage: 'My Listings' } });
  };

  const handlemarkassoldMethod = async (carId) => {
  try {
    setLoading(true);
    const response = await carAPI.markassold(carId);
    const cardetail = handleApiResponse(response);
    if (cardetail.status_code === 200) {
       messageApi.open({
          type: 'success',
          content: cardetail?.message || 'Car Sold successfully',
        });
       // Reload the data after successful mark as sold
       if (onRefresh) {
         setTimeout(() => {
           onRefresh();
         }, 500);
       }
    } else {
      message.error(cardetail.message || 'Failed to mark as sold');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to mark car as sold');
  } finally {
    setLoading(false);
  }
};



  return (
    <>
      
      <div className="car-card">
        {contextHolder}
        <button 
          type="button"
          className="car-card-content clickable-area" 
          onClick={handleCardClick} 
          style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0, width: '100%', textAlign: 'left' }}
        >
          <img src={imageSrc} alt="car" className={`car-card-image ${value === STATUS_SOLD ? 'sold' : ''}`} />
          <div className="car-card-details">
            <div className="car-card-header">
              <h3 className="car-card-title">{car.ad_title}</h3>

              {car.approval?.toLowerCase() === 'approved' && car.status !== 'sold' && (
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
  onClick={(e) => {
    e.domEvent.stopPropagation();
    setIsMarkAsSoldModalVisible(true);
  }}
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

                
                {car.approval?.toLowerCase() === 'rejected' && car.rejection_reason && (
                  <button
                    type="button"
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
                      background: 'none',
                      border: 'none',
                      padding: 0,
                    }}
                  >
                    Reason
                  </button>
                )}
              </div>
            )}

            
            {car.approval?.toLowerCase() === 'approved' && value !== STATUS_SOLD && (
              <button
                type="button"
                className="car-card-boost"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="car-card-boost-text">Boost</span>
                <img src={boost_icon} alt="boost" className="car-card-boost-icon" />
              </button>
            )}
          </div>
        </button>

        
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
                <Button type="default" onClick={(e) => { e.stopPropagation(); handleDelete(car.id); }} className="car-card-delete-btn">
                  Delete
                </Button>

                {!(value === 'Active' && car.approval?.toLowerCase() === 'pending') && (
                  <Button
                    type="primary"
                    onClick={(e) => { e.stopPropagation(); navigate('/sell', { state: { extras: car } }); }}
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

     
      <Modal
        open={isMarkAsSoldModalVisible}
        onCancel={() => setIsMarkAsSoldModalVisible(false)}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setIsMarkAsSoldModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            style={{ backgroundColor: '#008AD5', borderColor: '#008AD5' }}
            onClick={() => {
              setIsMarkAsSoldModalVisible(false);
              handlemarkassoldMethod(car.id);
            }}
          >
            Confirm
          </Button>,
        ]}
        closable={false}
      >
        <p style={{ fontSize: '16px', textAlign: 'center' }}>
          Are you sure you want to mark this car as sold?
        </p>
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
    status: PropTypes.string,
    draft: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rejection_reason: PropTypes.string,
    admin_rejection_comment: PropTypes.string,
    updated_at: PropTypes.string,
    chat_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    like_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    views: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  value: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};

export default CarCard;
