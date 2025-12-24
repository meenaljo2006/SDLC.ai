import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { Code2, ChevronDown, Box, Layout } from 'lucide-react';
import { useProject } from '../Context/ProjectContext';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject
  } = useProject();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const email = localStorage.getItem('email') || "User";
  const rawName = email.split('@')[0];
  const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const name = formattedName;
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="dash-top-header">
      <div className="header-left">
        <Link to="/dashboard" className='logo'>
        <div className="logo-box">
          <Code2 size={20} color="#fff" />
        </div>
        <span className="logo-text">
          SDLC<span style={{ color: '#22d3ee' }}>.ai</span>
        </span>
        </Link>

        {/* PROJECT SELECTOR */}
        <div className="project-selector-container">
          <button
            className="project-selector-btn"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            {selectedProject ? (
              <>
                <Box size={16} className="text-blue-400" />
                {selectedProject.name}
              </>
            ) : (
              <>
                <Layout size={16} className="text-slate-400" />
                Sandbox Mode
              </>
            )}
            <ChevronDown size={14} className="opacity-50" />
          </button>

          {isDropdownOpen && (
            <div className="project-dropdown">
              {/* Sandbox */}
              <div
                className="dropdown-item sandbox"
                onClick={() => {
                  setSelectedProject(null);
                  setIsDropdownOpen(false);
                }}
              >
                <Layout size={16} />
                Sandbox (No Save)
              </div>

              <div className="dropdown-divider" />

              {/* Projects */}
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Box size={16} className="text-blue-400" />
                    {project.name}
                  </div>
                ))
              ) : (
                <div className="dropdown-empty">
                  No projects found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
