import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.MY_ORDERS);
    return response.data;
  },

  getOrderByNumber: async (orderNumber) => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(orderNumber));
    return response.data;
  },
};
