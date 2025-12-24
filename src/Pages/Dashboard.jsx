import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Play,
  Bug,
  FolderGit2,
  Box,
  Activity,
  ShieldAlert,
  Layers,
  Lightbulb,
  Scale,
  ClipboardCheck,
  FileBadge,
  Beaker,
  Code
} from 'lucide-react';
import './Dashboard.css';
import CreateProjectModal from '../Components/CreateProjectModal';
import { useProject } from '../Context/ProjectContext';

const QUICK_TOOLS = [
  { id: 'new-project', label: 'New Project', icon: Plus, color: '#3b82f6' },
  { id: 'arch-gen', label: 'Architecture Gen', icon: Lightbulb, path: '/tools/design', color: '#eecc2293' },
  { id: 'risk-analysis', label: 'Run Risk Analysis', icon: Play, path: '/tools/risk', color: '#10b981' },
  { id: 'debug-code', label: 'Debug Code', icon: Bug, path: '/tools/debug', color: '#d946ef' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, activityFeed } = useProject(); 
  const [showCreateModal, setShowCreateModal] = useState(false);

  const email = localStorage.getItem('email') || "User";
  const rawName = email.split('@')[0];
  const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const name = formattedName;

  // --- HELPER: Get True "Last Updated" Time ---
  const getLastActivityInfo = (project) => {
    // 1. Get logs specific to this project
    const projectLogs = activityFeed.filter(a => a.project_id === project.id);
    
    // 2. Start with the project creation time
    let lastTime = new Date(project.created_at);
    let label = "Created";

    // 3. Check if there are any recent tool runs (Logs)
    if (projectLogs.length > 0) {
      const lastLogTime = new Date(projectLogs[0].created_at);
      if (lastLogTime > lastTime) {
        lastTime = lastLogTime;
        label = "Updated";
      }
    }

    // 4. Also check explicit project updates
    if (project.updated_at) {
      const serverUpdate = new Date(project.updated_at);
      if (serverUpdate > lastTime) {
        lastTime = serverUpdate;
        label = "Updated";
      }
    }

    return { lastTime, label };
  };

  // --- SORTING: 3 Most Recent Projects ---
  const recentProjects = [...projects]
    .map(p => ({ ...p, ...getLastActivityInfo(p) })) 
    .sort((a, b) => b.lastTime - a.lastTime)         
    .slice(0, 3);

  return (
    <div className="dashboard-content-wrapper">

      {/* HEADER */}
      <header className="dash-header-section">
        <div>
          <h1>
            Welcome Back, <span style={{ color: '#22d3ee' }}>{name}</span> 👋
          </h1>
          <p className="opacity-70">
            Here is your global SDLC status at a glance.
          </p>
        </div>

        <div className="stats-row">
          <div className="stat-pill">
            <span className="stat-val">{projects.length}</span>
            <span className="stat-lbl">Total Projects</span>
          </div>
        </div>
      </header>

      {/* GRID */}
      <div className="dashboard-grid-top">

        {/* RECENT PROJECTS CARD */}
        <section className="dash-card project-card">
          <div className="card-header header-row">
            <h3>Recent Projects</h3>
            {projects.length > 0 && (
              <span onClick={() => navigate('/projects')} className="view-all-link">
                View All
              </span>
            )}
          </div>

          <div className="project-list">
            {recentProjects.length > 0 ? (
              recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="project-item"
                >
                  <div className="project-icon">
                    <FolderGit2 size={22} />
                  </div>

                  <div className="project-info">
                    <h4>{project.name}</h4>
                    <div className="meta-tags">
                      <span className="time-tag">
                        {project.label} {project.lastTime.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* 👇 THIS IS THE BUTTON I FIXED 👇 */}
                  <button 
                    onClick={() => navigate(`/projects/${project.id}`)} 
                    className="btn-view-mini"
                  >
                    Open
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon-box">
                  <Box size={32} />
                </div>
                <h4>No Projects</h4>
                <p>Start by creating your first project.</p>
                <button onClick={() => setShowCreateModal(true)} className="btn-create-primary">
                  <Plus size={16} /> Create
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ACTIVITY FEED CARD */}
        <section className="dash-card analysis-card">
          <div className="card-header">
            <h3 className="flex items-center gap-2">
               Activity Feed
            </h3>
          </div>

          <div className="analysis-list">
            {activityFeed.length > 0 ? (
              activityFeed.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="activity-item"
                  onClick={() => {
                     if (item.project_id) {
                       navigate(`/projects/${item.project_id}`)
                     }
                  }}
                  style={{ cursor: item.project_id ? 'pointer' : 'default' }}
                >
                  <div className="activity-icon">
                    {/* ICON LOGIC */}
                    {item.tool_id === 'arch-gen' ? (
                      <Lightbulb size={18} className="text-blue-400" />
                    ) : item.tool_id === 'trade-off' ? (
                      <Scale size={18} className="text-pink-400" />
                    ) : item.tool_id === 'stack-selector' ? (
                      <Layers size={18} className="text-purple-400" />
                    ) : item.tool_id === 'design-review' ? (
                      <ClipboardCheck size={18} className="text-amber-400" />
                    ) : item.tool_id === 'risk-analysis' ? (
                      <ShieldAlert size={18} className="text-red-400" />
                    ) : item.tool_id === 'compliance' ? (
                      <FileBadge size={18} className="text-cyan-400" />
                    ) : item.tool_id === 'test-case' ? (
                      <Beaker size={18} className="text-teal-400" />
                    ) : item.tool_id === 'codegen' ? (
                      <Code size={18} className="text-indigo-400" />
                    ) : item.tool_id === 'debug-code' ? (
                      <Bug size={18} className="text-rose-400" />
                    ) : (
                      <Activity size={18} className="text-slate-400"/>
                    )}
                  </div>

                  <div className="activity-content">
                    <p className="act-title">
                      {item.tool} <span className="text-slate-500 font-normal">on</span> <strong className="text-white">{item.project_name}</strong>
                    </p>
                    <span className="act-time">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center p-8 text-slate-500">
                <p>No recent activity detected.</p>
                <small>Run tools in your projects to see them here.</small>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* QUICK TOOLS */}
      <section className="quick-start-section">
        <h3>Quick Start Tools</h3>
        <div className="tools-grid">
          {QUICK_TOOLS.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (tool.id === 'new-project') {
                  setShowCreateModal(true);
                } else {
                  navigate(tool.path);
                }
              }}
              className="tool-card"
            >
              <div
                className="tool-icon-wrapper"
                style={{
                  background: tool.color,
                  boxShadow: `0 0 20px ${tool.color}40`
                }}
              >
                <tool.icon size={28} color="#fff" />
              </div>
              <span className="tool-label">{tool.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;