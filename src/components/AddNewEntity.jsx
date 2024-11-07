import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import FormButton from "./FormButton";
import SubmitButton from "./SubmitButton";
import axios from "axios";
import { useFormStore } from "../store/useFormStore";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";
import { getNestedValue } from "../utils/utils";

const AddNewEntity = ({ rootEntity }) => {
  const { formValues, resetFormValues, emptyMandatoryFields, notInRangeField } =
    useFormStore();

  const [formKey, setFormKey] = useState(0);
  const [formStarted, setFormStarted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    resetFormValues();
  }, [resetFormValues, rootEntity]);

  const handleSubmit = () => {
    if (!formStarted) {
      alert("Please start the form before submitting.");
      return;
    }
    console.log("emptyMandatoryFields before submit: ", emptyMandatoryFields);

    const missingRequiredFields = emptyMandatoryFields.filter((field) => {
      const value = getNestedValue(formValues, field);
      console.log(`Checking field ${field}:`, value);
      return value === "" || value === null;
    });
    console.log("missingRequiredFields: ", missingRequiredFields);

    if (missingRequiredFields.length > 0) {
      console.log("missingRequiredFields: ", missingRequiredFields);
      alert("Lütfen göndermeden önce tüm gerekli alanları doldurun.");
      return;
    }

    if (notInRangeField.length > 0) {
      alert("Please ensure all fields are within the allowed range.");
      return;
    }

    const convertToNestedJson = (formValues) => {
      const result = {};

      Object.keys(formValues).forEach((key) => {
        const value = formValues[key];
        const keys = key.split(".").filter(Boolean);

        keys.reduce((acc, currKey, idx) => {
          const arrayMatch = currKey.match(/(\w+)\[(\d+)\]/);
          if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const arrayIndex = parseInt(arrayMatch[2], 10);

            acc[arrayKey] = acc[arrayKey] || [];
            acc[arrayKey][arrayIndex] = acc[arrayKey][arrayIndex] || {};

            if (idx === keys.length - 1) {
              acc[arrayKey][arrayIndex] = value;
            }

            return acc[arrayKey][arrayIndex];
          } else {
            if (idx === keys.length - 1) {
              acc[currKey] = value;
            } else {
              acc[currKey] = acc[currKey] || {};
            }
            return acc[currKey];
          }
        }, result);
      });

      return result;
    };

    const structuredJson = convertToNestedJson(formValues);
    // console.log("sending to back: ", structuredJson);

    axios
      .post(`http://localhost:5000/api/${rootEntity}`, structuredJson)
      .then((response) => {
        console.log("Entity created successfully:", response.data);
        resetForm();
      })
      .catch((error) => {
        console.error("Error submitting entity:", error);
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
  };

  const handleRemoveForm = () => {
    resetFormValues();
    setFormStarted(false);
    setIsClicked(false);
  };

  const handleBack = () => {
    navigate("/"); // Navigate to the viewing list page
  };

  return (
    <div className="main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 overflow-x-auto">
      {/* Container for BackButton */}
      <div className="w-full max-w-3xl mb-2">
        <BackButton onClick={handleBack} className="ml-0" />
      </div>

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
    </div>
  );
};

export default AddNewEntity;
