import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers?.authorization;
    if (newToken) {
      const token = newToken.replace("Bearer ", "");
      localStorage.setItem("token", token);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login")
    ) {
      originalRequest._retry = true;
      const newToken = error.response.headers?.authorization;
      if (newToken) {
        const token = newToken.replace("Bearer ", "");
        localStorage.setItem("token", token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
export default api;
