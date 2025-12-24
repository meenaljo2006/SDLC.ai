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
  const [activityFeed, setActivityFeed] = useState([]); // This will ALWAYS be global now
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper: Fetch history for a single project
  const fetchProjectHistory = async (projectId, projectName) => {
    try {
      const data = await getProjectHistory(projectId);
      return (data.activity_log || []).map(item => ({
        ...item,
        project_name: projectName,
        project_id: projectId,
        tool: item.tool || "System Action",
        created_at: item.timestamp || item.created_at || new Date().toISOString()
      }));
    } catch (err) {
      console.warn(`Failed to fetch history for project ${projectId}`, err);
      return [];
    }
  };

  // 1. Load Projects & Generate GLOBAL Feed
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      const projectList = data.projects || [];
      
      // Sort projects by newest first
      const sortedProjects = [...projectList].sort((a, b) => b.id - a.id);
      setProjects(sortedProjects);

      // --- ALWAYS AGGREGATE ALL HISTORIES ---
      const historyPromises = sortedProjects.map(p => fetchProjectHistory(p.id, p.name));
      const allHistories = await Promise.all(historyPromises);
      
      // Flatten and Sort
      const globalFeed = allHistories.flat();
      globalFeed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setActivityFeed(globalFeed); // This is now the permanent state for the feed

    } catch (err) {
      console.error("Error loading system data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Create Project
  const addProject = async (payload) => {
    const newProject = await createProject(payload);
    setProjects(prev => [newProject, ...prev]);
    // Optionally refresh global feed here if needed, or just append locally
    return newProject;
  };

  const removeProject = async (projectId) => {
    try {
      // 1. Call API
      await deleteProject(projectId);

      // 2. Update Projects List State
      setProjects(prev => prev.filter(p => p.id !== projectId));

      // 3. Remove this project's logs from the Global Activity Feed (Clean up)
      setActivityFeed(prev => prev.filter(item => item.project_id !== projectId));

      // 4. If the deleted project was currently selected, deselect it
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
      throw err;
    }
  };

  // Initial Load
  useEffect(() => {
    fetchProjects();
  }, []);

  // REMOVED: The useEffect that filtered activityFeed based on selectedProject.
  // Now, 'selectedProject' is just a pointer for the Tools pages.

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
        removeProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};