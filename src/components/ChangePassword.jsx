import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { validateField } from "../utils/validationUtils";
import axiosInstance from "../api/axiosInstance";
import SubmitButton from "./SubmitButton";
import CancelButton from "./CancelButton";

const ChangePassword = ({ userData, updatedUser, resetFields }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [failedAttempts, setFailedAttempts] = useState(
    parseInt(localStorage.getItem("changePasswordFailedAttempts")) || 0
  );
  const [timeoutRemaining, setTimeoutRemaining] = useState(
    parseInt(localStorage.getItem("changePasswordTimeoutRemaining")) || 0
  );
  const toastRef = useRef(null);

  const MAX_ATTEMPTS = 3;
  const TIMEOUT_DURATION = 10; // 10 seconds

  useEffect(() => {
    if (timeoutRemaining > 0) {
      setError({
        server: `Çok fazla başarısız deneme. Lütfen ${timeoutRemaining} saniye bekleyin ve tekrar deneyin.`,
      });

      const timer = setInterval(() => {
        setTimeoutRemaining((prev) => {
          const updatedTimeout = prev - 1;
          localStorage.setItem(
            "changePasswordTimeoutRemaining",
            updatedTimeout
          );
          setError({
            server: `Çok fazla başarısız deneme. Lütfen ${updatedTimeout} saniye bekleyin ve tekrar deneyin.`,
          });
          return updatedTimeout;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      localStorage.removeItem("changePasswordTimeoutRemaining");
      setError({}); // Clear error message after timeout ends
    }
  }, [timeoutRemaining]);

  useEffect(() => {
    localStorage.setItem("changePasswordFailedAttempts", failedAttempts);
  }, [failedAttempts]);

  const handleSave = async () => {
    setError({});
    if (timeoutRemaining > 0) {
      setError({
        server: `Çok fazla başarısız deneme. Lütfen ${timeoutRemaining} saniye bekleyin ve tekrar deneyin.`,
      });
      return;
    }

    try {
      const response = await axiosInstance.put(
        `http://localhost:5000/api/users/${updatedUser.Id}/change-password`,
        {
          CurrentPassword: currentPassword,
          NewPassword: newPassword,
          ConfirmNewPassword: confirmPassword,
        }
      );

      toastRef.current.show({
        severity: "success",
        summary: "Başarılı",
        detail: "Şifreniz başarıyla güncellendi!",
        life: 3000,
        closable: true,
      });

      setTimeout(() => {
        resetFields();
        setFailedAttempts(0);
        setTimeoutRemaining(0);
        localStorage.removeItem("changePasswordFailedAttempts");
        localStorage.removeItem("changePasswordTimeoutRemaining");
      }, 3000);
    } catch (err) {
      setFailedAttempts((prev) => prev + 1);

      if (failedAttempts + 1 >= MAX_ATTEMPTS) {
        setTimeoutRemaining(TIMEOUT_DURATION);
        setFailedAttempts(0);
        localStorage.setItem(
          "changePasswordTimeoutRemaining",
          TIMEOUT_DURATION
        );
        setError({
          server: `Çok fazla başarısız deneme. Lütfen ${TIMEOUT_DURATION} saniye bekleyin.`,
        });
      } else {
        const { response } = err;
        if (response && response.data) {
          setError({
            server: `Mevcut şifre hatalı. ${
              MAX_ATTEMPTS - (failedAttempts + 1)
            } deneme hakkınız kaldı.`,
          });
        } else {
          setError({ server: "Bilinmeyen bir hata oluştu." });
        }
      }
    }
  };

  const validateNewPassword = () => {
    const field = userData.Properties.find((prop) => prop.Name === "Password");
    const validationErrors = [];

    if (field?.ValidationRules) {
      const result = validateField(newPassword, field.ValidationRules);
      if (!result.isValid) {
        validationErrors.push(result.error);
      }
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
      <div className="relative">
        <InputText
          id={id}
          type={passwordVisible[fieldName] ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={`${label.toLowerCase()} değerini giriniz`}
          className="w-full pr-10" // Add padding-right to prevent overlap
        />
        <i
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 pi ${
            passwordVisible[fieldName] ? "pi-eye-slash" : "pi-eye"
          } cursor-pointer text-gray-500`}
          onClick={() =>
            setPasswordVisible((prev) => ({
              ...prev,
              [fieldName]: !prev[fieldName],
            }))
          }
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Toast ref={toastRef} />
      {error.server && (
        <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
          {error.server}
        </div>
      )}
      {renderPasswordField(
        "currentPassword",
        "Mevcut Şifre",
        currentPassword,
        (e) => setCurrentPassword(e.target.value),
        "currentPassword"
      )}
      {renderPasswordField(
        "newPassword",
        "Yeni Şifre",
        newPassword,
        (e) => setNewPassword(e.target.value),
        "newPassword"
      )}
      {renderPasswordField(
        "confirmPassword",
        "Yeni Şifre Doğrulaması",
        confirmPassword,
        (e) => setConfirmPassword(e.target.value),
        "confirmPassword"
      )}
      {error.validation && (
        <small className="p-error text-red-500">{error.validation}</small>
      )}
      <div className="mt-3 flex justify-between items-center">
        <SubmitButton
          label="Kaydet"
          icon="pi pi-check"
          onClick={handleValidateAndSave}
          className="bg-blue-500 text-white"
        />
        <CancelButton onClick={resetFields} className="bg-red-500 text-white" />
      </div>
    </div>
  );
};

export default ChangePassword;
