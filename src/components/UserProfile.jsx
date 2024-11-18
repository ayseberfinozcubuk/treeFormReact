import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import useUserStore from "../store/useUserStore";
import ProfileDetails from "./ProfileDetails";
import ChangePassword from "./ChangePassword";

const UserProfile = () => {
  const { userData, fetchUserData } = useUserStore();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [updatedUser, setUpdatedUser] = useState(storedUser || {});
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  useEffect(() => {
    console.log("storedUser: ", storedUser);
    if (!userData) {
      fetchUserData();
    }
  }, [userData, fetchUserData]);

  const resetFields = () => {
    setUpdatedUser(storedUser || {});
    setIsEditing(false);
    setIsPasswordChanging(false);
  };

  if (!userData) {
    console.log("User data is missing:", userData);
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-md bg-white rounded-lg shadow-md">
      <div className="flex justify-between border-b-2 border-gray-200 pb-2 mb-4">
        <Button
          label="Düzenle Profil"
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
  );
};

export default UserProfile;
