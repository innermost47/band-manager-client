import api from "./api";

export const projectService = {
  getProjects: async () => await api.get("/api/projects"),
  getPublicProjects: async () => await api.get("/api/projects/public"),
  getProject: async (id) => await api.get(`/api/projects/${id}`),
  createProject: async (data) => await api.post("/api/projects", data),
  updateProject: async (id, data) => await api.put(`/api/projects/${id}`, data),
  deleteProject: async (id) => await api.delete(`/api/projects/${id}`),
  updateProfileImage: async (data) =>
    await api.post(`/api/projects/update-profile-image`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getProfileImageFile: async (filePath) =>
    await api.get("/profile-image/" + filePath, {
      responseType: "blob",
    }),

  removeMemberFromProject: async (projectId, memberId) => {
    return api.delete(`/api/projects/${projectId}/members/${memberId}`);
  },
};
