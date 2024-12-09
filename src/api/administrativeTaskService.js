import api from "./api";

export const administrativeTaskService = {
  getAdministrativeTasks: async () =>
    await api.get("/api/administrative-tasks"),
  getAdministrativeTask: async (id) =>
    await api.get(`/api/administrative-tasks/${id}`),
  createAdministrativeTask: async (data) => {
    return await api.post("/api/administrative-tasks", data);
  },
  updateAdministrativeTask: async (id, data) => {
    return await api.put(`/api/administrative-tasks/${id}`, data);
  },
  deleteAdministrativeTask: async (id) =>
    await api.delete(`/api/administrative-tasks/${id}`),
};
