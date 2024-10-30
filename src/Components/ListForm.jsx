import React, { useEffect, useState, useRef } from "react";
import FormButton from "./FormButton";
import ExtendShrinkButton from "./ExtendShrinkButton";
import DynamicForm from "./DynamicForm";
import { useFormStore } from "../store/useFormStore";
import { v4 as uuidv4 } from "uuid";

const ListForm = ({ property, path, entityId, indentLevel, isEditMode }) => {
  const { formValues } = useFormStore();
  const { Name, Label, ListType } = property;
  const [storeForms, setStoreForms] = useState([]); // Array to store unique DynamicForm instances
  const [isExpanded, setIsExpanded] = useState(false);
  const effectExecutedRef = useRef(false); // Track if useEffect has run

  useEffect(() => {
    const keyPrefix = `${path}.${Name}`.replace(/^\./, ""); // Remove leading dot if present
    const arrayLength = getArrayLength(keyPrefix); // Get the number of array elements

    // Prevent repeated execution if effect has already run
    if (effectExecutedRef.current) return;

    // Populate initial storeForms based on array length if we are in view mode
    if (!isEditMode && arrayLength > 0) {
      const initialForms = Array.from({ length: arrayLength }).map(
        (_, index) => {
          const storeId = uuidv4(); // Generate a unique ID for each form
          const uniqueFormPath = `${keyPrefix}[${index}]`; // Consistent path with formValues keys
          return { id: storeId, path: uniqueFormPath, key: storeId };
        }
      );

      setStoreForms(initialForms); // Set initial forms with paths aligned to formValues
      effectExecutedRef.current = true;
    }
  }, [isEditMode, formValues, path, Name]);

  // Helper function to determine the number of array elements in formValues
  const getArrayLength = (keyPrefix) => {
    let count = 0;
    while (
      Object.keys(formValues).some((key) =>
        key.startsWith(`${keyPrefix}[${count}]`)
      )
    ) {
      count++;
    }
    return count;
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleAddListClick = () => {
    if (!isExpanded) {
      handleToggle();
    }
    handleAddStoreClick(); // Trigger adding a new store form entry
  };

  const handleAddStoreClick = () => {
    const storeId = uuidv4();
    const uniqueFormPath = `${path}.${Name}[${storeForms.length}]`; // Path based on existing count in storeForms
    setStoreForms((prevForms) => [
      ...prevForms,
      { id: storeId, path: uniqueFormPath, key: storeId },
    ]);
  };

  return (
    <div className={`space-x-4 mb-4 ml-${indentLevel * 4}`}>
      <div className="flex items-center mb-4">
        <label className="form-label text-gray-700 font-medium">{Label}</label>
        <div className="ml-2">
          <ExtendShrinkButton isExtended={isExpanded} onToggle={handleToggle} />
        </div>
        {/* Only show add button in edit mode */}
        <FormButton
          label={`${Label} Ekle`}
          icon="pi pi-plus"
          onClick={handleAddListClick}
          className={`ml-2 ${!isEditMode ? "hidden" : "visible"}`}
        />
      </div>

      <div className={isExpanded ? "visible" : "hidden"}>
        {/* Render each DynamicForm instance from storeForms */}
        {storeForms.map((form, index) => (
          <div key={form.key} style={{ marginTop: "10px" }}>
            <DynamicForm
              entityName={ListType}
              path={form.path} // Use unique path for each instance
              parentId={entityId}
              indentLevel={indentLevel + 1}
              isEditMode={isEditMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListForm;
