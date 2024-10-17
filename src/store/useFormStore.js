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
      const updatedMandatoryFields = state.emptyMandatoryFields.filter(
        (key) => !key.startsWith(path)
      );
      const updatedNotInRangeFields = state.notInRangeField.filter(
        (key) => !key.startsWith(path)
      );

      // Remove form values that match the path
      Object.keys(updatedFormValues).forEach((key) => {
        if (key.startsWith(path)) {
          delete updatedFormValues[key];
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
