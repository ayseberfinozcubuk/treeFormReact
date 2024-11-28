import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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

const EntityDetails = ({ rootEntity: defaultRootEntity }) => {
  const location = useLocation();
  const rootEntity = location.state?.rootEntity || defaultRootEntity;

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
    const resetUpdatedBy = async () => {
      console.log("RESET");
      try {
        if (formValues?.Id && formValues?.UpdatedBy) {
          await axiosInstance.patch(
            `/api/${rootEntity}/${rootEntity}-updatedby`,
            {
              id: formValues.Id,
              updatedBy: null,
            }
          );
        }
      } catch (error) {
        console.error("Error resetting UpdatedBy property:", error);
      }
    };

    // Function to handle browser navigation or refresh
    const handleBeforeUnload = (event) => {
      resetUpdatedBy(); // Reset UpdatedBy to null
      // Show a confirmation dialog (optional for unsaved changes)
      event.preventDefault();
      event.returnValue = ""; // Required for some browsers
    };

    // Add event listener for browser unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function when the component unmounts or on navigation
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      resetUpdatedBy();
    };
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.Role) {
      setRole(user.Role);
    }
  }, []);

  useEffect(() => {
    const fetchEntityById = async () => {
      try {
        const response = await axiosInstance.get(`/api/${rootEntity}/${id}`);
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

  const handleModeSwitch = async (checked) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.Id) {
      showToast(
        toast.current,
        "error",
        "Kullanıcı Hatası",
        "Geçersiz kullanıcı."
      );
      return;
    }

    console.log("formValues: ", formValues);
    if (formValues?.UpdatedBy && formValues.UpdatedBy !== user.Id) {
      console.log("UpdatedBy: ", formValues.UpdatedBy, " user id: ", user.Id);
      showToast(
        toast.current,
        "warn",
        "Erişim Engellendi",
        "Bu kayıt başka bir kullanıcı tarafından güncelleniyor."
      );
      return;
    }

    if (formValues?.UpdatedBy === null || formValues?.UpdatedBy === undefined) {
      try {
        await axiosInstance.patch(
          `/api/${rootEntity}/${rootEntity}-updatedby`,
          {
            id: formValues.Id,
            updatedBy: user.Id,
          }
        );

        // Fetch updated data
        const response = await axiosInstance.get(`/api/${rootEntity}/${id}`);
        setFormValues(response.data); // Update the store with the new data
      } catch (error) {
        console.error("Error updating UpdatedBy property:", error);
        showToast(
          toast.current,
          "error",
          "Güncelleme Hatası",
          "Düzenleme moduna geçerken bir hata oluştu."
        );
        return;
      }
    }

    setIsEditMode(checked); // Toggle edit mode
  };

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
      console.log("updated data sent to back: ", structuredJson);
      await axiosInstance.put(
        `http://localhost:5000/api/${rootEntity}/${id}`,
        structuredJson
      );

      // Reset the UpdatedBy property to null
      await axiosInstance.patch(`/api/${rootEntity}/${rootEntity}-updatedby`, {
        id: formValues.Id,
        updatedBy: null,
      });

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

  const handleCancelChanges = async () => {
    try {
      // Reset the UpdatedBy property to null
      await axiosInstance.patch(`/api/${rootEntity}/${rootEntity}-updatedby`, {
        id: formValues.Id,
        updatedBy: null,
      });

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
      toastTimeoutRef.current = timeoutFunction;
    } catch (error) {
      console.error("Error resetting UpdatedBy property:", error);
      showToast(
        toast.current,
        "error",
        "İptal Hatası",
        "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
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
                onChange={(e) => handleModeSwitch(e.value)}
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
