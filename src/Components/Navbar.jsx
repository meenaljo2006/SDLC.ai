import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }} // Step 1: Navbar drops in immediately
      className="navbar"
    >
      <div className="navbar-glass">
        <Link to="/" className="logo">
          <div className="logo-icon" />
          <span>SDLC<span style={{ color: '#22d3ee' }}>.ai</span></span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/')}`}>Home</Link>
          <Link to="/features" className={`nav-item ${isActive('/features')}`}>Features</Link>
          <Link to="/workflow" className={`nav-item ${isActive('/workflow')}`}>Workflow</Link>
        </div>

        <button className="cta-button">Login</button>
      </div>
    </motion.nav>
  );
};

export default Navbar;