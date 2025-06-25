import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Button, Tag, Collapse, Avatar } from "antd";
import {
  FaCheckCircle,
  FaGlobe,
  FaMapMarkerAlt,
  FaRegHeart,
  FaWhatsapp,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { GiGasPump, GiCarWheel } from "react-icons/gi";
import { MdCarRental } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
// import CarDetailsMock from '../components/cardetailsmock';
import "../assets/styles/cardetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import redcar_icon from "../assets/images/redcar_icon.jpg";
import bluecar_icon from "../assets/images/blackcar_icon.png";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Panel } = Collapse;

//const carImages = [redcar_icon, bluecar_icon, redcar_icon, bluecar_icon];

const CarDetails = () => {
  const { id } = useParams();
  console.log("Newid", id);
  const handleImageClick = (img) => setMainImageIdx(carImages.indexOf(img));
  const handleCollapseChange = (key) => setActiveKey(key);

  const features = [
    "Keyless Entry",
    "Rear AC Vents",
    "Push Start Button",
    "Cruise Control",
    "LED Headlights",
    "Rear Defogger",
    "Alloy Wheels",
    "Automatic Climate Control",
  ];

  const safetyFeatures = [
    "Airbags",
    "ABS",
    "Traction Control",
    "Lane Assist",
    "Blind Spot Monitor",
    "Rear Camera",
    "Parking Sensors",
    "Tire Pressure Monitor",
  ];

  const additionalFeatures = [
    "Sunroof",
    "Leather Seats",
    "Bluetooth",
    "Navigation",
    "Heated Seats",
    "Apple CarPlay",
    "Android Auto",
    "Premium Sound",
  ];

  const goToPrevImage = () => {
    setMainImageIdx((prev) => (prev === 0 ? carImages.length - 1 : prev - 1));
  };
  const goToNextImage = () => {
    setMainImageIdx((prev) => (prev === carImages.length - 1 ? 0 : prev + 1));
  };

  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [activeKey, setActiveKey] = useState(["1"]);
  const [openFeatures, setOpenFeatures] = useState(true);
  const [openSafety, setOpenSafety] = useState(false);
  const [openAdditional, setOpenAdditional] = useState(false);
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const Allcarsapi = async () => {
      try {
        setLoading(true);
        const response = await carAPI.getCarById(Number(id));
        const cardetail = handleApiResponse(response);
        if (cardetail?.data) {
          setCarDetails(cardetail.data);
        }
        message.success(cardetail.message || "Fetched successfully");
      } catch (error) {
        const errorData = handleApiError(error);
        message.error(errorData.message || "Failed to load car data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      Allcarsapi();
    }
  }, [id]);

  const Allcarsapi = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getCarById(Number(id));
      const cardetail = handleApiResponse(response);
      if (cardetail?.data) {
        setCarDetails(cardetail.data);
      }
      message.success(cardetail.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load car data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!carDetails) return <div>No data found</div>;

  const carImages = carDetails?.images?.length
    ? carDetails.images
    : [redcar_icon];

  const carInfo = [
    { label: "Body Type", value: carDetails.body_type || "-" },
    { label: "Regional Specs", value: carDetails.regional_specs || "-" },
    { label: "Door Count", value: carDetails.number_of_doors || "-" },
    { label: "Number of seats", value: carDetails.number_of_seats || "-" },
    { label: "Version", value: carDetails.trim || "-" },
  ];

  const additionalDetails = [
    { label: "Engine CC", value: carDetails.engine_cc || "-" },
    { label: "Number of Cylinders", value: carDetails.no_of_cylinders || "-" },
    { label: "Consumption", value: carDetails.consumption || "-" },
    { label: "Transmission", value: carDetails.transmission_type || "-" },
    { label: "Drive Type", value: carDetails.drive_type || "-" },
  ];

  return (
    <div className="container py-4 car-details-page">
      <div className="row">
        {/* Left: Images */}
        <div className="col-md-8">
          <Card className="main-image-card">
            <div className="main-image-wrapper">
              <img
                src={carImages[mainImageIdx]}
                alt="Car"
                className="main-car-image"
              />
              <button
                className="arrow-btn left-arrow"
                onClick={goToPrevImage}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                className="arrow-btn right-arrow"
                onClick={goToNextImage}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </div>
            <div className="thumbnail-row mt-3 d-flex gap-2">
              {carImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`thumbnail-img ${
                    mainImageIdx === idx ? "active" : ""
                  }`}
                  onClick={() => setMainImageIdx(idx)}
                />
              ))}
            </div>
          </Card>
          <Card className="mt-3 p-3">
            <h3>{carDetails.ad_title}</h3>
            <p className="text-muted">
              Indulge in the ultimate driving experience with our Mercedes AMG
              G63 2021. The high performance car combines cutting edge
              technologies & design, delivering a unique experience with our
              Mercedes AMG G63 2021. The high performance car technology.
            </p>
            <div className="d-flex align-items-center gap-3 mb-2">
              <Tag color="blue">
                {carDetails.no_of_cylinders +
                  " Cyl " +
                  carDetails.engine_cc +
                  " " +
                  carDetails.fuel_type}
              </Tag>
              <span className="text-muted">ID: 234567</span>
            </div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <FaRegHeart className="icon-fav" />
              <span>Buy/Sell</span>
            </div>
          </Card>
          <Card className="mt-3 p-3">
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <Card className="car-details-table-card">
                  <div className="car-details-table-title">
                    Car Informations
                  </div>
                  <table className="car-details-table">
                    <tbody>
                      {carInfo.map((item, idx) => (
                        <tr key={idx}>
                          <td className="car-details-table-label">
                            {item.label}
                          </td>
                          <td className="car-details-table-value">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
              <div className="col-md-6">
                <Card className="car-details-table-card">
                  <div className="car-details-table-title">
                    Additional Details
                  </div>
                  <table className="car-details-table">
                    <tbody>
                      {additionalDetails.map((item, idx) => (
                        <tr key={idx}>
                          <td className="car-details-table-label">
                            {item.label}
                          </td>
                          <td className="car-details-table-value">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            </div>
          </Card>
          {/* <CarDetailsMock /> */}
          <div>
            <div className="car-details-features-section">
              {/* Main Features Section */}
              <div className="car-details-features-h1">
                <span>Features - {carDetails.ad_title}</span>
              </div>
              <div className="border-bottom">
                <div className="car-details-features-header collapsed">
                  <span>Safety Features</span>
                  <span
                    onClick={() => setOpenFeatures(!openFeatures)}
                    style={{ cursor: "pointer" }}
                  >
                    {openFeatures ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                {openFeatures && (
                  <div>
                    <div className="car-details-feature-title"></div>
                    <div className="row">
                      {features.map((f, idx) => (
                        <div className="col-md-3 col-6 mb-2" key={idx}>
                          <span className="car-details-feature-item">
                            <FaCheckCircle
                              color="#4fc3f7"
                              style={{ marginRight: 6 }}
                            />
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Safety Features Section */}
              <div className="border-bottom">
                <div className="car-details-features-header collapsed">
                  <span>Safety Features</span>
                  <span
                    onClick={() => setOpenSafety(!openSafety)}
                    style={{ cursor: "pointer" }}
                  >
                    {openSafety ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                {openSafety && (
                  <div className="row mb-2 mt-2">
                    {safetyFeatures.map((f, idx) => (
                      <div className="col-md-3 col-6 mb-2" key={idx}>
                        <span className="car-details-feature-item">
                          <FaCheckCircle
                            color="#4fc3f7"
                            style={{ marginRight: 6 }}
                          />
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Additional Features Section */}
              <div className="border-bottom">
                <div className="car-details-features-header collapsed">
                  <span>Additional Features</span>
                  <span
                    onClick={() => setOpenAdditional(!openAdditional)}
                    style={{ cursor: "pointer" }}
                  >
                    {openAdditional ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                {openAdditional && (
                  <div className="row mb-2 mt-2">
                    {additionalFeatures.map((f, idx) => (
                      <div className="col-md-3 col-6 mb-2" key={idx}>
                        <span className="car-details-feature-item">
                          <FaCheckCircle
                            color="#4fc3f7"
                            style={{ marginRight: 6 }}
                          />
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Right: Seller Info */}
        <div className="col-md-4">
          <Card className="seller-info-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">{carDetails.ad_title}</h5>
                <div className="car-price">${carDetails.price}</div>
                <div className="row align-items-center mt-2 mb-2">
                  <div className="col-4 d-flex align-items-center gap-1">
                    <TbManualGearbox style={{ fontSize: "16px" }} />
                    <span>{carDetails.transmission_type}</span>
                  </div>
                  <div className="col-4 d-flex align-items-center gap-1">
                    <FaGlobe style={{ fontSize: "16px" }} />
                    <span>country</span>
                  </div>
                  <div className="col-4 d-flex align-items-center gap-1">
                    <FaMapMarkerAlt
                      style={{ fontSize: "16px", display: "inline" }}
                    />
                    <span>{carDetails.location}</span>
                  </div>
                </div>
                <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
                  Listed by Private User
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <div>Moe</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      Member since July 2016
                    </div>
                    <Link
                      to="/profile"
                      className="car-details-view-profile-link"
                    >
                      View Profile{" "}
                      <FaChevronRight
                        style={{ fontSize: "11px", marginLeft: "3px" }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button icon={<MessageOutlined />} className="w-100">
                Message
              </Button>
              <Button
                icon={<FaWhatsapp />}
                className="w-100"
                style={{ background: "#25D366", color: "#fff" }}
              >
                Whatsapp
              </Button>
              <Button icon={<FaPhoneAlt />} className="w-100">
                Call
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
