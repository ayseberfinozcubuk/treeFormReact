import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import FormButton from "./FormButton";
import axios from "axios";
import { useFormStore } from "../store/useFormStore";

const AddNewEntity = ({ rootEntity }) => {
  const { formValues, resetFormValues, emptyMandatoryFields, notInRangeField } =
    useFormStore();

  const [formKey, setFormKey] = useState(0);
  const [formStarted, setFormStarted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Reset formValues when the component is mounted or rootEntity changes
  useEffect(() => {
    resetFormValues(); // Reset the form values
  }, [resetFormValues, rootEntity]); // Ensure this runs when the component is rendered

  const handleSubmit = () => {
    if (!formStarted) {
      alert("Please start the form before submitting.");
      return;
    }

    if (emptyMandatoryFields.length > 0) {
      alert("Please fill in all required fields before submitting.");
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

    // Log the structured JSON to verify
    console.log(
      "Structured Form Values as JSON: ",
      JSON.stringify(structuredJson, null, 2)
    );

    console.log("Sending JSON:", structuredJson);

    axios
      .post(`http://localhost:5000/api/${rootEntity}`, structuredJson)
      .then((response) => {
        console.log("Entity created successfully:", response.data);
        resetForm(); // Reset form only after successful submission
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

  return (
    <div className="main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 overflow-x-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-8">
        Add New Entity
      </h1>

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
              onRemove={handleRemoveForm}
              isEditMode={true}
            />
          </div>
        )}

        <div className="mt-6">
          <FormButton
            label="Submit"
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
