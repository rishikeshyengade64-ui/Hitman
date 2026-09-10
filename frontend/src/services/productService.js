import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.FEATURED);
    return response.data;
  },

  getNewArrivals: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS);
    return response.data;
  },
};
