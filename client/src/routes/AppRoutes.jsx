import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import CategoryPage from '../pages/CategoryPage';
import Product from '../pages/Product';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';
import Cart from '../pages/Cart';
import Order from '../pages/Order';
import Contact from '../pages/Contact';
import ProtectedRoute from './ProtectRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
      </Route>


      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/orders" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;


