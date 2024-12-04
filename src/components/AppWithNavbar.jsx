import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import EntityListView from "./EntityListView";
import AddNewEntity from "./AddNewEntity";
import EntityDetails from "./EntityDetails";
import UserListView from "./UserListView";
import UserProfile from "./UserProfile"; // Import UserProfile
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import axiosInstance from "../api/axiosInstance";
import { useFormStore } from "../store/useFormStore";

const AppWithNavbar = ({ rootEntity, onLogout }) => {
  const { selectFromData } = useFormStore();

  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // Fetch user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // Fetch user from local storage
        if (!user || !user.Id || user === null) {
          console.error("User ID is missing. Redirecting to login.");
          navigate("/login");
          return;
        }
        setRole(user.Role); // Assume backend responds with { role: "admin" }
      } catch (error) {
        console.error(
          "Failed to fetch user role from localstorage user:",
          error
        );
        navigate("/login"); // Redirect to login if role fetch fails
      }
    };
    fetchUserRole();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "/api/users/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      label: `${rootEntity} Ekranı`,
      icon: "pi pi-list",
      command: () => navigate("/"),
      className: "text-base text-gray-200 font-medium hover:text-white mx-3",
    },
    ...selectFromData.map((item) => ({
      label: `${item} Ekranı`,
      icon: "pi pi-list",
      command: () => navigate("/entity-page", { state: { rootEntity: item } }),
      className: "text-base text-gray-200 font-medium hover:text-white mx-3",
    })),
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
      onClick={() => navigate("/profile")} // Navigate to UserProfile
      style={{ fontSize: "0.95rem" }}
    />
  );

  if (role === null) {
    return <div>Custom Loading...</div>; // Show a loading indicator while role is being fetched
  }

  return (
    <>
      <Menubar
        model={menuItems}
        start={start}
        end={end}
        className="bg-gray-800 text-white fixed top-0 w-full z-10"
        style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
      />
      <div className="p-6 pt-16">
        {/* Adjust padding to prevent overlap */}
        <Routes>
          <Route
            path="/"
            element={<EntityListView rootEntity={rootEntity} />}
          />
          <Route
            path="/add-entity"
            element={<AddNewEntity rootEntity={rootEntity} />}
          />
          {selectFromData.map((item) => (
            <Route
              key={item}
              path={`/entity-page`}
              element={<EntityListView rootEntity={item} />}
            />
          ))}
          <Route
            path="/details/:id"
            element={<EntityDetails rootEntity={rootEntity} />}
          />
          <Route path="/user-settings" element={<UserListView />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </>
  );
};

export default AppWithNavbar;
