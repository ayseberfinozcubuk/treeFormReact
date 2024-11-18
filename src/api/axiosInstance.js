import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Update to match your backend URL
  withCredentials: true, // Include cookies with every request
});

export default axiosInstance;
