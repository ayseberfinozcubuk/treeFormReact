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

  // Reset form values and subforms
  resetFormValues: () =>
    set(() => ({
      formValues: {},
      subForms: {},
    })),
}));
