import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicAuthRoutes = [
        "/login",
        "/register",
        "/forgot-password",
        "/verify-reset-otp",
        "/reset-password",
        "/admin/login",
      ];

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!publicAuthRoutes.includes(currentPath)) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
