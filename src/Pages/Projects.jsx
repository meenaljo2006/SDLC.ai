import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, 
  Trash2, 
  Search, 
  Plus,
  CheckCircle2,
  Cpu,
  Box, // <--- Imported to match Dashboard style
  X
} from 'lucide-react';
import { useProject } from '../Context/ProjectContext';
import CreateProjectModal from '../Components/CreateProjectModal';
import DeleteProjectModal from '../Components/DeleteProjectModal';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, activityFeed, removeProject, selectedProject } = useProject();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, project: null });
  const [searchTerm, setSearchTerm] = useState('');

  const getProjectStats = (project) => {
    const projectActivities = activityFeed.filter(a => a.project_id === project.id);
    const uniqueTools = new Set(projectActivities.map(a => a.tool_id)).size;
    let lastActive = new Date(project.created_at);
    let label = "Created";
    if (projectActivities.length > 0) {
      const lastActivityTime = new Date(projectActivities[0].created_at);
      if (lastActivityTime > lastActive) {
        lastActive = lastActivityTime;
        label = "Updated";
      }
    }
    return { uniqueTools, lastActive, label };
  };

  const handleClickDelete = (e, project) => {
    e.stopPropagation();
    setDeleteModal({ open: true, project: project });
  };

  const handleConfirmDelete = async (id) => {
    await removeProject(id);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-page no-scrollbar">
      
      {/* Header */}
      <div className="projects-header">
        <div className="header-title-block">
          <h1 className="gradient-title">Your Projects</h1>
          <p className="header-subtitle">Manage and monitor your SDLC workspaces.</p>
        </div>
        <div className="header-actions">
          <div className="search-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {/* Clear Search Button */}
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="search-clear-btn">
                <X size={14} />
              </button>
            )}
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-new-project">
            <Plus size={18} /> <span>New Project</span>
          </button>
        </div>
      </div>

      {/* === CONTENT AREA === */}
      <div className="projects-list-stack">
        
        {/* CASE 1: PROJECTS EXIST */}
        <AnimatePresence>
          {filteredProjects.map((project, index) => {
            const stats = getProjectStats(project);
            const isSelected = selectedProject?.id === project.id;
            const hasUsage = stats.uniqueTools > 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/projects/${project.id}`)}
                className={`project-row-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="card-left-icon">
                  <div className={`icon-box ${isSelected ? 'active-icon' : ''}`}>
                    <FolderGit2 size={24} />
                  </div>
                </div>

                <div className="card-middle-info">
                  <div className="info-heading-row">
                    <h3 className="project-title">{project.name}</h3>
                    {isSelected && (
                      <span className="active-badge">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    )}
                  </div>
                  <p className="project-desc">
                    {project.description || "No description provided."}
                  </p>
                  <p className="project-date">
                    {stats.label} {stats.lastActive.toLocaleString()}
                  </p>
                </div>

                <div className="card-right-actions">
                  <div className={`stat-usage-badge ${hasUsage ? 'active' : ''}`}>
                    <Cpu size={16} className={hasUsage ? "text-purple-400" : "text-slate-500"} />
                    <span>{stats.uniqueTools}/9 Tools</span>
                  </div>

                  <button 
                    onClick={(e) => handleClickDelete(e, project)}
                    className="action-btn delete"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* CASE 2: NO PROJECTS AT ALL (Dashboard Style) */}
        {projects.length === 0 && (
          <div className="empty-state-dashboard">
             <div className="empty-icon-box-dash">
               <Box size={32} />
             </div>
             <h4>No Projects Yet</h4>
             <p>Start by creating your first workspace.</p>
             <button onClick={() => setShowCreateModal(true)} className="btn-create-primary-dash">
               <Plus size={16} /> Create Project
             </button>
          </div>
        )}

        {/* CASE 3: PROJECTS EXIST BUT SEARCH NOT FOUND */}
        {projects.length > 0 && filteredProjects.length === 0 && (
          <div className="empty-state-dashboard">
             <div className="empty-icon-box-dash">
               <Search size={32} />
             </div>
             <h4>No Results Found</h4>
             <p>We couldn't find any project matching "{searchTerm}"</p>
             <button onClick={() => setSearchTerm('')} className="btn-clear-search">
               Clear Search
             </button>
          </div>
        )}

      </div>

      {/* MODALS */}
      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}

      {deleteModal.open && (
        <DeleteProjectModal 
          project={deleteModal.project}
          onClose={() => setDeleteModal({ open: false, project: null })}
          onConfirm={handleConfirmDelete}
        />
      )}

    </div>
  );
};

export default Projects;