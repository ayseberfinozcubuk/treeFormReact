import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export const useFormStore = create((set) => ({
  formValues: {},
  initialFormValues: {},
  formData: {},
  emptyMandatoryFields: [],
  notInRangeField: [],

  setInitialFormValues: (values) => set(() => ({ initialFormValues: values })),

  setFormData: (dataArray) => {
    const dataDict = dataArray.reduce((acc, item) => {
      acc[item.EntityName] = item;
      return acc;
    }, {});
    set(() => ({ formData: dataDict }));
  },

  updateFormValues: (key, value) =>
    set((state) => {
      const updatedFormValues = {
        ...state.formValues,
        [key]: value,
      };

      const isStringValue = typeof value === "string";
      const isEmpty = isStringValue
        ? value.trim() === ""
        : value === undefined || value === null || value === "";

      const isRequiredField = state.emptyMandatoryFields.includes(key);
      // console.log("updated form values: ", updatedFormValues);

      if (!isEmpty && isRequiredField) {
        const newEmptyFields = state.emptyMandatoryFields.filter(
          (field) => field !== key
        );
        return {
          formValues: updatedFormValues,
          emptyMandatoryFields: newEmptyFields,
        };
      }

      return { formValues: updatedFormValues };
    }),

  generateNewId: () => uuidv4(), // Generate a new ID without updating state

  addIdToFormValues: (path, id) =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        [path !== "" ? `${path}.Id` : "Id"]: id,
      },
    })),

  addEmptyMandatoryField: (key) => {
    set((state) => {
      if (!state.emptyMandatoryFields.includes(key)) {
        console.log("addEmptyMandatoryField: ", key);
        return {
          emptyMandatoryFields: [...state.emptyMandatoryFields, key],
        };
      }
      return state; // Return current state if the key is already present
    });
  },

  addNotInRangeField: (key) =>
    set((state) => ({ notInRangeField: [...state.notInRangeField, key] })),

  removeNotInRangeField: (key) =>
    set((state) => ({
      notInRangeField: state.notInRangeField.filter((field) => field !== key),
    })),

  removeEmptyMandatoryField: (key) => {
    console.log("removeEmptyMandatoryField: ", key);
    set((state) => ({
      emptyMandatoryFields: state.emptyMandatoryFields.filter(
        (field) => field !== key
      ),
    }));
  },

  removeFormSection: (path) =>
    set((state) => {
      console.log("removed path: ", path);
      const updatedFormValues = { ...state.formValues };
      const updatedMandatoryFields = state.emptyMandatoryFields.filter(
        (key) => !key.startsWith(path)
      );
      const updatedNotInRangeFields = state.notInRangeField.filter(
        (key) => !key.startsWith(path)
      );

      Object.keys(updatedFormValues).forEach((key) => {
        if (key.startsWith(path)) {
          delete updatedFormValues[key];
        }
      });

      console.log("after remove form values: ", updatedFormValues);

      return {
        formValues: updatedFormValues,
        emptyMandatoryFields: updatedMandatoryFields,
        notInRangeField: updatedNotInRangeFields,
      };
    }),

  // Set formValues from initialFormValues for a specific path
  resetFormValuesToInitial: () =>
    set((state) => ({ formValues: { ...state.initialFormValues } })),

  setFormValues: (values) => {
    const flattenObject = (obj, parentKey = "") => {
      let flattened = {};

      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const fullKey = parentKey !== "" ? `${parentKey}.${key}` : key;

        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            Object.assign(
              flattened,
              flattenObject(item, `${fullKey}[${index}]`)
            );
          });
        } else if (typeof value === "object" && value !== null) {
          Object.assign(flattened, flattenObject(value, fullKey));
        } else {
          flattened[fullKey] = value;
        }
      });

      return flattened;
    };

    const flattenedValues = flattenObject(values);
    set((state) => ({
      formValues: flattenedValues,
      initialFormValues: { ...state.initialFormValues, ...flattenedValues },
    }));
  },

  resetFormValues: () =>
    set(() => ({
      formValues: {},
      initialFormValues: {},
      emptyMandatoryFields: [],
      notInRangeField: [],
    })),
}));
