// validationUtils.js

export const validateField = (value, validationRules) => {
  console.log("value: ", value);
  console.log("validationRules: ", validationRules);

  if (validationRules === undefined) {
    console.log("no validation rules!");
    return { isValid: true, error: "" }; // No rules, so it's valid by default
  }

  // Check if it should start with specific characters
  if (
    validationRules.startsWith &&
    !value.startsWith(validationRules.startsWith)
  ) {
    return {
      isValid: false,
      error: `Value must start with ${validationRules.startsWith}.`,
    };
  }

  // Check maximum length
  if (validationRules.maxLength && value.length > validationRules.maxLength) {
    return {
      isValid: false,
      error: `Maximum length is ${validationRules.maxLength}.`,
    };
  }

  // Check if numbers are allowed
  if (validationRules.allowNumbers === false && /\d/.test(value)) {
    return { isValid: false, error: "Value must not contain numbers." };
  }

  // Check if special characters are allowed
  if (
    validationRules.allowSpecialCharacters === false &&
    /[^a-zA-Z0-9]/.test(value)
  ) {
    return {
      isValid: false,
      error: "Value must not contain special characters.",
    };
  }

  // Check for no spaces
  if (validationRules.noSpaces && /\s/.test(value)) {
    return { isValid: false, error: "Value must not contain spaces." };
  }

  // Check for prohibited characters
  if (validationRules.prohibitedCharacters) {
    for (const char of validationRules.prohibitedCharacters) {
      if (value.includes(char)) {
        return { isValid: false, error: `Value must not contain ${char}.` };
      }
    }
  }

  // Check alphanumeric requirement
  if (validationRules.isAlphanumeric && !/^[a-zA-Z0-9]*$/.test(value)) {
    return { isValid: false, error: "Value must be alphanumeric." };
  }

  // Check if it should contain specific characters
  if (validationRules.mustContain) {
    for (const char of validationRules.mustContain) {
      if (!value.includes(char)) {
        return { isValid: false, error: `Value must contain ${char}.` };
      }
    }
  }

  // Check for a custom regex pattern
  if (
    validationRules.regexPattern &&
    !new RegExp(validationRules.regexPattern).test(value)
  ) {
    return {
      isValid: false,
      error: validationRules.customMessage || "Invalid format.",
    };
  }

  // Check minimum length
  if (validationRules.minLength && value.length < validationRules.minLength) {
    return {
      isValid: false,
      error: `Minimum length is ${validationRules.minLength}.`,
    };
  }

  // If all checks pass, return valid
  return { isValid: true, error: "" };
};
