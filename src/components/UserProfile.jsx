import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0); // 0 = Profile, 1 = Update Password

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

      if (!userId) {
        console.error("User ID is missing.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        {
          email,
          userName,
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully");
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
      console.error("Error updating profile:", error);
      setError("Error updating profile");
    }
  };

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // Placeholder for password update logic
    console.log("Password updated successfully");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
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
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel header="Profile">
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
          </TabPanel>

          <TabPanel header="Update Password">
            <div className="p-field">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                New Password
              </label>
              <Password
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                feedback={false}
                toggleMask
                className="w-full"
              />
            </div>
            <div className="p-field">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Confirm New Password
              </label>
              <Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                feedback={false}
                toggleMask
                className="w-full"
              />
            </div>
            <Button
              label="Update Password"
              icon="pi pi-key"
              onClick={handlePasswordUpdate}
              className="w-full p-button mt-4"
            />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default UserProfile;
