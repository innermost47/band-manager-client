import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL;

let isRedirecting = false;

let navigationCallback = (options) => {
  if (!isRedirecting) {
    isRedirecting = true;
    window.location.href = "/login";
    // Reset après la redirection
    setTimeout(() => {
      isRedirecting = false;
    }, 100);
  }
};

export const setNavigationCallback = (callback) => {
  navigationCallback = (options) => {
    if (!isRedirecting) {
      isRedirecting = true;
      callback(options);
      // Reset après la redirection
      setTimeout(() => {
        isRedirecting = false;
      }, 100);
    }
  };
};

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
    isRedirecting = false;
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/login")
    ) {
      localStorage.removeItem("token");
      navigationCallback({
        state: { error: "Your session has expired. Please log in again." },
      });
    }
    return Promise.reject(error);
  }
);

export default api;
