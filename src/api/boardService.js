import api from "./api";

export const boardService = {
  getBoards: async () => await api.get("/api/boards"),
  getBoard: async (id) => await api.get(`/api/boards/${id}`),
  createBoard: async (data) => await api.post("/api/boards", data),
  updateBoard: async (id, data) => await api.put(`/api/boards/${id}`, data),
  deleteBoard: async (id) => await api.delete(`/api/boards/${id}`),
};
