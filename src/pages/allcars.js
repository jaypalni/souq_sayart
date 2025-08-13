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
import { message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
const Allcars = () => {
  return (
    <div>
      <PlaneBanner name={"jdi"} />
      <AllCarFilters />
      <CarListing />
      <Bestcarsalebytype />
      
    </div>
  );
};
// const CarListing = () => {
//   console.log("Hi All")
//   const [carsData, setCarsData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   useEffect(() => {
//     Allcarsapi();
//   }, []);
//   const Allcarsapi = async () => {
//     try {
//       setLoading(true);
//       const response = await carAPI.getAllCars({});
//       const newcars = handleApiResponse(response);
//       if (newcars?.data?.cars) {
//         setCarsData(newcars.data.cars);
//       }
//       message.success(newcars.message || "Fetched successfully");
//     } catch (error) {
//       const errorData = handleApiError(error);
//       message.error(errorData.message || "Failed to load car data");
//       setCarsData([]);
//     } finally {
//       setLoading(false);
//     } 
//   };

//   // Add Fav API

  // const Addfavcarapi = async (carId) => {
  //     try {
  //       setLoading(true);
  
  //       const response = await userAPI.addFavorite(carId); 
  //       const data = handleApiResponse(response);
  
  //       if (data.success) {
  //         message.success(data.message || "Added to favorites");
  //       } else {
  //         message.error(data.message || "Something went wrong");
  //       }
  //     } catch (error) {
  //       const errorData = handleApiError(error);
  //       message.error(
  //         errorData.message || "Failed to remove car from favorites."
  //       );
  //     } finally {
  //       setLoading(false);
  //     }       
  //   };

//   return (
//     <div className="car-listing-container">
//       <div className="car-listing-header">
//         <span>Showing 1 - {carsData.length} Cars</span>
//         <a
//           href="#"
//           className="allcars-sortingtitle"
//           style={{ color: "#000000", fontSize: "16px", fontWeight: "700" }}
//         >
//           Sort : Newest Listing
//         </a>
//       </div>
//       <div className="row">
//         {/* {carsData.map((car, idx) => (
//           <div className="col-3 p-0" key={idx}> */}
//           {carsData.map((car) => (
//             <div className="col-3 p-0" key={car.id || `${car.ad_title}-${car.price}`}>
//             <div
//               className="allcars-listing-card"
//               onClick={() => navigate(`/carDetails/${car.id}`)}
//             >
//               <div className="car-listing-image-wrapper">
//                 <img
//                   src={car.image_url || redcar_icon} // fallback image
//                   alt={car.ad_title || "Car Image"}
//                   className="car-listing-image"
//                 />
//                 <div className="car-listing-badges">
//                   {car.featured && (
//                     <div className="car-listing-badge blue-bg">Featured</div>
//                   )}
//                   {car.certified && (
//                     <div className="car-listing-badge orenge-bg">
//                       <CheckCircleFilled /> Certified Dealer
//                     </div>
//                   )}
//                 </div>
//                 {/* <div className="car-listing-fav">
//                   <FaRegHeart />
//                 </div> */}
//                 <button
//                   className="car-listing-fav"
//                   style={{
//                     backgroundColor: "#ffffff",
//                     color: "#008ad5",
//                     border: "none",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => Addfavcarapi(car.id)}
//                 >
//                   <FaRegHeart />
//                 </button>
//               </div>
//               <div className="car-listing-content">
//                 <div className="d-flex">
//                   <div className="car-listing-title">
//                     {car.ad_title || "No Title Available"}
//                   </div>
//                   <div className="car-listing-price">{"$" + car.price}</div>
//                 </div>
//                 <div className="car-listing-engine">
//                   {car.no_of_cylinders +
//                     "Cyl " +
//                     car.engine_cc +
//                     " " +
//                     car.fuel_type}
//                 </div>
//                 <div className="car-listing-details row">
//                   <div className="col-5">
//                     <span>
//                       <TbManualGearbox /> {car.transmission_type}
//                     </span>
//                   </div>
//                   <div className="col-3">
//                     <span>
//                       <FaGlobe /> {car.consumption}
//                     </span>
//                   </div>
//                   <div className="col-4">
//                     <span>
//                       <FaMapMarkerAlt /> {car.kilometers}
//                     </span>
//                   </div>
//                   <div className="car-listing-location">{car.location}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// -- New Code --

const CarListing = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Read cars from previous page if available
  const passedCars = location.state?.cars || [];

  const [carsData, setCarsData] = useState(passedCars);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // If no passed data, fetch all cars
    if (passedCars.length === 0) {
      fetchAllCars();
    }
  }, []);

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

  const fetchAllCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getAllCars({});
      const newCars = handleApiResponse(response);
      setCarsData(newCars?.data?.cars || []);
      message.success(newCars.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load car data");
      setCarsData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-listing-container">
      <div className="car-listing-header">
        <span>Showing 1 - {carsData.length} Cars</span>
        <a
          href="#"
          className="allcars-sortingtitle"
          style={{ color: "#000000", fontSize: "16px", fontWeight: "700" }}
        >
          Sort : Newest Listing
        </a>
      </div>
      <div className="row">
        {carsData.map((car) => (
          <div className="col-3 p-0" key={car.id || `${car.ad_title}-${car.price}`}>
            <div
              className="allcars-listing-card"
              onClick={() => navigate(`/carDetails/${car.id}`)}
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
    </div>
  );
};


export default Allcars;
