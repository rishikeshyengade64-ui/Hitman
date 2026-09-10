import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  addToCart: async (productId, variantId = null, quantity = 1) => {
    const response = await apiClient.post(API_ENDPOINTS.CART.ADD, {
      productId,
      variantId,
      quantity,
    });
    return response.data;
  },

  updateQuantity: async (itemId, quantity) => {
    const response = await apiClient.put(API_ENDPOINTS.CART.UPDATE(itemId), {
      quantity,
    });
    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await apiClient.delete(API_ENDPOINTS.CART.REMOVE(itemId));
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
    return response.data;
  },
};
