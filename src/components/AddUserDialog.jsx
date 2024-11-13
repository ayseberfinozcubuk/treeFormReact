import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const AddUserDialog = ({ visible, onHide, onSave, roles }) => {
  const [newUser, setNewUser] = useState({
    UserName: "",
    Email: "",
    Role: "read", // Default role
    Password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Define the fields dynamically
  const fields = [
    {
      name: "UserName",
      label: "Username",
      type: "text",
      placeholder: "Enter username",
    },
    {
      name: "Email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
    },
    {
      name: "Password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
    },
    {
      name: "ConfirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm password",
    },
    {
      name: "Role",
      label: "Role",
      type: "dropdown",
      options: roles,
      placeholder: "Select Role",
    },
  ];

  const handleInputChange = (field, value) => {
    if (field === "ConfirmPassword") {
      setConfirmPassword(value);
    } else {
      setNewUser((prevUser) => ({
        ...prevUser,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    if (newUser.Password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      onSave(newUser);
      setNewUser({
        UserName: "",
        Email: "",
        Role: "read",
        Password: "",
      });
      setConfirmPassword("");
      setError("");
    }
  };

  const renderInputField = (field) => {
    if (field.type === "dropdown") {
      return (
        <Dropdown
          id={field.name}
          value={newUser[field.name]}
          options={field.options.map((role) => ({ label: role, value: role }))}
          onChange={(e) => handleInputChange(field.name, e.value)}
          placeholder={field.placeholder}
          className="w-full"
        />
      );
    } else if (field.type === "password") {
      const isPasswordField = field.name === "Password";
      const isConfirmPasswordField = field.name === "ConfirmPassword";

      return (
        <div className="relative">
          <InputText
            id={field.name}
            type={
              isPasswordField
                ? passwordVisible
                  ? "text"
                  : "password"
                : confirmPasswordVisible
                ? "text"
                : "password"
            }
            value={
              isConfirmPasswordField ? confirmPassword : newUser[field.name]
            }
            onChange={(e) =>
              handleInputChange(
                field.name,
                isConfirmPasswordField ? e.target.value : e.target.value
              )
            }
            placeholder={field.placeholder}
            className="w-full"
          />
          <i
            className={`absolute right-3 top-2 pi ${
              isPasswordField
                ? passwordVisible
                  ? "pi-eye-slash"
                  : "pi-eye"
                : confirmPasswordVisible
                ? "pi-eye-slash"
                : "pi-eye"
            } cursor-pointer`}
            onClick={() => {
              if (isPasswordField) setPasswordVisible(!passwordVisible);
              if (isConfirmPasswordField)
                setConfirmPasswordVisible(!confirmPasswordVisible);
            }}
          />
        </div>
      );
    } else {
      return (
        <InputText
          id={field.name}
          type={field.type}
          value={newUser[field.name]}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          className="w-full"
        />
      );
    }
  };

  return (
    <Dialog
      header="Add New User"
      visible={visible}
      style={{ width: "400px" }}
      onHide={onHide}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            onClick={handleSave}
            className="p-button-primary"
          />
        </div>
      }
    >
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">
          Enter User Information
        </h3>
        {error && (
          <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* Dynamically render fields */}
        {fields.map((field) => (
          <div key={field.name} className="p-field">
            <label htmlFor={field.name} className="block mb-1 text-gray-600">
              {field.label}
            </label>
            {renderInputField(field)}
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default AddUserDialog;
