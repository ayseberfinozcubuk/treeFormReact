import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { validateField } from "../utils/validationUtils";
import axiosInstance from "../api/axiosInstance";

const ChangePassword = ({ userData, updatedUser, resetFields }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const toastRef = useRef(null); // Toast reference for notifications

  const handleSave = async () => {
    setError({});

    try {
      const response = await axiosInstance.put(
        `http://localhost:5000/api/users/${updatedUser.Id}/change-password`,
        {
          CurrentPassword: currentPassword,
          NewPassword: newPassword,
          ConfirmNewPassword: confirmPassword,
        }
      );

      // Show success toast
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Your password has been updated successfully!",
        life: 3000, // Duration in milliseconds
        closable: true, // Allow the user to close the toast manually
      });

      // Delay navigation to reset fields
      setTimeout(() => {
        resetFields();
      }, 3000); // Wait for the toast to disappear
    } catch (err) {
      // Handle errors from the backend
      const { response } = err;
      if (response && response.data) {
        setError({ server: response.data });
      } else {
        setError({ server: "An unknown error occurred." });
      }
    }
  };

  const handleToastHide = () => {
    // Reset fields when the toast is manually closed
    resetFields();
  };

  const validateNewPassword = () => {
    const field = userData.Properties.find((prop) => prop.Name === "Password");
    const validationErrors = [];

    // Validate new password
    if (field?.ValidationRules) {
      const result = validateField(newPassword, field.ValidationRules);
      if (!result.isValid) {
        validationErrors.push(result.error);
      }
    }

    // Validate new password and confirmation password match
    if (newPassword !== confirmPassword) {
      validationErrors.push(
        "Confirmation password does not match the new password."
      );
    }

    return validationErrors;
  };

  const handleValidateAndSave = () => {
    const errors = validateNewPassword();
    if (errors.length > 0) {
      setError({ validation: errors.join(", ") });
    } else {
      handleSave();
    }
  };

  return (
    <div className="space-y-4">
      <Toast ref={toastRef} onHide={handleToastHide} />{" "}
      {/* Toast with onHide */}
      {error.server && (
        <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
          {error.server}
        </div>
      )}
      <div className="p-field">
        <label htmlFor="currentPassword" className="block mb-2">
          Current Password
        </label>
        <InputText
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          className="w-full"
        />
      </div>
      <div className="p-field">
        <label htmlFor="newPassword" className="block mb-2">
          New Password
        </label>
        <InputText
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full"
        />
      </div>
      <div className="p-field">
        <label htmlFor="confirmPassword" className="block mb-2">
          Confirm New Password
        </label>
        <InputText
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full"
        />
      </div>
      {error.validation && (
        <small className="p-error text-red-500">{error.validation}</small>
      )}
      <div className="flex justify-between mt-4">
        <Button
          label="Cancel"
          icon="pi pi-times"
          className="p-button-secondary"
          onClick={resetFields}
          style={{ width: "150px" }}
        />
        <Button
          label="Save"
          icon="pi pi-check"
          className="p-button-primary"
          onClick={handleValidateAndSave}
          style={{ width: "150px" }}
        />
      </div>
    </div>
  );
};

export default ChangePassword;
