import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEntityStore } from "../store/useEntityStore"; // Use the new entity store
import { useFormStore } from "../store/useFormStore"; // Import useFormStore

const EntityListView = ({ rootEntity }) => {
  const { entities, entityIndexes, setEntities, selectEntity } =
    useEntityStore();
  const { setFormValues } = useFormStore(); // Access setFormValues from useFormStore
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    // Fetch entities data from the API
    axios
      .get(`http://localhost:5000/api/${rootEntity}`)
      .then((response) => {
        setEntities(rootEntity, response.data);
        //console.log("response.data EntityListView useEffect: ", response.data);
      }) // Store entities in Zustand
      .catch((error) =>
        console.error(`Error fetching ${rootEntity} list:`, error)
      );
  }, [rootEntity, setEntities]);

  const entitiesList = entities[rootEntity]
    ? Object.values(entities[rootEntity])
    : [];
  const indexesList = entityIndexes[rootEntity] || []; // Get entity indexes

  //console.log("entities EntityListView: ", entities);
  //console.log("entitiesList EntityListView: ", entitiesList);

  // Navigate to EntityDetails page on row click
  const handleRowSelect = (e) => {
    const selected = e.value;
    const index = indexesList[entitiesList.indexOf(selected)]; // Find the correct index for the selected entity
    selectEntity(rootEntity, index); // Store selected entity in Zustand

    //console.log("selected: ", selected);
    // Set the selected entity values in formValues
    setFormValues(selected);

    // Navigate to the details page with the entity's index
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl w-full p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <Card title={`${rootEntity} List`} className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {rootEntity} List
            </h1>
            <Button
              label={`Add New ${rootEntity}`}
              icon="pi pi-plus"
              className="p-button-success"
              onClick={() => navigate("/add-entity")}
            />
          </div>

          <DataTable
            value={entitiesList} // Use entities from Zustand without showing indexes
            selectionMode="single"
            onSelectionChange={handleRowSelect}
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
    </div>
  );
};

export default EntityListView;
