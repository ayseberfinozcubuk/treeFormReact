import React, { useEffect, useState } from "react";
import { useFormStore } from "../store/useFormStore";

const InputForm = ({ property, path, indentLevel }) => {
  const {
    updateFormValues,
    formValues,
    addEmptyMandatoryField,
    addNotInRangeField,
    removeNotInRangeField,
  } = useFormStore();
  const { Name, Label, Type, Unit, MinMax, IsMandatory } = property;
  const [error, setError] = useState(""); // Track validation errors

  // Check if the field is required and empty, and add to emptyMandatoryFields
  useEffect(() => {
    if (
      IsMandatory &&
      (!formValues[`${path}.${Name}`] ||
        formValues[`${path}.${Name}`].trim() === "")
    ) {
      addEmptyMandatoryField(`${path}.${Name}`);
    }
  }, [IsMandatory, formValues, Name, path, addEmptyMandatoryField]);

  const handleChange = (e) => {
    const value = e.target.value;

    // Validate against min and max values
    if (MinMax) {
      const numValue = parseFloat(value);
      if (MinMax.Min !== undefined && numValue < MinMax.Min) {
        setError(`Value must be greater than or equal to ${MinMax.Min}`);
        addNotInRangeField(`${path}.${Name}`); // Add to notInRangeField if invalid
      } else if (MinMax.Max !== undefined && numValue > MinMax.Max) {
        setError(`Value must be less than or equal to ${MinMax.Max}`);
        addNotInRangeField(`${path}.${Name}`); // Add to notInRangeField if invalid
      } else {
        // Clear any existing errors if the value is valid
        setError("");
        removeNotInRangeField(`${path}.${Name}`); // Remove from notInRangeField if valid
      }
    }

    // Update form values in Zustand
    updateFormValues(`${path}.${Name}`, value);
  };

  return (
    <div className={`flex flex-col space-y-2 mb-4 ml-${indentLevel * 4}`}>
      {/* Label with optional asterisk for required fields */}
      <label className="form-label text-gray-700 font-medium min-w-[150px]">
        {Label}
        {IsMandatory && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input field */}
      <input
        type={Type === "Double" ? "number" : "text"}
        value={formValues[`${path}.${Name}`] || ""}
        onChange={handleChange}
        min={MinMax?.Min}
        max={MinMax?.Max}
        required={IsMandatory}
        className={`form-input border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md p-2 w-full`} // Highlight border in red on error
      />

      {/* Unit label */}
      {Unit && (
        <label className="form-label text-gray-700 font-medium min-w-[150px]">
          {Unit}
        </label>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputForm;
