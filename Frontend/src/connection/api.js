import axios from "axios";

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
        "http://localhost:5000/api/auth/refresh",
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
