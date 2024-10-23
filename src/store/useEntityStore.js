import { create } from "zustand";

export const useEntityStore = create((set) => ({
  entities: {},
  entityIndexes: {},
  selectedEntity: null,
  expandedSections: {}, // Track expanded/collapsed sections

  // Set the entities and their indexes in the store
  setEntities: (rootEntity, dataArray) => {
    const entityDict = dataArray.reduce((acc, item, index) => {
      acc[index] = { ...item };
      return acc;
    }, {});

    set((state) => ({
      entities: {
        ...state.entities,
        [rootEntity]: entityDict,
      },
      entityIndexes: {
        ...state.entityIndexes,
        [rootEntity]: dataArray.map((_, index) => index),
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
            ...updatedData,
          },
        },
      },
    }));
  },

  // Track expand/shrink states
  toggleExpandSection: (key) => {
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [key]: !state.expandedSections[key], // Toggle the expand/collapse state
      },
    }));
  },

  // Reset the selected entity
  resetSelectedEntity: () => set(() => ({ selectedEntity: null })),
}));
