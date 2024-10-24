import React, { useEffect, useState, useRef } from "react";
import FormButton from "./FormButton";
import ExtendShrinkButton from "./ExtendShrinkButton";
import DynamicForm from "./DynamicForm";
import { useFormStore } from "../store/useFormStore";
import { v4 as uuidv4 } from "uuid";

const ListForm = ({ property, path, parentId, indentLevel, isEditMode }) => {
  const { subForms, formValues } = useFormStore();
  const { Name, Label, ListType } = property;
  const [storeButtons, setStoreButtons] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Ref to track if handleAddListClick has already been triggered
  const effectExecutedRef = useRef(false); // Ref to track whether the effect has already run

  useEffect(() => {
    const keyPrefix = `${path}.${Name}`.replace(/^\./, ""); // Remove leading dot if present
    const arrayLength = getArrayLength(keyPrefix); // Get the number of array elements

    // If the effect has already run, exit early
    if (effectExecutedRef.current) {
      return;
    }

    // If not in edit mode and there are existing elements in formValues
    if (!isEditMode && arrayLength > 0 && !isClicked) {
      const newId = uuidv4();
      setStoreButtons((prevState) => [...prevState, newId]);
      // Automatically simulate the store button clicks for each existing entry
      for (let i = 0; i < arrayLength; i++) {
        handleAddStoreClick(newId); // Call handleAddStoreClick with the new storeId
      }
      setIsClicked(true); // Mark as clicked to prevent further automatic clicks
      effectExecutedRef.current = true; // Set the ref to indicate that the effect has run
    }
  }, [isEditMode, formValues, path, Name, isClicked]);

  // Helper function to determine the number of array elements (e.g., Modes[0], Modes[1], etc.)
  const getArrayLength = (keyPrefix) => {
    let count = 0;

    // Loop until formValues has no key that matches the pattern `${keyPrefix}[${count}]`
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

    const newId = uuidv4();
    setStoreButtons((prevState) => [...prevState, newId]);
    setIsClicked(true);
  };

  const handleAddStoreClick = (storeId) => {
    const { formData, addSubForm } = useFormStore.getState();
    const subFormData = formData[ListType];

    if (!subFormData) {
      console.error(`No data found for ListType: ${ListType}`);
      return;
    }
    addSubForm(Name, subFormData, `${parentId}.${storeId}`);
  };

  return (
    <div className={`space-x-4 mb-4 ml-${indentLevel * 4}`}>
      <div className="flex items-center mb-4">
        <label className="form-label text-gray-700 font-medium">{Label}</label>
        <div className="ml-2">
          <ExtendShrinkButton isExtended={isExpanded} onToggle={handleToggle} />
        </div>

        {/* Add Tailwind CSS class to hide the button if not in edit mode */}
        <FormButton
          label={`${Label} Ekle`}
          icon="pi pi-plus"
          onClick={handleAddListClick}
          disabled={isClicked}
          className={`ml-2 ${!isEditMode ? "hidden" : "visible"}`} // Hide button if not in edit mode
        />
      </div>

      <div className={isExpanded ? "visible" : "hidden"}>
        {storeButtons.map((storeId) => (
          <div key={storeId} style={{ marginTop: "10px" }}>
            {/* Add Tailwind CSS class to hide the store button if not in edit mode */}
            <FormButton
              label={`${ListType} Ekle`}
              icon="pi pi-plus"
              onClick={() => handleAddStoreClick(storeId)}
              className={`ml-4 mb-4 ${!isEditMode ? "hidden" : "visible"}`} // Hide button if not in edit mode
            />
            {subForms[`${parentId}.${storeId}`]?.[Name]?.map((formPath, i) => (
              <DynamicForm
                key={i}
                entityName={ListType}
                path={path ? `${path}.${Name}[${i}]` : `${Name}[${i}]`} // Conditionally concatenate path
                parentId={
                  parentId
                    ? `${parentId}.${storeId}.${Name}[${i}]`
                    : `${storeId}.${Name}[${i}]`
                } // Conditionally concatenate parentId
                indentLevel={indentLevel + 1}
                isEditMode={isEditMode}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListForm;
