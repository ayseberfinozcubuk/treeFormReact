import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // Use Outlet for nested routes
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import axiosInstance from "../api/axiosInstance";

const NavbarLayout = ({ onLogout }) => {
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
      onClick={() => navigate("/")}
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
      {/* Fixed Navbar */}
      <Menubar
        model={[]}
        start={start}
        end={end}
        className="bg-gray-800 text-white fixed top-0 w-full z-10 navbar"
        style={{
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          height: "4rem", // Adjust the height here
        }}
      />
      {/* Main Content Area */}
      <div
        className="main-content"
        style={{
          paddingTop: "5rem",
          minHeight: "100vh",
        }}
      >
        {/* Render nested routes using Outlet */}
        <Outlet />
      </div>
    </>
  );
};

export default NavbarLayout;
