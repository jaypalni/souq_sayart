/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

import React from 'react';
const CAR_TYPE_NAME = 'New Mercedes-Benz Sedan';
const CAR_TYPE_COUNT = 42;

const carTypes = Array.from({ length: 16 }, () => ({
  name: CAR_TYPE_NAME,
  count: CAR_TYPE_COUNT,
}));

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
