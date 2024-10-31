import React, { useEffect, useState } from "react";
import { useFormStore } from "../store/useFormStore";

const InputForm = ({ property, path, indentLevel, isEditMode }) => {
  const {
    updateFormValues,
    formValues,
    addEmptyMandatoryField,
    addNotInRangeField,
    removeNotInRangeField,
  } = useFormStore();
  const { Name, Label, Type, Unit, MinMax, IsMandatory } = property;
  const [error, setError] = useState(""); // Track validation errors

  const formValueKey = path ? `${path}.${Name}` : Name; // Only add the dot if path is non-empty
  const formValue = formValues[formValueKey];

  // Check if the field is mandatory and ensure validation
  useEffect(() => {
    if (IsMandatory) {
      if (typeof formValue === "string" && formValue.trim() === "") {
        addEmptyMandatoryField(formValueKey);
      } else if (
        formValue === undefined ||
        formValue === null ||
        formValue === ""
      ) {
        addEmptyMandatoryField(formValueKey);
      }
    }
  }, [IsMandatory, formValueKey, formValue, addEmptyMandatoryField]);

  const handleChange = (e) => {
    let value = e.target.value;

    // If the field is empty, set it to null
    if (value === "") {
      value = null;
    } else {
      // If the type is int, convert to integer
      if (Type === "int") {
        value = parseInt(value, 10);
      }
      // If the type is double, convert to float
      else if (Type === "double") {
        value = parseFloat(value);
      }
    }

    // Validate against min and max values
    if (MinMax) {
      const numValue = parseFloat(value);
      if (MinMax.Min !== undefined && numValue < MinMax.Min) {
        setError(`Value must be greater than or equal to ${MinMax.Min}`);
        addNotInRangeField(formValueKey);
      } else if (MinMax.Max !== undefined && numValue > MinMax.Max) {
        setError(`Value must be less than or equal to ${MinMax.Max}`);
        addNotInRangeField(formValueKey);
      } else {
        setError("");
        removeNotInRangeField(formValueKey);
      }
    }

    // Update form values in Zustand
    updateFormValues(formValueKey, value);
  };

  return (
    <div
      className={`flex flex-row items-center space-x-2 mb-2 ml-${
        indentLevel * 3
      }`} // Reduced spacing and margin
    >
      {/* Label with optional asterisk for required fields */}
      <label className="text-sm text-gray-700 font-medium">
        {Label}
        {IsMandatory && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Conditional rendering: Input field in edit mode, plain text in view mode */}
      {isEditMode ? (
        <input
          type={Type === "int" || Type === "double" ? "number" : "text"}
          value={formValue ?? ""} // Use formValues if it exists, otherwise default to an empty string
          onChange={handleChange}
          min={MinMax?.Min}
          max={MinMax?.Max}
          required={IsMandatory}
          className={`border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md p-1 w-48 text-sm`} // Reduced width, padding, and font size
        />
      ) : (
        <div
          className={`border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md p-1 w-48 text-gray-900 bg-gray-100 text-sm`} // Smaller font, padding, and width
          style={{ pointerEvents: "none" }} // Makes the div non-interactive
        >
          {formValue ?? "-"}
        </div>
      )}

      {/* Unit label if applicable */}
      {Unit && (
        <label className="text-sm text-gray-600 font-medium">{Unit}</label>
      )}

      {/* Error message if validation fails */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputForm;
