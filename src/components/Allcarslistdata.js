import React, { useState } from 'react';
import { message, Tooltip } from 'antd'; // ✅ added Tooltip
import { CheckCircleFilled } from '@ant-design/icons';
import { FaRegHeart, FaGlobe, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { TbManualGearbox } from 'react-icons/tb';
import PropTypes from 'prop-types';
import { userAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

const Allcarslistdata = ({ car, idx, onClick }) => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const { translate } = useLanguage();
  const [messageApi, contextHolder] = message.useMessage();
  const [, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(car.is_favorite);

  const handleFavorite = async () => {
    try {
      setLoading(car.id);
      const response = await userAPI.addFavorite(car.id);
      const data1 = handleApiResponse(response);

      if (data1) {
        setIsFavorite(true);
        messageApi.open({
          type: 'success',
          content: data1?.message || translate('landing.ADDED_TO_FAVORITES'),
        });
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message);
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      setLoading(car.id);
      const response = await userAPI.removeFavorite(car.id);
      const data1 = handleApiResponse(response);

      if (data1) {
        setIsFavorite(false);
        messageApi.open({
          type: 'success',
          content: data1?.message || translate('landing.REMOVED_FROM_FAVORITES'),
        });
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message);
    } finally {
      setLoading(null);
    }
  };

  // ✅ Inline styles for two-line truncation
  const titleStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    lineHeight: '1.4',
    maxHeight: '2.8em',
    cursor: 'pointer',
    fontSize: '18px',       
    fontWeight: 700,
  };

  const formatEngineSummary = (car) => {
  const isElectric = car.fuel_type === 'Electric';
  let cylindersPart = '';

  if (!isElectric && car.no_of_cylinders) {
    cylindersPart = `${car.no_of_cylinders}cyl `;
  }

  // Convert engine_cc from string → number safely
  let engineCC = Number(car.engine_cc) || 0;

  // ✅ Auto-adjust if CC is too small (e.g., "8" should be 800)
  if (engineCC > 0 && engineCC < 100) {
    engineCC *= 100; // assume shorthand like "8" → "800"
  }

  const liters = (engineCC / 1000).toFixed(1);

  return `${cylindersPart}${liters}L ${car.fuel_type || ''}`.trim();
};

  return (
    <div className="col-3 p-0" key={idx} onClick={onClick} style={{ cursor: 'pointer' }}>
      {contextHolder}
      <div className="allcars-listing-card">
        <div className="car-listing-image-wrapper">
          <img src={`${BASE_URL}${car.image}`} alt={car.title} className="car-listing-image" />
          <div className="car-listing-badges">
            {car.featured && <div className="car-listing-badge blue-bg">Featured</div>}
            {car.certified && (
              <div className="car-listing-badge orenge-bg">
                <CheckCircleFilled /> Certified Dealer
              </div>
            )}
          </div>
          <div className="car-listing-fav">
            {isFavorite ? (
              <FaHeart
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFavorite();
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#008ad5',
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            ) : (
              <FaRegHeart
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFavorite();
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#008ad5',
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            )}
          </div>
        </div>

        <div className="car-listing-content">
          <div className="d-flex">
            <Tooltip title={car.title}>
              <div style={titleStyle}>{car.title}</div>
            </Tooltip>
            <div className="car-listing-price">{car.price}</div>
          </div>
          <div className="car-listing-engine">{formatEngineSummary(car)}</div>
          <div className="car-listing-details row">
            <div className="col-5">
              <span>
                <TbManualGearbox /> {car.transmission}
              </span>
            </div>
            <div className="col-3">
              <span>
                <FaGlobe /> {car.country_code}
              </span>
            </div>
            <div className="col-4">
              <span>
                <FaMapMarkerAlt /> {car.mileage}
              </span>
            </div>
            <div className="car-listing-location">{car.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Allcarslistdata.propTypes = {
  idx: PropTypes.number.isRequired,
  car: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    featured: PropTypes.bool.isRequired,
    certified: PropTypes.bool.isRequired,
    price: PropTypes.string.isRequired,
    engine: PropTypes.string.isRequired,
    transmission: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    mileage: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};

export default Allcarslistdata;
