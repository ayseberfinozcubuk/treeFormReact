import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ListForm from "./ListForm";
import DeleteButton from "./DeleteButton";
import { useFormStore } from "../store/useFormStore";
import { getNestedValue } from "../utils/utils.js";

const DynamicForm = ({
  entityName,
  path = "",
  indentLevel = 0,
  onRemove,
  isEditMode,
  parentId,
  parentName,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [entityId, setEntityId] = useState(null);

  const {
    formData,
    formValues,
    updateFormValues,
    generateNewId,
    addIdToFormValues,
  } = useFormStore();

  useEffect(() => {
    if (!entityId) {
      const newId = generateNewId();
      setEntityId(newId);
      addIdToFormValues(path, newId); // Add ID to formValues after setting it in local state
    }
  }, [entityId, path, generateNewId, addIdToFormValues]);

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

  const handleDelete = () => {
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
          entityName={entityName}
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
    } else if (property.Name === `${parentName}Id`) {
      const currentPath = path ? `${path}.${property.Name}` : property.Name;
      const currentValue = getNestedValue(formValues, currentPath);

      if (currentValue !== parentId) {
        updateFormValues(currentPath, parentId);
      }

      return null; // Render nothing or replace this line if other actions are needed
    }
  };

  return (
    <div className="relative p-6 pt-12 border border-gray-200 rounded-md bg-white shadow-md">
      <DeleteButton
        onClick={handleDelete}
        className={isEditMode ? "visible" : "hidden"}
        style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
      />
      {data?.Properties.map(renderInput)}
    </div>
  );
};

export default DynamicForm;
