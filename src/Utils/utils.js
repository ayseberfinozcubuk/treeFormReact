import { Button } from "primereact/button";
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance

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
  // console.log("obj1: ", obj1, "obj2", obj2);
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
      /*
      console.log(
        "obj1[key]: ",
        obj1[key],
        " obj2[key]: ",
        obj2[key],
        " key: ",
        key
      );
      */
      return false; // Key mismatch or values not equal
    }
  }

  return true; // All keys and values match
};

export const showToast = (currentToast, severity, summary, detail) => {
  currentToast.show({ severity, summary, detail, life: 3000 });
};

// Function to clear timeout and execute its logic when toast is dismissed
export const onToastClose = (currentTimeoutRef) => {
  if (currentTimeoutRef) {
    // Clear the timeout if it exists
    clearTimeout(currentTimeoutRef);

    // Execute the logic immediately
    if (typeof currentTimeoutRef === "function") {
      currentTimeoutRef(); // Execute the stored function
    }
    // Reset the timeout reference
    currentTimeoutRef = null;
  }
};

export const showConfirmationToast = (
  currentToast,
  confirmMessage,
  onClick
) => {
  currentToast.show({
    severity: "warn",
    sticky: true,
    content: (
      <div
        className="p-d-flex p-flex-column p-ai-center"
        style={{
          padding: "1rem",
          maxWidth: "280px", // Balanced width for content
          margin: "0 auto", // Center content horizontally
          textAlign: "center", // Center the text
        }}
      >
        {/* Message Content */}
        <div
          className="font-medium"
          style={{
            fontSize: "0.85rem", // Smaller font size for compactness
            marginBottom: "0.75rem", // Space between message and buttons
          }}
        >
          {confirmMessage}
        </div>

        {/* Action Buttons */}
        <div
          className="p-d-flex p-jc-center"
          style={{
            gap: "0.75rem", // Space between buttons
          }}
        >
          <Button
            label="Evet"
            icon="pi pi-check"
            className="p-button-success"
            onClick={() => {
              onClick();
              currentToast.clear(); // Clear the toast after confirming
            }}
            style={{
              padding: "0.4rem 1rem", // Compact button size
              fontSize: "0.8rem",
            }}
          />
          <Button
            label="Hayır"
            icon="pi pi-times"
            className="p-button-danger"
            onClick={() => currentToast.clear()} // Clear the toast without taking action
            style={{
              padding: "0.4rem 1rem", // Compact button size
              fontSize: "0.8rem",
            }}
          />
        </div>
      </div>
    ),
  });
};

export const checkUserExists = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return !!response.data; // Return true if user exists, false otherwise
  } catch (error) {
    return false; // Treat error as user not existing
  }
};
