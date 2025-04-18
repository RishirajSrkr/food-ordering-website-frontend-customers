import React from 'react'
import { Routes, Route } from 'react-router'
import Home from '../pages/Home'
import ExploreFood from '../pages/ExploreFood'
import ContactPage from '../pages/ContactPage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AllFoodsOfCategory from '../pages/AllFoodsOfCategory'
import FoodDetails from '../pages/FoodDetails'
import Cart from '../pages/Cart'
import PlaceOrder from '../pages/PlaceOrder'
import MyOrders from '../pages/MyOrders'
import ProtectedRoute from '../components/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/explore' element={<ExploreFood />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<PlaceOrder />} />
        <Route path='/my-orders' element={<MyOrders />} />

      </Route>

      <Route path='/food/:foodId' element={<FoodDetails />} />
      <Route path='/category/:categoryName' element={<AllFoodsOfCategory />} />
    </Routes>
  )
}

export default AppRoutes