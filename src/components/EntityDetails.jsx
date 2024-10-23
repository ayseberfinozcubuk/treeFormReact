import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import FormButton from "./FormButton";
import axios from "axios";
import { useFormStore } from "../store/useFormStore";
import { useEntityStore } from "../store/useEntityStore"; // Import useEntityStore
import { InputSwitch } from "primereact/inputswitch"; // Import PrimeReact's InputSwitch

const EntityDetails = ({ rootEntity }) => {
  const {
    formValues,
    setFormValues,
    resetFormValues,
    emptyMandatoryFields,
    notInRangeField,
  } = useFormStore();

  const { selectedEntity } = useEntityStore(); // Get the selected entity from useEntityStore
  const [formKey, setFormKey] = useState(0);

  // State to track view or edit mode (default is view mode, hence false)
  const [isEditMode, setIsEditMode] = useState(false); // Default to view mode

  // Initialize form values from useEntityStore when component mounts
  useEffect(() => {
    if (selectedEntity) {
      console.log(`EntityDetails form values: ${formValues.EmitterName}`);
    }
  }, [selectedEntity, setFormValues]);

  const handleSubmit = () => {
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

    axios
      .post(`http://localhost:5000/api/${rootEntity}`, structuredJson)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    resetForm();
  };

  const resetForm = () => {
    resetFormValues();
    setFormKey((prevKey) => prevKey + 1);
  };

  const handleRemoveForm = () => {
    resetFormValues();
  };

  return (
    <div className="main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 overflow-x-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-8">
        {isEditMode ? "Edit Entity" : "View Entity"}
      </h1>

      <div className="responsive-container p-6 bg-white shadow-md rounded-md border border-gray-300 w-auto">
        <div className="mb-4 flex items-center">
          <label className="form-label text-gray-700 font-medium">
            {rootEntity}
          </label>
          {/* Use PrimeReact InputSwitch to toggle between Edit/View mode */}
          <InputSwitch
            checked={isEditMode}
            onChange={(e) => setIsEditMode(e.value)}
            className="ml-4"
          />
          <span className="ml-2">{isEditMode ? "Edit Mode" : "View Mode"}</span>
        </div>

        {/* Render form in view or edit mode based on isEditMode state */}
        <div>
          <DynamicForm
            key={formKey}
            entityName={rootEntity}
            onRemove={handleRemoveForm}
            isEditMode={isEditMode} // Pass the mode to DynamicForm
          />
        </div>

        {isEditMode && (
          <div className="mt-6">
            <FormButton
              label="Submit"
              icon="pi pi-check"
              onClick={handleSubmit}
              className="bg-blue-500 text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityDetails;
