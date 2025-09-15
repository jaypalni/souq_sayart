/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import '../assets/styles/usersavedsearches.css';
import carImage from '../assets/images/subscribecar_icon.png';
import diamondLogo from '../assets/images/bluediamond_icon.svg';
import dollarLogo from '../assets/images/bluedollar_icon.svg';
import like_icon from '../assets/images/like_icon.svg';
import { useNavigate } from 'react-router-dom';
import diamondGif from '../assets/images/diamondGif.gif';
import { carAPI } from '../services/api';
import { handleApiResponse } from '../utils/apiUtils';
import { useToken } from '../hooks/useToken';
import { useTokenWithInitialization } from '../hooks/useTokenWithInitialization';

const MAX_SAVED_SEARCHES = 3;
const BASE_URL = process.env.REACT_APP_API_URL;
const buildMakeImageSrc = (item) => {
  if (item.make_image) {
    return `${BASE_URL}${item.make_image}`;
  }
  return carImage;
};

const buildPriceText = (sp) => {
  const hasRange = Boolean(sp?.price_min) || Boolean(sp?.price_to);
  if (!hasRange) {
    return 'IQD 0';
  }
  let left = '';
  if (sp?.price_min) {
    left = `IQD ${sp.price_min}`;
  }
  let right = '';
  if (sp?.price_to) {
    right = ` - IQD ${sp.price_to}`;
  }
  return `${left}${right}`;
};

const buildYearText = (sp) => `From ${sp?.year_min || 'N/A'}`;

const ModelText = ({ model }) => {
  if (!model) {
    return null;
  }
  return <span className="user-saved-search-model">{model}</span>;
};

ModelText.propTypes = {
  model: PropTypes.string,
};

const FeaturesList = ({ features }) => {
  let list = [];
  if (Array.isArray(features)) {
    list = features;
  }
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

FeaturesList.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string),
};

const SavedSearchCard = ({ item, idx, total }) => {
  const sp = item.search_params || {};
  let divider = '';
  if (idx < total - 1) {
    divider = ' with-divider';
  }
  const priceText = buildPriceText(sp);
  const yearText = buildYearText(sp);
  const imgSrc = buildMakeImageSrc(item);
  const makeDisplay =  item?.name || 'Unknown Make';
  console.log('Make',  item?.name)
  const makeAlt =  item?.name || 'Car';

  return (
    <div className={`user-saved-search-section${divider}`} key={item.id}>
      <div className="user-saved-search-header">
        <img src={imgSrc} alt={makeAlt} className="user-saved-search-logo" />
        <div className="user-saved-search-title">
          <span className="user-saved-search-brand">{makeDisplay}</span>
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

SavedSearchCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    make_image: PropTypes.string,
    search_params: PropTypes.shape({
      make: PropTypes.string,
      model: PropTypes.string,
      price_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      price_to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      year_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      extra_features: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
  idx: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

const SignupBox = ({ onClick, title, buttonText }) => (
  <div className="user-saved-searches-signup-box">
    <div className="signup-icon">
      <img src={like_icon} alt="like" />
    </div>
    <div>
      <h1>{title}</h1>
      <p className="signup-description-text">
        Find your saved searches right here. Get alerts for new listings.
      </p>
      <button className="signup-btn" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  </div>
);

SignupBox.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

const ModalComingSoon = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <img src={diamondGif} alt="Diamond" className="modal-image" />
      <p
        className="modal-title-text"
      >
        This Feature is coming soon
      </p>
      <p
        className="modal-subtitle-text"
      >
        you could try to remove some filters:
      </p>
      <button className="modal-your-close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

ModalComingSoon.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const UserSavedsearch = ({title,savesearchesreload}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenReady, setTokenReady] = useState(false);
  const { token, isReady, isAuthenticated } = useTokenWithInitialization();
  const authState = useSelector(state => state.auth);
  
  const isLoggedIn = isAuthenticated;
  // Effect to handle token readiness


  useEffect(() => {
    // If user is authenticated, consider them ready even if token is undefined
    // This handles cases where authentication state is managed differently
    if (isReady && (isAuthenticated || (token && token !== 'undefined' && token !== 'null'))) {
      setTokenReady(true);
    } else {
      setTokenReady(false);
    }
  }, [isReady, token, isAuthenticated]);
console.log('2222',token)
  useEffect(() => {
    if (isLoggedIn && tokenReady) {
      fetchSavedSearches();
    }
  }, [isLoggedIn, tokenReady, savesearchesreload]);

  const fetchSavedSearches = async () => {
    try {
      const res = await carAPI.getsavedsearches(1, 10);
      const response = handleApiResponse(res);

      if (response?.data?.searches) {
        setSavedSearches(response.data.searches.slice(0, MAX_SAVED_SEARCHES));
      }
    } catch {
      setSavedSearches([]);
    } finally {
      setLoading(false);
    }
  };

  const getSavedSearchView = () => {
    if (!isLoggedIn || !tokenReady) {
      return 'notLoggedIn';
    }
   
    if (loading) {
      return 'loading';
    }
    if (authState?.isAuthenticated  && savedSearches.length === 0) {
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
            buttonText="Start Searching "
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
          className="user-saved-searches-title"
        >
          {title || 'Your Saved Searches'}
        </h1>
        <button
          type="button"
          className="car-listing-seeall"
          onClick={() => navigate('/myProfile/searches')}
        >
          See All
        </button>
      </div>

      <div className="user-saved-searches-top">
        <div className="user-saved-searches-left">
          {renderSavedSearchContent()}

          <div className="user-saved-search-actions">
            <div className="user-saved-search-action-box">
              <img src={diamondLogo} alt="Diamond" className="action-icon" />
              <button
                type="button"
                className="action-button"
                onClick={() => setIsModalOpen(true)}
              >
                Value your car with our free online valuation
              </button>
            </div>

            <div className="user-saved-search-action-box">
              <img src={dollarLogo} alt="Dollar" className="action-icon" />
              <button
                type="button"
                className="action-button"
                onClick={() => setIsModalOpen(true)}
              >
                List your car or get a free Instant Offer
              </button>
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

UserSavedsearch.propTypes = {
  title: PropTypes.string,
  savesearchesreload: PropTypes.any,
};

export default UserSavedsearch;
