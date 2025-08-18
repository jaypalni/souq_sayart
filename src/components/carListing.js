import React from "react";
import { Tag } from "antd";
import { FaCogs, FaGlobe, FaMapMarkerAlt, FaRegHeart } from "react-icons/fa";
import { TbManualGearbox } from "react-icons/tb";
import { CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../assets/styles/carListing.css";
import carImage from "../assets/images/Car_icon.png";
import car_type from "../assets/images/car_type.png";
import country_code from "../assets/images/country_code.png";
import speed_code from "../assets/images/speed_dashboard.png";

import { useState, useEffect } from "react";

const CarListing = ({ title, cardata }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [visibleCars, setVisibleCars] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (Array.isArray(cardata) && cardata.length > 0) {
      let startIndex = 0;

      const updateVisibleCars = () => {
        const slice = cardata.slice(startIndex, startIndex + 10);
        setVisibleCars(slice);
        startIndex = (startIndex + 10) % cardata.length;
      };

      updateVisibleCars();
      const interval = setInterval(updateVisibleCars, 900000);

      return () => clearInterval(interval);
    }
  }, [cardata]);

  return (
    <div className="car-listing-container">
      {visibleCars.length > 0 && (
        <div className="car-listing-header mt-4">
          <span>{title}</span>
          <a href="#" className="car-listing-seeall">
            See All
          </a>
        </div>
      )}
      <div className="car-listing-flex-row">
        {visibleCars.map((car, idx) => (
          <div
            className="car-listing-card"
            key={idx}
            style={car.featured ? { cursor: "pointer" } : {}}
            onClick={() => navigate(`/carDetails/${car.car_id}`)}
          >
            <div className="car-listing-image-wrapper">
              <img
                src={`${BASE_URL}${car.car_image}`}
                alt={car.title}
                className="car-listing-image"
              />
              <div className="car-listing-badges">
                {Number(car.featured) === 1 && (
                  <div className="car-listing-badge blue-bg">Featured</div>
                )}
                {Number(car.is_verified) === 1 && (
                  <div className="car-listing-badge orenge-bg">
                    <CheckCircleFilled /> Certified Dealer
                  </div>
                )}
              </div>
              <div className="car-listing-fav">
                <FaRegHeart />
              </div>
            </div>
            <div className="car-listing-content">
              <div className="d-flex">
                <div className="car-listing-title">{car.ad_title}</div>
                <div className="car-listing-price">
                  {"$" + Number(car.price).toLocaleString()}
                </div>
              </div>
              <div className="car-listing-engine">
                {car.fuel_type === "Electric"
                  ? car.fuel_type
                  : `${car.no_of_cylinders}cyl ${(car.engine_cc / 1000).toFixed(
                      1
                    )}L  ${car.fuel_type}`}
              </div>
              <div className="car-listing-details row">
                <div className="col-5">
                  <span>
                    <img
                      src={car_type}
                      alt="Car"
                      style={{ width: 14, height: 14 }}
                    />{" "}
                    {car.transmission}
                  </span>
                </div>
                <div className="col-3">
                  <span>
                    <img
                      src={country_code}
                      alt="Country"
                      style={{ width: 14, height: 14 }}
                    />
                    {car.country_code}
                  </span>
                </div>
                <div className="col-4">
                  <span>
                    <img
                      src={speed_code}
                      alt="Speed"
                      style={{ width: 14, height: 14 }}
                    />
                    {car.mileage}
                  </span>
                </div>
                <div className="car-listing-location">{car.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarListing;
