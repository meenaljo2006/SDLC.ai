import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Terminal,
  Cpu,
  ChevronRightCircle,
  Bot,Loader2,FileInput, FileOutput
} from 'lucide-react';
import { useProject } from '../Context/ProjectContext';
import './ProjectDetails.css';

import ArchGenView from '../Components/LogViews/ArchGenView';
import DesignReviewView from '../Components/LogViews/DesignReviewView';
import CodeGenView from '../Components/LogViews/CodeGenView';
import ComplianceAuditorView from '../Components/LogViews/ComplianceAuditorView';
import RiskView from '../Components/LogViews/RiskView';
import TradeOffView from '../Components/LogViews/TradeOffView';
import SmartDebuggerView from '../Components/LogViews/SmartDebuggerView';
import TestCaseBuilderView from '../Components/LogViews/TestCaseBuilderView';
import TechStackView from '../Components/LogViews/TechStackView';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, activityFeed } = useProject();
  
  const [project, setProject] = useState(null);
  const [logs, setLogs] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);

  useEffect(() => {
    if (projects.length > 0) {
      const found = projects.find(p => p.id === parseInt(id));
      if (found) setProject(found);
      
      const projectLogs = activityFeed.filter(log => log.project_id === parseInt(id));
      setLogs(projectLogs);
    }
  }, [id, projects, activityFeed]);

  const toggleExpand = (logId) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  if (!project) {
    return (
      <div className="project-loading-state">
        <Loader2 size={48} className="spinner-icon" />
      </div>
    );
  }

  const renderOutputContent = (log) => {
    // 1. If tool is Architecture Generator, show the fancy view
    if (log.tool_id === 'arch-gen') {
      return <ArchGenView data={log.output} />;
    } else if (log.tool_id === 'review') {
      return <DesignReviewView data={log.output} />;
    } else if(log.tool_id ==='codegen'){
      return <CodeGenView data={log.output} />;
    } else if(log.tool_id === 'compliance'){
      return <ComplianceAuditorView data={log.output} />;
    } else if (log.tool_id==='risk'){
      return <RiskView data={log.output} />;
    } else if (log.tool_id ==='trade-off'){
      return <TradeOffView data={log.output} />;
    } else if(log.tool_id ==='debug'){
      return <SmartDebuggerView data={log.output} />;
    } else if(log.tool_id === 'test-gen'){
      return <TestCaseBuilderView data={log.output} />;
    } else if (log.tool_id==='stack-selector'){
      return <TechStackView data={log.output} />;
    }
    
    // 2. Fallback for others (Risk, CodeGen) - JSON Dump for now
    return (
      <pre className="code-box">
        {JSON.stringify(log.output, null, 2)}
      </pre>
    );
  };

  return (
    <div className="project-details-page no-scrollbar">
      
      {/* === HEADER CONTAINER === */}
      <div className="details-header-container">
        
        {/* LEFT SIDE: Icon + Info (Name, Date, Desc) */}
        <div className="header-left">
          <div className="header-icon-large">
             <Layers size={32} />
          </div>
          
          <div className="header-info">
            <h1 className="details-title">{project.name}</h1>
            
            <div className="details-meta">
              <span className="meta-pill">
                <Calendar size={12} /> Created: {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Back Button */}
        <div className="header-right">
          <button onClick={() => navigate('/projects')} className="back-btn">
            Back to Projects <ChevronRightCircle size={18} /> 
          </button>
        </div>

      </div>

      {project.description && 
       project.description.trim() !== "" && 
       project.description !== "No description provided" && (
        <div className="description-box">
          <p>{project.description}</p>
        </div>
      )}

      <hr className="details-divider" />

      {/* API Runs Section */}
      <h3 className="section-projecttitle">
         <Bot size={22} /> Activity Log & API Runs 
      </h3>

      <div className="logs-container">
        {logs.length === 0 ? (
          <div className="empty-logs">
             <p>No tools have been run in this project yet.</p>
             <small>Select this project in the dashboard and run a tool to see logs here.</small>
          </div>
        ) : (
          logs.map((log, index) => (
            <motion.div 
              key={log.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="log-card"
            >
              <div 
                className="log-header" 
                onClick={() => toggleExpand(log.id)}
              >
                <div className="log-summary">
                  <div className="log-icon">
                    <Cpu size={16} />
                  </div>
                  <div className="log-title-block">
                    <span className="log-tool-name">{log.tool}</span>
                    <span className="log-time">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="log-chevron">
                   {expandedLogId === log.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              <AnimatePresence>
                {expandedLogId === log.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="log-content-split"  /* 👈 Uses the new CSS Grid */
                  >
                    
                    {/* LEFT SIDE: INPUT */}
                    <div className="log-panel log-panel-left">
                      <span className="panel-label">
                        <FileInput size={14}/> Input Parameters
                      </span>
                      {/* Reuse your existing code-box style */}
                      <div className="code-box">
                        {log.input || "No input recorded."}
                      </div>
                    </div>

                    {/* RIGHT SIDE: OUTPUT */}
                    <div className="log-panel log-panel-right">
                      <span className="panel-label">
                        <FileOutput size={14}/> AI Result
                      </span>
                      {/* 👈 Calls the helper to render ArchGenView */}
                      <div className="mt-2">
                        {renderOutputContent(log)}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;