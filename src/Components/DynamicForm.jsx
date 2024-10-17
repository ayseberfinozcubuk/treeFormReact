import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ListForm from "./ListForm";
import CancelButton from "./CancelButton";
import { useFormStore } from "../store/useFormStore";

const DynamicForm = ({
  entityName,
  path = "",
  parentId,
  indentLevel = 0,
  onRemove, // Passed from App.js if available
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const { formData, removeFormSection } = useFormStore();

  useEffect(() => {
    setLoading(true);
    const entity = formData[entityName]; // Access formData as a dictionary
    if (entity) {
      setData(entity);
    } else {
      setError("Entity not found.");
    }
    setLoading(false);
  }, [entityName, formData]);

  if (loading) return <p>Loading form data...</p>;
  if (error) return <p>{error}</p>;

  const handleCancel = () => {
    if (onRemove) {
      onRemove(); // Use the onRemove function if provided
    } else {
      // Default logic if onRemove is not provided
      removeFormSection(path);
      setIsVisible(false);
    }
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
          parentId={parentId}
          indentLevel={indentLevel}
        />
      );
    }
    return (
      <InputForm
        key={property.Name}
        property={property}
        path={path}
        indentLevel={indentLevel}
      />
    );
  };

  return (
    <div
      className={`relative p-6 pt-12 border border-gray-200 rounded-md bg-white shadow-md`}
    >
      <CancelButton onClick={handleCancel} className="absolute top-2 right-2" />
      {data?.Properties.map(renderInput)}
    </div>
  );
};

export default DynamicForm;
