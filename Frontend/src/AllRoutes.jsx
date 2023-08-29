import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import Signup from "./pages/Register";
import Login from "./pages/Login";
import {PlaceOrder, ProductList }from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import UserProfile from "./pages/UserProfile";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";


const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/allproducts" element={<ProductList />}></Route>
        <Route path="/addproduct" element={<ProductForm />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/product/:id" element={<ProductDetail/>}></Route>
        <Route path="/admin" element={<Admin/>}></Route>
      </Routes>
    </div>
  );
};

export default AllRoutes;
