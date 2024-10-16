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

export const getNestedValue = (formValues, path, propertyName) => {
  if (!path) return formValues[propertyName] || "";
  const paths = path.split(".");
  let current = formValues;

  for (const p of paths) {
    current = current[p];
    if (!current) return ""; // If not found, return an empty string
  }

  return current[propertyName] || ""; // Return the found value or empty string
};
