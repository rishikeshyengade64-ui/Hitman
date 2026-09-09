import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

import HomePage from '../pages/Home';
import ProductListingPage from '../pages/ProductListing';
import ProductDetailsPage from '../pages/ProductDetails';
import CartCheckoutPage from '../pages/CartCheckout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import OrderSuccessPage from '../pages/Orders/OrderSuccessPage';
import OrderHistoryPage from '../pages/Orders/OrderHistoryPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Storefront Experience - Gated by Athlete Login */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Navigate to="/checkout" replace />} />
        <Route path="/checkout" element={<CartCheckoutPage />} />
        <Route path="/orders/success/:orderNumber" element={<OrderSuccessPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Route>

      {/* Auth Experience in AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
