import React, { useState, useEffect } from "react";
import DynamicForm from "./components/DynamicForm";
import FormButton from "./components/FormButton";
import { useFormStore } from "./store/useFormStore";

const App = () => {
  const {
    setFormData,
    formValues,
    resetFormValues,
    emptyMandatoryFields,
    notInRangeField,
  } = useFormStore();
  const [formKey, setFormKey] = useState(0);
  const [formStarted, setFormStarted] = useState(false);
  const [rootEntity, setRootEntity] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  // Load JSON data from public folder dynamically
  useEffect(() => {
    fetch("/SampleData/sampleData.json")
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
        setRootEntity(data[0].EntityName); // Set the initial root entity
      })
      .catch((error) => console.error("Error loading sampleData:", error));
  }, [setFormData]);

  const handleSubmit = () => {
    if (emptyMandatoryFields.length > 0) {
      console.log(`empty mandatory fields: ${emptyMandatoryFields}`);
      alert("Please fill in all required fields before submitting.");
      return; // Prevent submission if there are empty mandatory fields
    }

    if (notInRangeField.length > 0) {
      alert("Please ensure all fields are within the allowed range.");
      return; // Prevent submission if there are fields out of range
    }

    const convertToNestedJson = (formValues) => {
      const result = {};

      Object.keys(formValues).forEach((key) => {
        const value = formValues[key];
        const keys = key.split(".").filter(Boolean); // Split by dot and remove empty keys

        keys.reduce((acc, currKey, idx) => {
          // Check if the key is an array-like key (e.g., "Modes[0]")
          const arrayMatch = currKey.match(/(\w+)\[(\d+)\]/);
          if (arrayMatch) {
            const arrayKey = arrayMatch[1]; // e.g., "Modes"
            const arrayIndex = parseInt(arrayMatch[2], 10); // e.g., 0

            // Ensure the array exists at this key
            acc[arrayKey] = acc[arrayKey] || [];

            // Ensure the specific array index exists
            acc[arrayKey][arrayIndex] = acc[arrayKey][arrayIndex] || {};

            // If it's the last key, assign the value
            if (idx === keys.length - 1) {
              acc[arrayKey][arrayIndex] = value;
            }

            return acc[arrayKey][arrayIndex];
          } else {
            // Normal key handling (non-array)
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

    // You can now send `structuredJson` to the backend
    // Example: axios.post('/api/form-submit', structuredJson);

    resetForm(); // Reset the form after submission
  };

  const resetForm = () => {
    resetFormValues(); // Reset all form values, subforms, and validation fields
    setFormKey((prevKey) => prevKey + 1); // Ensure new form key to reset form
    setFormStarted(false);
    setIsClicked(false);
  };

  const handleStartForm = () => {
    setIsClicked(true);
    setFormStarted(true);
  };

  const handleRemoveForm = () => {
    resetFormValues(); // Reset Zustand store values when the form is removed
    setFormStarted(false);
    setIsClicked(false); // Make the Add button clickable again after form is cancelled
  };

  return (
    <div className="main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 overflow-x-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-8">
        Dynamic Form Example
      </h1>

      {/* Use w-auto to fit to content and avoid excessive width */}
      <div className="responsive-container p-6 bg-white shadow-md rounded-md border border-gray-300 w-auto">
        <div className="mb-4 flex items-center">
          <label className="form-label text-gray-700 font-medium">
            {rootEntity}
          </label>
          <FormButton
            label={`${rootEntity} Ekle`} // Add Button
            icon="pi pi-plus"
            onClick={handleStartForm} // Start form on click
            disabled={isClicked} // Disable button when form is started
            className="ml-2"
          />
        </div>

        {formStarted && (
          <div>
            <DynamicForm
              key={formKey}
              entityName={rootEntity}
              onRemove={handleRemoveForm} // Reset form when cancel is clicked
            />
          </div>
        )}

        {/* Ensure that the Submit button is in its own block */}
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

export default App;
