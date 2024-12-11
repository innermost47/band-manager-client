import api from "./api";

export const loginService = {
  login: async (credentials) => await api.post("/login", credentials),
  verify2FA: async (data) => await api.post("/verify-2fa", data),
  checkRegistrationAvailability: async () => return await api.get('/check-registration-availability'),
};
