import React, { useState } from "react";
import Slider from "react-slick";
import { FaCarSide, FaShuttleVan, FaCar, FaCarAlt } from "react-icons/fa";
import { MdOutlineDirectionsCar } from "react-icons/md";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import "../assets/styles/cartypelist.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import SVG files as modules
import wagonIcon from "../assets/images/wagon_icon.svg";
import vanIcon from "../assets/images/van_icon.svg";
import coupeIcon from "../assets/images/coupe_icon.svg";
import convertibleIcon from "../assets/images/convertible_icon.svg";
import suvIcon from "../assets/images/suv_icon.svg";
import sedanIcon from "../assets/images/sedan_icon.svg";
import rightarrow from "../assets/images/rightarrow_icon.svg";
import leftarrow from "../assets/images/leftarrow_icon.svg";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Searchemptymodal from "../components/searchemptymodal";


const bodyTypes = [
  {
    name: "Wagon",
    icon: <img src={wagonIcon} alt="Wagon" width="96" height="36" />,
  },
  { name: "Van", icon: <img src={vanIcon} alt="Van" width="96" height="47" /> },
  {
    name: "Coupe",
    icon: <img src={coupeIcon} alt="Coupe" width="96" height="36" />,
  },
  {
    name: "Convertible",
    icon: (
      <img src={convertibleIcon} alt="Convertible" width="96" height="34" />
    ),
  },
  { name: "SUV", icon: <img src={suvIcon} alt="SUV" width="96" height="36" /> },
  {
    name: "Sedan",
    icon: <img src={sedanIcon} alt="Sedan" width="96" height="36" />,
  },
  {
    name: "Wagon2",
    icon: <img src={wagonIcon} alt="Wagon" width="96" height="36" />,
  },
  {
    name: "Van2",
    icon: <img src={vanIcon} alt="Van" width="96" height="47" />,
  },
  {
    name: "Coupe2",
    icon: <img src={coupeIcon} alt="Coupe" width="96" height="36" />,
  },
  {
    name: "Convertible2",
    icon: (
      <img src={convertibleIcon} alt="Convertible" width="96" height="36" />
    ),
  },
  {
    name: "SUV2",
    icon: <img src={suvIcon} alt="SUV" width="96" height="36" />,
  },
  {
    name: "Sedan2",
    icon: <img src={sedanIcon} alt="Sedan" width="96" height="36" />,
  },
];

const Arrow = (props) => {
  const { className, style, onClick, left } = props;
  return (
    <div
      className={className + " car-type-arrow"}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        color: "#222",
        fontSize: 36,
        width: 48,
        height: 48,
        left: left ? -40 : "unset",
        right: !left ? -40 : "unset",
        zIndex: 3,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {left ? <img src={rightarrow} alt="leftarrow" /> : <img src={leftarrow} alt="rightarrow" />}
    </div>
  );
};

const CarTypeList = ({setSearchBodyType}) => {
  const [loading, setLoading] = useState(false);
    const [carSearch, setCarSearch] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bodyType, setBodyType] = useState("All Body Types");
     const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    nextArrow: <Arrow left={false} />,
    prevArrow: <Arrow left={true} />,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
    ],
  };


  const handleSearch = async (item) => {
  const token = localStorage.getItem("token");
    try {
      setLoading(true);
  
      const params = {
        make: "",
        model: "",
        body_type: item,
        location: "",
      };
  
      const response = await carAPI.getSearchCars(params);
      const data1 = handleApiResponse(response);
      if (data1) {
        const results = data1?.data?.cars || [];
        setCarSearch(results);
  
        if (results.length === 0) {
          setIsModalOpen(true);
        } else {
          navigate("/allcars", { state: { cars: results,pagination: data1?.data?.pagination  } });
         localStorage.setItem("searchcardata", JSON.stringify(params));
  
        }
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to search car data");
      setCarSearch([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-type-list-container">
      <h2 className="car-type-list-title">Body Types</h2>
      <Slider {...settings} className="car-type-slider">
        {bodyTypes.map((type) => (
          <div key={type.name} className="car-type-item" onClick={() => handleSearch(type.name)}>
            <div className="car-type-icon">{type.icon}</div>
            <div className="car-type-name">{type.name}</div>
          </div>
        ))}
      </Slider>
      <Searchemptymodal
  visible={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  bodyType={bodyType}
  setBodyType={setBodyType}
  onSave={handleSearch}
/>
    </div>
  );
};

export default CarTypeList;
