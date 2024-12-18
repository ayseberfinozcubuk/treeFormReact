import React, { useEffect, useState } from "react";
import { useFormStore } from "../store/useFormStore";
import { validateField } from "../utils/validationUtils"; // Import the validation utility
import { getLength, getNestedValue } from "../utils/utils"; // Import the validation utility
import axiosInstance from "../api/axiosInstance";

const InputForm = ({ entityName, property, path, isEditMode }) => {
  const {
    updateFormValues,
    formValues,
    formData,
    addEmptyMandatoryField,
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
    DependsOn,
    ValidationRules,
    Note,
    SelectFrom,
  } = property;

  const [error, setError] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const formValueKey = path !== "" ? `${path}.${Name}` : Name;
  var formValue = formValues[formValueKey];

  useEffect(() => {
    if (Type === "Guid" && SelectFrom) {
      const fetchOptions = async () => {
        try {
          const response = await axiosInstance.get(`/api/${SelectFrom}`);
          setOptions(response.data);
          if (!isEditMode && formValue) {
            const existingEntity = response.data.find(
              (item) => item.Id === formValue
            );
            setSelectedOption(existingEntity);
          }
        } catch (error) {
          console.error(`Error fetching options for ${SelectFrom}:`, error);
        }
      };
      fetchOptions();
    }
  }, [Type, SelectFrom, formValue, isEditMode]);

  useEffect(() => {
    if (formValue === undefined) {
      updateFormValues(formValueKey, null);
    }
  }, [formValue, formValueKey, updateFormValues]);

  useEffect(() => {
    if (IsCalculated && DependsOn) {
      const dependencyKey = path !== "" ? `${path}.${DependsOn}` : DependsOn;
      const dependentValue = getNestedValue(formValues, dependencyKey);

      // Check if the entityName has a property matching DependsOn in formData
      const entityData = formData[entityName];

      if (entityData) {
        const propertyData = entityData.Properties.find(
          (prop) => prop.Name === DependsOn
        ); // Find the property with Name equal to DependsOn
        const { Type: dependentType } = propertyData || {}; // Get the Type of the DependsOn property

        /*
        console.log("entityData: ", entityData);
        console.log("propertyData: ", propertyData);
        console.log("dependentType: ", dependentType);
        console.log("dependencyKey: ", dependencyKey);
        console.log("dependentValue: ", dependentValue);
        console.log("formValues: ", formValues);
        */

        if (
          dependentType === "list" &&
          Note &&
          Note.includes(`${DependsOn}.length`)
        ) {
          if (
            (formValues[formValueKey] === undefined ||
              formValues[formValueKey] === null) &&
            formValues[formValueKey] !== 0
          ) {
            updateFormValues(formValueKey, 0);
          } else {
            const arrayLength = getLength(formValues, dependencyKey);
            if (formValues[formValueKey] !== arrayLength) {
              updateFormValues(formValueKey, arrayLength);
            }
          }
        } else if (dependentValue !== undefined && dependentValue !== null) {
          // Normal calculation process if dependentValue is available
          try {
            const calculatedValue = eval(
              Note.replace(DependsOn, dependentValue)
            );
            if (formValue !== calculatedValue) {
              updateFormValues(formValueKey, calculatedValue);
            }
          } catch (error) {
            console.error("Error calculating value:", error);
          }
        } else if (dependentValue === null && formValue !== dependentValue) {
          updateFormValues(formValueKey, dependentValue);
        }
      } else {
        // console.log("AAAAAAA BIG TROUBLE! NO ENTITY DATA!");
      }
    }
  }, [
    IsCalculated,
    DependsOn,
    Note,
    formValues,
    formValueKey,
    entityName,
    path,
    formValue,
    updateFormValues,
    formData,
  ]);

  useEffect(() => {
    if (IsMandatory) {
      if (typeof formValue === "string" && formValue.trim() === "") {
        addEmptyMandatoryField(formValueKey);
      } else if (formValue === null || formValue === "") {
        addEmptyMandatoryField(formValueKey);
      }
    }
  }, [IsMandatory, formValueKey, formValue, addEmptyMandatoryField]);

  const validateAndSetError = (value) => {
    // console.log("validate value: ", value);
    if (value === null) {
      setError("");
      removeNotInRangeField(formValueKey);
      return;
    }

    const { isValid, error: validationError } = validateField(
      value,
      ValidationRules
    );

    if (MinMax) {
      const numValue = parseFloat(value);
      if (MinMax.Min !== undefined && numValue < MinMax.Min) {
        setError(`Değer, ${MinMax.Min} veya daha büyük olmalıdır.`);
        addNotInRangeField(formValueKey);
        return;
      } else if (MinMax.Max !== undefined && numValue > MinMax.Max) {
        setError(`Değer, ${MinMax.Min} veya daha küçük olmalıdır.`);
        addNotInRangeField(formValueKey);
        return;
      } else {
        removeNotInRangeField(formValueKey);
      }
    }

    if (!isValid) {
      setError(validationError);
      addNotInRangeField(formValueKey);
    } else {
      setError("");
      removeNotInRangeField(formValueKey);
    }
  };

  useEffect(() => {
    if (IsCalculated) {
      validateAndSetError(formValue);
    }
  }, [formValue, IsCalculated, MinMax, ValidationRules]);

  const handleChange = (e) => {
    let value = e.target.value;

    if (value === "") {
      value = null;
      setError(""); // Clear the error state when input is cleared
      removeNotInRangeField(formValueKey);
    } else {
      if (Type === "int") {
        value = parseInt(value, 10);
      } else if (Type === "double") {
        value = parseFloat(value);
      }
    }
    validateAndSetError(value);
    updateFormValues(formValueKey, value);
    setSelectedOption(options.find((option) => option.Id === value));
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
          {Type === "Guid" && SelectFrom ? (
            isEditMode ? (
              <select
                value={formValue ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormValues(formValueKey, value);
                }}
                className={`border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md p-1 w-48 text-sm ml-2`}
              >
                <option value="">{Label} Seçiniz</option>
                {options.map((option) => (
                  <option key={option.Id} value={option.Id}>
                    {option.PlatformName || option.Name || option.Id}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className={`border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md p-1 w-48 text-gray-900 bg-gray-100 text-sm ml-2`}
                style={{ pointerEvents: "none" }}
              >
                {selectedOption
                  ? selectedOption.PlatformName || selectedOption.Name
                  : "No data"}
              </div>
            )
          ) : IsCalculated !== true && isEditMode ? (
            Type === "enum" && EnumValues ? (
              <select
                value={formValue ?? ""}
                onChange={handleChange}
                className={`border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md p-1 w-48 text-sm ml-2`}
              >
                <option value="">{Label} Seçiniz</option>
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
