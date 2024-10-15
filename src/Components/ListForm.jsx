// ListForm.jsx
import React, { useState } from "react";
import { Button } from "primereact/button";
import DynamicForm from "./DynamicForm";
import { useFormStore } from "../store/useFormStore";
import { v4 as uuidv4 } from "uuid";

const ListForm = ({ property, path, parentId, indentLevel }) => {
  const { subForms, addSubForm } = useFormStore();
  const { Name, Label, ListType } = property;
  const [storeButtons, setStoreButtons] = useState([]); // Track independent Store buttons
  const [isClicked, setIsClicked] = useState(false); // Track if the "Add Items" button has been clicked

  // Handler to create an "Add Store" button when "Add Stores" is clicked
  const handleAddListClick = () => {
    const newId = uuidv4();
    setStoreButtons((prevState) => [...prevState, newId]); // Create "Add Store" button dynamically
    setIsClicked(true); // Disable the button after clicking
  };

  // Handler for adding independent Store form when "Add Store" is clicked
  const handleAddStoreClick = (storeId) => {
    addSubForm(Name, `/SampleData/${ListType}.json`, `${parentId}.${storeId}`); // Create an independent Store form
  };

  return (
    <div style={{ marginLeft: `${indentLevel * 20}px` }}>
      {/* Add Stores Button (disable after one click) */}
      <label>{Label}</label>
      <Button
        type="button"
        label={`Add ${Name}`} // E.g., Add Stores
        icon="pi pi-plus"
        onClick={handleAddListClick}
        disabled={isClicked} // Disable after first click
        style={{ marginLeft: "10px" }}
      />

      {/* Dynamically created "Add Store" buttons */}
      {storeButtons.map((storeId) => (
        <div key={storeId} style={{ marginTop: "10px" }}>
          <Button
            type="button"
            label={`Add ${ListType}`} // E.g., Add Store
            icon="pi pi-plus"
            onClick={() => handleAddStoreClick(storeId)} // Create independent Store form
            style={{ marginLeft: "20px" }}
          />

          {/* Render dynamically created subforms */}
          {subForms[`${parentId}.${storeId}`]?.[Name]?.map((formPath, i) => (
            <DynamicForm
              key={i}
              jsonPath={formPath}
              path={`${path}.${Name}[${i}]`}
              parentId={`${parentId}.${storeId}.${Name}[${i}]`} // Pass unique ID for each new form instance
              indentLevel={indentLevel + 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ListForm;
