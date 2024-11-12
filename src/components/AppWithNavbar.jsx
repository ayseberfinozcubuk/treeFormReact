// AppWithNavbar.jsx
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import EntityListView from "./EntityListView";
import AddNewEntity from "./AddNewEntity";
import EntityDetails from "./EntityDetails";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

const AppWithNavbar = ({ rootEntity, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: `${rootEntity} Listesini Görüntüle`,
      icon: "pi pi-list",
      command: () => navigate("/"),
    },
    {
      label: `Yeni ${rootEntity} Ekle`,
      icon: "pi pi-plus",
      command: () => navigate("/add-entity"),
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        onLogout(); // Trigger logout
        navigate("/login");
      },
    },
  ];

  const start = <span className="text-xl font-semibold">EHBB</span>;
  const end = (
    <Button
      icon="pi pi-user"
      className="p-button-text text-white"
      onClick={() => navigate("/profile")}
    />
  );

  return (
    <>
      <Menubar
        model={menuItems}
        start={start}
        end={end}
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

export default AppWithNavbar;
