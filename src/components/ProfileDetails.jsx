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

      <div className="flex flex-col gap-2 mt-3">
        {!isEditing ? (
          <SubmitButton
            label="Düzenle"
            icon="pi pi-pencil"
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            style={{ width: "150px" }}
          />
        ) : (
          <div className="mt-3 flex justify-between items-center">
            <SubmitButton
              label="Güncelle"
              icon="pi pi-check"
              onClick={handleSave}
              className="bg-blue-500 text-white"
            />
            <CancelButton onClick={resetFields} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetails;
