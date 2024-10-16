import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ListForm from "./ListForm";
import CancelButton from "./CancelButton";
import { useFormStore } from "../store/useFormStore";

const DynamicForm = ({ jsonPath, path = "", parentId, indentLevel = 0 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // State to track visibility

  const { removeFormSection } = useFormStore();

  useEffect(() => {
    setLoading(true);
    fetch(jsonPath)
      .then((response) => response.json())
      .then(setData)
      .catch((err) => {
        setError("Error loading form data.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [jsonPath]);

  if (loading) return <p>Loading form data...</p>;
  if (error) return <p>{error}</p>;

  // Handler for cancelling (removing) a section
  const handleCancel = () => {
    removeFormSection(path); // Remove the input values from the state (Zustand)
    setIsVisible(false); // Hide the component by setting visibility to false
  };

  if (!isVisible) {
    return null; // When isVisible is false, render nothing (removes the component)
  }

  const renderInput = (property) => {
    if (property.Type === "List") {
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
      {/* Cancel button positioned absolutely in the top-right corner */}
      <CancelButton
        onClick={handleCancel}
        className="absolute top-2 right-2" // Positioned in top-right corner
      />
      {/* Render the form inputs */}
      {data?.Properties.map(renderInput)}
    </div>
  );
};

export default DynamicForm;
