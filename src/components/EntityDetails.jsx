import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import FormButton from "./FormButton";
import axios from "axios";
import { useFormStore } from "../store/useFormStore";
import { useEntityStore } from "../store/useEntityStore";
import { InputSwitch } from "primereact/inputswitch";

const EntityDetails = ({ rootEntity }) => {
  const {
    formValues,
    setFormValues,
    resetFormValues,
    emptyMandatoryFields,
    notInRangeField,
  } = useFormStore();

  const { selectedEntity } = useEntityStore();
  const [formKey, setFormKey] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (selectedEntity) {
      setFormValues(selectedEntity);
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

    // PUT request with the entity's existing ID
    axios
      .put(
        `http://localhost:5000/api/${rootEntity}/${selectedEntity?.Id}`,
        structuredJson
      )
      .then((response) => {
        console.log("Update successful:", response.data);
      })
      .catch((error) => {
        console.error("Update error:", error);
      });

    resetForm();
  };

  const resetForm = () => {
    resetFormValues();
    setFormKey((prevKey) => prevKey + 1);
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
          <InputSwitch
            checked={isEditMode}
            onChange={(e) => setIsEditMode(e.value)}
            className="ml-4"
          />
          <span className="ml-2">{isEditMode ? "Edit Mode" : "View Mode"}</span>
        </div>

        <div>
          <DynamicForm
            key={formKey}
            entityName={rootEntity}
            onRemove={resetFormValues}
            isEditMode={isEditMode}
          />
        </div>

        {isEditMode && (
          <div className="mt-6">
            <FormButton
              label="Update Entity"
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
