import api from "./api";

export const loginService = {
  login: async (credentials) => await api.post("/login", credentials),
  verify2FA: async (data) => await api.post("/verify-2fa", data),
  checkRegistrationAvailability: async () =>
    await api.get("/check-registration-availability"),
  forgotPassword: (data) => api.post("/password/forgot", data),
  resetPassword: (data) => api.post("/password/reset", data),
  checkInvitationAvailability: async () =>
    await api.get("/check-invitation-availability"),
};
