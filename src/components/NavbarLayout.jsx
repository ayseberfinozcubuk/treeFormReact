import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import axiosInstance from "../api/axiosInstance";

const NavbarLayout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
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

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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
      onClick={() => navigate("/")}
    >
      EHBB
    </span>
  );

  const end = (
    <>
      <Menu model={profileMenuItems} popup ref={menuRef} id="profileMenu" />
      <Button
        icon={isDarkMode ? "pi pi-sun" : "pi pi-moon"}
        className="p-button-text text-gray-200 font-medium hover:text-white mx-3"
        onClick={() => setIsDarkMode((prev) => !prev)}
        style={{ fontSize: "0.95rem" }}
        aria-label="Toggle Dark Mode"
      />
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
        className={`fixed top-0 w-full z-10 navbar ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-800 text-white"
        }`}
        style={{
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          height: "4rem",
        }}
      />
      <div
        className="main-content"
        style={{
          paddingTop: "5rem",
          minHeight: "100vh",
          backgroundColor: isDarkMode ? "#121212" : "#f4f4f4",
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default NavbarLayout;
