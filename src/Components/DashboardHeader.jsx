import React from 'react';
import { Code2 } from 'lucide-react';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const userEmail = localStorage.getItem('email') || "User";
  const name = userEmail.split('@')[0]; 
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="dash-top-header">
      {/* Left: Logo */}
      <div className="header-left">
        <div className="logo-box">
           <Code2 size={20} color="#fff" />
        </div>
        <span className="logo-text">SDLC<span style={{color:'#22d3ee'}}>.ai</span></span>
      </div>

      {/* Right: User Pill */}
      <div className="header-right">
        <div className="user-pill">
          <div className="user-avatar">{initial}</div>
          <span className="user-name">Hi, {name}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;