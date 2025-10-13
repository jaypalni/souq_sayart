/*
 * Copyright (c) 2025 Palni. All rights reserved.
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
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
import UserSavedsearch from '../components/userSavedsearch';
import { useLanguage } from '../contexts/LanguageContext';

const Landing = () => {
  const { translate } = useLanguage();
  const [,setLoading] = useState(false);
  const [carsData, setCarsData] = useState([]);
  const [carsRecomData, setCarsRecomData] = useState([]);
  const [searchbodytype, setSearchBodyType] = useState();
  const [savesearchesreload, setSaveSearchesReload] = useState({});

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

      message.success(data1.message || translate('filters.FETCHED_SUCCESSFULLY'));
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || translate('filters.FETCH_FAILED'));
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

      message.success(data1.message || translate('filters.FETCHED_SUCCESSFULLY'));
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || translate('filters.FETCH_FAILED'));
      setCarsRecomData([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container py-4">
        <LandingFilters searchbodytype={searchbodytype} setSaveSearchesReload={setSaveSearchesReload} />
        <CarTypeList setSearchBodyType={setSearchBodyType} setSaveSearchesReload={setSaveSearchesReload} />
        <UserSavedsearch title={translate('landing.YOUR_SAVED_SEARCHES')} savesearchesreload={savesearchesreload} />
        <CarListing title={translate('landing.FEATURED_CAR')} cardata={carsData} />
      </div>

      <DownloadApp />

      <div className="container">
        <div className="my-5"></div>
        <CarListing title={translate('landing.RECOMMENDED_CARS')} cardata={carsRecomData} />
      </div>

      <SellYourCar />
    </>
  );
};

export default Landing;