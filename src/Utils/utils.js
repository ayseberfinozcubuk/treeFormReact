export const getNestedValue = (formValues, fullPath) => {
  return formValues.hasOwnProperty(fullPath) ? formValues[fullPath] : undefined;
};

export const getLength = (formValues, keyPrefix) => {
  const uniqueKeys = new Set();

  // Loop through the keys in formValues
  Object.keys(formValues).forEach((key) => {
    // Check if the key starts with the specified keyPrefix and has a valid number in the square brackets
    const match = key.match(new RegExp(`^${keyPrefix}\\[(\\d+)\\]`));
    if (match) {
      // Add the number to the set for uniqueness
      uniqueKeys.add(parseInt(match[1], 10));
    }
  });

  // console.log("AAA COUNT: ", uniqueKeys.size);
  return uniqueKeys.size; // Return the count of unique numbers
};
