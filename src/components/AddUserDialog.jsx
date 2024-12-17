import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { validateField } from "../utils/validationUtils";
import useUserStore from "../store/useUserStore";
import SubmitButton from "./SubmitButton";
import CancelButton from "./CancelButton";

const AddUserDialog = ({ visible, onHide, onSave }) => {
  const { userData } = useUserStore();
  const initialUserState = { Role: "read" }; // Default state for new user
  const [newUser, setNewUser] = useState(initialUserState);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [passwordVisible, setPasswordVisible] = useState({});

  useEffect(() => {
    if (userData && newUser.Role === "read") {
      setNewUser((prevUser) => ({ ...prevUser, Role: "read" }));
    }
  }, [userData]);

  const resetFields = () => {
    setNewUser(initialUserState);
    setConfirmPassword("");
    setError({});
    setPasswordVisible({});
  };

  const handleInputChange = (fieldName, value) => {
    if (fieldName === "ConfirmPassword") {
      // Update ConfirmPassword state directly
      setConfirmPassword(value);
    } else {
      // Update other fields in the newUser state
      setNewUser((prevUser) => ({ ...prevUser, [fieldName]: value }));
    }

    // Find validation rules for the field
    const field = userData.Properties.find((prop) => prop.Name === fieldName);
    if (field?.ValidationRules) {
      const result = validateField(value, field.ValidationRules);
      setError((prevError) => ({
        ...prevError,
        [fieldName]: result.isValid ? "" : result.error,
      }));
    }

    // Handle password mismatch validation
    if (fieldName === "Password" || fieldName === "ConfirmPassword") {
      const passwordError =
        (fieldName === "Password" ? value : newUser.Password) !==
        (fieldName === "ConfirmPassword" ? value : confirmPassword)
          ? "Şifreler eşleşmiyor."
          : "";
      setError((prevError) => ({
        ...prevError,
        ConfirmPassword: passwordError,
      }));
    }
  };

  const handleSave = () => {
    const passwordError =
      newUser.Password !== confirmPassword ? "Şifreler eşleşmiyor." : "";
    const validationErrors = {};

    userData?.Properties.forEach((field) => {
      if (field.ValidationRules) {
        const result = validateField(
          newUser[field.Name] || "",
          field.ValidationRules
        );
        if (!result.isValid) validationErrors[field.Name] = result.error;
      }
    });

    setError({ ...validationErrors, ConfirmPassword: passwordError });

    if (!passwordError && Object.keys(validationErrors).length === 0) {
      onSave(newUser);
      resetFields(); // Reset fields after save
    }
  };

  const renderInputField = (field) => {
    const { Name, Label, Type, EnumValues } = field;
    const value =
      Name === "ConfirmPassword" ? confirmPassword : newUser[Name] || "";

    if (Type === "enum") {
      return (
        <Dropdown
          id={Name}
          value={newUser[Name]}
          options={EnumValues.map((option) => ({
            label: option.Label,
            value: option.Value,
          }))}
          onChange={(e) => handleInputChange(Name, e.value)}
          placeholder={Label}
          className="w-full"
        />
      );
    } else if (Type === "password") {
      return (
        <div className="relative">
          <InputText
            id={Name}
            type={passwordVisible[Name] ? "text" : "password"}
            value={value}
            onChange={(e) => handleInputChange(Name, e.target.value)}
            placeholder={Label}
            className="w-full pr-10" // Add padding-right to avoid overlap
          />
          <i
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 pi ${
              passwordVisible[Name] ? "pi-eye-slash" : "pi-eye"
            } cursor-pointer text-gray-500`}
            onClick={() =>
              setPasswordVisible((prev) => ({ ...prev, [Name]: !prev[Name] }))
            }
          />
        </div>
      );
    } else {
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
    }
  };

  if (!userData) return null;

  return (
    <Dialog
      header={
        <div className="text-center w-full font-semibold text-lg">
          Yeni Kullanıcı Ekle
        </div>
      }
      visible={visible}
      style={{ width: "400px" }}
      onHide={() => {
        resetFields(); // Reset fields on cancel
        onHide();
      }}
      footer={
        <div className="mt-1 flex justify-between items-center">
          <SubmitButton
            label="Kaydet"
            icon="pi pi-check"
            onClick={handleSave}
            className="bg-blue-500 text-white"
          />
          <CancelButton
            onClick={() => {
              resetFields(); // Reset fields on cancel
              onHide();
            }}
          />
        </div>
      }
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-600 mb-5">
          Yeni Kullanıcı için Bilgi Giriniz
        </h3>
        {userData.Properties.filter((field) => field.Type !== "Guid").map(
          (field) => (
            <div key={field.Name} className="p-field">
              <label htmlFor={field.Name} className="block mb-1 text-gray-600">
                {field.Label}
                {field.IsMandatory && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {renderInputField(field)}
              {error[field.Name] && (
                <small className="p-error text-red-500">
                  {error[field.Name]}
                </small>
              )}
            </div>
          )
        )}
      </div>
    </Dialog>
  );
};

export default AddUserDialog;
