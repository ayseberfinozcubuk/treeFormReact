import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import SubmitButton from "./SubmitButton";
import CancelButton from "./CancelButton";
import axiosInstance from "../api/axiosInstance";
import { useFormStore } from "../store/useFormStore";
import { useEntityStore } from "../store/useEntityStore";
import { InputSwitch } from "primereact/inputswitch";
import { useNavigate } from "react-router-dom";
import { convertToNestedJson } from "../utils/utils";

const EntityDetails = ({ rootEntity }) => {
  const { formValues, setFormValues, emptyMandatoryFields, notInRangeField } =
    useFormStore();
  const { selectedEntity } = useEntityStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [role, setRole] = useState("read");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.Role) {
      setRole(user.Role);
    }
  }, []);

  useEffect(() => {
    if (selectedEntity) {
      setFormValues(selectedEntity);
    }
  }, [selectedEntity, setFormValues]);

  const handleSubmit = async () => {
    const missingRequiredFields = emptyMandatoryFields.filter(
      (field) => formValues[field] === "" || formValues[field] === null
    );

    if (missingRequiredFields.length > 0) {
      alert("Lütfen göndermeden önce tüm gerekli alanları doldurun.");
      return;
    }

    if (notInRangeField.length > 0) {
      alert("Lütfen tüm alanların izin verilen aralıkta olduğundan emin olun.");
      return;
    }

    const structuredJson = convertToNestedJson(formValues);

    try {
      await axiosInstance.put(
        `http://localhost:5000/api/${rootEntity}/${selectedEntity?.Id}`,
        structuredJson
      );
      alert("Entity başarıyla güncellendi!");
      navigate("/"); // Redirect back to main list view after update
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleCancelChanges = () => {
    alert("Değişiklikler iptal edilecek!");
    navigate("/"); // Redirect back to main list view after update
  };

  return (
    <div className="main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 overflow-x-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-8">
        {isEditMode ? `${rootEntity} Düzenle` : `${rootEntity} Görüntüle`}
      </h1>
      <div className="responsive-container p-6 bg-white shadow-md rounded-md border border-gray-300 w-auto">
        <div className="mb-4 flex items-center">
          <label className="form-label text-gray-700 font-medium">
            {rootEntity}
          </label>

          {role !== "read" && (
            <>
              <InputSwitch
                checked={isEditMode}
                onChange={(e) => setIsEditMode(e.value)}
                className="ml-4"
              />
              <span className="ml-2">
                {isEditMode ? "Düzenleme Modu" : "Görüntüleme Modu"}
              </span>
            </>
          )}
        </div>

        <DynamicForm entityName={rootEntity} isEditMode={isEditMode} />

        {isEditMode && (
          <>
            <SubmitButton
              label="Güncelle"
              icon="pi pi-check"
              onClick={handleSubmit}
              className="bg-blue-500 text-white"
            />
            <CancelButton onClick={handleCancelChanges} />
          </>
        )}
      </div>
    </div>
  );
};

export default EntityDetails;
