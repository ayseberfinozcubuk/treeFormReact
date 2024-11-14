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
  const [error, setError] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [initialEmail, setInitialEmail] = useState("");
  const [initialUserName, setInitialUserName] = useState("");

  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmail(storedUser.Email);
      setUserName(storedUser.UserName);
      setInitialEmail(storedUser.Email);
      setInitialUserName(storedUser.UserName);
    }
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Invalid email format.";
    }
    if (name === "userName") {
      if (value.length < 3 || value.length > 20)
        error = "Username must be between 3 and 20 characters.";
    }
    if (name === "newPassword" || name === "confirmPassword") {
      if (newPassword !== confirmPassword)
        error = "New password and confirmation do not match.";
    }
    setError((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (name, value) => {
    switch (name) {
      case "email":
        setEmail(value);
        validateField("email", value);
        break;
      case "userName":
        setUserName(value);
        validateField("userName", value);
        break;
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        validateField("newPassword", value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        validateField("confirmPassword", value);
        break;
      default:
        break;
    }
  };

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
        setInitialEmail(email);
        setInitialUserName(userName);
        setError({});
      } else {
        setError((prevErrors) => ({
          ...prevErrors,
          form: "Failed to update profile",
        }));
      }
    } catch (error) {
      setError((prevErrors) => ({
        ...prevErrors,
        form: "Error updating profile",
      }));
    }
  };

  const handleCancelEdit = () => {
    setEmail(initialEmail);
    setUserName(initialUserName);
    setError({});
    setIsEditing(false);
  };

  const handlePasswordUpdate = async () => {
    setError({});
    if (newPassword !== confirmPassword) {
      setError((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match",
      }));
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
        }
      );

      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordFields(false);
        setError({});
      } else {
        setError((prevErrors) => ({
          ...prevErrors,
          form: response.data || "Failed to update password",
        }));
      }
    } catch (error) {
      setError((prevErrors) => ({
        ...prevErrors,
        form: "Error updating password: " + error.response?.data,
      }));
    }
  };

  const handleCancelPasswordUpdate = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError({});
    setShowPasswordFields(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">User Profile</h2>
        {error.form && (
          <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
            {error.form}
          </div>
        )}

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
            onChange={(e) => handleInputChange("userName", e.target.value)}
            placeholder="Enter your username"
            className="w-full"
            disabled={!isEditing}
          />
          {error.userName && (
            <small className="p-error text-red-500">{error.userName}</small>
          )}
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
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
            className="w-full"
            disabled={!isEditing}
          />
          {error.email && (
            <small className="p-error text-red-500">{error.email}</small>
          )}
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          {isEditing ? (
            <>
              <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-outlined p-button-secondary"
                onClick={handleCancelEdit}
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
              onClick={handleCancelPasswordUpdate}
              label="Cancel Password Update"
            />
          )}
        </div>

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
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
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
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder="Enter new password"
                className="w-full"
              />
              <i
                className={`absolute right-3 top-9 pi ${
                  newPasswordVisible ? "pi-eye-slash" : "pi-eye"
                } cursor-pointer`}
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
              />
              {error.newPassword && (
                <small className="p-error text-red-500">
                  {error.newPassword}
                </small>
              )}
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
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
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
              {error.confirmPassword && (
                <small className="p-error text-red-500">
                  {error.confirmPassword}
                </small>
              )}
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
