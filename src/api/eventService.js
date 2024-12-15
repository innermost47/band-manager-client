import api from "./api";

export const eventService = {
  getPublicEventsByProject: async (projectId) => {
    return await api.get(`/api/events/public/project/${projectId}`);
  },
  getByProject: async (id) => {
    return await api.get(`/api/events/project/${id}`);
  },
  update: async (id, data) => {
    return await api.put(`/api/events/${id}`, data);
  },
  create: async (data) => {
    return await api.post(`/api/events`, data);
  },
  delete: async (id) => {
    return await api.delete(`/api/events/${id}`);
  },
  getPublicEvents: async () => {
    return await api.get(`/api/events/publics`);
  },
};
