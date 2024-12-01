import api from "./api";

export const userService = {
  getUsers: async () => await api.get("/api/users"),
  getUser: async (id) => await api.get(`/api/users/${id}`),
  createUser: async (data) => await api.post("/api/users", data),
  updateUser: async (id, data) => await api.put(`/api/users/${id}`, data),
  deleteUser: async (id) => await api.delete(`/api/users/${id}`),
};
