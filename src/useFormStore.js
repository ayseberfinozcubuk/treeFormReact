/* 
This Zustand store manages:

-formValues:    The current form data.
-originalValues:    For tracking the initial values to revert on cancellation.
-isSectionExtended:     The state of whether a section is expanded or collapsed.
-subForms:  Stores dynamically loaded forms.

*/

// useFormStore.js
// useFormStore.js
import { create } from "zustand";

export const useFormStore = create((set) => ({
  formValues: {},
  originalValues: {},
  isSectionExtended: {},
  subForms: {},

  // Update form values for a specific form instance
  updateFormValues: (path, value) =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        [path]: value,
      },
    })),

  // Save original values for a specific form instance
  saveOriginalValues: (sectionName, values) =>
    set((state) => ({
      originalValues: {
        ...state.originalValues,
        [sectionName]: values,
      },
    })),

  // Cancel changes for a specific form instance
  cancelChanges: (sectionName) =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        [sectionName]: state.originalValues[sectionName],
      },
    })),

  // Toggle section expand/collapse for a specific form instance
  toggleSection: (sectionName) =>
    set((state) => ({
      isSectionExtended: {
        ...state.isSectionExtended,
        [sectionName]: !state.isSectionExtended[sectionName],
      },
    })),

  // Add a new subform specific to a parent instance (unique identifier)
  addSubForm: (propertyName, formPath, parentId) =>
    set((state) => ({
      subForms: {
        ...state.subForms,
        [parentId]: {
          ...(state.subForms[parentId] || {}),
          [propertyName]: state.subForms[parentId]?.[propertyName]
            ? [...state.subForms[parentId][propertyName], formPath]
            : [formPath],
        },
      },
    })),
}));
