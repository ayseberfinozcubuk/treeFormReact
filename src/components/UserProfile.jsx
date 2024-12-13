import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import useUserStore from "../store/useUserStore";
import ProfileDetails from "./ProfileDetails";
import ChangePassword from "./ChangePassword";
import axiosInstance from "../api/axiosInstance";

const UserProfile = () => {
  const { userData, fetchUserData } = useUserStore();
  const [updatedUser, setUpdatedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  // Fetch and sync user data from backend or localStorage
  useEffect(() => {
    const fetchAndUpdateUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.Id) {
          throw new Error("Yerel depolamada kullanıcı Id'si bulunamadı.");
        }

        // Fetch user data by ID
        const response = await axiosInstance.get(`/api/users/${storedUser.Id}`);
        const fetchedUser = response.data;

        // Update localStorage and state
        localStorage.setItem("user", JSON.stringify(fetchedUser));
        setUpdatedUser(fetchedUser);

        // Fetch additional user data if needed
        if (!userData) {
          fetchUserData();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);

        // Fallback to localStorage if backend fetch fails
        const storedUser = JSON.parse(localStorage.getItem("user")) || null;
        setUpdatedUser(storedUser);
      }
    };

    fetchAndUpdateUserData();
  }, [userData, fetchUserData, isPasswordChanging]);

  // Reset fields to the latest user data
  const resetFields = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUpdatedUser(storedUser || null);
    setIsEditing(false);
    setIsPasswordChanging(false);
  };

  if (!updatedUser) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-16">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between border-b-2 border-gray-200 pb-2 mb-4">
          <Button
            label="Profili Düzenle"
            className={`p-button-text ${
              !isPasswordChanging ? "font-bold border-b-2 border-primary" : ""
            }`}
            onClick={() => {
              setIsPasswordChanging(false);
            }}
            style={{ width: "50%" }}
          />
          <Button
            label="Şifreyi Değiştir"
            className={`p-button-text ${
              isPasswordChanging ? "font-bold border-b-2 border-primary" : ""
            }`}
            onClick={() => {
              setIsPasswordChanging(true);
              setIsEditing(false);
            }}
            style={{ width: "50%" }}
          />
        </div>

        {!isPasswordChanging ? (
          <ProfileDetails
            userData={userData}
            updatedUser={updatedUser}
            setUpdatedUser={setUpdatedUser}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            resetFields={resetFields}
          />
        ) : (
          <ChangePassword
            userData={userData}
            updatedUser={updatedUser}
            resetFields={resetFields}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
