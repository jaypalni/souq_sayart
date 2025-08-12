import React, { useState, useRef, useEffect } from "react";
import { Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../assets/styles/landingFilters.css";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message, Modal, Tag } from "antd";
import { fetchMakeCars, fetchModelCars } from "../commonFunction/fetchMakeCars";
import { useNavigate } from "react-router-dom";
import emptysearch from "../assets/images/emptysearch.gif";
const { Option } = Select;

const newUsedOptions = ["New & Used", "New", "Used"];
const priceMinOptions = ["Price Min", 5000, 10000, 20000, 30000, 40000];
const priceMaxOptions = ["Price Max", 20000, 30000, 40000, 50000, 100000];

const LandingFilters = () => {
  const [loading, setLoading] = useState(false);
  const [make, setMake] = useState("All");
  const [carMakes, setCarMakes] = useState([]);
  const [model, setModel] = useState("All Models");
  const [carModels, setCarModels] = useState([]);
  const [bodyType, setBodyType] = useState("All Body Types");
  const [carBodyTypes, setCarBodyTypes] = useState([]);
  const [location, setLocation] = useState("Baghdad");
  const [carLocation, setCarLocation] = useState([]);
  const [carSearch, setCarSearch] = useState([]);
  const [newUsed, setNewUsed] = useState("New & Used");
  const [priceMin, setPriceMin] = useState("Price Min");
  const [priceMax, setPriceMax] = useState("Price Max");
  const [carCount] = useState(342642);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  // New Code 
  const [isModalOpen, setIsModalOpen] = useState(false);

//-- End
  const dropdownRefs = {
    newUsed: useRef(),
    priceMin: useRef(),
    priceMax: useRef(),
  };

  useEffect(() => {
    fetchMakeCars({ setLoading, setCarMakes });
  }, []);

  useEffect(() => {
    make && fetchModelCars({ setLoading, setCarModels, make });
  }, [make]);

  useEffect(() => {
    model && fetchBodyTypeCars();
  }, []);

  useEffect(() => {
    bodyType && fetchRegionCars();
  }, []);

  // useEffect(() => {
  //   make && model && bodyType && location && handleSearch();
  // }, [make, model]);

  const fetchBodyTypeCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getBodyCars({});
      const data1 = handleApiResponse(response);

      if (data1) {
        setCarBodyTypes(data1?.data);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Make car data");
      setCarBodyTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getLocationCars({});
      const data1 = handleApiResponse(response);
      if (data1) {
        setCarLocation(data1?.data);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Locations car data");
      setCarLocation([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {};

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getSearchCars(make, model);
      const data1 = handleApiResponse(response);

      if (data1) {
        setCarSearch(data1?.data);
      }
     // navigate("/allcars");
      setIsModalOpen(true);
      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to Search car data");
      setCarSearch([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        dropdownRefs[openDropdown] &&
        !dropdownRefs[openDropdown].current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const renderDropdown = (type, options, value, setValue) => (
    <div className="landing-filters-dropdown-menu" ref={dropdownRefs[type]}>
      {options.map((opt) => (
        <div
          key={opt}
          className={`landing-filters-dropdown-item${
            value === opt ? " selected" : ""
          }`}
          onClick={() => {
            setValue(opt);
            handleChange(
              type === "newUsed"
                ? "New & Used"
                : type === "priceMin"
                ? "Price Min"
                : "Price Max",
              opt
            );
            setOpenDropdown(null);
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  );

  return (
    <div className="landing-filters-outer">
      <div className="landing-filters-bar">
        <div className="landing-filters-row">
          <div className="landing-filters-col">
            <label className="landing-filters-label">Make</label>
            <Select
              value={make}
              onChange={(value) => {
                setMake(value);
                setModel("All Models");
                handleChange("Make", value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
              placeholder="All Models"
            >
              {carMakes.map((m) => (
                <Option key={m.id} value={m.name}>
                  {m.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label">Model</label>
            <Select
              value={model}
              onChange={(value) => {
                setModel(value);
                handleChange("Model", value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
              disabled={make === "All Make"}
            >
              {carModels?.map((m) => (
                <Option key={m.id} value={m.id}>
                  {m.model_name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label">Body Type</label>
            <Select
              value={bodyType}
              onChange={(value) => {
                setBodyType(value);
                handleChange("Body Type", value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
            >
              {carBodyTypes.map((b) => (
                <Option key={b.id} value={b.body_type}>
                  {b.body_type}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col">
            <label className="landing-filters-label">Location</label>
            <Select
              value={location}
              onChange={(value) => {
                setLocation(value);
                handleChange("Location", value);
              }}
              className="landing-filters-select"
              size="large"
              dropdownClassName="landing-filters-dropdown"
            >
              {carLocation.map((l) => (
                <Option key={l.id} value={l.location}>
                  {l.location}
                </Option>
              ))}
            </Select>
          </div>
          <div className="landing-filters-col landing-filters-btn-col">
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              className="landing-filters-btn"
            >
              <span>Show {carCount.toLocaleString()} Cars</span>
            </Button>
          </div>
        </div>
        <div className="landing-filters-row landing-filters-row-text">
          <div
            className="landing-filters-text"
            onClick={() =>
              setOpenDropdown(openDropdown === "newUsed" ? null : "newUsed")
            }
            tabIndex={0}
          >
            {newUsed} <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === "newUsed" &&
              renderDropdown("newUsed", newUsedOptions, newUsed, setNewUsed)}
          </div>
          <div
            className="landing-filters-text"
            onClick={() =>
              setOpenDropdown(openDropdown === "priceMin" ? null : "priceMin")
            }
            tabIndex={0}
          >
            {priceMin} <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === "priceMin" &&
              renderDropdown(
                "priceMin",
                priceMinOptions,
                priceMin,
                setPriceMin
              )}
          </div>
          <div
            className="landing-filters-text"
            onClick={() =>
              setOpenDropdown(openDropdown === "priceMax" ? null : "priceMax")
            }
            tabIndex={0}
          >
            {priceMax} <span className="landing-filters-text-arrow">▼</span>
            {openDropdown === "priceMax" &&
              renderDropdown(
                "priceMax",
                priceMaxOptions,
                priceMax,
                setPriceMax
              )}
          </div>
        </div>
      </div>
      
{isModalOpen && (
  <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <img
        src={emptysearch}
        alt="No Results"
        className="modal-image"
        style={{ maxWidth: "100px", marginBottom: "15px" }}
      />

      <p
        style={{
          fontSize: "16px",
          color: "#0A0A0B",
          fontWeight: 700,
          marginBottom: "4px",
          textAlign: "center",
        }}
      >
        We didn’t find anything that matches this search
      </p>

      <p
        style={{
          fontSize: "12px",
          color: "#898384",
          fontWeight: 400,
          marginTop: "0",
          textAlign: "center",
        }}
      >
        you could try to remove some filters:
      </p>

      {/* Filters as tags */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {make !== "All" && (
          <span
            style={{
              background: "#f0f0f0",
              padding: "5px 10px",
              borderRadius: "6px",
              margin: "5px",
              fontSize: "12px",
              cursor: "pointer",
            }}
            onClick={() => setMake("All")}
          >
            {make}
          </span>
        )}
        {model !== "All Models" && (
          <span
            style={{
              background: "#f0f0f0",
              padding: "5px 10px",
              borderRadius: "6px",
              margin: "5px",
              fontSize: "12px",
              cursor: "pointer",
            }}
            onClick={() => setModel("All Models")}
          >
            {model}
          </span>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default LandingFilters;
