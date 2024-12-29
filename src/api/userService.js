import api from "./api";

export const userService = {
  getMyProjects: async () => await api.get("/api/users/myprojects"),
  getUsers: async () => await api.get("/api/users"),
  getProfile: async () => await api.get(`/api/users/profile`),
  getMember: async (id) => await api.get(`/api/users/member/${id}`),
  getProfiles: async () => await api.get(`/api/users/profiles`),
  signUp: async (data) => await api.post("/signup", data),
  updateProfile: async (data) => await api.put(`/api/users/profile`, data),
  deleteUser: async (id) => await api.delete(`/api/users/${id}`),
  verifyEmail: async (data) => await api.post(`/verify-email`, data),
  getCurrentUserProjects: async (id) =>
    await api.get(`/api/users/current/projects/${id}`),
  sendInvitation: async (data) => await api.post(`/api/invitations/send`, data),
  acceptInvitation: async (token) =>
    await api.post(`/api/invitations/accept/${token}`),
  declineInvitation: async (token) =>
    await api.post(`/api/invitations/decline/${token}`),
  cancelInvitation: async (token) =>
    await api.post(`/api/invitations/cancel/${token}`),
  sendCollaborationRequest: async (data) =>
    await api.post(`/api/invitations/request`, data),
  inviteByEmail: async (data) =>
    await api.post("/api/invitations/invite-by-email", data),
  joinWithCode: async (data) =>
    await api.post("/api/invitations/join-with-code", data),
};
