// App.js
import React, { useState } from "react";
import DynamicForm from "./components/DynamicForm";
import { Button } from "primereact/button";
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
    <div className="app-container">
      <h1>Dynamic Form Example</h1>

      {/* Show the "Add Root" button aligned with the form's indentation */}
      <div>
        <label className="form-label">{root}</label>
        <Button
          label={`Add ${root}`}
          icon="pi pi-plus"
          onClick={handleStartForm}
          disabled={isClicked} // Disable the button after the first click
          style={{ marginLeft: "10px" }}
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
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          backgroundColor: "#007bb5",
          color: "white",
          marginLeft: "20px", // Ensure the submit button is aligned with the form
        }}
      />
    </div>
  );
};

export default App;
