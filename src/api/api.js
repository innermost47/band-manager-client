import axios from "axios";
export const API_BASE_URL = process.env.REACT_APP_API_URL;
let isRedirecting = false;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

let navigationCallback = (options) => {
  if (!isRedirecting) {
    isRedirecting = true;
    window.location.href = "/login";
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
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/login")
    ) {
      if (error.response.data.tokenExpired) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const newToken = error.response.data.token;
            localStorage.setItem("token", newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            isRefreshing = false;
            return api(originalRequest);
          } catch (err) {
            processQueue(err, null);
            isRefreshing = false;
            navigationCallback({
              state: {
                error: "Your session has expired. Please log in again.",
              },
            });
            return Promise.reject(err);
          }
        } else {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
      } else {
        navigationCallback({
          state: { error: "Your session has expired. Please log in again." },
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
