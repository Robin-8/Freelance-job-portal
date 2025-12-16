import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      if (userInfo?.role === "client") {
        window.location.href = "/client/login";
      } else if (userInfo?.role === "freelancer") {
        window.location.href = "/freelancer/login";
      } else if (userInfo?.role === "admin") {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
