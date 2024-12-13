import React, { useState, useEffect, useRef } from "react";
import DynamicForm from "./DynamicForm";
import FormButton from "./FormButton";
import SubmitButton from "./SubmitButton";
import axiosInstance from "../api/axiosInstance";
import { useFormStore } from "../store/useFormStore";
import { Toast } from "primereact/toast";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getNestedValue,
  convertToNestedJson,
  showToast,
  onToastClose,
} from "../utils/utils";

const AddNewEntity = ({ rootEntity: defaultRootEntity }) => {
  const location = useLocation();
  const rootEntity = location.state?.rootEntity || defaultRootEntity;

  const { formValues, resetFormValues, emptyMandatoryFields, notInRangeField } =
    useFormStore();

  const [formKey, setFormKey] = useState(0);
  const [formStarted, setFormStarted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const navigate = useNavigate();
  const toast = useRef(null); // Toast reference
  const toastTimeoutRef = useRef(null); // Reference to store the timeout ID

  useEffect(() => {
    resetFormValues();
  }, [resetFormValues, rootEntity]);

  const handleSubmit = () => {
    if (!formStarted) {
      alert("Lütfen göndermeden önce formu başlatın.");
      return;
    }
    // console.log("emptyMandatoryFields before submit: ", emptyMandatoryFields);

    const missingRequiredFields = emptyMandatoryFields.filter((field) => {
      const value = getNestedValue(formValues, field);
      // console.log(`Checking field ${field}:`, value);
      return value === "" || value === null;
    });
    // console.log("missingRequiredFields: ", missingRequiredFields);

    if (missingRequiredFields.length > 0) {
      // console.log("missingRequiredFields: ", missingRequiredFields);
      alert("Lütfen formu göndermeden önce tüm gerekli alanları doldurun.");
      return;
    }

    if (notInRangeField.length > 0) {
      alert("Lütfen bütün alanların beklenen aralıkta olduğundan emin olun.");
      return;
    }

    // console.log("formValues before nestedJson: ", formValues);

    const structuredJson = convertToNestedJson(formValues);
    // console.log("sending to back: ", structuredJson);

    axiosInstance
      .post(`/api/${rootEntity}`, structuredJson) // Base URL is already set
      .then((response) => {
        // console.log("Entity created successfully:", response.data);
        showToast(
          toast.current,
          "success",
          "Başarıyla Eklendi",
          `${rootEntity} başarıyla eklendi!`
        );

        setTimeout(() => {
          resetForm();
          navigate(`/list`, { state: { rootEntity } });
        }, 3000);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert("Yetkisiz. Lütfen yeniden giriş yapın.");
          navigate("/login");
        } else {
          console.error("Error submitting entity:", error);
          alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
      });

    resetForm();
  };

  const resetForm = () => {
    resetFormValues();
    setFormKey((prevKey) => prevKey + 1);
    setFormStarted(false);
    setIsClicked(false);
  };

  const handleStartForm = () => {
    setIsClicked(true);
    setFormStarted(true);
    const user = JSON.parse(localStorage.getItem("user"));
    formValues.CreatedBy = user.Id;
  };

  const handleRemoveForm = () => {
    resetFormValues();
    setFormStarted(false);
    setIsClicked(false);
  };

  return (
    <div className="main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 overflow-x-auto">
      {/* Container for title */}
      <div className="w-full max-w-3xl flex justify-center mb-8">
        <h1 className="text-xl font-semibold text-gray-800">
          Yeni {rootEntity} Ekle
        </h1>
      </div>

      <div className="responsive-container p-6 bg-white shadow-md rounded-md border border-gray-300 w-auto">
        <div className="mb-4 flex items-center">
          <label className="form-label text-gray-700 font-medium">
            {rootEntity}
          </label>
          <FormButton
            label={`${rootEntity} Ekle`}
            icon="pi pi-plus"
            onClick={handleStartForm}
            disabled={isClicked}
            className="ml-2"
          />
        </div>

        {formStarted && (
          <div>
            <DynamicForm
              key={formKey}
              entityName={rootEntity}
              isEditMode={true}
              onRemove={handleRemoveForm}
            />
          </div>
        )}

        <div className="mt-6">
          <SubmitButton
            icon="pi pi-check"
            onClick={handleSubmit}
            className="bg-blue-500 text-white"
          />
        </div>
      </div>

      {/* Toast container */}
      <Toast ref={toast} onHide={() => onToastClose(toastTimeoutRef.current)} />
    </div>
  );
};

export default AddNewEntity;
