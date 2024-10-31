import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEntityStore } from "../store/useEntityStore";
import { useFormStore } from "../store/useFormStore";
import DeleteButton from "./DeleteButton";

const EntityListView = ({ rootEntity }) => {
  const { entities, entityIndexes, setEntities, selectEntity } =
    useEntityStore();
  const { setFormValues } = useFormStore();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/${rootEntity}`)
      .then((response) => {
        setEntities(rootEntity, response.data);
      })
      .catch((error) =>
        console.error(`Error fetching ${rootEntity} list:`, error)
      );
  }, [rootEntity, setEntities]);

  const entitiesList = entities[rootEntity]
    ? Object.values(entities[rootEntity])
    : [];
  const indexesList = entityIndexes[rootEntity] || [];

  const handleRowSelect = (e) => {
    const selected = e.value;
    const index = indexesList[entitiesList.indexOf(selected)];
    selectEntity(rootEntity, index);
    setFormValues(selected);
    navigate(`/details/${index}`);
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${rootEntity} with id: ${id}?`
    );

    if (isConfirmed) {
      axios
        .delete(`http://localhost:5000/api/${rootEntity}/${id}`)
        .then(() => {
          setEntities(
            rootEntity,
            entitiesList.filter((entity) => entity.Id !== id)
          );
        })
        .catch((error) =>
          console.error(`Error deleting ${rootEntity} with ID ${id}:`, error)
        );
    }
  };

  const renderDeleteButton = (rowData) => {
    return (
      <DeleteButton
        icon="pi pi-trash"
        className="p-button-danger p-button-text"
        onClick={() => handleDelete(rowData.Id)}
      />
    );
  };

  // Exclude 'Id' and 'list' type properties from columns
  const getColumns = (data) => {
    if (data && data.length > 0) {
      return Object.keys(data[0]).filter(
        (col) => col !== "Id" && !Array.isArray(data[0][col])
      );
    }
    return [];
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return `[Array of ${value.length} items]`;
    } else if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    } else {
      return value;
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
            value={entitiesList}
            selectionMode="single"
            onSelectionChange={handleRowSelect}
            scrollable
            scrollHeight="60vh" // Set a shorter scrollable height
            tableStyle={{ minWidth: "50rem" }}
            className="p-datatable-gridlines p-datatable-striped p-datatable-responsive text-sm leading-tight"
          >
            {entitiesList.length > 0 &&
              getColumns(entitiesList).map((col) => (
                <Column
                  key={col}
                  field={col}
                  header={col.charAt(0).toUpperCase() + col.slice(1)}
                  body={(rowData) => renderValue(rowData[col])}
                  sortable
                  className="px-3 py-2" // Reduce padding for shorter rows
                />
              ))}
            <Column
              body={renderDeleteButton}
              headerStyle={{ width: "4rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
            />
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default EntityListView;
