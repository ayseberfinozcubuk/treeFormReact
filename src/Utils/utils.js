// utils.js

export const updateNestedValues = (formValues, path, propertyName, value) => {
  const updatedValues = { ...formValues };
  const paths = path ? path.split(".") : [];
  let current = updatedValues;

  paths.forEach((p) => {
    if (!current[p]) current[p] = {};
    current = current[p];
  });

  current[propertyName] = value; // Update the nested value
  return updatedValues;
};

export const getNestedValue = (initialFormValues, fullPath) => {
  return initialFormValues.hasOwnProperty(fullPath)
    ? initialFormValues[fullPath]
    : undefined;
};
