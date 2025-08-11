import React, { useState, useRef, useEffect } from "react";
import { carAPI } from "../services/api";
import { handleApiResponse, handleApiError } from "../utils/apiUtils";
import { message } from "antd";

const fetchMakeCars = async ({ setLoading, setCarMakes }) => {
  try {
    setLoading(true);
    const response = await carAPI.getMakeCars({});
    const data1 = handleApiResponse(response);
   
    if (data1) {
      setCarMakes(data1?.data);
    }

    message.success(data1.message || "Fetched successfully");
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || "Failed to Make car data");
    setCarMakes([]);
  } finally {
    setLoading(false);
  }
};

const fetchModelCars = async ({ setLoading, setCarModels, make }) => {
 
  try {
    setLoading(true);
    const response = await carAPI.getModelCars(make);
    const data1 = handleApiResponse(response);
   
    if (data1) {
      setCarModels(data1?.data);
    }

    message.success(data1.message || "Fetched successfully");
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || "Failed to Make car data");
    setCarModels([]);
  } finally {
    setLoading(false);
  }
};

export { fetchMakeCars, fetchModelCars };
