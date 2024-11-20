import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useFormStore } from "../store/useFormStore";
import { InputSwitch } from "primereact/inputswitch";
import DynamicForm from "./DynamicForm";
import SubmitButton from "./SubmitButton";
import CancelButton from "./CancelButton";
import { Toast } from "primereact/toast";
import { convertToNestedJson, areObjectsEqual } from "../utils/utils";

const EntityDetails = ({ rootEntity }) => {
  const {
    formValues,
    emptyMandatoryFields,
    setFormValues,
    resetFormValues,
    initialFormValues,
    notInRangeField,
  } = useFormStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [role, setRole] = useState("read");
  const [entityData, setEntityData] = useState(null);
  const toast = useRef(null); // Toast reference
  const { id } = useParams(); // Get id from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.Role) {
      setRole(user.Role);
    }
  }, []);

  useEffect(() => {
    // Fetch the entity by ID
    const fetchEntityById = async () => {
      try {
        const response = await axiosInstance.get(`/api/${rootEntity}/${id}`);
        //setEntityData(response.data);
        setFormValues(response.data); // Set form values in the store
      } catch (error) {
        console.error(`Error fetching ${rootEntity} by ID:`, error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchEntityById();
  }, [rootEntity, id, setFormValues, navigate]);

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const handleSubmit = async () => {
    // Check for missing required fields
    if (!formValues) return; // Ensure data is fetched

    const missingRequiredFields = emptyMandatoryFields.filter((field) => {
      const value = formValues[field];
      console.log(`Checking field ${field}:`, value);
      return value === "" || value === null;
    });

    if (missingRequiredFields.length > 0) {
      console.log("missingRequiredFields: ", missingRequiredFields);
      alert("Lütfen göndermeden önce tüm gerekli alanları doldurun.");
      return;
    }

    if (notInRangeField.length > 0) {
      alert("Please ensure all fields are within the allowed range.");
      return;
    }

    if (areObjectsEqual(initialFormValues, entityData)) {
      showToast(
        "info",
        "Değişiklik Yok",
        "Girilen bilgiler mevcut verilerle aynı. Güncelleme yapılmadı."
      );
      return;
    }

    console.log("formValues before nestedJson: ", formValues);

    const structuredJson = convertToNestedJson(entityData);

    try {
      await axiosInstance.put(
        `http://localhost:5000/api/${rootEntity}/${id}`,
        structuredJson
      );
      showToast(
        "success",
        "Başarıyla Güncellendi",
        `${rootEntity} başarıyla güncellendi!`
      );
      resetFormValues();
      navigate("/"); // Redirect back to the main list view after update
    } catch (error) {
      console.error("Update error:", error);
      showToast(
        "error",
        "Güncelleme Hatası",
        "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleCancelChanges = () => {
    showToast(
      "info",
      "Değişiklik İptal Edildi",
      "Değişiklikler iptal edilecek!"
    );
    resetFormValues();
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

        {entityData && (
          <>
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
          </>
        )}
      </div>

      {/* Toast container */}
      <Toast ref={toast} />
    </div>
  );
};

export default EntityDetails;
