/**
 * @file fetchMakeCars.js
 * @description Common function for fetching car make data from API.
 * @version 1.0.0
 * @date 2025-08-19
 * @author Palni
 *
 * Copyright (c) 2025 Palni.
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium is strictly prohibited unless explicitly authorized.
 */

/**
 * Copyright (c) 2025 Palni
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 * Unauthorized copying or distribution of this file,
 * via any medium is strictly prohibited.
 */

import React from 'react';
import { carAPI } from '../services/api';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';
import { message } from 'antd';

const fetchMakeCars = async ({ setLoading, setCarMakes }) => {
  try {
    setLoading(true);
    const response = await carAPI.getMakeCars({});
    const data1 = handleApiResponse(response);

    if (data1) {
      setCarMakes(data1?.data);
    }

    message.success(data1.message || 'Fetched successfully');
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to Make car data');
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

    message.success(data1.message || 'Fetched successfully');
  } catch (error) {
    const errorData = handleApiError(error);
    message.error(errorData.message || 'Failed to Make car data');
    setCarModels([]);
  } finally {
    setLoading(false);
  }
};

export { fetchMakeCars, fetchModelCars };
