import React from 'react';
import { Button } from 'antd';
import { userAPI } from '../services/api';
import lightbluetick from '../assets/images/lightbluetick_icon.svg'

const SubscriptionCard = ({ title, price, duration, features, highlight }) => (
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
      height: 340,
    }}
  >
    <div style={{ width: '109%', boxSizing: 'border-box' }}>
      <div
        style={{
          backgroundColor: '#7991A4',
          borderRadius: 6,
          padding: '12px',
          height: 160,
          padding: '12px',
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 20,
            marginBottom: 8,
            color: '#fff',
            marginBottom: 24,
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
          }}
        >
          ${price}{' '}
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: '#888',
              color: '#fff',
            }}
          >
            {duration}
          </span>
        </div>
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
                marginTop: '12',
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              Choose This Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
      {features.map((f, i) => (
        <li
          key={i}
          style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}
        >
          <span style={{ color: '#039be5', fontWeight: 700, marginRight: 8 }}>
            <img
              src={lightbluetick}
              alt='tick'
              style={{
                width: 16,
                height: 16,
              }}
            />
          </span>{' '}
          {f}
        </li>
      ))}
    </ul>
  </div>
);

export default SubscriptionCard; 

