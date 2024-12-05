import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Adjust based on your backend setup
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes("/signin")) {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
