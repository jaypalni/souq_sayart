import { useEffect, useState } from "react";
import CarTypeList from "../components/cartypelist";
import SavedSearches from "../components/savedSearches";
import LandingFilters from "../components/LandingFilters";
import CarListing from "../components/carListing";
import DownloadApp from "../components/downloadApp";
import SellYourCar from "../components/sellYourCar";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";

const Landing = () => {
  const [loading, setLoading] = useState(false);
  const [carsData, setCarsData] = useState([]);
  const [carsRecomData, setCarsRecomData] = useState([]);
  useEffect(() => {
    fetchFeaturedCars();
    fetchRecommendedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getCarFeatures({});
      const data1 = handleApiResponse(response);
      console.log("API Response123:", data1?.data?.cars);
      if (data1) {
        setCarsData(data1?.data?.cars);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load car data");
      setCarsData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getCarRecommended({});
      const data1 = handleApiResponse(response);
      console.log("API Response Recommended Cars:", data1?.data);
      if (data1) {
        setCarsRecomData(data1?.data);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load car data");
      setCarsRecomData([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container py-4">
        <LandingFilters />
        <CarTypeList />
        <CarListing title={"Featured Car"} cardata={carsData} />
      </div>

      <DownloadApp />

      <div className="container">
        <div className="my-5"></div>
        <CarListing title={"Recommended Cars"} cardata={carsRecomData} />
      </div>

      <SellYourCar />
    </>
  );
  
};

export default Landing;
