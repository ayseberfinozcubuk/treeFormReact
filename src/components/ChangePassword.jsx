import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const ChangePassword = ({
  userData,
  updatedUser,
  setUpdatedUser,
  resetFields,
}) => {
  const handleInputChange = (fieldName, value) => {
    setUpdatedUser((prevUser) => ({ ...prevUser, [fieldName]: value }));
  };

  return (
    <>
      {userData?.Properties?.filter((field) => field.Type === "password").map(
        (field) => (
          <div key={field.Name} className="mb-4">
            <label htmlFor={field.Name} className="block mb-2 text-gray-700">
              {field.Label}
            </label>
            <InputText
              id={field.Name}
              type="password"
              placeholder={`Yeni ${field.Label}`}
              className="w-full"
              onChange={(e) => handleInputChange(field.Name, e.target.value)}
            />
          </div>
        )
      )}
      <div className="flex justify-between mt-4">
        <Button
          label="İptal Et"
          icon="pi pi-times"
          className="p-button-secondary"
          onClick={resetFields}
          style={{ width: "150px" }}
        />
        <Button
          label="Şifreyi Güncelle"
          icon="pi pi-check"
          className="p-button-primary"
          style={{ width: "150px" }}
        />
      </div>
    </>
  );
};

export default ChangePassword;
