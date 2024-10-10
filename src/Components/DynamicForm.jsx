// DynamicForm.jsx
import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ListForm from "./ListForm";

const DynamicForm = ({ jsonPath, path = "", parentId, indentLevel = 0 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p>Loading form data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const renderInput = (property) => {
    if (property.Type === "List") {
      return (
        <ListForm
          key={property.Name}
          property={property}
          path={path}
          parentId={parentId} // Unique parent ID for each level
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

  return <div>{data?.Properties.map(renderInput)}</div>;
};

export default DynamicForm;
