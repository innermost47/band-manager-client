import api from "./api";

export const tablatureService = {
  getTablatures: async () => await api.get("/api/tablatures"),
  getTablature: async (id) => await api.get(`/api/tablatures/${id}`),
  createTablature: async (data) => {
    return await api.post("/api/tablatures", data);
  },
  updateTablature: async (id, data) => {
    return await api.put(`/api/tablatures/${id}`, data);
  },
  deleteTablature: async (id) => await api.delete(`/api/tablatures/${id}`),
};
