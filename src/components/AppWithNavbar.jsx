import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import EntityListView from "./EntityListView";
import AddNewEntity from "./AddNewEntity";
import EntityDetails from "./EntityDetails";
import UserListView from "./UserListView";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

const AppWithNavbar = ({ rootEntity, onLogout }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState("read");

  useEffect(() => {
    // Check if the user is an admin by accessing the stored user data
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.Role) {
      setRole(user.Role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  // Define menu items
  const menuItems = [
    {
      label: `${rootEntity} Listesini Görüntüle`,
      icon: "pi pi-list",
      command: () => navigate("/"),
      className: "text-base text-gray-200 font-medium hover:text-white mx-3",
    },
    ...(role !== "read"
      ? [
          {
            label: `Yeni ${rootEntity} Ekle`,
            icon: "pi pi-plus",
            command: () => navigate("/add-entity"),
            className:
              "text-base text-gray-200 font-medium hover:text-white mx-3",
          },
        ]
      : []),

    // Only show User Settings if the user is an admin
    ...(role === "admin"
      ? [
          {
            label: "User Settings",
            icon: "pi pi-users",
            command: () => navigate("/user-settings"),
            className:
              "text-base text-gray-200 font-medium hover:text-white mx-3",
          },
        ]
      : []),
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
      className: "text-base text-gray-200 font-medium hover:text-white mx-3",
    },
  ];

  const start = (
    <span className="text-xl font-medium text-gray-200 hover:text-white">
      EHBB
    </span>
  );

  const end = (
    <Button
      icon="pi pi-user"
      className="p-button-text text-gray-200 font-medium hover:text-white mx-3"
      onClick={() => navigate("/profile")}
      style={{ fontSize: "0.95rem" }}
    />
  );

  return (
    <>
      <Menubar
        model={menuItems}
        start={start}
        end={end}
        className="bg-gray-800 text-white fixed top-0 w-full z-10" // Fixed position
        style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }} // Optional shadow for styling
      />
      <div className="p-6 pt-16">
        {" "}
        {/* Add top padding to avoid overlap */}
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
          <Route path="/user-settings" element={<UserListView />} />
        </Routes>
      </div>
    </>
  );
};

export default AppWithNavbar;
