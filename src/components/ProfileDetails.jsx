import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import axiosInstance from "../api/axiosInstance";
import { showToast } from "../utils/utils";
import { Toast } from "primereact/toast";
import SubmitButton from "./SubmitButton";
import CancelButton from "./CancelButton";

const ProfileDetails = ({
  userData,
  updatedUser,
  setUpdatedUser,
  isEditing,
  setIsEditing,
  resetFields,
}) => {
  const toast = useRef(null);

  const handleInputChange = (fieldName, value) => {
    setUpdatedUser((prevUser) => ({ ...prevUser, [fieldName]: value }));
  };

  const handleSave = async () => {
    try {
      const userId = updatedUser?.Id;
      if (!userId) {
        alert("Kullanıcı ID'si eksik. Profil güncellenemiyor.");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (
        storedUser &&
        storedUser.UserName === updatedUser.UserName &&
        storedUser.Email === updatedUser.Email
      ) {
        showToast(
          toast.current,
          "info",
          "Değişiklik Yok",
          "Girilen bilgiler mevcut verilerle aynı. Güncelleme yapılmadı."
        );
        return;
      }

      const updatePayload = {
        UserName: updatedUser.UserName,
        Email: updatedUser.Email,
      };

      await axiosInstance.put(`/api/users/${userId}`, updatePayload);

      showToast(
        toast.current,
        "success",
        "Başarıyla Güncellendi",
        `${updatePayload.UserName} başarıyla güncellendi!`
      );
      setIsEditing(false);
    } catch (error) {
      showToast(
        toast.current,
        "error",
        "İşlem gerçekleşemedi",
        "Hata: İşlem gerçekleştirilemedi."
      );
    }
  };

  const renderField = (field) => {
    const { Name, Label, Type, EnumValues } = field;
    const value = updatedUser[Name] || "";

    const commonStyle =
      "w-full h-10 p-2 rounded-md border border-gray-300 bg-gray-100 text-gray-800";

    if (Type === "enum") {
      if (!isEditing) {
        const displayValue =
          EnumValues?.find((option) => option.Value === value)?.Label || "-";
        return (
          <div className={`${commonStyle} flex items-center`}>
            {displayValue}
          </div>
        );
      } else {
        return (
          <select
            id={Name}
            value={value}
            onChange={(e) => handleInputChange(Name, e.target.value)}
            className="w-full h-10 p-2 rounded-md border border-gray-300 text-gray-800 bg-white"
          >
            <option value="" disabled>
              {Label} Seçiniz
            </option>
            {EnumValues?.map((option) => (
              <option key={option.Value} value={option.Value}>
                {option.Label}
              </option>
            ))}
          </select>
        );
      }
    }

    if (!isEditing) {
      return (
        <div className={`${commonStyle} flex items-center`}>{value || "-"}</div>
      );
    }

    return (
      <InputText
        id={Name}
        type={Type === "mail" ? "email" : "text"}
        value={value}
        onChange={(e) => handleInputChange(Name, e.target.value)}
        placeholder={Label}
        className="w-full h-10 p-2 rounded-md border border-gray-300"
      />
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="block mb-1 text-gray-700 font-medium">
        {userData?.Properties?.filter(
          (field) => field.Type !== "Guid" && field.Type !== "password"
        ).map((field) => (
          <div key={field.Name} className="mb-4">
            {/* Label */}
            <label
              htmlFor={field.Name}
              className="block text-sm text-gray-700 font-medium mb-1"
              style={{
                minWidth: "150px",
                maxWidth: "250px",
                lineHeight: "1.25rem",
              }}
            >
              {field.Label}
            </label>

            {/* Field Value */}
            <div className="relative">{renderField(field)}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        {!isEditing ? (
          <SubmitButton
            label="Düzenle"
            icon="pi pi-pencil"
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            style={{ width: "150px" }}
          />
        ) : (
          <div className="flex items-center justify-between w-full">
            {/* Güncelle Button */}
            <SubmitButton
              label="Güncelle"
              icon="pi pi-check"
              onClick={handleSave}
              className="bg-blue-500 text-white hover:bg-blue-600"
              style={{ width: "150px" }}
            />

            {/* İptal Et Button */}
            <CancelButton
              onClick={() => {
                resetFields();
                setIsEditing(false);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
              style={{ width: "150px" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetails;
