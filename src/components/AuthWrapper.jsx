import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import axiosInstance from "../api/axiosInstance";
import { showToast } from "../utils/utils";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const toastRef = React.useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.Id) {
        navigate("/login");
        return;
      }

      try {
        const userExists = await axiosInstance.get(`/api/users/${user.Id}`);
        if (!userExists.data) {
          throw new Error("User does not exist");
        }
      } catch (error) {
        // Show toast, clear session, and redirect
        showToast(
          toastRef.current,
          "error",
          "Kullanıcı Bulunamadı",
          "Bu kullanıcı artık mevcut değil."
        );
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; max-age=0"; // Clear token cookie
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <>
      <Toast ref={toastRef} />
      {children}
    </>
  );
};

export default AuthWrapper;
