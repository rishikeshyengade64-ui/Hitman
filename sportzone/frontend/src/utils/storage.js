const TOKEN_KEY = 'sportzone_jwt_token';
const USER_KEY = 'sportzone_user_data';
const CART_KEY = 'sportzone_cart_items';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCart: () => {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setCart: (items) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Could not save cart to localStorage:', err);
    }
  },
  clearCart: () => {
    localStorage.removeItem(CART_KEY);
  },

  getLastOrder: () => {
    try {
      const data = localStorage.getItem('sportzone_last_order');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setLastOrder: (order) => {
    try {
      localStorage.setItem('sportzone_last_order', JSON.stringify(order));
    } catch (err) {
      console.warn('Could not save last order:', err);
    }
  },
};
