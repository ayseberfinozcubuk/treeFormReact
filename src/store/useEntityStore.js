import { create } from "zustand";

export const useEntityStore = create((set) => ({
  entities: {}, // Store entities as a dictionary with keys based on rootEntity
  entityIndexes: {}, // Store indexes for each entity separately
  selectedEntity: null, // Track the currently selected entity

  // Set the entities and their indexes in the store
  setEntities: (rootEntity, dataArray) => {
    const entityDict = dataArray.reduce((acc, item, index) => {
      acc[index] = { ...item }; // Store entities without index in their values
      return acc;
    }, {});

    set((state) => ({
      entities: {
        ...state.entities,
        [rootEntity]: entityDict,
      },
      entityIndexes: {
        ...state.entityIndexes,
        [rootEntity]: dataArray.map((_, index) => index), // Keep track of indexes separately
      },
    }));
  },

  // Select a specific entity
  selectEntity: (rootEntity, index) => {
    set((state) => ({
      selectedEntity: state.entities[rootEntity]?.[index] || null,
    }));
  },

  // Update an entity in the store
  updateEntity: (rootEntity, index, updatedData) => {
    set((state) => ({
      entities: {
        ...state.entities,
        [rootEntity]: {
          ...state.entities[rootEntity],
          [index]: {
            ...state.entities[rootEntity][index],
            ...updatedData, // Update with new data
          },
        },
      },
    }));
  },

  // Reset the selected entity
  resetSelectedEntity: () => set(() => ({ selectedEntity: null })),
}));
