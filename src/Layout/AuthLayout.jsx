import React from 'react';
import { Outlet } from 'react-router-dom'; // Placeholder for Login/Register content
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Activity } from 'lucide-react';
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      {/* LEFT SIDE: ANIMATION */}
      <div className="auth-left">
        <div className="auth-grid-bg" />
        
        {/* Central Scanner Animation */}
        <div className="scanner-core">
          <motion.div 
            className="scanner-ring"
            style={{ width: 300, height: 300, borderStyle: 'dashed' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="scanner-ring"
            style={{ width: 220, height: 220, borderColor: '#22d3ee', borderWidth: '2px' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="scanner-ring"
            style={{ width: 140, height: 140, borderStyle: 'dotted' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <ShieldCheck size={64} color="#22d3ee" />
          </motion.div>
        </div>

        {/* Floating Code Particles */}
        <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }} 
            transition={{ duration: 4, repeat: Infinity }}
            style={{ position: 'absolute', top: '20%', left: '20%' }}
        >
            <Lock size={24} color="#a78bfa" />
        </motion.div>
        <motion.div 
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }} 
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            style={{ position: 'absolute', bottom: '25%', right: '20%' }}
        >
            <Activity size={24} color="#34d399" />
        </motion.div>

        <div className="auth-caption">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Secure Access
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Authenticate to enter the Intelligent SDLC Environment.
          </motion.p>
        </div>
      </div>

      {/* RIGHT SIDE: FORM OUTLET */}
      <div className="auth-right">
        {/* The Login or Register component will render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;