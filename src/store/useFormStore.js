// useFormStore.js
import { create } from "zustand";

export const useFormStore = create((set) => ({
  formValues: {},
  subForms: {},

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
