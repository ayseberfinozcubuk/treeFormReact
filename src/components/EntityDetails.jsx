import React from "react";
import { useParams } from "react-router-dom";
import { useEntityStore } from "../store/useEntityStore"; // Access the Zustand store

const EntityDetails = ({ rootEntity }) => {
  const { id } = useParams(); // Get the entity ID from the URL
  const { selectedEntity, updateEntity } = useEntityStore(); // Access selected entity and update method

  if (!selectedEntity) {
    return <div>Loading...</div>;
  }

  // Handle updates (you can replace this with actual update logic)
  const handleUpdate = () => {
    const updatedData = { ...selectedEntity, updatedField: "New Value" }; // Example update
    updateEntity(rootEntity, id, updatedData); // Update entity in Zustand
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Details of {rootEntity}</h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(selectedEntity).map((key) => (
          <div key={key} className="p-4 border border-gray-300 rounded shadow">
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
            <div className="mt-2">
              {typeof selectedEntity[key] === "object" ? (
                Array.isArray(selectedEntity[key]) ? (
                  `[Array of ${selectedEntity[key].length} items]`
                ) : (
                  <pre>{JSON.stringify(selectedEntity[key], null, 2)}</pre>
                )
              ) : (
                selectedEntity[key]
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 p-2 bg-blue-500 text-white"
      >
        Update Entity
      </button>
    </div>
  );
};

export default EntityDetails;
