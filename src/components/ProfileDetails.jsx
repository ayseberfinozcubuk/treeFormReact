import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axiosInstance from "../api/axiosInstance";
import { showToast } from "../utils/utils";
import { Toast } from "primereact/toast";

const ProfileDetails = ({
  userData,
  updatedUser,
  setUpdatedUser,
  isEditing,
  setIsEditing,
  resetFields,
}) => {
  const toast = useRef(null); // Toast reference

  const handleInputChange = (fieldName, value) => {
    setUpdatedUser((prevUser) => ({ ...prevUser, [fieldName]: value }));
  };

  const handleSave = async () => {
    try {
      const userId = updatedUser?.Id; // Assuming 'Id' is part of the user data
      if (!userId) {
        alert("Kullanıcı ID'si eksik. Profil güncellenemiyor");
        return;
      }

      // Retrieve stored user data from localStorage
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

      // Send updated profile to the server
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
      <Toast ref={toast} />
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
