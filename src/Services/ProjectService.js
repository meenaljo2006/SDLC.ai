const BASE_URL = 'https://sdlc.testproject.live/api/v1';

// Helper to get clean token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')?.replace(/^"|"$/g, "");
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'x-api-key': 'supersecret123'
  };
};

export const getProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects/`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

export const createProject = async (payload) => {
  const res = await fetch(`${BASE_URL}/projects/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
};

// New function for Activity Feed
export const getProjectHistory = async (projectId) => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/history`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};

export const deleteProject = async (projectId) => {
  const token = localStorage.getItem('token')?.replace(/^"|"$/g, "");
  const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-api-key': 'supersecret123'

    }
  });
  
  // The API returns { message: "Project deleted" } or similar
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
};