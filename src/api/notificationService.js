import api from "./api";

export const notificationService = {
  getNotifications: async () => await api.get("/api/notifications"),
  markAllAsRead: async () =>
    await api.put("/api/notifications/mark-all-as-read"),
  markNotificationAsRead: async (id) =>
    await api.put(`/api/notifications/${id}/mark-as-read`),
  deleteAllNotifications: async () =>
    await api.delete(`/api/notifications/all`),
};
