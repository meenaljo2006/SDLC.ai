import {useEffect} from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Features from './Pages/Features';
import Workflow from './Pages/Workflow'; 
import Login from './Pages/Login';
import Register from './Pages/Register';
import AuthLayout from './Layout/AuthLayout';
import MainLayout from './Layout/MainLayout';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Pages/Dashboard';
 

import './App.css';
import './index.css';


const App = () => {

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("User is logged in ");
    } else {
      console.log("User is NOT logged in ");
    }
  });

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

        <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;