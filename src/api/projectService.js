import api from "./api";

export const projectService = {
  getProjects: async () => await api.get("/api/projects"),
  getProject: async (id) => await api.get(`/api/projects/${id}`),
  createProject: async (data) => await api.post("/api/projects", data),
  updateProject: async (id, data) => await api.put(`/api/projects/${id}`, data),
  deleteProject: async (id) => await api.delete(`/api/projects/${id}`),
};
