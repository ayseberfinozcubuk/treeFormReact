import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ListForm from "./ListForm";
import DeleteButton from "./DeleteButton";
import CancelButton from "./CancelButton"; // Import the new CancelButton
import { useFormStore } from "../store/useFormStore";
import { getNestedValue } from "../utils/utils.js"; // Adjust path if utils.js is in a different folder

const DynamicForm = ({
  entityName,
  path = "",
  indentLevel = 0,
  onRemove,
  isEditMode,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [entityId, setEntityId] = useState(null);

  const {
    formData,
    formValues,
    initialFormValues,
    removeFormSection,
    addIdValue,
    resetToInitialValues,
  } = useFormStore();

  useEffect(() => {
    setEntityId(addIdValue(path));
  }, []);

  useEffect(() => {
    setLoading(true);
    const entity = formData[entityName];
    if (entity) {
      setData(entity);
    } else {
      setError("Entity not found.");
    }
    setLoading(false);
  }, [entityName, formData]);

  const handleDelete = (path = path) => {
    removeFormSection(path);
    setIsVisible(false);
    onRemove && onRemove();
  };

  if (!isVisible) {
    return null;
  }

  const renderInput = (property) => {
    if (property.Type === "list") {
      return (
        <ListForm
          key={property.Name}
          property={property}
          path={path}
          entityId={entityId}
          indentLevel={indentLevel}
          isEditMode={isEditMode}
        />
      );
    }

    if (property.Type !== "Guid") {
      return (
        <InputForm
          key={property.Name}
          property={property}
          path={path}
          indentLevel={indentLevel}
          isEditMode={isEditMode}
        />
      );
    }
  };

  return (
    <div className="relative p-6 pt-12 border border-gray-200 rounded-md bg-white shadow-md">
      <DeleteButton
        onClick={handleDelete}
        className={isEditMode ? "visible" : "hidden"}
        style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }} // Add inline styling for position
      />
      {data?.Properties.map(renderInput)}
    </div>
  );
};

export default DynamicForm;
