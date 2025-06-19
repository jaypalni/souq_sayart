import React, { useState } from 'react';
import { Switch, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const savedSearchesData = [
  {
    id: 1,
    logo: 'https://cdn-icons-png.flaticon.com/512/616/616494.png', // Lamborghini logo
    title: 'Lamborghini',
    details: '$0 - 0$  •  From 2005',
    notify: true,
  },
  {
    id: 2,
    logo: 'https://cdn-icons-png.flaticon.com/512/226/226595.png', // Mercedes logo
    title: 'Mercedes - Benz',
    subtitle: 'A-Class',
    details: '$6524 - 33556  •  From 2005  •  to 30,000 km  •  number of seats: 3-5  •  new',
    notify: false,
  },
  {
    id: 3,
    logo: 'https://cdn-icons-png.flaticon.com/512/616/616494.png', // Lamborghini logo
    title: 'Lamborghini',
    details: '$0 - 0$  •  From 2005',
    notify: true,
  },
];

const EmptyState = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center'
  }}>
    <div style={{ 
      width: '64px', 
      height: '64px', 
      background: '#FFA500',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px'
    }}>
      <SearchOutlined style={{ fontSize: '32px', color: '#FFFFFF' }} />
    </div>
    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>No Saved Searches</h3>
    <p style={{ 
      margin: '0 0 24px 0', 
      color: '#666', 
      fontSize: '14px',
      maxWidth: '300px' 
    }}>
      Run your searches again quickly<br />
      Get Notified about new cars
    </p>
    <Button type="primary" size="large" icon={<SearchOutlined />}>
      Start Searching
    </Button>
  </div>
);

const SavedSearches = () => {
  const [searches, setSearches] = useState(savedSearchesData);

  const handleToggle = (id) => {
    setSearches(searches =>
      searches.map(s =>
        s.id === id ? { ...s, notify: !s.notify } : s
      )
    );
  };

  if (searches.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="saved-searches-main">
      <div className="saved-searches-header">Saved Searches</div>
      <div className="saved-searches-list">
        {searches.map(search => (
          <div className="saved-search-item" key={search.id}>
            <div className="saved-search-info">
              <img src={search.logo} alt="logo" className="saved-search-logo" />
              <div>
                <div className="saved-search-title">{search.title}</div>
                {search.subtitle && <div className="saved-search-subtitle">{search.subtitle}</div>}
                <div className="saved-search-details">{search.details}</div>
                <div className="saved-search-notify-label">Get Notified about new offers.</div>
              </div>
            </div>
            <Switch
              checked={search.notify}
              onChange={() => handleToggle(search.id)}
              className="saved-search-switch"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSearches; 