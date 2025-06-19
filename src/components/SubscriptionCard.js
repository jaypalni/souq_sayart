import React from 'react';
import { Button } from 'antd';

const SubscriptionCard = ({ title, price, duration, features, highlight }) => (
  <div className="subscription-card" style={{
    background: highlight ? '#f7fafd' : '#e3e8ef',
    border: highlight ? '2px solid #b3d8fd' : '1px solid #d1d5db',
    borderRadius: 12,
    padding: 24,
    minWidth: 240,
    boxShadow: highlight ? '0 2px 8px #e3f1ff' : 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
    <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
      ${price} <span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>{duration}</span>
    </div>
    <Button type="primary" style={{ margin: '12px 0' }}>Choose This Plan</Button>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
      {features.map((f, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
          <span style={{ color: '#039be5', fontWeight: 700, marginRight: 8 }}>•</span> {f}
        </li>
      ))}
    </ul>
  </div>
);

export default SubscriptionCard; 