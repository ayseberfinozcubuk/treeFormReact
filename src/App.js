import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import EntityListView from "./components/EntityListView";
import AddNewEntity from "./components/AddNewEntity";
import { useFormStore } from "./store/useFormStore"; // Import Zustand store

const App = () => {
  const { setFormData } = useFormStore(); // Zustand store action to set form data
  const [rootEntity, setRootEntity] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Fetch JSON data from the public folder
    fetch("/SampleData/sampleData.json") // Adjust the path as needed
      .then((response) => response.json())
      .then((data) => {
        setFormData(data); // Store data in Zustand store
        setRootEntity(data[0].EntityName); // Set rootEntity to the first element's EntityName
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error loading sample data:", error);
        setIsLoading(false); // Even on error, stop loading
      });
  }, [setFormData]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <Router>
      <div className="main-container">
        <nav>
          <Link to="/">View {rootEntity} List</Link>
          <Link to="/add-entity">Add New {rootEntity}</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<EntityListView rootEntity={rootEntity} />} // Only rendered when rootEntity is available
          />
          <Route
            path="/add-entity"
            element={<AddNewEntity rootEntity={rootEntity} />} // Pass rootEntity as prop
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
