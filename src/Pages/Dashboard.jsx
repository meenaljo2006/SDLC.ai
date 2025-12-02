import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, Settings, Play, Plus } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import DashboardHeader from '../Components/DashboardHeader';
import './Dashboard.css';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const handleNavigate = (view) => {
    setActiveView(view);
  };

  return (
    <div className="dashboard-container">
      
      {/* 1. Top Fixed Header */}
      <DashboardHeader />

      {/* Wrapper for Sidebar + Content (Below Header) */}
      <div className="dashboard-body">
        
        {/* 2. Sidebar (Left Fixed, below header) */}
        <Sidebar activeView={activeView} onNavigate={handleNavigate} />

        {/* 3. Main Content (Right) */}
        <main className="dashboard-content">
          
         
        </main>
      </div>
    </div>
  );
};

export default Dashboard;