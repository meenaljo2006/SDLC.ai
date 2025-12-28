import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Settings, LogOut, ChevronLeft, ChevronRight,
  Lightbulb, Scale, Layers, ClipboardCheck, ShieldAlert, FileBadge, 
  Beaker, Code, Bug
} from 'lucide-react';
import './Sidebar.css';
import { useProject } from '../Context/ProjectContext'; // <--- 1. IMPORT THIS

// AI Tools JSON
export const AI_TOOLS = [
  {
    category: "Architecture",
    tools: [
      { id: "api-04", name: "Architecture Generator", path: "/tools/design", icon: "Lightbulb" },
      { id: "api-01", name: "Trade-off Analyzer", path: "/tools/tradeoff", icon: "Scale" },
      { id: "api-05", name: "Stack Selector", path: "/tools/tech-stack", icon: "Layers" },
      { id: "api-02", name: "Design Reviewer", path: "/tools/review", icon: "ClipboardCheck" }
    ]
  },
  {
    category: "Security & Quality",
    tools: [
      { id: "api-03", name: "Risk Scanner", path: "/tools/risk", icon: "ShieldAlert" },
      { id: "api-07", name: "Compliance Auditor", path: "/tools/compliance", icon: "FileBadge" }
    ]
  },
  {
    category: "Development",
    tools: [
      { id: "api-06", name: "Test Case Builder", path: "/tools/test-gen", icon: "Beaker" },
      { id: "api-08", name: "Boilerplate Assistant", path: "/tools/codegen", icon: "Code" },
      { id: "api-09", name: "Smart Debugger", path: "/tools/debug", icon: "Bug" }
    ]
  }
];

// Icon map
const iconMap = {
  Lightbulb, Scale, Layers, ClipboardCheck, ShieldAlert,
  FileBadge, Beaker, Code, Bug,
  default: FileText
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // 2. GET THE RESET FUNCTION
  const { resetProjectData } = useProject(); 

  const userEmail = localStorage.getItem('email') || "User";

  useEffect(() => {
    const desktopWidth = isCollapsed ? '80px' : '290px';
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    document.documentElement.style.setProperty('--sidebar-width', isMobile ? '0px' : desktopWidth);
  }, [isCollapsed]);

  useEffect(() => {
    const applyWidth = () => {
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      const desktopWidth = isCollapsed ? '80px' : '290px';
      document.documentElement.style.setProperty('--sidebar-width', isMobile ? '0px' : desktopWidth);
    };
    applyWidth();
    window.addEventListener('resize', applyWidth);
    return () => window.removeEventListener('resize', applyWidth);
  }, [isCollapsed]);

  // 3. UPDATE LOGOUT FUNCTION
  const handleLogout = () => {
    // A. Clear Storage
    localStorage.clear();

    // B. Clear React State (Projects & Feed)
    resetProjectData();

    // C. Navigate
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      
      <nav className="sidebar-nav">

        {/* MENU Label */}
        <div className="menu-label">MENU</div>

        {/* Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className={`nav-button ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} className="nav-icon" />
          {!isCollapsed && <span>Dashboard</span>}
        </button>

        {/* Projects */}
        <button
          onClick={() => navigate('/projects')}
          className={`nav-button ${location.pathname === '/projects' ? 'active' : ''}`}
        >
          <FileText size={20} className="nav-icon" />
          {!isCollapsed && <span>Projects</span>}
        </button>

        {/* AI SUITE Label */}
        <div className="api-label">AI SUITE</div>

        {/* Dynamic AI Tools */}
        {AI_TOOLS.map((group) => (
          <React.Fragment key={group.category}>
            {group.tools.map((tool) => {
              const IconComp = iconMap[tool.icon] || iconMap.default;

              return (
                <button
                  key={tool.id}
                  onClick={() => navigate(tool.path)}
                  className={`nav-button ${location.pathname === tool.path ? 'active' : ''}`}
                  title={isCollapsed ? tool.name : ""}
                >
                  <IconComp size={20} className="nav-icon" />
                  {!isCollapsed && <span>{tool.name}</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}

        {/* Logout */}
        <button onClick={handleLogout} className="nav-button logout-btn" style={{ marginTop: "auto" }}>
          <LogOut size={20} className="nav-icon" />
          {!isCollapsed && <span>Logout</span>}
        </button>

      </nav>

      {/* Collapse Toggle */}
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="sidebar-toggle">
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};

export default Sidebar;