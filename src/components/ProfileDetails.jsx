import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";

const ProfileDetails = ({
  userData,
  updatedUser,
  setUpdatedUser,
  isEditing,
  setIsEditing,
  resetFields,
}) => {
  const handleInputChange = (fieldName, value) => {
    setUpdatedUser((prevUser) => ({ ...prevUser, [fieldName]: value }));
  };

  const handleSave = async () => {
    try {
      const userId = updatedUser?.Id; // Assuming 'Id' is part of the user data
      if (!userId) {
        alert("User ID is missing. Unable to update profile.");
        return;
      }

      const updatePayload = {
        UserName: updatedUser.UserName,
        Email: updatedUser.Email,
      };

      // Ensure the base URL is correctly configured
      const response = await axios.put(`/api/users/${userId}`, updatePayload, {
        baseURL: "http://localhost:5000", // Update this if your backend is hosted elsewhere
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the JWT token
        },
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      if (error.response) {
        console.error("Error updating user profile:", error.response.data);
        alert(
          `Failed to update profile: ${error.response.statusText} (${error.response.status})`
        );
      } else {
        console.error("Error updating user profile:", error);
        alert("An unknown error occurred. Please try again.");
      }
    }
  };

  const renderField = (field) => {
    const { Name, Label, Type, EnumValues } = field;
    const value = updatedUser[Name] || "-";

    if (Type === "enum") {
      return (
        <div className="text-gray-800 p-2 bg-gray-100 rounded-md">
          {EnumValues?.find((option) => option.Value === value)?.Label || "-"}
        </div>
      );
    }

    if (!isEditing) {
      return (
        <div className="text-gray-800 p-2 bg-gray-100 rounded-md">
          {value || "-"}
        </div>
      );
    }

    return (
      <InputText
        id={Name}
        type={Type === "mail" ? "email" : "text"}
        value={value}
        onChange={(e) => handleInputChange(Name, e.target.value)}
        placeholder={Label}
        className="w-full"
      />
    );
  };

  return (
    <>
      {userData?.Properties?.filter(
        (field) => field.Type !== "Guid" && field.Type !== "password"
      ).map((field) => (
        <div key={field.Name} className="p-field mb-4">
          <label htmlFor={field.Name} className="block mb-2 text-gray-700">
            {field.Label}
          </label>
          {renderField(field)}
        </div>
      ))}

      <div className="flex flex-col gap-2 mt-4">
        {!isEditing ? (
          <Button
            label="Düzenle"
            icon="pi pi-pencil"
            className="p-button-primary"
            onClick={() => setIsEditing(true)}
            style={{ width: "150px" }}
          />
        ) : (
          <div className="flex justify-between mt-4">
            <Button
              label="İptal Et"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={resetFields}
              style={{ width: "150px" }}
            />
            <Button
              label="Kaydet"
              icon="pi pi-check"
              className="p-button-primary"
              onClick={handleSave}
              style={{ width: "150px" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetails;
