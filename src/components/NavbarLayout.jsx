import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        src="tubitak_logo.png"
        alt="Bilgem Logo"
        className="h-10 w-10 object-contain"
      />
      <span className="text-xl font-medium text-gray-200 hover:text-white">
        EHBB
      </span>
    </div>
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
        className={`fixed top-0 w-full z-10 navbar bg-gray-800 text-white`}
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
          backgroundColor: "#f4f4f4",
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default NavbarLayout;
