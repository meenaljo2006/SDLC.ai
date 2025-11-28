import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  return (
    <motion.div className="auth-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Enter your credentials to access your dashboard.</p>
      </div>
      <form>
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
            <input type="password" placeholder="••••••••" className="form-input" />
          </div>
        </div>
        <button type="button" className="auth-btn">Sign In</button>
      </form>
      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
      </div>
    </motion.div>
  );
};

export default Login;