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
    <div
      className={`flex items-center space-x-4 mb-4 ml-${indentLevel * 4}`} // Adjust spacing between elements
    >
      {/* Label */}
      <label className="form-label text-gray-700 font-medium min-w-[150px]">
        {Label}
      </label>

      {/* Input field */}
      <input
        type={Type === "Double" ? "number" : "text"}
        value={formValues[`${path}.${Name}`] || ""}
        onChange={handleChange}
        min={MinMax?.Min}
        max={MinMax?.Max}
        required
        className="form-input border border-gray-300 rounded-md p-2 w-full" // Tailwind classes for input styling
      />
    </div>
  );
};

export default InputForm;
