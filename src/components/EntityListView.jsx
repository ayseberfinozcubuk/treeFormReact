import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEntityStore } from "../store/useEntityStore"; // Use the new entity store

const EntityListView = ({ rootEntity }) => {
  const { entities, entityIndexes, setEntities, selectEntity } =
    useEntityStore();
  const [metaKey, setMetaKey] = useState(false);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    // Fetch entities data from the API
    axios
      .get(`http://localhost:5000/api/${rootEntity}`)
      .then((response) => setEntities(rootEntity, response.data)) // Store entities in Zustand
      .catch((error) =>
        console.error(`Error fetching ${rootEntity} list:`, error)
      );
  }, [rootEntity, setEntities]);

  const entitiesList = entities[rootEntity]
    ? Object.values(entities[rootEntity])
    : [];
  const indexesList = entityIndexes[rootEntity] || []; // Get entity indexes

  // Navigate to EntityDetails page on row click
  const handleRowSelect = (e) => {
    const selected = e.value;
    const index = indexesList[entitiesList.indexOf(selected)]; // Find the correct index for the selected entity
    selectEntity(rootEntity, index); // Store selected entity in Zustand
    navigate(`/details/${index}`); // Use the index for navigation
  };

  // Function to determine the keys (column names) dynamically
  const getColumns = (data) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]); // Get keys from the first object as column names
  };

  // Helper function to render objects or arrays correctly
  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return `[Array of ${value.length} items]`; // Display array length or map over it
    } else if (typeof value === "object" && value !== null) {
      return JSON.stringify(value); // Convert object to a string for display
    } else {
      return value; // Render other primitive types as they are
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen dark:bg-gray-900">
      <Card title="Entity List" className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {rootEntity} List
          </h1>
          <div className="flex items-center space-x-2">
            <InputSwitch
              checked={metaKey}
              onChange={(e) => setMetaKey(e.value)}
            />
            <Button
              label={`Add New ${rootEntity}`}
              icon="pi pi-plus"
              className="p-button-success"
              onClick={() => navigate("/add-entity")}
            />
          </div>
        </div>

        <DataTable
          value={entitiesList} // Use entities from Zustand without showing indexes
          selectionMode="single"
          onSelectionChange={handleRowSelect}
          metaKeySelection={metaKey}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-gridlines p-datatable-striped p-datatable-responsive"
        >
          {/* Ensure each column has a stable and unique key */}
          {entitiesList.length > 0 &&
            getColumns(entitiesList).map((col) => (
              <Column
                key={col} // Use column name or field as key
                field={col}
                header={col.charAt(0).toUpperCase() + col.slice(1)} // Capitalize header
                body={(rowData) => renderValue(rowData[col])} // Handle object/array rendering
                sortable
              />
            ))}
        </DataTable>
      </Card>
    </div>
  );
};

export default EntityListView;
