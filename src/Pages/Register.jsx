import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for form data (Name removed, only Email & Password)
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation Helper Function
  const validateForm = () => {
    // 1. Check Empty Fields
    if (!formData.email || !formData.password) {
      setError("Email and Password are required.");
      return false;
    }

    // 2. Check Email Format using Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // 3. Check Password Strength (Min 6 chars)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Step 1: Run Validation
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // Step 2: Call API via Proxy
      const response = await fetch('https://sdlc.testproject.live/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "New User", 
          email: formData.email,
          password: formData.password
        }),
      });

      // Step 3: Parse Response
      const data = await response.json();

      if (!response.ok) {
        // Server returned an error (e.g., 400 Bad Request, 409 Conflict)
        // Use the message from the server if available
        throw new Error(data.message || data.error || 'Registration failed. Please try again.');
      }

      // Step 4: Success
      console.log("Registration Successful:", data);
      
      // Optional: If API returns a token, save it here
      localStorage.setItem('token', data.token);
      localStorage.setItem("email", formData.email);


      // Navigate to Dashboard (Home) directly
      navigate('/dashboard'); 

    } catch (err) {
      console.error("Registration Error:", err);
      // Set the specific error message from backend to display to user
      setError(err.message || "Something went wrong. Check your connection.");
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
        <h1>Create Account</h1>
        <p>Join the future of intelligent software development.</p>
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
          <label className="form-label">Work Email</label>
          <div className="form-input-wrapper">
            <Mail size={18} className="form-icon" />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com" 
              className="form-input" 
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
              placeholder="Min 6 characters" 
              className="form-input" 
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader2 size={18} className="spin" /> Creating Account...
            </span>
          ) : (
            "Get Started"
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>
    </motion.div>
  );
};

export default Register;