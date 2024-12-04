import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // http://localhost:5000 or http://10.40.144.237:5000
  withCredentials: true, // Include cookies with every request
});

export default axiosInstance;
