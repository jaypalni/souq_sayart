import React from "react";
import "../assets/styles/usersavedsearches.css";
import mercedesLogo from "../assets/images/souqLogo.svg"; // Placeholder, replace with actual brand logo if available
import lamborghiniLogo from "../assets/images/souqLogo.svg"; // Placeholder, replace with actual brand logo if available

const savedSearches = [
  {
    brand: "Mercedes - Benz",
    model: "A-Class",
    logo: mercedesLogo,
    price: "$6524 - 33565$",
    year: "From 2005",
    details: ["to 30,000 km", "number of seats: 3-5", "new"],
  },
  {
    brand: "Lamborgini",
    model: "",
    logo: lamborghiniLogo,
    price: "$0 - 0$",
    year: "From 2005",
    details: [],
  },
  {
    brand: "Lamborgini",
    model: "",
    logo: lamborghiniLogo,
    price: "$0 - 0$",
    year: "From 2005",
    details: [],
  },
];

const UserSavedsearch = ({ title }) => {
  return (
    <>
      <div className="car-listing-header mt-4">
        <span>{title}</span>
        <a href="#" className="car-listing-seeall">
          See All
        </a>
      </div>
      <div className="user-saved-searches-outer-card">
        {savedSearches.map((item, idx) => (
          <div
            className={`user-saved-search-section${
              idx < savedSearches.length - 1 ? " with-divider" : ""
            }`}
            key={idx}
          >
            <div className="user-saved-search-header">
              <img
                src={item.logo}
                alt={item.brand}
                className="user-saved-search-logo"
              />
              <div className="user-saved-search-title">
                <span className="user-saved-search-brand">{item.brand}</span>
                {item.model && (
                  <span className="user-saved-search-model">{item.model}</span>
                )}
              </div>
            </div>
            <div className="user-saved-search-meta">
              <span className="user-saved-search-price">{item.price}</span>
              <span className="user-saved-search-dot">•</span>
              <span className="user-saved-search-year">{item.year}</span>
            </div>
            {item.details.length > 0 && (
              <ul className="user-saved-search-details">
                {item.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default UserSavedsearch;
