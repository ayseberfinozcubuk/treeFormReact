// InputForm.jsx
import React from "react";
import { useFormStore } from "../useFormStore";
import CancelButton from "./CancelButton";

const InputForm = ({ property, path, indentLevel }) => {
  const { formValues, updateFormValues } = useFormStore();
  const { Name, Label, Type } = property;

  const handleChange = (e) => {
    updateFormValues(`${path}.${Name}`, e.target.value);
  };

  return (
    <div style={{ marginLeft: `${indentLevel * 10}px` }}>
      <label>{Label}</label>
      <input
        type={Type === "Double" ? "number" : "text"}
        value={formValues[`${path}.${Name}`] || ""}
        onChange={handleChange}
      />
      <CancelButton sectionName={path} />
    </div>
  );
};

export default InputForm;
