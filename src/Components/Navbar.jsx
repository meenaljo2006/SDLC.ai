import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react'; // 👈 Import the Icon
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="navbar"
    >
      <div className="navbar-glass">
        <Link to="/" className="logo">
          {/* 👇 Updated Logo Box */}
          <div className="nav-logo-box">
            <Code2 size={18} color="#fff" />
          </div>
          <span className="logo-text">
            SDLC<span style={{ color: '#22d3ee' }}>.ai</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/')}`}>Home</Link>
          <Link to="/features" className={`nav-item ${isActive('/features')}`}>Features</Link>
          <Link to="/workflow" className={`nav-item ${isActive('/workflow')}`}>Workflow</Link>
        </div>

        <button className="cta-button" onClick={() => navigate("/login")}>Login</button>
      </div>
    </motion.nav>
  );
};

export default Navbar;