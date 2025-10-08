/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Avatar, message, Tooltip, Modal } from 'antd';
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { MessageOutlined, UserOutlined,ShareAltOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../assets/styles/cardetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import redcar_icon from '../assets/images/redcar_icon.jpg';
import country_code from '../assets/images/country_code.png';
import speed_code from '../assets/images/speed_dashboard.png';
import car_type from '../assets/images/car_type.png';
import pin_location from '../assets/images/pin_location.png';
import gear_image from '../assets/images/gear_image.png';
import fuel_image from '../assets/images/fuel_image.png';
import calender_image from '../assets/images/Layer_1.png';
import { carAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import CarListing from '../components/carListing';
import { FaChevronUp, FaChevronDown, FaCheckCircle } from 'react-icons/fa';
import PlaneBanner from '../components/planeBanner';
import boost_icon from '../assets/images/boost_icon.svg';

// Helpers
const openWhatsApp = (phoneNumber) => {
  const url = `https://wa.me/${phoneNumber}`;
  window.open(url, '_blank');
};

const buildCarImages = (images, baseUrl, fallback) => {
  if (Array.isArray(images) && images.length > 0) {
    return images.map((img) => {
      if (img?.startsWith('http')) {
        return img;
      }
      return `${baseUrl}${img}`;
    });
  }
  return [fallback];
};

const formatEngineSummary = (details) => {
  const isElectric = details.fuel_type === 'Electric';
  let cylindersPart = '';
  if (!isElectric) {
    cylindersPart = `${details.no_of_cylinders}cyl `;
  }
  const liters = ((details.engine_cc || 0) / 1000).toFixed(1);
  return `${cylindersPart}${liters}L ${details.fuel_type || ''}`.trim();
};

const getCarInfo = (d) => [
  { label: 'Body Type', value: d.body_type || '-' },
  { label: 'Regional Specs', value: d.regional_specs || '-' },
  { label: 'Door Count', value: d.number_of_doors || '-' },
  { label: 'Number of seats', value: d.number_of_seats || '-' },
  { label: 'Version', value: d.trim || '-' },
  { label: 'Exterior Color', value: d.exterior_color || '-' },
  { label: 'Interior Color', value: d.interior_color || '-' },
  { label: 'Warranty', value: d.warranty_date || '-' },
];

const getAdditionalDetails = (d) => [
  { label: 'Engine CC', value: d.engine_cc || '-' },
  { label: 'Number of Cylinders', value: d.no_of_cylinders || '-' },
  { label: 'Consumption', value: d.consumption || '-' },
  { label: 'Transmission', value: d.transmission_type || '-' },
  { label: 'Drive Type', value: d.drive_type || '-' },
  { label: 'Vehicle Type', value: d.vechile_type || '-' },
  { label: 'Horse Power', value: d.horse_power || '-' },
  { label: 'Accident History', value: d.accident_history || '-' },
];

// Sub-components
const ThumbnailButton = ({ img, idx, isActive, onClick }) => {
  const thumbClass = `thumbnail-img${isActive ? ' active' : ''}`;
  
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Show image ${idx + 1}`}
      className="thumbnail-button"
    >
      <img
        src={img}
        alt={`thumb-${idx}`}
        className={thumbClass}
      />
    </button>
  );
};

ThumbnailButton.propTypes = {
  img: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const InfoTable = ({ title, rows = [] }) => (
  <div className="col-md-6">
    <div className="car-details-table-title">{title}</div>
    <table className="car-details-table">
      <tbody>
        {rows.map((item) => (
          <tr key={item.label}>
            <td className="car-details-table-label">{item.label}</td>
            <td className="car-details-table-value">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

InfoTable.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
};

InfoTable.defaultProps = {
  rows: [],
  title: '',
};

const ImageGallery = ({ images }) => {
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const goToNextImage = () => setMainImageIdx((prev) => (prev + 1) % images.length);
  const goToPrevImage = () =>
    setMainImageIdx((prev) => {
      if (prev === 0) {
        return images.length - 1;
      }
      return prev - 1;
    });

  return (
    <Card className="main-image-card">
      <div className="main-image-wrapper">
        <img src={images[mainImageIdx]} alt="Car" className="main-car-image" />
        <button className="arrow-btn left-arrow" onClick={goToPrevImage} aria-label="Previous image">
          <FaChevronLeft />
        </button>
        <button className="arrow-btn right-arrow" onClick={goToNextImage} aria-label="Next image">
          <FaChevronRight />
        </button>
      </div>
      <div className=" mt-3 d-flthumbnail-rowex gap-2">
        {images.map((img, idx) => (
          <ThumbnailButton
            key={img}
            img={img}
            idx={idx}
            isActive={mainImageIdx === idx}
            onClick={() => setMainImageIdx(idx)}
          />
        ))}
      </div>
    </Card>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const FeaturesSection = ({ adTitle, featuresCsv }) => {
  const [open, setOpen] = useState(false);

  // Normalize features to always be an array of individual features
  const features = Array.isArray(featuresCsv)
    ? featuresCsv.flatMap(item => item.split(',').map(f => f.trim())) // split and trim each string
    : (featuresCsv || '').split(',').map(f => f.trim()); // fallback if it's just a string

  const toggleFeatures = () => setOpen(!open);
  const chevron = open ? <FaChevronUp /> : <FaChevronDown />;

  return (
    <div className="car-details-features-section">
      <div className="car-details-features-h1">
        <span>Features - {adTitle}</span>
      </div>
      <div className="border-bottom">
        <div className="car-details-features-header collapsed">
          <span className="features-header-text">Extra Features</span>
          <button
            type="button"
            onClick={toggleFeatures}
            aria-expanded={open}
            aria-controls="extra-features"
            className="features-toggle-button"
          >
            {chevron}
          </button>
        </div>
        {open && <FeaturesList features={features} />}
      </div>
    </div>
  );
};


const FeaturesList = ({ features }) => (
  <div id="extra-features" className="row mb-2 mt-2">
    {features.map((feature) => (
      <div className="col-md-3 col-6 mb-2" key={feature}>
        <span className="car-details-feature-item">
          <FaCheckCircle color="#4fc3f7" className="features-icon" />
          {feature}
        </span>
      </div>
    ))}
  </div>
);

FeaturesList.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const copyToClipboard = () => {
  const url = window.location.href;
  
  const copyWithClipboardAPI = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Page URL copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy URL');
      console.error(err);
    }
  };

  const copyWithFallback = () => {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Page URL copied to clipboard!');
  };

  if (navigator.clipboard) {
    copyWithClipboardAPI();
  } else {
    copyWithFallback();
  }
};

FeaturesSection.propTypes = {
  adTitle: PropTypes.string.isRequired,
  featuresCsv: PropTypes.string,
};

// Extracted CarHeader component
const CarHeader = ({ carDetails }) => {
  return (
    <>
      <h3 className="text-title">{carDetails.ad_title}</h3>
      <p className="text-muted">{carDetails.description}</p>
    </>
  );
};

CarHeader.propTypes = {
  carDetails: PropTypes.shape({
    ad_title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

// Extracted CarEngineSummary component
const CarEngineSummary = ({ carDetails }) => {
  return (
    <div className="d-flex align-items-center gap-3 mb-2 car-engine-summary">
      {formatEngineSummary(carDetails)}
    </div>
  );
};

CarEngineSummary.propTypes = {
  carDetails: PropTypes.shape({
    fuel_type: PropTypes.string,
    no_of_cylinders: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    engine_cc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

// Extracted CarLocation component
const CarLocation = ({ location }) => {
  return (
    <div className="d-flex align-items-center gap-1 mb-2">
      <img
        src={pin_location}
        alt="Location pin"
        className="location-icon"
      />
      <span className="location-text">
        {location}
      </span>
    </div>
  );
};

CarLocation.propTypes = {
  location: PropTypes.string.isRequired,
};

// Extracted CarDetailsCards component
const CarDetailsCards = ({ carDetails }) => {
  const carDetailItems = [
    {
      label: 'Year',
      value: carDetails.year || '-',
      icon: calender_image,
    },
    {
      label: 'Fuel Type',
      value: carDetails.fuel_type || '-',
      icon: fuel_image,
    },
    {
      label: 'Condition',
      value: carDetails.condition || '-',
      icon: gear_image,
    },
    {
      label: 'Kilometers',
      value: carDetails.kilometers || '-',
      icon: speed_code,
    },
  ];

  return (
    <div className="col-md-12">
      <div className="car-details-info car-details-info-section">
        Car Details
      </div>

      <div className="row">
        {carDetailItems.map((item) => (
          <CarDetailCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
};

const CarDetailCard = ({ item }) => (
  <div className="col-md-3">
    <div className="car-detail-card">
      <div className="car-detail-card-content">
        <img
          src={item.icon}
          alt=""
          className="car-detail-icon"
        />
        <p className="car-detail-label">
          {item.label}
        </p>
      </div>
      <p className="car-detail-value">
        {item.value}
      </p>
    </div>
  </div>
);

CarDetailCard.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
};

CarDetailsCards.propTypes = {
  carDetails: PropTypes.shape({
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fuel_type: PropTypes.string,
    condition: PropTypes.string,
    kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

// New extracted component to reduce complexity in CarDetailsMain
const CarInfoTables = ({ carInfo, additionalDetails }) => (
  <div className="row g-4 mb-4">
    <InfoTable title="Car Informations" rows={carInfo} />
    <InfoTable title="Additional Details" rows={additionalDetails} />
  </div>
);

CarInfoTables.propTypes = {
  carInfo: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  additionalDetails: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};


// Extracted CarDetailsMain component
const CarDetailsMain = ({ carDetails, BASE_URL, images, carInfo, additionalDetails }) => {
  return (
    <div className="col-md-8">
      <ImageGallery images={images} />
      
      <CarHeader carDetails={carDetails} />
      <CarEngineSummary carDetails={carDetails} />
      <CarLocation location={carDetails.location} />
      <CarDetailsCards carDetails={carDetails} />

      <div className="row g-4 mb-4">
        <InfoTable title="Car Informations" rows={carInfo} />
        <InfoTable title="Additional Details" rows={additionalDetails} />
      </div>

      <FeaturesSection adTitle={carDetails.ad_title} featuresCsv={carDetails.extra_features} />
    </div>
  );
};

CarDetailsMain.propTypes = {
  carDetails: PropTypes.shape({
    ad_title: PropTypes.string.isRequired,
    extra_features: PropTypes.string,
    location: PropTypes.string,
    seller: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      member_since: PropTypes.string.isRequired,
      phone_number: PropTypes.string.isRequired,
      whatsapp: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  BASE_URL: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  carInfo: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  additionalDetails: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};



// Extracted SellerInfoCard component
const SellerInfoCard = ({ carDetails, copyToClipboard, openWhatsApp, messageApi, previousPage }) => {
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);

  const handleCallClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPhoneModalVisible(true);
  };

  const copyPhoneNumber = () => {
    const phoneNumber = carDetails.seller.phone_number;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phoneNumber)
        .then(() => {
          messageApi.open({ type: 'success', content: 'Phone Number Copied' });
          setIsPhoneModalVisible(false);
        })
        .catch(() => {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = phoneNumber;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          messageApi.open({ type: 'success', content: 'Phone Number Copied' });
          setIsPhoneModalVisible(false);
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = phoneNumber;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      messageApi.open({ type: 'success', content: 'Phone Number Copied' });
      setIsPhoneModalVisible(false);
    }
  };

  // Helper function to render status info
  const renderStatus = () => {
  const { approval, status, reason, comment } = carDetails;

  const statusStyles = {
    rejected: { background: '#FDECEC', color: '#DC3545' },
    approved: { background: '#A4F4E7', color: '#0B7B69' },
    sold: { background: '#D5F0FF', color: '#008AD5' },
    pending: { background: '#FFEDD5', color: '#D67900' },
  };

  const commonStyle = {
    fontWeight: 600,
    padding: '8px 12px', 
    borderRadius: '6px',
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
  };

  if (approval === 'rejected') {
    return (
      <div style={{ ...commonStyle, ...statusStyles.rejected }}>
        Rejected
        {reason && <div>Reason: {reason}</div>}
        {comment && <div>Comment: {comment}</div>}
      </div>
    );
  }

  if (approval === 'approved' && status === 'sold') {
    return (
      <div style={{ ...commonStyle, ...statusStyles.sold }}>
        Sold
      </div>
    );
  }

if (approval === 'approved' && status !== 'sold') {
  return (
    <div style={{ display: 'inline-block',  width: '100%', textAlign: 'center' }}> 
      <div style={{ ...commonStyle, ...statusStyles.approved }}>
        Active
      </div>
      
    <div
  onClick={(e) => e.stopPropagation()}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
    }
  }}
  role="button"
  tabIndex={0}
  className="d-flex justify-content-center align-items-center mt-2 p-2 rounded"
  style={{ 
    width: '100%', 
    cursor: 'pointer', 
    backgroundColor: '#D67900', 
    gap: '4px', 
    textAlign: 'center' 
  }}
>
  <span className="car-card-boost-text text-white">Boost</span>
  <img src={boost_icon} alt="boost" className="car-card-boost-icon" />
</div>
      
    </div>
  );
}



  if (approval === 'pending') {
    return (
      <div style={{ ...commonStyle, ...statusStyles.pending }}>
        Approval Pending
      </div>
    );
  }

  return null;
};

  return (
    <Card className="seller-info-card">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className='row'>
            <div className='col-10'>
              <Tooltip title={carDetails.ad_title} placement="top">
                <h5 className="mb-0 seller-info-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {carDetails.ad_title}
                </h5>
              </Tooltip>
            </div>
            <div className='col-2'>
              <ShareAltOutlined className="share-icon" onClick={copyToClipboard} />
            </div>
          </div>

          <div className="car-price">
            {'IQD ' + Number(carDetails.price).toLocaleString()}
          </div>
          
          <div className="d-flex align-items-center mt-2 mb-2 seller-info-details">
            <div className="d-flex align-items-center gap-1">
              <img src={car_type} alt="Car Type" className="seller-info-icon" />
              <span>{carDetails.transmission_type}</span>
            </div>
            <span className="mx-2">|</span>
            <div className="d-flex align-items-center gap-1">
              <img src={country_code} alt="Country" className="seller-info-country-icon" />
              <span>{carDetails.country_code}</span>
            </div>
            <span className="mx-2">|</span>
            <div className="d-flex align-items-center gap-1">
              <img src={speed_code} alt="Kilometers" className="seller-info-speed-icon" />
              <span>{carDetails.kilometers}</span>
            </div>
          </div>

          <div className='mt-2 text-muted seller-info-listed-text'>
            Listed by {carDetails?.seller?.is_dealer === 'true' ? 'Dealer' : 'Owner'}
          </div>

          <div className="d-flex align-items-center gap-2 mt-2">
            <Avatar icon={<UserOutlined />} alt="User Avatar" />
            <div>
              <div className="seller-name">{carDetails.seller.first_name}</div>
              <div className="text-muted seller-member-since">Member since {carDetails.seller.member_since}</div>
              <Link className="car-details-view-profile-link">
                View Profile <FaChevronRight className="view-profile-chevron" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Conditional Rendering based on previousPage */}
      
      <div className="d-flex gap-2 mt-3">
        {previousPage === 'My Listings' ? (
          
          renderStatus()
        ) : (
          <>
            <Button icon={<MessageOutlined />} className="w-100 message-button">Message</Button>
            
            <Button
              onClick={() => openWhatsApp(carDetails.seller.phone_number)}
              icon={<FaWhatsapp />}
              className={`w-100 whatsapp-button ${carDetails.seller.whatsapp === 'False' ? 'whatsapp-button-disabled' : 'whatsapp-button-enabled'}`}
              disabled={carDetails.seller.whatsapp === 'False'}
            >
              Whatsapp
            </Button>

            <Button
              icon={<FaPhoneAlt className="call-button-icon" />}
              className="w-100 no-hover-bg call-button"
              onClick={handleCallClick}
            >
              Call
            </Button>
          </>
        )}
      </div>

      {/* Phone Number Modal */}
      <Modal
        title="Seller's Phone Number"
        open={isPhoneModalVisible}
        onCancel={() => setIsPhoneModalVisible(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px' }}>
            Click the phone number to copy:
          </p>
          <div
            onClick={copyPhoneNumber}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                copyPhoneNumber();
              }
            }}
            role="button"
            tabIndex={0}
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#008AD5',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#f0f8ff',
              display: 'inline-block',
            }}
          >
            {carDetails.seller.phone_number}
          </div>
        </div>
      </Modal>
    </Card>
  );
};


SellerInfoCard.propTypes = {
  carDetails: PropTypes.shape({
    ad_title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    transmission_type: PropTypes.string,
    country_code: PropTypes.string,
    kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    approval: PropTypes.string,
    status: PropTypes.string,
    reason: PropTypes.string,
    comment: PropTypes.string,
    boost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    seller: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      member_since: PropTypes.string.isRequired,
      phone_number: PropTypes.string.isRequired,
      whatsapp: PropTypes.string.isRequired,
      is_dealer: PropTypes.string,
    }).isRequired,
  }).isRequired,
  copyToClipboard: PropTypes.func.isRequired,
  openWhatsApp: PropTypes.func.isRequired,
  messageApi: PropTypes.object.isRequired,
  previousPage: PropTypes.string,
};

// Extracted CarDetailsSidebar component
const CarDetailsSidebar = ({ carDetails, copyToClipboard, openWhatsApp, messageApi, previousPage }) => {
  return (
    <div className="col-md-4">
      <SellerInfoCard 
        carDetails={carDetails} 
        copyToClipboard={copyToClipboard} 
        openWhatsApp={openWhatsApp} 
        messageApi={messageApi} 
        previousPage={previousPage}
      />
    </div>
  );
};

CarDetailsSidebar.propTypes = {
  carDetails: PropTypes.shape({
    ad_title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    transmission_type: PropTypes.string,
    country_code: PropTypes.string,
    kilometers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    approval: PropTypes.string,
    status: PropTypes.string,
    reason: PropTypes.string,
    comment: PropTypes.string,
    boost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    seller: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      member_since: PropTypes.string.isRequired,
      phone_number: PropTypes.string.isRequired,
      whatsapp: PropTypes.string.isRequired,
      is_dealer: PropTypes.string,
    }).isRequired,
  }).isRequired,
  copyToClipboard: PropTypes.func.isRequired,
  openWhatsApp: PropTypes.func.isRequired,
  messageApi: PropTypes.object.isRequired,
  previousPage: PropTypes.string,
};

// Custom hook for car details API logic
const useCarDetails = (id) => {
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await carAPI.getCarById(Number(id));
        const cardetail = handleApiResponse(response);
        if (cardetail?.data) {
          setCarDetails(cardetail.data);
        }
        messageApi.open({
          type: 'success',
          content: cardetail.message,
        });
      } catch (error) {
        const errorData = handleApiError(error);
        messageApi.open({
          type: 'error',
          content: errorData.error,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id, messageApi]);

  return { carDetails, loading, messageApi, contextHolder };
};

// Helper function for data processing
const processCarData = (carDetails, BASE_URL) => {
  const images = buildCarImages(carDetails?.car_image, BASE_URL, redcar_icon);
  const carInfo = getCarInfo(carDetails);
  const additionalDetails = getAdditionalDetails(carDetails);
  return { images, carInfo, additionalDetails };
};

// Loading component
const LoadingState = () => <div>Loading...</div>;

// Error state component
const ErrorState = () => <div>No data found</div>;

// Similar cars section component
const SimilarCarsSection = ({ carDetails }) => (
  <div className="similar-cars-section">
    <CarListing
      title={'Used ' + carDetails.ad_title}
      cardata={carDetails.similar_cars}
    />
  </div>
);

SimilarCarsSection.propTypes = {
  carDetails: PropTypes.shape({
    ad_title: PropTypes.string.isRequired,
    similar_cars: PropTypes.array,
  }).isRequired,
};

const CarDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const BASE_URL = process.env.REACT_APP_API_URL;
  
  // Get previous page from location state or default to "All Cars"
  const previousPage = location.state?.previousPage || 'All Cars';

  console.log('Perviuspage', previousPage)
  
  const { carDetails, loading, messageApi, contextHolder } = useCarDetails(id);
    const { user } = useSelector((state) => state.auth);
  if (loading) {
    return <LoadingState />;
  }

  if (!carDetails) {
    return <ErrorState />;
  }

  const { images, carInfo, additionalDetails } = processCarData(carDetails, BASE_URL);
  return (
    <div className="car-details-page">
      <PlaneBanner carDetails={carDetails} previousPage={previousPage} />
      <div className="container py-4">
        {contextHolder}
        <div className="row">
        <CarDetailsMain 
          carDetails={carDetails} 
          BASE_URL={BASE_URL} 
          images={images} 
          carInfo={carInfo} 
          additionalDetails={additionalDetails} 
        />
        <CarDetailsSidebar 
          carDetails={carDetails} 
          copyToClipboard={copyToClipboard} 
          openWhatsApp={openWhatsApp} 
          messageApi={messageApi} 
          previousPage={previousPage} 
        />
      </div>

   { user?.id!=  carDetails?.seller?.id &&    <SimilarCarsSection carDetails={carDetails} />
    }
      </div>
    </div>
  );
};

CarDetails.propTypes = {
  // This component doesn't accept external props
  // All data comes from useParams and internal state
};

export default CarDetails;