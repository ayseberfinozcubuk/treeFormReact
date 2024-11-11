export const getNestedValue = (formValues, fullPath) => {
  return formValues.hasOwnProperty(fullPath) ? formValues[fullPath] : undefined;
};

export const getLength = (formValues, keyPrefix) => {
  const uniqueKeys = new Set();
  // console.log("formValues: ", formValues);
  // console.log("keyPrefix: ", keyPrefix);

  // Escape `keyPrefix` so dots and other characters are interpreted literally
  const escapedPrefix = keyPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Regex to match escaped keyPrefix followed by an index in square brackets, allowing any additional properties
  const regex = new RegExp(`^${escapedPrefix}\\[(\\d+)\\](\\..*)?$`);

  // Debug: List all keys in formValues to confirm structure
  // console.log("All keys in formValues:");
  // Object.keys(formValues).forEach((key) => console.log("key: ", key));

  // Loop through the keys in formValues
  Object.keys(formValues).forEach((key) => {
    const match = key.match(regex);
    if (match) {
      // console.log(`Match found: ${key}, index: ${match[1]}`);
      uniqueKeys.add(parseInt(match[1], 10));
    } else {
      // console.log(`No match for key: ${key} with prefix: ${keyPrefix}`);
    }
  });

  // console.log("Unique indices found:", Array.from(uniqueKeys));
  // console.log("COUNT: ", uniqueKeys.size, " OF ", keyPrefix);
  return uniqueKeys.size; // Return the count of unique numbers
};
