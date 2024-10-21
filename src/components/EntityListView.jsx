import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library

const EntityListView = ({ rootEntity }) => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [error, setError] = useState(null); // Handle errors

  useEffect(() => {
    if (rootEntity) {
      axios
        .get(`http://localhost:5000/api/${rootEntity}`)
        .then((response) => {
          // Assign a unique id to each entity
          const entitiesWithIds = response.data.map((ent) => ({
            ...ent,
            uuid: uuidv4(), // Assign a unique id
          }));
          setEntities(entitiesWithIds);
          setError(null); // Clear any previous errors
        })
        .catch((error) => {
          console.error(error);
          setError(`Error fetching ${rootEntity}: ${error.message}`);
        });
    }
  }, [rootEntity]); // Add rootEntity as a dependency

  const handleEntityClick = (ent) => {
    setSelectedEntity(ent); // Set the selected object to view its details
  };

  const renderEntityDetails = (entity) => {
    return (
      <div>
        <h2>Entity Details</h2>
        <ul>
          {/* Dynamically loop through each key-value pair in the object */}
          {Object.entries(entity).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object" ? JSON.stringify(value) : value}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h1>{rootEntity} List</h1>

      {/* Display error if fetching fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {entities.map((ent) => (
          <li key={ent.uuid} onClick={() => handleEntityClick(ent)}>
            {ent.emitterName || "Unknown Name"}
          </li>
        ))}
      </ul>

      {selectedEntity && renderEntityDetails(selectedEntity)}
    </div>
  );
};

export default EntityListView;
