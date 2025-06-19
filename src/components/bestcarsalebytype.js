import React from "react";

const carTypes = [
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
  { name: "New Mercedes-Benz Sedan", count: 42 },
];

const Bestcarsalebytype = () => {
  return (
    <div className="bestcarsalebytype-container" style={{ margin: "32px 0%" }}>
      <div className="bestcarsalebytype-header">
        <h2 className="bestcarsalebytype-title">Best Cars for sale by type</h2>
      </div>
      <div className="bestcarsalebytype-grid" style={{ padding: "0.5% 2%" }}>
        {carTypes.map((type, idx) => (
          <div className="bestcarsalebytype-item" key={idx}>
            <span className="type-name">{type.name}</span>
            <span className="type-count">({type.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestcarsalebytype;
