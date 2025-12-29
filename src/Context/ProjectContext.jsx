import { createContext, useContext, useEffect, useState } from 'react';
import {
  getProjects,
  createProject,
  getProjectHistory,
  deleteProject 
} from '../Services/ProjectService';

// 1. IMPORT FIREBASE
import { db } from '../firebaseConfig'; 
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'; 

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

  // --- NEW: Helper to save logs to FIREBASE ---
  const logActivity = async (toolId, toolName, inputData, outputData) => {
    // 1. If Sandbox (no project selected), DO NOT SAVE.
    if (!selectedProject) return;

    const projectId = selectedProject.id;
    
    // 2. Create the log object
    const newLog = {
      project_id: projectId,
      project_name: selectedProject.name,
      tool_id: toolId,
      tool: toolName,
      input: inputData,   // Saving the prompt
      output: outputData, // Saving the result
      created_at: new Date().toISOString()
    };

    try {
      // 3. Save to FIREBASE Collection "logs"
      await addDoc(collection(db, "logs"), newLog);
      
      // 4. Update the Global Feed State immediately (Optimistic Update)
      setActivityFeed(prev => [newLog, ...prev]);
      
    } catch (e) {
      console.error("Error saving log to Firebase:", e);
    }
  };

  // --- UPDATED: Fetch history (Merges API + Firebase) ---
  const fetchProjectHistory = async (projectId, projectName) => {
    try {
      // A. Fetch REAL LOGS from Firebase
      let firebaseLogs = [];
      try {
        const q = query(
          collection(db, "logs"),
          where("project_id", "==", projectId)
        );
        
        const querySnapshot = await getDocs(q);
        firebaseLogs = querySnapshot.docs.map(doc => ({
           id: doc.id, 
           ...doc.data() 
        }));
      } catch (e) {
        console.error("Firebase fetch error:", e);
      }

      // B. Fetch API logs (In case backend gets fixed later)
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
        // Ignore API errors
      }

      // C. Merge both
      return [...firebaseLogs, ...apiLogs];

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

      // Fetch history for all projects (API + Firebase)
      const historyPromises = sortedProjects.map(p => fetchProjectHistory(p.id, p.name));
      const allHistories = await Promise.all(historyPromises);
      
      const globalFeed = allHistories.flat();
      // Sort by date (Newest first)
      globalFeed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setActivityFeed(globalFeed);

    } catch (err) {
      console.error("Error loading system data:", err);
      setProjects([]);
      setActivityFeed([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Reset Data (Call on Logout) ---
  const resetProjectData = () => {
    setProjects([]);
    setActivityFeed([]);
    setSelectedProject(null);
    setLoading(false);
    localStorage.removeItem("currentProjectId"); // Clear saved ID
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
      
      // Note: We are NOT deleting logs from Firebase automatically for safety.

      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        localStorage.removeItem("currentProjectId"); // Clear if deleted
      }
    } catch (err) {
      console.error("Delete failed", err);
      throw err;
    }
  };

  // --- NEW: Helper to sync selection with LocalStorage ---
  const handleSetSelectedProject = (project) => {
    setSelectedProject(project);
    if (project?.id) {
      localStorage.setItem("currentProjectId", project.id);
    } else {
      localStorage.removeItem("currentProjectId");
    }
  };

  // --- EFFECT: Restore selection on reload ---
  useEffect(() => {
    if (projects.length > 0) {
      const savedProjectId = localStorage.getItem("currentProjectId");
      if (savedProjectId) {
        const foundProject = projects.find(p => p.id === parseInt(savedProjectId));
        if (foundProject) {
          setSelectedProject(foundProject);
        }
      }
    }
  }, [projects]);

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
        setSelectedProject: handleSetSelectedProject, // Use the wrapper!
        removeProject,
        logActivity,
        resetProjectData 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};