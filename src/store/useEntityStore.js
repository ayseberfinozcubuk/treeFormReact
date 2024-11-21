import { create } from "zustand";

export const useEntityStore = create((set) => ({
  entities: {},

  // Set the entities and their indexes in the store
  setEntities: (rootEntity, dataArray) => {
    // console.log("dataArray useEntityyStore setEntities: ", dataArray);
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
}));
