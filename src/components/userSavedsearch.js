// import React from "react";
// import "../assets/styles/usersavedsearches.css";
// import mercedesLogo from "../assets/images/souqLogo.svg"; // Placeholder, replace with actual brand logo if available
// import lamborghiniLogo from "../assets/images/souqLogo.svg"; // Placeholder, replace with actual brand logo if available

// const savedSearches = [
//   {
//     brand: "Mercedes - Benz",
//     model: "A-Class",
//     logo: mercedesLogo,
//     price: "$6524 - 33565$",
//     year: "From 2005",
//     details: ["to 30,000 km", "number of seats: 3-5", "new"],
//   },
//   {
//     brand: "Lamborgini",
//     model: "",
//     logo: lamborghiniLogo,
//     price: "$0 - 0$",
//     year: "From 2005",
//     details: [],
//   },
//   {
//     brand: "Lamborgini",
//     model: "",
//     logo: lamborghiniLogo,
//     price: "$0 - 0$",
//     year: "From 2005",
//     details: [],
//   },
// ];

// const UserSavedsearch = ({ title }) => {
//   return (
//     <>
//       <div className="car-listing-header mt-4">
//         <span>{title}</span>
//         <a href="#" className="car-listing-seeall">
//           See All
//         </a>
//       </div>
//       <div className="user-saved-searches-outer-card">
//         {savedSearches.map((item, idx) => (
//           <div
//             className={`user-saved-search-section${
//               idx < savedSearches.length - 1 ? " with-divider" : ""
//             }`}
//             key={idx}
//           >
//             <div className="user-saved-search-header">
//               <img
//                 src={item.logo}
//                 alt={item.brand}
//                 className="user-saved-search-logo"
//               />
//               <div className="user-saved-search-title">
//                 <span className="user-saved-search-brand">{item.brand}</span>
//                 {item.model && (
//                   <span className="user-saved-search-model">{item.model}</span>
//                 )}
//               </div>
//             </div>
//             <div className="user-saved-search-meta">
//               <span className="user-saved-search-price">{item.price}</span>
//               <span className="user-saved-search-dot">•</span>
//               <span className="user-saved-search-year">{item.year}</span>
//             </div>
//             {item.details.length > 0 && (
//               <ul className="user-saved-search-details">
//                 {item.details.map((d, i) => (
//                   <li key={i}>{d}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default UserSavedsearch;

import React from "react";
import "../assets/styles/usersavedsearches.css";
import mercedesLogo from "../assets/images/souqLogo.png";
import lamborghiniLogo from "../assets/images/souqLogo.png";
import carImage from "../assets/images/subscribecar_icon.png";
import diamondLogo from "../assets/images/bluediamond_icon.svg";
import dollarLogo from "../assets/images/bluedollar_icon.svg";
import like_icon from "../assets/images/like_icon.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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

const UserSavedsearch = () => {
  const navigate = useNavigate();

  const tokendata = localStorage.getItem("token");
  let isLoggedIn;
  if (tokendata === "" || tokendata === null) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }


  
  return (
    <div className="user-saved-searches-wrapper">
      <div className="Search-header">
        <h1
          style={{
            fontWeight: "700",
            fontSize: "32px",
            marginBottom: "24px",
            marginTop: "24px",
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
          {/* 🔁 Only this section is conditionally rendered */}
          {isLoggedIn ? (
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
                      <span className="user-saved-search-brand">
                        {item.brand}
                      </span>
                      {item.model && (
                        <span className="user-saved-search-model">
                          {item.model}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="user-saved-search-meta">
                    <span className="user-saved-search-price">
                      {item.price}
                    </span>
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
          ) : (
            <div className="user-saved-searches-signup-box">
              <div className="signup-icon">
                <img src={like_icon} alt="like" />
              </div>
              <div>
                <h1>Sign up searches</h1>
                <p>
                  Find your saved searches right here. Get alerts for new
                  listings.
                </p>
                <button
                  className="signup-btn"
                  onClick={() => navigate("/login")}
                >
                  Sign up / log in
                </button>
              </div>
            </div>
          )}

          {/* 🔁 Always show these two action boxes */}
          <div className="user-saved-search-actions">
            <div className="user-saved-search-action-box">
              <img src={diamondLogo} alt="Diamond" className="action-icon" />
              <p>Value your car with our free online valuation</p>
            </div>
            <div className="user-saved-search-action-box">
              <img src={dollarLogo} alt="Dollar" className="action-icon" />
              <p>List your car or get a free Instant Offer</p>
            </div>
          </div>
        </div>

        {/* 🔁 Always show the image box */}
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
