import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useFormStore } from "../store/useFormStore";
import { InputSwitch } from "primereact/inputswitch";
import DynamicForm from "./DynamicForm";
import SubmitButton from "./SubmitButton";
import CancelButton from "./CancelButton";
import { Toast } from "primereact/toast";
import {
  convertToNestedJson,
  areObjectsEqual,
  showToast,
  onToastClose,
} from "../utils/utils";

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
  const [isLoading, setIsLoading] = useState(true);

  const toast = useRef(null); // Toast reference
  const toastTimeoutRef = useRef(null); // Reference to store the timeout ID

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
        // setEntityData(response.data);
        setFormValues(response.data); // Set form values in the store
        setIsLoading(false); // Data is loaded
      } catch (error) {
        console.error(`Error fetching ${rootEntity} by ID:`, error);
        setIsLoading(false); // End loading even if there's an error
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchEntityById();
  }, [rootEntity, id, setFormValues, navigate]);

  const handleSubmit = async () => {
    if (!formValues || typeof formValues !== "object") {
      console.error("formValues is invalid or undefined.");
      showToast(
        toast.current,
        "error",
        "Form Hatası",
        "Form verileri eksik veya geçersiz."
      );
      return;
    }

    const missingRequiredFields = emptyMandatoryFields.filter((field) => {
      const value = formValues[field];
      return value === "" || value === null;
    });

    if (missingRequiredFields.length > 0) {
      showToast(
        toast.current,
        "error",
        "Eksik Alanlar",
        "Lütfen tüm gerekli alanları doldurun."
      );
      return;
    }

    if (notInRangeField.length > 0) {
      showToast(
        toast.current,
        "error",
        "Geçersiz Değerler",
        "Bazı alanlar izin verilen aralığın dışında."
      );
      return;
    }

    if (areObjectsEqual(initialFormValues, formValues)) {
      showToast(
        toast.current,
        "info",
        "Değişiklik Yok",
        "Girilen bilgiler mevcut verilerle aynı. Güncelleme yapılmadı."
      );
      return;
    }

    try {
      const structuredJson = convertToNestedJson(formValues);
      await axiosInstance.put(
        `http://localhost:5000/api/${rootEntity}/${id}`,
        structuredJson
      );

      // Show success toast and set timeout
      showToast(
        toast.current,
        "success",
        "Başarıyla Güncellendi",
        `${rootEntity} başarıyla güncellendi!`
      );

      const timeoutFunction = () => {
        resetFormValues();
        navigate("/");
      };

      toastTimeoutRef.current = setTimeout(timeoutFunction, 3000);

      // Store the function for immediate execution if the toast is dismissed
      toastTimeoutRef.current = timeoutFunction;
    } catch (error) {
      console.error("Update error:", error);
      showToast(
        toast.current,
        "error",
        "Güncelleme Hatası",
        "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  // Cancel changes handler
  const handleCancelChanges = () => {
    showToast(
      toast.current,
      "info",
      "Değişiklik İptal Edildi",
      "Değişiklikler iptal edilecek!"
    );

    const timeoutFunction = () => {
      resetFormValues();
      navigate("/");
    };

    toastTimeoutRef.current = setTimeout(timeoutFunction, 3000);

    // Store the function for immediate execution if the toast is dismissed
    toastTimeoutRef.current = timeoutFunction;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>{" "}
        {/* Replace with a spinner or any loading indicator */}
      </div>
    );
  }

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

        {formValues && (
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
      <Toast ref={toast} onHide={() => onToastClose(toastTimeoutRef.current)} />
    </div>
  );
};

export default EntityDetails;
