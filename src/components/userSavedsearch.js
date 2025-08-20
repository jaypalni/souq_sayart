/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useState, useEffect } from 'react';
import '../assets/styles/usersavedsearches.css';
import carImage from '../assets/images/subscribecar_icon.png';
import diamondLogo from '../assets/images/bluediamond_icon.svg';
import dollarLogo from '../assets/images/bluedollar_icon.svg';
import like_icon from '../assets/images/like_icon.svg';
import { useNavigate } from 'react-router-dom';
import diamondGif from '../assets/images/diamondGif.gif';
import { carAPI } from '../services/api';
import { handleApiResponse } from '../utils/apiUtils';

// Helpers to reduce complexity in SavedSearchCard
const buildMakeImageSrc = (item) =>
  item.make_image ? `http://13.202.75.187:5002${item.make_image}` : carImage;

const buildPriceText = (sp) => {
  const hasRange = Boolean(sp?.price_min) || Boolean(sp?.price_to);
  if (!hasRange) {
    return '$0';
  }
  const left = sp?.price_min ? `$${sp.price_min}` : '';
  const right = sp?.price_to ? ` - $${sp.price_to}` : '';
  return `${left}${right}`;
};

const buildYearText = (sp) => `From ${sp?.year_min || 'N/A'}`;

const ModelText = ({ model }) =>
  model ? <span className="user-saved-search-model">{model}</span> : null;

const FeaturesList = ({ features }) => {
  const list = Array.isArray(features) ? features : [];
  if (list.length === 0) {
    return null;
  }
  return (
    <ul className="user-saved-search-details">
      {list.map((f) => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  );
};

const SavedSearchCard = ({ item, idx, total }) => {
  const sp = item.search_params || {};
  const divider = idx < total - 1 ? ' with-divider' : '';
  const priceText = buildPriceText(sp);
  const yearText = buildYearText(sp);
  const imgSrc = buildMakeImageSrc(item);

  return (
    <div className={`user-saved-search-section${divider}`} key={item.id}>
      <div className="user-saved-search-header">
        <img src={imgSrc} alt={sp.make || 'Car'} className="user-saved-search-logo" />
        <div className="user-saved-search-title">
          <span className="user-saved-search-brand">{sp.make || 'Unknown Make'}</span>
          <ModelText model={sp.model} />
        </div>
      </div>

      <div className="user-saved-search-meta">
        <span className="user-saved-search-price">{priceText}</span>
        <span className="user-saved-search-dot">•</span>
        <span className="user-saved-search-year">{yearText}</span>
      </div>

      <FeaturesList features={sp.extra_features} />
    </div>
  );
};

const SignupBox = ({ onClick, title, buttonText }) => (
  <div className="user-saved-searches-signup-box">
    <div className="signup-icon">
      <img src={like_icon} alt="like" />
    </div>
    <div>
      <h1>{title}</h1>
      <p style={{ fontSize: '16px', fontWeight: '400' }}>
        Find your saved searches right here. Get alerts for new listings.
      </p>
      <button className="signup-btn" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  </div>
);

const ModalComingSoon = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <img src={diamondGif} alt="Diamond" className="modal-image" />
      <p
        style={{
          fontSize: '16px',
          color: '#0A0A0B',
          fontWeight: 700,
          marginBottom: '4px',
        }}
      >
        This Feature is coming soon
      </p>
      <p
        style={{
          fontSize: '12px',
          color: '#898384',
          fontWeight: 400,
          marginTop: '0',
        }}
      >
        you could try to remove some filters:
      </p>
      <button className="modal-your-close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

const UserSavedsearch = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  const tokendata = localStorage.getItem('token');
  const isLoggedIn = !!tokendata;

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedSearches();
    }
  }, [isLoggedIn]);

  const fetchSavedSearches = async () => {
    try {
      const res = await carAPI.getsavedsearches(1, 10);
      const response = handleApiResponse(res);

      if (response?.data?.searches) {
        setSavedSearches(response.data.searches.slice(0, 3));
      }
    } catch {
      setSavedSearches([]);
    } finally {
      setLoading(false);
    }
  };

  const getSavedSearchView = () => {
    if (!isLoggedIn) {
      return 'notLoggedIn';
    }
    if (loading) {
      return 'loading';
    }
    if (savedSearches.length === 0) {
      return 'empty';
    }
    return 'list';
  };

  const renderSavedSearchContent = () => {
    const view = getSavedSearchView();
    switch (view) {
      case 'notLoggedIn': {
        return (
          <SignupBox
            onClick={() => navigate('/login')}
            title="Sign up searches"
            buttonText="Sign up / log in"
          />
        );
      }
      case 'loading': {
        return <p>Loading saved searches...</p>;
      }
      case 'empty': {
        return (
          <SignupBox
            onClick={() => window.scrollTo({ top: 260, behavior: 'smooth' })}
            title="You have no Saved searches"
            buttonText="Start Searching"
          />
        );
      }
      case 'list':
      default: {
        return (
          <div className="user-saved-searches-outer-card">
            {savedSearches.map((item, idx) => (
              <SavedSearchCard
                key={item.id}
                item={item}
                idx={idx}
                total={savedSearches.length}
              />
            ))}
          </div>
        );
      }
    }
  };

  return (
    <div className="user-saved-searches-wrapper">
      <div className="Search-header">
        <h1
          style={{
            fontWeight: '700',
            fontSize: '32px',
            marginBottom: '24px',
            marginTop: '24px',
          }}
        >
          Your Saved Searches
        </h1>
        <a href="#" className="car-listing-seeall">
          See All
        </a>
      </div>

      <div className="user-saved-searches-top">
        <div className="user-saved-searches-left">
          {renderSavedSearchContent()}

          <div className="user-saved-search-actions">
            <div className="user-saved-search-action-box">
              <img src={diamondLogo} alt="Diamond" className="action-icon" />
              <p
                style={{
                  fontSize: '14px',
                  color: '#0A0A0B',
                  cursor: 'pointer',
                }}
                onClick={() => setIsModalOpen(true)}
              >
                Value your car with our free online valuation
              </p>
            </div>

            <div className="user-saved-search-action-box">
              <img src={dollarLogo} alt="Dollar" className="action-icon" />
              <p
                style={{
                  fontSize: '14px',
                  color: '#0A0A0B',
                  cursor: 'pointer',
                }}
                onClick={() => setIsModalOpen(true)}
              >
                List your car or get a free Instant Offer
              </p>
            </div>
          </div>

          {isModalOpen && <ModalComingSoon onClose={() => setIsModalOpen(false)} />}
        </div>

        <div className="user-saved-search-image-box">
          <img src={carImage} alt="Car" className="user-saved-search-image" />
          <div className="user-saved-search-image-text">
            <h3>Subscribe To Our Packages</h3>
            <p>
              Find your saved searches right here. Get alerts for new listings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSavedsearch;
