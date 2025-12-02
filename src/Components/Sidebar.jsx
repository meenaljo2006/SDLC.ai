import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Settings, LogOut, ChevronLeft, ChevronRight, 
  Code2, ShieldCheck, Zap, Bug, Lightbulb, Scale, Layers, ClipboardCheck, 
  ShieldAlert, FileBadge, Beaker, Code
} from 'lucide-react';
import './Sidebar.css';

// 1. Define the Data
export const AI_TOOLS = [
  {
    category: "Architecture",
    tools: [
      { id: "api-04", name: "Architecture Generator", path: "/tools/design", icon: "Lightbulb", desc: "Generate patterns from requirements" },
      { id: "api-01", name: "Trade-off Analyzer", path: "/tools/tradeoff", icon: "Scale", desc: "Compare technical solutions" },
      { id: "api-05", name: "Stack Selector", path: "/tools/tech-stack", icon: "Layers", desc: "Pick the right database & framework" },
      { id: "api-02", name: "Design Reviewer", path: "/tools/review", icon: "ClipboardCheck", desc: "Automated design auditing" }
    ]
  },
  {
    category: "Security & Quality",
    tools: [
      { id: "api-03", name: "Risk Scanner", path: "/tools/risk", icon: "ShieldAlert", desc: "Instant vulnerability detection" },
      { id: "api-07", name: "Compliance Auditor", path: "/tools/compliance", icon: "FileBadge", desc: "Check code against standards" }
    ]
  },
  {
    category: "Development",
    tools: [
      { id: "api-06", name: "Test Case Builder", path: "/tools/test-gen", icon: "Beaker", desc: "Create BDD & Unit tests" },
      { id: "api-08", name: "Boilerplate Assistant", path: "/tools/codegen", icon: "Code", desc: "Generate scaffold code instantly" },
      { id: "api-09", name: "Smart Debugger", path: "/tools/debug", icon: "Bug", desc: "Analyze stack traces & fix errors" }
    ]
  }
];

// 2. Map String names to actual Icon Components
const iconMap = {
  Lightbulb, Scale, Layers, ClipboardCheck,
  ShieldAlert, FileBadge,
  Beaker, Code, Bug,
  // Default fallback
  default: Zap
};

const Sidebar = ({ activeView, onNavigate }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const userEmail = localStorage.getItem('email') || "User";
  const emailInitial = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); 
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      
      <nav className="sidebar-nav">
        
        {/* MAIN MENU */}
        <div className="menu-label">MENU</div>
        
        <button onClick={() => onNavigate('dashboard')} className={`nav-button ${activeView === 'dashboard' ? 'active' : ''}`} title="Dashboard">
          <LayoutDashboard size={20} className="nav-icon" />
          {!isCollapsed && <span className="nav-text">Dashboard</span>}
        </button>

        <button onClick={() => onNavigate('projects')} className={`nav-button ${activeView === 'projects' ? 'active' : ''}`} title="Projects">
          <FileText size={20} className="nav-icon" />
          {!isCollapsed && <span className="nav-text">Projects</span>}
        </button>

        {/* AI SUITE - Dynamically Rendered from JSON */}
        <div className="api-label" style={{marginTop: '1.5rem'}}>AI SUITE</div>

        {AI_TOOLS.map((group) => (
          <React.Fragment key={group.category}>
            {/* Optional: Show Category Label if needed, or just list tools flat */}
            {/* {!isCollapsed && <div className="sub-menu-label">{group.category}</div>} */}
            
            {group.tools.map((tool) => {
              const IconComponent = iconMap[tool.icon] || iconMap.default;
              
              return (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(tool.path)} // Use tool path as view identifier
                  className={`nav-button ${activeView === tool.path ? 'active' : ''}`}
                  title={isCollapsed ? tool.name : ""}
                >
                  <IconComponent size={20} className="nav-icon" />
                  {!isCollapsed && <span className="nav-text">{tool.name}</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}

        {/* LOGOUT */}
        <button onClick={handleLogout} className="nav-button logout-btn" style={{marginTop: 'auto'}}>
            <LogOut size={20} className="nav-icon" />
            {!isCollapsed && <span className="nav-text">Logout</span>}
        </button>
      </nav>

      <button onClick={() => setIsCollapsed(!isCollapsed)} className="sidebar-toggle">
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

    </div>
  );
};

export default Sidebar;