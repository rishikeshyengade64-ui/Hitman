import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const categoryService = {
  getAllCategories: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
    return response.data;
  },

  getCategoryBySlug: async (slug) => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.DETAIL(slug));
    return response.data;
  },
};
