import axios from "axios";

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");

const API_URL = import.meta.env.VITE_API_URL || "https://whiteboard-backend-1els.onrender.com/api";
export const api = axios.create({
  baseURL:API_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const res = await axios.post(
        `${API_URL}auth/refresh`,
        { refreshToken }
      );

      accessToken = res.data.accessToken;
      localStorage.setItem("accessToken", accessToken);

      err.config.headers.Authorization = `Bearer ${accessToken}`;
      return api(err.config);
    }
    return Promise.reject(err);
  }
);
