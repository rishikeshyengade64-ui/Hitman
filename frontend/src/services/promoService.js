import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const promoService = {
  validatePromo: async (code, orderAmount = 0) => {
    const response = await apiClient.post(API_ENDPOINTS.PROMOS.VALIDATE, {
      code,
      orderAmount,
    });
    return response.data;
  },
};
