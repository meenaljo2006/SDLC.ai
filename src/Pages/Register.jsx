import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';

const Register = () => {
  return (
    <motion.div className="auth-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Join the future of intelligent software development.</p>
      </div>
      <form>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="form-input-wrapper">
            <User size={18} className="form-icon" />
            <input type="text" placeholder="Enter your Name" className="form-input" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="form-input-wrapper">
            <Mail size={18} className="form-icon" />
            <input type="email" placeholder="name@domain.com" className="form-input" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="form-input-wrapper">
            <Lock size={18} className="form-icon" />
            <input type="password" placeholder="Create a strong password" className="form-input" />
          </div>
        </div>
        <button type="button" className="auth-btn">Get Started</button>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>
    </motion.div>
  );
};

export default Register;