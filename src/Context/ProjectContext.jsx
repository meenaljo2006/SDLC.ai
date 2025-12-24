import { createContext, useContext, useEffect, useState } from 'react';
import {
  getProjects,
  createProject,
  getProjectHistory,
  deleteProject 
} from '../Services/ProjectService';

const ProjectContext = createContext(null);

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used inside ProjectProvider');
  return ctx;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- NEW: Helper to save logs locally ---
  const logActivity = (toolId, toolName, inputData, outputData) => {
    // 1. If Sandbox (no project selected), DO NOT SAVE.
    if (!selectedProject) return;

    const projectId = selectedProject.id;
    
    // 2. Create the log object
    const newLog = {
      id: Date.now(), // unique ID
      project_id: projectId,
      project_name: selectedProject.name,
      tool_id: toolId,
      tool: toolName,
      input: inputData,   // Saving the prompt
      output: outputData, // Saving the result (code/diagram)
      created_at: new Date().toISOString()
    };

    // 3. Save to LocalStorage (The "Shadow" DB)
    const storageKey = `project_logs_${projectId}`;
    const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedLogs = [newLog, ...existingLogs]; // Add to top
    localStorage.setItem(storageKey, JSON.stringify(updatedLogs));

    // 4. Update the Global Feed State immediately so Dashboard updates
    setActivityFeed(prev => [newLog, ...prev]);
  };

  // --- UPDATED: Fetch history (Merges API + Local) ---
  const fetchProjectHistory = async (projectId, projectName) => {
    try {
      // A. Try fetching real API history
      let apiLogs = [];
      try {
        const data = await getProjectHistory(projectId);
        apiLogs = (data.activity_log || []).map(item => ({
          ...item,
          project_name: projectName,
          project_id: projectId,
          tool: item.tool || "System Action",
          created_at: item.timestamp || item.created_at
        }));
      } catch (e) {
        // If API fails or is empty, just ignore
      }

      // B. Fetch "Shadow" LocalStorage history
      const storageKey = `project_logs_${projectId}`;
      const localLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');

      // C. Merge both
      return [...localLogs, ...apiLogs];

    } catch (err) {
      console.warn(`Failed to fetch history for project ${projectId}`, err);
      return [];
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      const projectList = data.projects || [];
      
      const sortedProjects = [...projectList].sort((a, b) => b.id - a.id);
      setProjects(sortedProjects);

      // Fetch history for all projects (API + Local)
      const historyPromises = sortedProjects.map(p => fetchProjectHistory(p.id, p.name));
      const allHistories = await Promise.all(historyPromises);
      
      const globalFeed = allHistories.flat();
      globalFeed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setActivityFeed(globalFeed);

    } catch (err) {
      console.error("Error loading system data:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (payload) => {
    const newProject = await createProject(payload);
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const removeProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setActivityFeed(prev => prev.filter(item => item.project_id !== projectId));
      
      // Also clean up the local storage logs for this project!
      localStorage.removeItem(`project_logs_${projectId}`);

      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activityFeed,
        loading,
        fetchProjects,
        addProject,
        selectedProject,
        setSelectedProject,
        removeProject,
        logActivity // <--- Exporting this so Tools can use it
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};