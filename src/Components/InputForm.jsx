import React, { useEffect, useState } from "react";
import { useFormStore } from "../store/useFormStore";
import { validateField } from "../utils/validationUtils"; // Import the validation utility

const InputForm = ({ property, path, isEditMode }) => {
  const {
    updateFormValues,
    formValues,
    addEmptyMandatoryField,
    emptyMandatoryFields,
    addNotInRangeField,
    removeNotInRangeField,
  } = useFormStore();
  const {
    Name,
    Label,
    Type,
    Unit,
    MinMax,
    IsMandatory,
    EnumValues,
    IsCalculated,
    ValidationRules, // Include ValidationRules from property
  } = property;

  const [error, setError] = useState(""); // Track validation errors

  const formValueKey = path ? `${path}.${Name}` : Name;
  const formValue = formValues[formValueKey];

  useEffect(() => {
    console.log("emptyMandatoryFields", emptyMandatoryFields);
    if (IsMandatory) {
      console.log(Name, " is mandatory!");
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

    if (value === "") {
      value = null;
    } else {
      if (Type === "int") {
        value = parseInt(value, 10);
      } else if (Type === "double") {
        value = parseFloat(value);
      }
    }

    // Validation for MinMax values
    if (MinMax && value !== null) {
      const numValue = parseFloat(value);
      if (MinMax.Min !== undefined && numValue < MinMax.Min) {
        setError(`Value must be greater than or equal to ${MinMax.Min}`);
        addNotInRangeField(formValueKey);
      } else if (MinMax.Max !== undefined && numValue > MinMax.Max) {
        setError(`Value must be less than or equal to ${MinMax.Max}`);
        addNotInRangeField(formValueKey);
      } else {
        removeNotInRangeField(formValueKey);
      }
    }

    // Validation based on ValidationRules
    const { isValid, error: validationError } = validateField(
      value,
      ValidationRules
    );
    if (!isValid) {
      setError(validationError);
      addNotInRangeField(formValueKey);
    } else if (
      !MinMax ||
      (MinMax && value >= MinMax.Min && value <= MinMax.Max)
    ) {
      // Only clear the error if there’s no MinMax error and ValidationRules pass
      setError("");
      removeNotInRangeField(formValueKey);
    }

    // Update form values in Zustand
    updateFormValues(formValueKey, value);
  };

  const selectedLabel = EnumValues?.find(
    (enumOption) => enumOption.Value === formValue
  )?.Label;

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <label
          className="text-sm text-gray-700 font-medium"
          style={{
            minWidth: "150px",
            maxWidth: "150px",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            lineHeight: "1.25rem",
          }}
        >
          {Label}
          {IsMandatory && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="flex flex-col">
          {IsCalculated !== true && isEditMode ? (
            Type === "enum" && EnumValues ? (
              <select
                value={formValue ?? ""}
                onChange={handleChange}
                className={`border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md p-1 w-48 text-sm ml-2`}
              >
                <option value="">Select {Label}</option>
                {EnumValues.map((enumOption) => (
                  <option key={enumOption.Value} value={enumOption.Value}>
                    {enumOption.Label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={Type === "int" || Type === "double" ? "number" : "text"}
                value={formValue ?? ""}
                onChange={handleChange}
                min={MinMax?.Min}
                max={MinMax?.Max}
                required={IsMandatory}
                className={`border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md p-1 w-48 text-sm ml-2`}
              />
            )
          ) : (
            <div
              className={`border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md p-1 w-48 text-gray-900 bg-gray-100 text-sm ml-2`}
              style={{ pointerEvents: "none" }}
            >
              {Type === "enum" && EnumValues
                ? selectedLabel ?? "-"
                : formValue ?? "-"}
            </div>
          )}

          {/* Error message positioned below the input area */}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {Unit && (
          <label className="text-sm text-gray-600 font-medium ml-2">
            {Unit}
          </label>
        )}
      </div>
    </div>
  );
};

export default InputForm;
