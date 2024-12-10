import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppWithNavbar from "./components/AppWithNavbar";
// import AuthWrapper from "./components/AuthProvider";
import LoginPage from "./components/LoginPage";
import UserProfile from "./components/UserProfile"; // Import UserProfile
import { useFormStore } from "./store/useFormStore";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axiosInstance from "./api/axiosInstance";
import { checkUserExists } from "./utils/utils";

const App = () => {
  const { setFormData } = useFormStore();
  const [rootEntity, setRootEntity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start as not authenticated

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    document.cookie = "authToken=; path=/; max-age=0"; // Clear token cookie
  };

  useEffect(() => {
    const checkAuth = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      // If user or token is missing, redirect to login without showing an error
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Token validation
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

      setIsAuthenticated(true);
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
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      document.cookie = "authToken=; path=/; max-age=0"; // Clear token cookie
    };

    checkAuth();
  }, []);

  useEffect(() => {
    fetch("/SampleData/sampleDataNew.json")
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
        setRootEntity(data[0].EntityName);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading sample data:", error);
        setIsLoading(false);
      });
  }, [setFormData]);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Router
      future={{
        v7_startTransition: true, // Opt-in to React.startTransition support
        v7_relativeSplatPath: true, // Opt-in to updated relative splat path resolution
      }}
    >
      <Routes>
        {isAuthenticated ? (
          <>
            <Route
              path="/*"
              element={
                <AppWithNavbar
                  rootEntity={rootEntity}
                  onLogout={handleLogout}
                />
              }
            />
            <Route path="/profile" element={<UserProfile />} />
          </>
        ) : (
          <>
            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
