import React, { useState } from "react";
import FilterIcon from "../assets/images/filter_icon.svg";
import {
  Drawer,
  Button,
  Select,
  Input,
  Checkbox,
  Radio,
  Divider,
  Row,
  Col,
} from "antd";
import { FaArrowLeft, FaCheck, FaRegDotCircle } from "react-icons/fa";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";

import Comforticon from "../assets/images/comfort_icon.svg";
import Mediaicon from "../assets/images/media_icon.svg";
import Extrasicon from "../assets/images/extras_icon.svg";
import Safetyicon from "../assets/images/safety_icon.svg";
import Searchicon from "../assets/images/search_icon.svg";
import Backarrowicon from "../assets/images/backarrow_icon.svg";


const { Option } = Select;

const fuelOptions = ["Any", "Petrol", "Diesel", "Hybrid", "Electric"];

const transmissionOptions = ["Any", "Automatic", "Manual", "Steptonic"];

const cylinderOptions = [
  "3",
  "4",
  "5",
  "6",
  "8",
  "12",
  "N/A",
  "Electric",
  "Not Sure",
];

const extraFeaturesData = [
  {
    title: "Comfort & Convenience",
    icon: <img src={Comforticon} alt="Comfort Icon" />,
    features: ["Heated seats", "Keyless entry", "power mirrors"],
  },
  {
    title: "Entertainment & Media",
    icon: <img src={Mediaicon} alt="Media Icon" />,
    features: ["Bluetooth", "Cd Play", "Radio"],
  },
  {
    title: "Extras",
    icon: <img src={Extrasicon} alt="Extras Icon" />,
    features: ["Navigation", "Alloy wheels", "Power locks"],
  },
  {
    title: "Safety & Security",
    icon: <img src={Safetyicon} alt="Safety Icon" />,
    features: ["Diesel", "Electric"],
  },
];


const numberofdoors = ["Any", "2/3", "4/5"];

