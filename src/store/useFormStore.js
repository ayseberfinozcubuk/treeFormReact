import { create } from "zustand";

export const useFormStore = create((set) => ({
  formValues: {},
  formData: {}, // Store formData as a dictionary
  subForms: {},
  emptyMandatoryFields: [], // Track mandatory fields that are empty
  notInRangeField: [], // Track fields that are not in the min-max range

  // Set the form data in the store
  setFormData: (dataArray) => {
    const dataDict = dataArray.reduce((acc, item) => {
      acc[item.EntityName] = item;
      return acc;
    }, {});
    set(() => ({ formData: dataDict })); // Store the data as a dictionary
  },

  // Update form values
  updateFormValues: (key, value) =>
    set((state) => {
      const updatedFormValues = {
        ...state.formValues,
        [key]: value,
      };

      const isEmpty = !value || value.trim() === "";
      const isRequiredField = state.emptyMandatoryFields.includes(key);

      // If the field is required and now filled, remove it from emptyMandatoryFields
      if (!isEmpty && isRequiredField) {
        const newEmptyFields = state.emptyMandatoryFields.filter(
          (field) => field !== key
        );
        return {
          formValues: updatedFormValues,
          emptyMandatoryFields: newEmptyFields,
        };
      }

      // If the field is empty and required, add it to emptyMandatoryFields
      if (isEmpty && !isRequiredField) {
        return {
          formValues: updatedFormValues,
          emptyMandatoryFields: [...state.emptyMandatoryFields, key],
        };
      }

      return { formValues: updatedFormValues };
    }),

  // Track required fields that are initially empty
  addEmptyMandatoryField: (key) =>
    set((state) => ({
      emptyMandatoryFields: [...state.emptyMandatoryFields, key],
    })),

  // Track fields outside the min-max range
  addNotInRangeField: (key) =>
    set((state) => ({
      notInRangeField: [...state.notInRangeField, key],
    })),

  // Remove fields back in range
  removeNotInRangeField: (key) =>
    set((state) => ({
      notInRangeField: state.notInRangeField.filter((field) => field !== key),
    })),

  // Add sub-form
  addSubForm: (key, path, formId) =>
    set((state) => ({
      subForms: {
        ...state.subForms,
        [formId]: {
          ...state.subForms[formId],
          [key]: [...(state.subForms[formId]?.[key] || []), path],
        },
      },
    })),

  // Optimized removal of form section and its validation fields
  removeFormSection: (path) =>
    set((state) => {
      const updatedFormValues = { ...state.formValues };
      const updatedMandatoryFields = [...state.emptyMandatoryFields];
      const updatedNotInRangeFields = [...state.notInRangeField];

      // Use a single iteration over formValues to remove the matching entries
      Object.keys(updatedFormValues).forEach((key) => {
        if (key.startsWith(path)) {
          delete updatedFormValues[key];

          // Remove from emptyMandatoryFields if it exists
          const mandatoryIndex = updatedMandatoryFields.indexOf(key);
          if (mandatoryIndex > -1) {
            updatedMandatoryFields.splice(mandatoryIndex, 1);
          }

          // Remove from notInRangeField if it exists
          const notInRangeIndex = updatedNotInRangeFields.indexOf(key);
          if (notInRangeIndex > -1) {
            updatedNotInRangeFields.splice(notInRangeIndex, 1);
          }
        }
      });

      return {
        formValues: updatedFormValues,
        emptyMandatoryFields: updatedMandatoryFields,
        notInRangeField: updatedNotInRangeFields,
      };
    }),

  // Reset form values and subforms
  resetFormValues: () =>
    set(() => ({
      formValues: {},
      subForms: {},
      emptyMandatoryFields: [], // Clear empty fields on reset
      notInRangeField: [], // Clear range errors on reset
    })),
}));
