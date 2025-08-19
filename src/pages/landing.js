/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import { useEffect, useState } from 'react';
import CarTypeList from '../components/cartypelist';
import LandingFilters from '../components/LandingFilters';
import CarListing from '../components/carListing';
import DownloadApp from '../components/downloadApp';
import SellYourCar from '../components/sellYourCar';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';
import SavedSearches from '../components/userSavedsearch';

const Landing = () => {
  const [setLoading] = useState(false);
  const [carsData, setCarsData] = useState([]);
  const [carsRecomData, setCarsRecomData] = useState([]);
  const [searchbodytype, setSearchBodyType] = useState();

  useEffect(() => {
    fetchFeaturedCars();
    fetchRecommendedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getCarFeatures({});
      const data1 = handleApiResponse(response);

      if (data1) {
        setCarsData(data1?.data?.cars);
      }

      message.success(data1.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to load car data');
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
      if (data1) {
        setCarsRecomData(data1?.data.cars);
      }

      message.success(data1.message || 'Fetched successfully');
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || 'Failed to load car data');
      setCarsRecomData([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container py-4">
        <LandingFilters searchbodytype={searchbodytype} />
        <CarTypeList setSearchBodyType={setSearchBodyType} />
        <SavedSearches title={'Your Saved Searches'} />
        <CarListing title={'Featured Car'} cardata={carsData} />
      </div>

      <DownloadApp />

      <div className="container">
        <div className="my-5"></div>
        <CarListing title={'Recommended Cars'} cardata={carsRecomData} />
      </div>

      <SellYourCar />
    </>
  );
};

export default Landing;
