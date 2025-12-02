import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Safe Response Handling: Check content-type before parsing JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
         data = await response.json();
      } else {
         // If server returns text/html (like a 500 error page), read as text to avoid crash
         const text = await response.text();
         console.warn("Non-JSON Response:", text);
         
         if (!response.ok) {
             throw new Error(response.status === 500 
                 ? "Server Error (500). Please try again later." 
                 : `Server Error: ${response.status}`);
         }
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Login failed. Please check your credentials.');
      }

      // Success
      console.log("Login Successful:", data);
      
      // Optional: Save token if API sends one
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('email', formData.email);


      navigate('/dashboard'); // Redirect to Dashboard

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="auth-card" 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Enter your credentials to access your dashboard.</p>
      </div>

      {/* Error Message Banner */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#ef4444', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px'
          }}
        >
          <AlertCircle size={18} style={{flexShrink: 0}} />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="form-input-wrapper">
            <Mail size={18} className="form-icon" />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com" 
              className="form-input" 
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="form-input-wrapper">
            <Lock size={18} className="form-icon" />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              className="form-input" 
              required
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader2 size={18} className="spin" /> Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
      </div>
    </motion.div>
  );
};

export default Login;