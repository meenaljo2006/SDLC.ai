import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import Features from './Pages/Features';
import Workflow from './Pages/Workflow'; // Adjusted based on previous component creation
import Login from './Pages/Login';
import Register from './Pages/Register';
import AuthLayout from './Layout/AuthLayout';
import MainLayout from './Layout/MainLayout';
import './App.css';
import './index.css';

const App = () => {
  return (
    <div className="body-wrapper">
      <div className="ambient-glow" />
      
      <Routes>
        {/* GROUP 1: Main Pages (Navbar + Container applied here) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/workflow" element={<Workflow />} />
        </Route>

        {/* GROUP 2: Login/Register (Completely separate, uses AuthLayout) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;