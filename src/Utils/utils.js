export const getNestedValue = (formValues, fullPath) => {
  return formValues.hasOwnProperty(fullPath) ? formValues[fullPath] : undefined;
};

export const getLength = (formValues, keyPrefix) => {
  const uniqueKeys = new Set();

  // Escape `keyPrefix` so dots and other characters are interpreted literally
  const escapedPrefix = keyPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Regex to match escaped keyPrefix followed by an index in square brackets, allowing any additional properties
  const regex = new RegExp(`^${escapedPrefix}\\[(\\d+)\\](\\..*)?$`);

  // Loop through the keys in formValues
  Object.keys(formValues).forEach((key) => {
    const match = key.match(regex);
    if (match) {
      uniqueKeys.add(parseInt(match[1], 10));
    }
  });

  return uniqueKeys.size; // Return the count of unique numbers
};

export const convertToNestedJson = (formValues) => {
  if (!formValues || typeof formValues !== "object") {
    throw new Error("Invalid formValues: Expected an object.");
  }

  const result = {};
  Object.keys(formValues).forEach((key) => {
    const value = formValues[key];
    const keys = key.split(".").filter(Boolean);

    keys.reduce((acc, currKey, idx) => {
      const arrayMatch = currKey.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const arrayKey = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2], 10);

        acc[arrayKey] = acc[arrayKey] || [];
        acc[arrayKey][arrayIndex] = acc[arrayKey][arrayIndex] || {};

        if (idx === keys.length - 1) {
          acc[arrayKey][arrayIndex] = value;
        }
        return acc[arrayKey][arrayIndex];
      } else {
        if (idx === keys.length - 1) {
          acc[currKey] = value;
        } else {
          acc[currKey] = acc[currKey] || {};
        }
        return acc[currKey];
      }
    }, result);
  });

  // Remove null entries from arrays
  Object.keys(result).forEach((key) => {
    if (Array.isArray(result[key])) {
      result[key] = result[key].filter((item) => item !== null);
    }
  });

  return result;
};

export const areObjectsEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true; // Quick check for identical references

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false; // If not objects or if null, not equal
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false; // Different number of keys

  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      console.log(
        "obj1[key]: ",
        obj1[key],
        " obj2[key]: ",
        obj2[key],
        " key: ",
        key
      );
      return false; // Key mismatch or values not equal
    }
  }

  return true; // All keys and values match
};
