import { create } from "zustand";

export const useFormStore = create((set) => ({
  formValues: {},
  initialFormValues: {},
  formData: {},
  emptyMandatoryFields: [],
  notInRangeField: [],
  selectFromData: [],

  setFormData: (dataArray) => {
    const dataDict = dataArray.reduce((acc, item) => {
      acc[item.EntityName] = item;
      return acc;
    }, {});

    // Collect all SelectFrom values into a single array
    const selectFromData = dataArray.flatMap(
      (item) =>
        item.Properties?.flatMap((property) => property.SelectFrom || []) || []
    );
    // console.log(dataDict);
    set(() => ({ formData: dataDict, selectFromData: selectFromData }));
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

  addIdToFormValues: (path, id) =>
    set((state) => {
      // console.log("in addIdFormValues BUM");
      const idKey = path !== "" ? `${path}.Id` : "Id";
      // Check if the ID already exists and is not null
      if (
        state.formValues[idKey] !== null &&
        state.formValues[idKey] !== undefined
      ) {
        return state; // Return current state without changes
      }

      // Add the ID to formValues
      // console.log("add id to form values on path: ", path);
      return {
        formValues: {
          ...state.formValues,
          [idKey]: id,
        },
      };
    }),

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
            if (item !== null && item !== undefined) {
              // Check for null or undefined
              Object.assign(
                flattened,
                flattenObject(item, `${fullKey}[${index}]`)
              );
            }
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
    // console.log("flattened values: ", flattenedValues);
    set((state) => ({
      formValues: flattenedValues,
      initialFormValues: flattenedValues,
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
