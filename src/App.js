// App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppWithNavbar from "./components/AppWithNavbar";
import LoginPage from "./components/LoginPage";
import UserProfile from "./components/UserProfile"; // Import UserProfile
import { useFormStore } from "./store/useFormStore";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const App = () => {
  const { setFormData } = useFormStore();
  const [rootEntity, setRootEntity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state without persistence

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

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
    return <div>Loading...</div>;
  }

  return (
    <Router>
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
            <Route path="/profile" element={<UserProfile />} />{" "}
            {/* Profile route */}
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
