import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppWithNavbar from "./components/AppWithNavbar";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import AddNewEntity from "./components/AddNewEntity";
import EntityDetails from "./components/EntityDetails";
import UserListView from "./components/UserListView";
import EntityListView from "./components/EntityListView";
import UserProfile from "./components/UserProfile";
import { useFormStore } from "./store/useFormStore";
import axiosInstance from "./api/axiosInstance";
import { checkUserExists } from "./utils/utils";

const App = () => {
  const { setFormData } = useFormStore();
  const [rootEntity, setRootEntity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // Track user role for conditional rendering

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    document.cookie = "authToken=; path=/; max-age=0";
  };

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem("user"));
      setRole(user.Role);
      console.log("Current role:", role);
    } else {
      handleLogout();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const validateAuth = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (!user || !token || !(await checkUserExists(user.Id))) {
        handleLogout();
        return;
      }

      setIsAuthenticated(true);
      setRole(user.Role); // Save the user's role
    };
    validateAuth();
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
        console.error("Error loading data:", error);
        setIsLoading(false);
      });
  }, [setFormData]);

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <Route
            path="/"
            element={
              <AppWithNavbar rootEntity={rootEntity} onLogout={handleLogout} />
            }
          >
            {/* Nested Routes */}
            <Route
              path="/"
              element={<MainPage rootEntity={rootEntity} role={role} />}
            />
            <Route
              path="/list"
              element={<EntityListView rootEntity={rootEntity} />}
            />
            <Route path="/entity-page" element={<EntityListView />} />
            <Route path="/add-entity" element={<AddNewEntity />} />
            <Route path="/details/:id" element={<EntityDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            {role === "admin" && (
              <Route path="/user-settings" element={<UserListView />} />
            )}
          </Route>
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
