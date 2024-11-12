import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Toggle password visibility states
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmail(storedUser.Email);
      setUserName(storedUser.UserName);
    }
  }, []);

  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.Id;

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        {
          email,
          userName,
        }
      );

      if (response.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, Email: email, UserName: userName })
        );
        setIsEditing(false);
        setError("");
      } else {
        setError("Failed to update profile");
      }
    } catch (error) {
      setError("Error updating profile");
    }
  };

  const handlePasswordUpdate = async () => {
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.Id;

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/change-password`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        }
      );

      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("Password updated successfully");
        setShowPasswordFields(false);
      } else {
        setError(response.data || "Failed to update password");
      }
    } catch (error) {
      setError("Error updating password: " + error.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">User Profile</h2>
        {error && (
          <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* User Information */}
        <div className="p-field">
          <label
            htmlFor="userName"
            className="block text-gray-700 font-medium mb-2"
          >
            Username
          </label>
          <InputText
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your username"
            className="w-full"
            disabled={!isEditing}
          />
        </div>
        <div className="p-field">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email
          </label>
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full"
            disabled={!isEditing}
          />
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          {isEditing ? (
            <>
              <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-outlined p-button-secondary"
                onClick={() => setIsEditing(false)}
              />
              <Button
                label="Save"
                icon="pi pi-check"
                className="p-button p-button-success"
                onClick={handleSave}
              />
            </>
          ) : (
            <Button
              label="Edit Profile"
              icon="pi pi-pencil"
              className="p-button p-button-primary"
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>

        {/* Toggle Password Fields */}
        <div className="mt-4 flex justify-center">
          {!showPasswordFields ? (
            <Button
              label="Update Password"
              icon="pi pi-key"
              onClick={() => setShowPasswordFields(true)}
              className="p-button-warning"
            />
          ) : (
            <Button
              icon="pi pi-times"
              className="p-button-text p-button-danger"
              onClick={() => setShowPasswordFields(false)}
              label="Cancel Password Update"
            />
          )}
        </div>

        {/* Password Update Fields */}
        {showPasswordFields && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <div className="p-field relative">
              <label
                htmlFor="currentPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Current Password
              </label>
              <InputText
                id="currentPassword"
                type={currentPasswordVisible ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full"
              />
              <i
                className={`absolute right-3 top-9 pi ${
                  currentPasswordVisible ? "pi-eye-slash" : "pi-eye"
                } cursor-pointer`}
                onClick={() =>
                  setCurrentPasswordVisible(!currentPasswordVisible)
                }
              />
            </div>
            <div className="p-field relative">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                New Password
              </label>
              <InputText
                id="newPassword"
                type={newPasswordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full"
              />
              <i
                className={`absolute right-3 top-9 pi ${
                  newPasswordVisible ? "pi-eye-slash" : "pi-eye"
                } cursor-pointer`}
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
              />
            </div>
            <div className="p-field relative">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Confirm New Password
              </label>
              <InputText
                id="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full"
              />
              <i
                className={`absolute right-3 top-9 pi ${
                  confirmPasswordVisible ? "pi-eye-slash" : "pi-eye"
                } cursor-pointer`}
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              />
            </div>
            <Button
              label="Save New Password"
              icon="pi pi-check"
              onClick={handlePasswordUpdate}
              className="w-full p-button-success mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
