import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ListForm from "./ListForm";
import DeleteButton from "./DeleteButton";
import { useFormStore } from "../store/useFormStore";

const DynamicForm = ({
  entityName,
  path = "",
  parentId,
  indentLevel = 0,
  onRemove,
  isEditMode,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const { formData, removeFormSection, addIdValue } = useFormStore();

  useEffect(() => {
    addIdValue(path);
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

  if (loading) return <p>Loading form data...</p>;
  if (error) return <p>{error}</p>;

  const handleDelete = () => {
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
          parentId={parentId}
          indentLevel={indentLevel}
          isEditMode={isEditMode}
        />
      );
    }

    // Check for Guid type and apply the rules
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
        className={`absolute ${
          !isEditMode ? "hidden" : "visible"
        } top-2 right-2`}
      />
      {data?.Properties.map(renderInput)}
    </div>
  );
};

export default DynamicForm;
