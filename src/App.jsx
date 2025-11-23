import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Features from './pages/Features';
import './App.css';
import Workflow from './Pages/Workflow';

const App = () => {
  return (
    <div className="body-wrapper">
      <div className="ambient-glow" />
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/workflow" element={<Workflow />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
