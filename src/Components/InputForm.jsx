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

  const formValueKey = path ? `${path}.${Name}` : Name; // Only add the dot if path is non-empty
  const formValue = formValues[formValueKey];

  // console.log("Input form property: ", property);
  // console.log("Form values in component aaaa:", formValues); // Log here to ensure it's being passed correctly
  console.log("formValues: ", formValues);
  console.log("formValueKey: ", formValueKey);
  // console.log("name: ", Name);
  useEffect(() => {
    // console.log(`form values inside input: ${formValues.emitterName}`);
    console.log("Form values in component bbbb:", formValue); // Log here to ensure it's being passed correctly

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
  }, [
    IsMandatory,
    formValues,
    formValueKey,
    addEmptyMandatoryField,
    formValue,
  ]);

  const handleChange = (e) => {
    let value = e.target.value;

    // If the type is int, convert to integer
    if (Type === "int") {
      value = parseInt(value, 10);
    }
    // If the type is double, convert to float
    else if (Type === "double") {
      value = parseFloat(value);
    }

    // Validate against min and max values
    if (MinMax) {
      const numValue = parseFloat(value);
      if (MinMax.Min !== undefined && numValue < MinMax.Min) {
        setError(`Value must be greater than or equal to ${MinMax.Min}`);
        addNotInRangeField(formValueKey); // Add to notInRangeField if invalid
      } else if (MinMax.Max !== undefined && numValue > MinMax.Max) {
        setError(`Value must be less than or equal to ${MinMax.Max}`);
        addNotInRangeField(formValueKey); // Add to notInRangeField if invalid
      } else {
        // Clear any existing errors if the value is valid
        setError("");
        removeNotInRangeField(formValueKey); // Remove from notInRangeField if valid
      }
    }

    // Update form values in Zustand
    updateFormValues(formValueKey, value);
  };

  return (
    <div
      className={`flex flex-row items-center space-x-4 mb-4 ml-${
        indentLevel * 4
      }`}
    >
      {/* Label with optional asterisk for required fields */}
      <label className="form-label text-gray-700 font-medium">
        {Label}
        {IsMandatory && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input field with fixed width */}
      <input
        type={Type === "int" || Type === "double" ? "number" : "text"} // Use number type for int and double
        value={formValue ?? ""} // Use formValues if it exists, otherwise default to an empty string
        onChange={handleChange}
        min={MinMax?.Min}
        max={MinMax?.Max}
        required={IsMandatory}
        className={`form-input border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md p-2 w-64`} // Fixed width for input field
      />

      {/* Unit label */}
      {Unit && (
        <label className="form-label text-gray-700 font-medium">{Unit}</label>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputForm;
