// src/routes/adminRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import Login from '../pages/Login'
import Products from '../pages/product/Products'
import FormProduct from '../pages/product/FormProduct'
import Categories from '../pages/category/Categories'

import Discounts from '../pages/discount/Discounts'
import Orders from '../pages/order/Orders'

// Auth guard component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token')
  return isAuthenticated ? children : <Navigate to="/login" />
}

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<FormProduct />} />
        <Route path="products/edit/:id" element={<FormProduct />} />
        <Route path="categories" element={<Categories />} />
        <Route path="discounts" element={<Discounts />} />
        <Route path="orders" element={<Orders />} />

      </Route>
    </Routes>
  )
}