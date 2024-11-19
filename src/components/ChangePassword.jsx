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
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  }); // Visibility states for passwords
  const toastRef = useRef(null);

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
        life: 3000,
        closable: true,
      });

      // Delay navigation to reset fields
      setTimeout(() => {
        resetFields();
      }, 3000);
    } catch (err) {
      const { response } = err;
      if (response && response.data) {
        setError({ server: response.data });
      } else {
        setError({ server: "An unknown error occurred." });
      }
    }
  };

  const handleToastHide = () => {
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

  const renderPasswordField = (id, label, value, onChange, fieldName) => (
    <div className="p-field relative">
      <label htmlFor={id} className="block mb-2">
        {label}
      </label>
      <InputText
        id={id}
        type={passwordVisible[fieldName] ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full"
      />
      <i
        className={`absolute right-3 top-8 pi ${
          passwordVisible[fieldName] ? "pi-eye-slash" : "pi-eye"
        } cursor-pointer`}
        onClick={() =>
          setPasswordVisible((prev) => ({
            ...prev,
            [fieldName]: !prev[fieldName],
          }))
        }
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <Toast ref={toastRef} onHide={handleToastHide} />
      {error.server && (
        <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
          {error.server}
        </div>
      )}
      {renderPasswordField(
        "currentPassword",
        "Current Password",
        currentPassword,
        (e) => setCurrentPassword(e.target.value),
        "currentPassword"
      )}
      {renderPasswordField(
        "newPassword",
        "New Password",
        newPassword,
        (e) => setNewPassword(e.target.value),
        "newPassword"
      )}
      {renderPasswordField(
        "confirmPassword",
        "Confirm New Password",
        confirmPassword,
        (e) => setConfirmPassword(e.target.value),
        "confirmPassword"
      )}
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
