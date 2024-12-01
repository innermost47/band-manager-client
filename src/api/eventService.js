import api from "./api";

export const eventService = {
  getEvents: async () => await api.get("/api/events"),
  getEvent: async (id) => await api.get(`/api/events/${id}`),
  createEvent: async (data) => await api.post("/api/events", data),
  updateEvent: async (id, data) => await api.put(`/api/events/${id}`, data),
  deleteEvent: async (id) => await api.delete(`/api/events/${id}`),
};
