import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from '../Components/Sidebar'; // Check your import paths
import DashboardHeader from '../Components/DashboardHeader';
import './DashboardLayout.css'; 

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
           {/* This renders Overview when at /dashboard */}
           {/* This renders Projects when at /projects */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;