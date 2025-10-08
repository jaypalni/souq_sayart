import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { userAPI } from '../services/api';
import lightbluetick from '../assets/images/lightbluetick_icon.svg';

const SubscriptionCard = ({ title, price, duration, features, details, currency, is_subscribed }) => {
  
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(160);

  useEffect(() => {
    if (headerRef.current) {
      const contentHeight = headerRef.current.scrollHeight;
      if (contentHeight > 160) {
        setHeaderHeight(200); 
      } else {
        setHeaderHeight(160);
      }
    }
  }, [title, details, duration]);

  return (
    <div
      className='subscription-card'
      style={{
        background: '#ffffff',
        borderColor: '#CED7DE',
        borderRadius: 12,
        minWidth: 240,
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 340,
        height: 'auto',
      }}
    >
      <div style={{ width: '109%', boxSizing: 'border-box' }}>
        <div
          ref={headerRef}
          style={{
            backgroundColor: '#7991A4',
            borderRadius: 6,
            padding: '12px',
            height: headerHeight, 
            position: 'relative',
          }}
        >
          {is_subscribed === 1 && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#ffa726',
                color: '#fff',
                borderRadius: 6,
                padding: '2px 12px',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Current
            </div>
          )}

          <div
            style={{
              fontWeight: 600,
              fontSize: 20,
              marginBottom: 24,
              color: '#fff',
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 4,
              color: '#fff',
              display: 'flex',
              alignItems: 'baseline',
              flexWrap: 'nowrap',
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>
              IQD{' '}
              {details?.price
                ? parseFloat(details.price.toString().replace(/[^\d.]/g, '')).toLocaleString()
                : '0'}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#fff',
                marginLeft: 6,
                whiteSpace: 'nowrap',
              }}
            >
              {duration}
            </span>
          </div>

          {is_subscribed !== 1 && (
            <div style={{ width: '100%', padding: '0 10px 10px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <Button
                  type='primary'
                  style={{
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    borderColor: '#fff',
                    borderRadius: 12,
                    marginLeft: 5,
                    marginRight: 5,
                  }}
                >
                  Choose This Plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
        {features.map((f) => (
          <li
            key={`feature-${f}`}
            style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}
          >
            <img
              src={lightbluetick}
              alt='tick'
              style={{
                width: 16,
                height: 16,
                marginRight: 8,
              }}
            />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
};

SubscriptionCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  duration: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  details: PropTypes.shape({
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priceModel: PropTypes.string,
    postsAllowed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    photosAllowed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    videosAllowed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    postDuration: PropTypes.string,
    featured: PropTypes.string,
    banner: PropTypes.string,
    analytics: PropTypes.string,
    additionalCar: PropTypes.string,
    emailNewsletter: PropTypes.string,
    sponsoredContent: PropTypes.string,
  }),
  currency: PropTypes.string,
  is_subscribed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SubscriptionCard;
