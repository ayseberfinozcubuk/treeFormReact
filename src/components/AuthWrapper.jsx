import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import axiosInstance from "../api/axiosInstance";
import { showToast, checkUserExists } from "../utils/utils";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const toastRef = React.useRef(null);

  useEffect(() => {
    const authenticate = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      // If user or token is missing, redirect to login without showing an error
      if (!user || !user.Id || !token) {
        navigate("/login");
        return;
      }

      // Optional: Token validation
      // If you trust server-side token checks via `credentials`, skip this part.
      const isTokenValid = token && (await validateToken(token));
      if (!isTokenValid) {
        handleLogout(); // Handle token invalidation
        return;
      }

      // Check if the user still exists in the backend
      const userExists = await checkUserExists(user.Id);
      if (!userExists) {
        handleLogout(); // Handle missing user
        return;
      }
    };

    const validateToken = async (token) => {
      try {
        const response = await axiosInstance.post("/api/validate-token", {
          token,
        });
        return response.data.isValid;
      } catch {
        return false; // Treat failure as invalid token
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      document.cookie = "token=; path=/; max-age=0"; // Clear token cookie
      navigate("/login");
    };

    authenticate();
  }, [navigate]);

  return (
    <>
      <Toast ref={toastRef} />
      {children}
    </>
  );
};

export default AuthWrapper;
