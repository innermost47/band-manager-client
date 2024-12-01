import api from "./api";

export const adminTaskService = {
  getTasks: async () => await api.get("/api/administrative-tasks"),
  getTask: async (id) => await api.get(`/api/administrative-tasks/${id}`),
  createTask: async (data) => await api.post("/api/administrative-tasks", data),
  updateTask: async (id, data) =>
    await api.put(`/api/administrative-tasks/${id}`, data),
  deleteTask: async (id) => await api.delete(`/api/administrative-tasks/${id}`),
};
