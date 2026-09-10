// Resolve and normalize dynamic API base URL for Render cloud deployment and local development
const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    return '/api';
  }
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

export const API_BASE_URL = resolveApiBaseUrl();

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    BY_SLUG: (slug) => `/products/slug/${slug}`,
    FEATURED: '/products/featured',
    NEW_ARRIVALS: '/products/new-arrivals',
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (slug) => `/categories/${slug}`,
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (id) => `/cart/items/${id}`,
    REMOVE: (id) => `/cart/items/${id}`,
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    CREATE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    DETAIL: (orderNumber) => `/orders/${orderNumber}`,
  },
  PROMOS: {
    VALIDATE: '/promos/validate',
  },
};
