import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./MainPage";
import AddNewEntity from "./AddNewEntity";
import EntityDetails from "./EntityDetails";
import UserListView from "./UserListView";
import EntityListView from "./EntityListView";
import UserProfile from "./UserProfile";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import axiosInstance from "../api/axiosInstance";

const AppWithNavbar = ({ rootEntity, onLogout }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.Id) {
          navigate("/login");
          return;
        }
        setRole(user.Role);
      } catch (error) {
        console.error("Failed to fetch user role from localstorage:", error);
        navigate("/login");
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
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const profileMenuItems = [
    {
      label: "Kullanıcı Detayları",
      icon: "pi pi-user",
      command: () => navigate("/profile"),
    },
    {
      label: "Çıkış Yap",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  const start = (
    <span
      className="text-xl font-medium text-gray-200 hover:text-white cursor-pointer"
      onClick={() => navigate("/")} // Navigate to the main page
    >
      EHBB
    </span>
  );

  const end = (
    <>
      <Menu model={profileMenuItems} popup ref={menuRef} id="profileMenu" />
      <Button
        icon="pi pi-user"
        className="p-button-text text-gray-200 font-medium hover:text-white mx-3"
        onClick={(event) => menuRef.current.toggle(event)}
        aria-controls="profileMenu"
        aria-haspopup
        style={{ fontSize: "0.95rem" }}
      />
    </>
  );

  if (role === null) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Menubar
        model={[]}
        start={start}
        end={end}
        className="bg-gray-800 text-white fixed top-0 w-full z-10"
        style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
      />
      <div className="p-6 pt-16">
        <Routes>
          <Route
            path="/"
            element={<MainPage role={role} rootEntity={rootEntity} />}
          />
          <Route
            path="/list"
            element={<EntityListView rootEntity={rootEntity} />}
          />
          <Route path="/entity-page" element={<EntityListView />} />
          <Route path="/add-entity" element={<AddNewEntity />} />
          <Route path="/details/:id" element={<EntityDetails />} />
          {role === "admin" && (
            <Route path="/user-settings" element={<UserListView />} />
          )}
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </>
  );
};

export default AppWithNavbar;
