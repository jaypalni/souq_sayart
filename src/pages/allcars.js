import { useEffect, useState } from "react";
import AllCarFilters from "../components/allcarfilters";
import PlaneBanner from "../components/planeBanner";
import redcar_icon from "../assets/images/redcar_icon.jpg";
import bluecar_icon from "../assets/images/blackcar_icon.png";
import { CheckCircleFilled } from "@ant-design/icons";
import "../assets/styles/carListing.css";
import { FaCogs, FaGlobe, FaMapMarkerAlt, FaRegHeart } from "react-icons/fa";
import { TbManualGearbox } from "react-icons/tb";
import Bestcarsalebytype from "../components/bestcarsalebytype";
import { carAPI, userAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import car_type from "../assets/images/car_type.png";
import country_code from "../assets/images/country_code.png";
import speed_code from "../assets/images/speed_dashboard.png";
import { message,Pagination } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
const Allcars = () => {
  const [filtercarsData, setFilterCarsData] = useState([]);

  console.log("all car filters",filtercarsData)
  return (
    <div>
      <PlaneBanner name={"jdi"} />
      <AllCarFilters filtercarsData={filtercarsData} setFilterCarsData={setFilterCarsData}  />
      <CarListing filtercarsData={filtercarsData} setFilterCarsData={setFilterCarsData}  />
      <Bestcarsalebytype />
      
    </div>
  );
};

const CarListing = ({filtercarsData}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const passedCars = location.state?.cars || [];
  const passedPagination = location.state?.pagination || {};
  const [carsData, setCarsData] = useState(passedCars);
  const [paginationData, setPaginationData] = useState(passedPagination);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
   
    if (filtercarsData.length === 0) {
      setCarsData(passedCars)
      setPaginationData(passedPagination)
    }else{
      setCarsData(filtercarsData?.cars)
      setPaginationData(filtercarsData?.pagination)
    }
  }, [filtercarsData]);
  console.log("paginationData",paginationData)

   const Addfavcarapi = async (carId) => {
      try {
        setLoading(true);
  
        const response = await userAPI.addFavorite(carId); 
        const data = handleApiResponse(response);
  
        if (data.success) {
          message.success(data.message || "Added to favorites");
        } else {
          message.error(data.message || "Something went wrong");
        }
      } catch (error) {
        const errorData = handleApiError(error);
        message.error(
          errorData.message || "Failed to remove car from favorites."
        );
      } finally {
        setLoading(false);
      }       
    };

const onShowSizeChange = (current, pageSize) => {
  console.log(current, pageSize);
};
const onPageChange = (page, pageSize) => {
  console.log(page, pageSize);
};
  return (
    <div className="car-listing-container">
      <div className="car-listing-header">
        <span>Showing 1 - {carsData?.length} Cars</span>
        <a
          href="#"
          className="allcars-sortingtitle"
          style={{ color: "#000000", fontSize: "16px", fontWeight: "700" }}
        >
          Sort : Newest Listing
        </a>
      </div>
      <div className="row">
        {carsData?.map((car) => (
          <div className="col-3 p-0" key={car.id || `${car.ad_title}-${car.price}`}>
            <div
              className="allcars-listing-card"
              onClick={() => navigate(`/carDetails/${car.car_id}`)}
            >
              <div className="car-listing-image-wrapper">
               <img
  src={car.car_image ? `${baseUrl}${car.car_image}` : redcar_icon}
  alt="Car"
  onError={(e) => e.target.src = redcar_icon}
/>
                <div className="car-listing-badges">
                  {car.featured && (
                    <div className="car-listing-badge blue-bg">Featured</div>
                  )}
                  {Number(car.is_verified) === 1 && (
                    <div className="car-listing-badge orenge-bg">
                      <CheckCircleFilled /> Certified Dealer
                    </div>
                  )}
                </div>
                <button
                  className="car-listing-fav"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#008ad5",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    Addfavcarapi(car.id);
                  }}
                >
                  <FaRegHeart />
                </button>
              </div>
              <div className="car-listing-content">
                <div className="d-flex">
                  <div className="car-listing-title">
                    {car.ad_title || "No Title Available"}
                  </div>
                  <div className="car-listing-price">
  {"$" + Number(car.price).toLocaleString()}
</div>

                </div>
                <div className="car-listing-engine">
                  {car.no_of_cylinders +
                    " Cyl " +
                    car.engine_cc +
                    " " +
                    car.fuel_type}
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
          </div>
        ))}
      </div>
      <div className="row" >
        <div className="col-12 d-flex justify-content-center">
         <Pagination
      showSizeChanger
      onShowSizeChange={onShowSizeChange}
      onChange={onPageChange}
      defaultCurrent={paginationData?.page}
      total={paginationData?.total}
    />
    </div>
  
      </div>
    </div>
  );
};


export default Allcars;
