// useFormStore.js
import { create } from "zustand";

export const useFormStore = create((set) => ({
  formValues: {},
  formData: {}, // Store formData as a dictionary
  subForms: {},

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
    set((state) => ({
      formValues: {
        ...state.formValues,
        [key]: value,
      },
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

  // Remove form section and its values
  removeFormSection: (path) =>
    set((state) => {
      const updatedFormValues = { ...state.formValues };
      const keys = Object.keys(updatedFormValues);
      keys.forEach((key) => {
        if (key.startsWith(path)) {
          delete updatedFormValues[key];
        }
      });

      return { formValues: updatedFormValues };
    }),

  // Reset form values and subforms
  resetFormValues: () =>
    set(() => ({
      formValues: {},
      subForms: {},
    })),
}));
