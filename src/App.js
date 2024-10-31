import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import EntityListView from "./components/EntityListView";
import AddNewEntity from "./components/AddNewEntity";
import EntityDetails from "./components/EntityDetails";
import { Menubar } from "primereact/menubar";
import { useFormStore } from "./store/useFormStore";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const App = () => {
  const { setFormData } = useFormStore();
  const [rootEntity, setRootEntity] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/SampleData/sampleData.json")
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
      <AppWithNavbar rootEntity={rootEntity} />
    </Router>
  );
};

const AppWithNavbar = ({ rootEntity }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: `View ${rootEntity} List`,
      icon: "pi pi-list",
      command: () => navigate("/"),
    },
    {
      label: `Add New ${rootEntity}`,
      icon: "pi pi-plus",
      command: () => navigate("/add-entity"),
    },
  ];

  const start = <span className="text-xl font-semibold">EHBB</span>;

  return (
    <>
      <Menubar
        model={menuItems}
        start={start}
        className="bg-gray-800 text-white shadow-md"
      />
      <div className="p-6">
        <Routes>
          <Route
            path="/"
            element={<EntityListView rootEntity={rootEntity} />}
          />
          <Route
            path="/add-entity"
            element={<AddNewEntity rootEntity={rootEntity} />}
          />
          <Route
            path="/details/:id"
            element={<EntityDetails rootEntity={rootEntity} />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
