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

const CarListing = ({ title, cardata }) => {
  const navigate = useNavigate();
  console.log("cardata123", cardata);
  return (
    <div className="car-listing-container">
      {cardata?.length > 0 && (
        <div className="car-listing-header mt-4">
          <span>{title}</span>

          <a href="#" className="car-listing-seeall">
            See All
          </a>
        </div>
      )}
      <div className="car-listing-flex-row">
        {cardata.map((car, idx) => (
          <div
            className="car-listing-card"
            key={idx}
            style={car.featured ? { cursor: "pointer" } : {}}
            onClick={() => navigate(`/carDetails/${car.id}`)}
          >
            <div className="car-listing-image-wrapper">
              <img
                src={carImage}
                alt={car.title}
                className="car-listing-image"
              />
              <div className="car-listing-badges">
                {car.featured && (
                  <div className="car-listing-badge blue-bg">Featured</div>
                )}
                {car.certified && (
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
                <div className="car-listing-title">{car.title}</div>
                <div className="car-listing-price">${car.price}</div>
              </div>
              <div className="car-listing-engine">{car.engine}</div>
              <div className="car-listing-details row">
                <div className="col-5">
                  {" "}
                  <span>
                    <img
                      src={car_type}
                      alt="Car"
                      style={{
                        width: "14px",
                        height: "14px",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#003958",
                      }}
                    />{" "}
                    {car.transmission}
                  </span>
                </div>
                <div className="col-3">
                  <span>
                    <img
                      src={country_code}
                      alt="Car"
                      style={{
                        width: "14px",
                        height: "14px",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#003958",
                      }}
                    />
                    {car.country}
                  </span>{" "}
                </div>
                <div className="col-4">
                  <span>
                    <img
                      src={speed_code}
                      alt="Car"
                      style={{
                        width: "14px",
                        height: "14px",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#003958",
                      }}
                    />
                    {car.mileage}{" "}
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
