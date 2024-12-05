import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import axiosInstance from "../api/axiosInstance";
import { checkUserExists } from "../utils/utils";

// Create an AuthContext
const AuthContext = createContext();

// Hook to consume the AuthContext
export const useAuth = () => useContext(AuthContext);

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const toastRef = React.useRef(null);

  // Central authentication logic
  useEffect(() => {
    const authenticate = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
      console.log("user: ", user, " with id: ", user.Id, " token: ", token);
      console.log("document.cookie: ", document.cookie);

      if (!user || !user.Id || !token) {
        console.log("A");
        //handleLogout();
        return;
      }

      try {
        const isTokenValid = await validateToken(token);
        const userExists = await checkUserExists(user.Id);

        if (isTokenValid && userExists) {
          setIsAuthenticated(true);
        } else {
          //handleLogout();
        }
      } catch (error) {
        console.error("Authentication error:", error);
        //handleLogout();
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
      document.cookie = "authToken=; path=/; max-age=0"; // Clear token cookie
      setIsAuthenticated(false);
      navigate("/login");
    };

    authenticate();
  }, [navigate]);

  // If authentication is in progress, show a loader or blank screen
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      <Toast ref={toastRef} />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthWrapper;