const Cardetailsfilter = () => {
  const [visible, setVisible] = useState(false);

   const [extrafeaturesvisible, setextrafeaturesvisible] = useState(false);

  const [value, setValue] = useState("Any");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const [selectedValues, setSelectedValues] = useState(["Any"]);

  const fuelhandleChange = (checkedValues) => {
    setSelectedValues(checkedValues);
  };

  const [transmissionselectedValues, settransmissionselectedValues] = useState(["Any"]);
  

  const transmissionhandleChange = (option) => {
    if (transmissionselectedValues.includes(option)) {
      settransmissionselectedValues(transmissionselectedValues.filter((val) => val !== option));
    } else {
      settransmissionselectedValues([...transmissionselectedValues, option]);
    }
  };

  const [cylinderselectedValues, setcylinderselectedValues] = useState([]);

  const cylinderhandleChange = (option) => {
    if (cylinderselectedValues.includes(option)) {
      setcylinderselectedValues(cylinderselectedValues.filter((val) => val !== option));
    } else {
      setcylinderselectedValues([...cylinderselectedValues, option]);
    }
  };    
  
  const [doorselectedValues, setdoorselectedValues] = useState([]);

  const doorhandleChange = (option) => {
    if (doorselectedValues.includes(option)) {
      setdoorselectedValues(
        doorselectedValues.filter((val) => val !== option)
      );
    } else {
      setdoorselectedValues([...doorselectedValues, option]);
    }
  };   
  
  const [search, setSearch] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  return (
    <>
      <div onClick={() => setVisible(true)}>
        <img
          src={FilterIcon}
          alt="Filter Icon"
          style={{ width: "30px", height: "30px" }}
        />
      </div>
      <Drawer
        title="Filter"
        placement="left"
        onClose={() => setVisible(false)}
        visible={visible}
        width={380}
        bodyStyle={{
          paddingBottom: 80,
          height: "calc(100% - 108px)", // Account for header and footer
          overflow: "hidden", // Prevent double scrollbars
        }}
      >
        <div
          style={{
            height: "100%",
            overflowY: "auto",
            paddingRight: "8px", // Add some padding for the scrollbar
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, fontSize: "14px" }}>Trim</div>
            <Select
              defaultValue="Any"
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Option value="Any">Any</Option>
              <Option value="Base">Base</Option>
              <Option value="Sport">Sport</Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Verified
            </div>
            <Radio.Group
              onChange={handleChange}
              value={value}
              style={{
                display: "flex", // make buttons stay side by side
                gap: "10px", // spacing instead of marginRight
              }}
            >
              <Radio.Button
                value="Any"
                className="custom-radio-button"
                style={{
                  width: "20%",
                  textAlign: "center",
                  marginRight: "10px",
                  borderRadius: "4px",
                  color: value === "Any" ? "#000" : "#000",
                  fontSize: "12px",
                  fontWeight: "400",
                  borderColor: value === "Any" ? "#D67900" : undefined,
                  backgroundColor: value === "Any" ? "#FFEDD5" : undefined, // optional highlight
                }}
              >
                Any
              </Radio.Button>
              <Radio.Button
                value="Available"
                className="custom-radio-button"
                style={{
                  width: "30%",
                  textAlign: "center",
                  borderRadius: "4px",
                  color: value === "Available" ? "#000" : "#000",
                  fontSize: "12px",
                  fontWeight: "400",
                  borderLeft: "1px solid #D67900",
                  borderColor: value === "Available" ? "#D67900" : undefined,
                  backgroundColor:
                    value === "Available" ? "#FFEDD5" : undefined,
                }}
              >
                Available
              </Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Kilometers
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input placeholder="Min" />
              </Col>
              <Col span={12}>
                <Input placeholder="Max" />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Year
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input placeholder="Min" />
              </Col>
              <Col span={12}>
                <Input placeholder="Max" />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Fuel Type
            </div>
            <div className="checkbox-button-group">
              {fuelOptions.map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    selectedValues.includes(option) ? "selected" : ""
                  }`}
                >
                  <Checkbox
                    value={option}
                    checked={selectedValues.includes(option)}
                    onChange={() => {
                      if (selectedValues.includes(option)) {
                        setSelectedValues(
                          selectedValues.filter((item) => item !== option)
                        );
                      } else {
                        setSelectedValues([...selectedValues, option]);
                      }
                    }}
                    style={{ display: "none" }} // hide the default checkbox box
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Transmission
            </div>
            <div className="checkbox-button-group">
              {transmissionOptions.map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    transmissionselectedValues.includes(option)
                      ? "selected"
                      : ""
                  }`}
                >
                  <Checkbox
                    checked={transmissionselectedValues.includes(option)}
                    onChange={() => transmissionhandleChange(option)}
                    style={{ display: "none" }} // Hide default checkbox box
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Number of Cylinders
            </div>
            <div className="checkbox-button-group">
              {cylinderOptions.map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    cylinderselectedValues.includes(option) ? "selected" : ""
                  }`}
                >
                  <Checkbox
                    checked={cylinderselectedValues.includes(option)}
                    onChange={() => cylinderhandleChange(option)}
                    style={{ display: "none" }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Power (1hp)
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input placeholder="Min" />
              </Col>
              <Col span={12}>
                <Input placeholder="Max" />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Consumption (l/100)
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input placeholder="Min" />
              </Col>
              <Col span={12}>
                <Input placeholder="Max" />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "3px",
              }}
            >
              Air Conditioning
            </div>
            <Select
              defaultValue="Any"
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Option value="Any">Any</Option>
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "3px",
              }}
            >
              Color
            </div>
            <Select
              defaultValue="Any"
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Option value="Any">Any</Option>
              <Option value="Black">Black</Option>
              <Option value="White">White</Option>
              <Option value="Red">Red</Option>
              <Option value="Blue">Blue</Option>
              <Option value="Green">Green</Option>
              <Option value="Yellow">Yellow</Option>
              <Option value="Orange">Orange</Option>
              <Option value="Purple">Purple</Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Number Of Seats
            </div>
            <Row gutter={8}>
              <Col span={12}>
                <Input placeholder="Min" />
              </Col>
              <Col span={12}>
                <Input placeholder="Max" />
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "3px",
              }}
            >
              Extra Features
            </div>
            <Select
              defaultValue="Any"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={() => setextrafeaturesvisible(true)}
            >
              <Select.Option value="Any">Any</Select.Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Number of Doors
            </div>
            <div className="checkbox-button-group">
              {numberofdoors.map((option) => (
                <label
                  key={option}
                  className={`checkbox-button ${
                    doorselectedValues.includes(option) ? "selected" : ""
                  }`}
                >
                  <Checkbox
                    checked={doorselectedValues.includes(option)}
                    onChange={() => doorhandleChange(option)}
                    style={{ display: "none" }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "3px",
              }}
            >
              Interior
            </div>
            <Select
              defaultValue="Any"
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Option value="Any">Any</Option>
              <Option value="Leather">Leather</Option>
              <Option value="Cloth">Cloth</Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "3px",
              }}
            >
              Source
            </div>
            <Select
              defaultValue="Any"
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Option value="Any">Any</Option>
              <Option value="Private">Private</Option>
              <Option value="Dealer">Dealer</Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 500,
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Payment Options
            </div>
            <Select
              defaultValue="Any"
              style={{ width: "100%", marginTop: "3px" }}
            >
              <Option value="Any">Any</Option>
              <Option value="Cash">Cash</Option>
              <Option value="Installment">Installment</Option>
            </Select>
          </div>
          {/* Add more filter fields as needed */}
          <Divider />
          <Button type="primary" block>
            Apply Filters
          </Button>
        </div>
      </Drawer>
      <Drawer
        title={null} // no default title
        closeIcon={null} // hides the default "X" close icon
        placement="left"
        onClose={() => setextrafeaturesvisible(false)}
        open={extrafeaturesvisible} // use `open` instead of deprecated `visible` if you're on AntD v5+
        width={380}
        bodyStyle={{
          padding: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Custom Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 16,
            borderBottom: "1px solid #eee",
          }}
        >
          <img
            src={Backarrowicon}
            alt="Back Arrow Icon"
            style={{ width: 24, height: 24 }}
            onClick={() => setextrafeaturesvisible(false)}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 16,
              marginLeft: 16,
              color: "#0A0A0B",
            }}
          >
            Extra Features
          </span>
        </div>
        {/* Search Bar */}
        <div style={{ padding: 16 }}>
          <Input
            placeholder="Search Here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={
              <img
                src={Searchicon}
                alt="Search Icon"
                style={{ width: 24, height: 24 }}
              />
            }
            style={{
              borderRadius: 8,
              height: 44,
              boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.07)",
            }}
          />
        </div>
        {/* Features List */}
        <div
          style={{
            height: "calc(100vh - 120px)",
            overflowY: "auto",
            //padding: 16,
            marginTop: 0,
            marginLeft: 16,
            marginRight: 16,
          }}
        >
          {extraFeaturesData.map((section) => {
            // Filter features by search
            const filtered = section.features.filter((f) =>
              f.toLowerCase().includes(search.toLowerCase())
            );
            if (filtered.length === 0) return null;
            return (
              <div key={section.title} style={{ marginBottom: 5 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    margin: "16px 0 8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: 8 }}>{section.icon}</span>
                  {section.title}
                </div>
                {filtered.map((feature) => (
                  <div
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      height: 36,
                      fontSize: 12,
                      fontWeight: 400,
                      background: selectedFeatures.includes(feature)
                        ? "#f5f5f5"
                        : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ textTransform: "capitalize" }}>
                      {feature}
                    </span>
                    {selectedFeatures.includes(feature) ? (
                      <FaCheck style={{ color: "#222" }} />
                    ) : (
                      <MdOutlineCheckBoxOutlineBlank
                        style={{ color: "#fff" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Drawer>
    </>
  );
};

export default Cardetailsfilter;
