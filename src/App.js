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
      alert("Please fill in all required fields before submitting.");
      return; // Prevent submission if there are empty mandatory fields
    }

    if (notInRangeField.length > 0) {
      alert("Please ensure all fields are within the allowed range.");
      return; // Prevent submission if there are fields out of range
    }

    console.log("Submitted Form Values: ", formValues);
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
    setFormStarted(false);
    setIsClicked(false);
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
