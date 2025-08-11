import React, { useState, useRef } from "react";
import { FaWhatsapp, FaPhoneAlt, FaShareAlt } from "react-icons/fa";
import { Pagination, Select } from "antd";
import { BsChatLeftDots } from "react-icons/bs";
import "../assets/styles/userProfile.css";
import Share_icon from "../assets/images/share_icon.svg";
import Bluetick_icon from "../assets/images/bluetick_svg.svg";
import Pinlocation_icon from "../assets/images/pinlocation_icon.svg";
import Allcarslistdata from "../components/Allcarslistdata";
import redcar_icon from "../assets/images/redcar_icon.jpg";
import bluecar_icon from "../assets/images/blackcar_icon.png";

const { Option } = Select;

const locations = ["Baghdad", "Beirut", "Dubai", "Riyadh", "Cairo"];

const carData = [
  {
    image: redcar_icon,
    title: "2021 Porsche 992 Turbo S",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: "2025 Mercedes-Benz Citan",
    price: "$40,035",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Manual",
    location: "Lebanon",
    country: "US",
    mileage: "7500",
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: "2022 Toyota Camry",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: "2021 Porsche 992 Turbo S",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Manual",
    location: "Lebanon",
    country: "India",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: "2021 Maruti Suzuki Swift",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "London",
    mileage: "35490",
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: "2021 Skoda Octavia",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: "2024 Hyundai Tucson",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Dubai",
    country: "Dubai",
    mileage: "55989",
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: "2018 Toyota Camry",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "65789",
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: "2002 Honda Accord",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Venezuela",
    country: "Venezuela",
    mileage: "894894",
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: "2019 Toyota Ipsum",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: "2021 Porsche 992 Turbo S",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: "2021 Porsche 992 Turbo S",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: "2021 Porsche 992 Turbo S",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: bluecar_icon,
    title: "2021 Porsche 992 Turbo S",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
  {
    image: redcar_icon,
    title: "2021 Porsche 992 Turbo S",
    price: "$30,435",
    engine: "6 Cyl 3.0L Petrol",
    transmission: "Automatic",
    location: "Lebanon",
    country: "US",
    mileage: "55000",
    featured: true,
    certified: true,
  },
];

const UsersProfile = () => {
  const [location, setLocation] = useState("Baghdad");

  const handleChange = (name, value) => {
   
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div
        style={{
          backgroundColor: "#008ad5",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          height: 55,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 35px" }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 400,
              color: "#fff",
              marginTop: 15,
            }}
          >
            Home &gt; New Cars &gt; Profile
          </p>
        </div>
      </div>

      {/* Profile section */}
      <div style={{ marginTop: 25, marginLeft: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          {/* Avatar */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#cce6f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: "bold",
              color: "#007acc",
            }}
          >
            M
          </div>

          {/* Name and stats */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: "bold", fontSize: 20 }}>Moe</span>
              <span style={{ color: "#008ad5", fontSize: 18 }}>
                <img
                  src={Bluetick_icon} // 🔄 correct variable name
                  alt="Share"
                  style={{
                    width: 13.33,
                    height: 13.33,
                    cursor: "pointer",
                    marginRight: 24,
                  }}
                />
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              35 Published ads
            </div>
            <div style={{ fontSize: 14, color: "gray" }}>
              Joined on 04/10/2024
            </div>
          </div>

          {/* Share icon */}
          <div style={{ marginLeft: 55 }} >
            <img
              src={Share_icon}
              alt="Share"
              style={{
                width: 24,
                height: 24,
                cursor: "pointer",
                marginRight: 1,
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="blue-btn">
            <BsChatLeftDots /> Message
          </button>
          <button className="green-btn">
            <FaWhatsapp /> Whatsapp
          </button>
          <button className="dark-btn">
            <FaPhoneAlt /> Call
          </button>
        </div>

        {/* Address section */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 600, color: "#555" }}>
            <img
              src={Pinlocation_icon}
              alt="Share"
              style={{
                width: 24,
                height: 24,
                cursor: "pointer",
                marginRight: 4,
              }}
            />
            {"Address"}
          </div>
          <div style={{ marginTop: 10 }}>
            <label style={{ color: "#008ad5", fontWeight: "bold" }}>
              Location
            </label>
            {/* <div
              style={{
                marginTop: 5,
                backgroundColor: "#f5f5f5",
                padding: "10px 15px",
                borderRadius: 10,
                width: 120,
              }}
            >
              Baghdad ▼
            </div> */}
            <div className="custom-select-wrapper">
              <Select
              
                value={location}
                onChange={(value) => {
                  setLocation(value);
                  handleChange("Location", value);
                }}
              >
                {locations.map((l) => (
                  <Option key={l} value={l}>
                    {l}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div
        className="row"
        style={{ marginLeft: "100px", marginRight: "100px", marginTop: "25px" }}
      >
        {carData.map((car, idx) => (
          <Allcarslistdata key={idx} car={car} idx={idx} />
        ))}
      </div>
      {/* Pagination */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination defaultCurrent={1} total={30} />
      </div>
    </div>
  );
};

export default UsersProfile;
