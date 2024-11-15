import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { validateField } from "../utils/validationUtils";
import useUserStore from "../store/useUserStore";

const UserProfile = () => {
  const { userData, fetchUserData } = useUserStore();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [updatedUser, setUpdatedUser] = useState(storedUser);
  const [currentPasswords, setCurrentPasswords] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [passwordVisible, setPasswordVisible] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordFields, setPasswordFields] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  useEffect(() => {
    if (userData) {
      const passwords = userData.Properties.filter(
        (field) => field.Type === "password"
      );
      setPasswordFields(passwords);
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [userData, fetchUserData]);

  const resetFields = () => {
    setUpdatedUser(storedUser);
    setCurrentPasswords({});
    setConfirmPassword("");
    setError({});
    setPasswordVisible({});
    setShowPasswordFields(false);
    setIsEditing(false);
    setIsPasswordChanging(false);
  };

  const handleInputChange = (fieldName, value) => {
    setUpdatedUser((prevUser) => ({ ...prevUser, [fieldName]: value }));

    const field = userData.Properties.find((prop) => prop.Name === fieldName);
    if (field?.ValidationRules) {
      const result = validateField(value, field.ValidationRules);
      setError((prevError) => ({
        ...prevError,
        [fieldName]: result.isValid ? "" : result.error,
      }));
    }
  };

  const handleCurrentPasswordChange = (value) => {
    setCurrentPasswords((prev) => ({ ...prev, Password: value }));
  };

  const handleSave = () => {
    const passwordError =
      updatedUser.Password !== confirmPassword ? "Passwords do not match." : "";
    const validationErrors = {};

    userData?.Properties.forEach((field) => {
      if (field.ValidationRules) {
        const result = validateField(
          updatedUser[field.Name] || "",
          field.ValidationRules
        );
        if (!result.isValid) validationErrors[field.Name] = result.error;
      }
    });

    setError({ ...validationErrors, ConfirmPassword: passwordError });

    if (!passwordError && Object.keys(validationErrors).length === 0) {
      alert("User profile updated successfully!");
      resetFields();
    }
  };

  const handleChangePasswordButtonClick = () => {
    setShowPasswordFields(true);
    setIsPasswordChanging(true);
  };

  const renderField = (field) => {
    const { Name, Label, Type, EnumValues, IsMandatory } = field;
    const value = updatedUser[Name] || "";

    if (Type === "enum") {
      return (
        <div className="text-gray-800 p-2 bg-gray-100 rounded-md">
          {EnumValues.find((option) => option.Value === value)?.Label || "-"}
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

  const renderPasswordFields = () => {
    return passwordFields.map((field) => (
      <div key={field.Name} className="mb-6">
        {field.Name === "Password" && (
          <div className="p-field mb-4">
            <label
              htmlFor="current-Password"
              className="block mb-2 text-gray-700"
            >
              Şimdiki {field.Label}
            </label>
            <InputText
              id="current-Password"
              type={passwordVisible["current-Password"] ? "text" : "password"}
              value={currentPasswords.Password || ""}
              onChange={(e) => handleCurrentPasswordChange(e.target.value)}
              placeholder={`Şimdiki ${field.Label}`}
              className="w-full"
            />
            <i
              className={`absolute right-3 top-2 pi ${
                passwordVisible["current-Password"] ? "pi-eye-slash" : "pi-eye"
              } cursor-pointer`}
              onClick={() =>
                setPasswordVisible((prev) => ({
                  ...prev,
                  "current-Password": !prev["current-Password"],
                }))
              }
            />
          </div>
        )}
        <div className="p-field mb-4">
          <label htmlFor={field.Name} className="block mb-2 text-gray-700">
            Yeni {field.Label}
            {field.IsMandatory && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            <InputText
              id={field.Name}
              type={passwordVisible[field.Name] ? "text" : "password"}
              value={updatedUser[field.Name] || ""}
              onChange={(e) => handleInputChange(field.Name, e.target.value)}
              placeholder={`Yeni ${field.Label}`}
              className="w-full"
            />
            <i
              className={`absolute right-3 top-2 pi ${
                passwordVisible[field.Name] ? "pi-eye-slash" : "pi-eye"
              } cursor-pointer`}
              onClick={() =>
                setPasswordVisible((prev) => ({
                  ...prev,
                  [field.Name]: !prev[field.Name],
                }))
              }
            />
          </div>
        </div>
      </div>
    ));
  };

  if (!userData) {
    console.log("User data is missing:", userData);
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-md bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
      {userData.Properties.filter(
        (field) => field.Type !== "Guid" && field.Type !== "password"
      ).map((field) => (
        <div key={field.Name} className="p-field mb-4">
          <label htmlFor={field.Name} className="block mb-2 text-gray-700">
            {field.Label}
            {field.IsMandatory && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
          {error[field.Name] && (
            <small className="p-error text-red-500">{error[field.Name]}</small>
          )}
        </div>
      ))}
      {!showPasswordFields && (
        <Button
          label="Change Password"
          icon="pi pi-lock"
          className="p-button-secondary mt-4"
          onClick={handleChangePasswordButtonClick}
        />
      )}
      {showPasswordFields && renderPasswordFields()}
      <div className="flex justify-between mt-6">
        {isPasswordChanging || isEditing ? (
          <>
            {!isEditing && (
              <Button
                label="Düzenle"
                icon="pi pi-pencil"
                className="p-button-primary"
                onClick={() => setIsEditing(true)}
              />
            )}
            <Button
              label="İptal Et"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={resetFields}
            />
            <Button
              label="Kaydet"
              icon="pi pi-check"
              className="p-button-primary"
              onClick={handleSave}
            />
          </>
        ) : (
          <Button
            label="Edit"
            icon="pi pi-pencil"
            className="p-button-primary"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
