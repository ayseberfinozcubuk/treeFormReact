import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EntityListView from "./components/EntityListView";
import AddNewEntity from "./components/AddNewEntity";
import { useFormStore } from "./store/useFormStore";

const App = () => {
  const { setFormData } = useFormStore();
  const [rootEntity, setRootEntity] = useState("");

  // Load JSON data from public folder dynamically
  useEffect(() => {
    fetch("/SampleData/sampleData.json")
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
        setRootEntity(data[0].EntityName); // Set the initial root entity
      })
      .catch((error) => console.error("Error loading sampleData:", error));
  }, [setFormData]);

  return (
    <Router>
      <div className="main-container">
        <nav>
          <Link to="/">View Objects</Link>
          <Link to="/add-object">Add New Object</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<EntityListView rootEntity={rootEntity} />}
          />
          <Route
            path="/add-object"
            element={<AddNewEntity rootEntity={rootEntity} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
