// InputForm.jsx
import React from "react";
import { useFormStore } from "../store/useFormStore";

const InputForm = ({ property, path, indentLevel }) => {
  const { updateFormValues, formValues } = useFormStore();
  const { Name, Label, Type, MinMax } = property;

  const handleChange = (e) => {
    updateFormValues(`${path}.${Name}`, e.target.value);
  };

  return (
    <div style={{ marginLeft: `${indentLevel * 20}px`, marginBottom: "10px" }}>
      <label className="form-label">{Label}</label>
      <input
        type={Type === "Double" ? "number" : "text"}
        value={formValues[`${path}.${Name}`] || ""}
        onChange={handleChange}
        min={MinMax?.Min}
        max={MinMax?.Max}
        required
        className="form-input"
      />
    </div>
  );
};

export default InputForm;
