/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Avatar, message } from 'antd';
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
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import CarListing from '../components/carListing';
import { FaChevronUp, FaChevronDown, FaCheckCircle } from 'react-icons/fa';

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
      <div className="thumbnail-row mt-3 d-flex gap-2">
        {images.map((img, idx) => {
          let thumbClass = 'thumbnail-img';
          if (mainImageIdx === idx) {
            thumbClass += ' active';
          }
          return (
            <button
              type="button"
              key={img}
              onClick={() => setMainImageIdx(idx)}
              aria-label={`Show image ${idx + 1}`}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <img
                src={img}
                alt={`thumb-${idx}`}
                className={thumbClass}
              />
            </button>
          );
        })}
      </div>
    </Card>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const FeaturesSection = ({ adTitle, featuresCsv }) => {
  const [open, setOpen] = useState(false);
  const features = (featuresCsv || '')
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);

  const chevron = open ? <FaChevronUp /> : <FaChevronDown />;

  return (
    <div className="car-details-features-section">
      <div className="car-details-features-h1">
        <span>Features - {adTitle}</span>
      </div>
      <div className="border-bottom">
        <div className="car-details-features-header collapsed">
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Extra Features</span>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="extra-features"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            {chevron}
          </button>
        </div>
        {open && (
          <div id="extra-features" className="row mb-2 mt-2">
            {features.map((feature) => (
              <div className="col-md-3 col-6 mb-2" key={feature}>
                <span className="car-details-feature-item">
                  <FaCheckCircle color="#4fc3f7" style={{ marginRight: 6 }} />
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const copyToClipboard = () => {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Page URL copied to clipboard!');
      })
      .catch((err) => {
        message.error('Failed to copy URL');
        console.error(err);
      });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Page URL copied to clipboard!');
  }
};

FeaturesSection.propTypes = {
  adTitle: PropTypes.string.isRequired,
  featuresCsv: PropTypes.string,
};

const CarDetails = () => {
  const { id } = useParams();
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const Allcarsapi = async () => {
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
      Allcarsapi();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!carDetails) {
    return <div>No data found</div>;
  }

  const images = buildCarImages(carDetails?.car_image, BASE_URL, redcar_icon);
  const carInfo = getCarInfo(carDetails);
  const additionalDetails = getAdditionalDetails(carDetails);

  return (
    <div className="container py-4 car-details-page">
      {contextHolder}
      <div className="row">
        <div className="col-md-8">
          <ImageGallery images={images} />
          <h3 className="text-title">{carDetails.ad_title}</h3>
          <p className="text-muted">{carDetails.description}</p>
          <div
            className="d-flex align-items-center gap-3 mb-2"
            style={{ color: '#2B2829', fontWeight: 400, fontSize: '14px' }}
          >
            {formatEngineSummary(carDetails)}
          </div>
          <div className="d-flex align-items-center gap-1 mb-2">
            <img
              src={pin_location}
              alt=""
              style={{
                width: '15px',
                height: '15px',
              }}
            />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#7991A4',
              }}
            >
              {carDetails.location}
            </span>
          </div>
          <div className="col-md-12">
            <div className="car-details-info" style={{ marginBottom: '10px' }}>
              Car Details
            </div>

            <div className="row">
              {[
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
              ].map((item) => (
                <div className="col-md-3" key={item.label}>
                  <div
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: 10,
                      padding: '8px',
                      height: 80,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        style={{ width: 14, height: 14 }}
                      />
                      <p
                        style={{
                          color: '#726C6C',
                          fontWeight: 400,
                          fontSize: '12px',
                          margin: 0,
                        }}
                      >
                        {item.label}
                      </p>
                    </div>
                    <p
                      style={{
                        color: '#0A0A0B',
                        fontWeight: 700,
                        fontSize: '14px',
                        margin: 0,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4 mb-4">
            <InfoTable title="Car Informations" rows={carInfo} />
            <InfoTable title="Additional Details" rows={additionalDetails} />
          </div>

          <FeaturesSection adTitle={carDetails.ad_title} featuresCsv={carDetails.extra_features} />
        </div>
        <div className="col-md-4">
          <Card className="seller-info-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
               <div 
                style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  }}>
  <h5
    className="mb-0 text-truncate"
    style={{
      fontSize: '20px',
      fontWeight: 700,
      color: '#0A0A0B',
      margin:'0',
    }}
  >
    {carDetails.ad_title}
  </h5>

  <ShareAltOutlined
    style={{
      fontSize: '20px',
      color: '#008ad5',
      cursor: 'pointer',
      flexShrink: 0,
      marginLeft: '40px'
    }}
    onClick={copyToClipboard}
  />
               </div>
                <div className="car-price">
                  {'IQD ' + Number(carDetails.price).toLocaleString()}
                </div>
                <div
                  className="d-flex align-items-center mt-2 mb-2"
                  style={{ marginLeft: '7px' }}
                >
                  <div className="d-flex align-items-center gap-1">
                    <img
                      src={car_type}
                      alt="Car Type"
                      style={{ width: '14px', height: '14px' }}
                    />
                    <span>{carDetails.transmission_type}</span>
                  </div>
                  <span className="mx-2">|</span>

                  <div className="d-flex align-items-center gap-1">
                    <img
                      src={country_code}
                      alt="Country"
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>{carDetails.country_code}</span>
                  </div>
                  <span className="mx-2">|</span>
                  <div className="d-flex align-items-center gap-1">
                    <img
                      src={speed_code}
                      alt="Kilometers"
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>{carDetails.kilometers}</span>
                  </div>
                </div>

                <div
                  className="mt-2 text-muted"
                  style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0B' }}
                >
                  Listed by Private User
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Avatar icon={<UserOutlined />} alt="User Avatar" />
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#0A0A0B',
                      }}
                    >
                      {carDetails.seller.first_name}
                    </div>
                    <div
                      className="text-muted"
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: '#0A0A0B',
                      }}
                    >
                      Member since {carDetails.seller.member_since}
                    </div>
                    <Link className="car-details-view-profile-link">
                      View Profile{' '}
                      <FaChevronRight
                        style={{ fontSize: '9px', marginLeft: '2px' }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button
                icon={<MessageOutlined />}
                className="w-100"
                style={{
                  background: '#008AD5',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              >
                Message
              </Button>
              <Button
                onClick={() => openWhatsApp(carDetails.seller.phone_number)}
                icon={<FaWhatsapp />}
                className="w-100"
                disabled={carDetails.seller.whatsapp === 'False'}
                style={{
                  background: carDetails.seller.whatsapp === 'False' ? '#D3D3D3' : '#20B648',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              >
                Whatsapp
              </Button>

              <Button
                icon={<FaPhoneAlt style={{ color: '#fff' }} />}
                className="w-100 no-hover-bg"
                style={{
                  background: '#323F49',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '12px',
                  border: 'none',
                  pointerEvents: 'none',
                }}
                onClick={() => {
                  messageApi.open({
                    type: 'success',
                    content: carDetails.seller.phone_number,
                  });
                }}
              >
                Call
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div
        style={{
          marginTop: 50,
        }}
      >
        <CarListing
          title={'Used ' + carDetails.ad_title}
          cardata={carDetails.similar_cars}
        />
      </div>
    </div>
  );
};

export default CarDetails;