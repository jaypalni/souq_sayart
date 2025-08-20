/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';

const carTypes = [
  { id: 1, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 2, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 3, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 4, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 5, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 6, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 7, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 8, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 9, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 10, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 11, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 12, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 13, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 14, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 15, name: 'New Mercedes-Benz Sedan', count: 42 },
  { id: 16, name: 'New Mercedes-Benz Sedan', count: 42 },
];

const Bestcarsalebytype = () => {
  return (
    <div className="bestcarsalebytype-container" style={{ margin: '32px 0%' }}>
      <div className="bestcarsalebytype-header">
        <h2 className="bestcarsalebytype-title">Best Cars for sale by type</h2>
      </div>
      <div className="bestcarsalebytype-grid" style={{ padding: '0.5% 2%' }}>
        {carTypes.map((type) => (
          <div className="bestcarsalebytype-item" key={type.id}>
            <span className="type-name">{type.name}</span>
            <span className="type-count">({type.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestcarsalebytype;