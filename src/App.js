// App.js
import React, { useState } from "react";
import DynamicForm from "./components/DynamicForm";
import FormButton from "./components/FormButton"; // Import FormButton
import { useFormStore } from "./store/useFormStore";

const App = () => {
  const { formValues, resetFormValues } = useFormStore();
  const [formKey, setFormKey] = useState(0); // Used to reset the form by changing its key
  const [formStarted, setFormStarted] = useState(false); // Track if the form has started
  const [root, setRoot] = useState("EmiterNodePri"); // Variable to store the form name
  const [isClicked, setIsClicked] = useState(false); // Track button click

  // Function to handle form submission
  const handleSubmit = () => {
    console.log("Submitted Form Values: ", formValues); // Log form values on submission
    resetForm(); // Reset the form after submission
  };

  // Function to reset the form programmatically
  const resetForm = () => {
    resetFormValues(); // Clear the Zustand store
    setFormKey((prevKey) => prevKey + 1); // Increment key to re-render DynamicForm and reset inputs
    setFormStarted(false); // Reset to initial state
    setIsClicked(false); // Reset the button click
  };

  // Function to handle the "Add EmiterNodePri" click
  const handleStartForm = () => {
    setIsClicked(true); // Disable the button after the first click
    setFormStarted(true); // Show the DynamicForm
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8">
      {/* The header/title at the top */}
      <h1 className="text-xl font-semibold text-gray-800 mb-8">
        Dynamic Form Example
      </h1>

      {/* The form container */}
      <div className="w-full max-w-3xl p-6 bg-white shadow-md rounded-md border border-gray-300">
        {/* Show the "Add Root" button aligned with the form's indentation */}
        <div className="mb-4 flex items-center">
          <label className="form-label">{root}</label>
          <FormButton
            label={`Add ${root}`}
            icon="pi pi-plus"
            onClick={handleStartForm}
            disabled={isClicked} // Disable the button after the first click
            className="ml-2"
          />
        </div>

        {/* Once the button is clicked, render the form indented at the same level */}
        {formStarted && (
          <div>
            <DynamicForm
              key={formKey}
              jsonPath={`/SampleData/${root}.json`}
              indentLevel={1} // Start one tab to the right
            />
          </div>
        )}

        {/* Submit Button */}
        <FormButton
          label="Submit"
          icon="pi pi-check"
          onClick={handleSubmit}
          className="mt-6 bg-blue-500 text-white"
        />
      </div>
    </div>
  );
};

export default App;
