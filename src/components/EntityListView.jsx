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
  const { setFormValues, formData } = useFormStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntities = async () => {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage

      // Log the token value for debugging
      console.log("Token from localStorage:", token);

      // If token is missing, redirect to login
      if (!token) {
        console.error("No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/${rootEntity}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token to the Authorization header
            },
          }
        );

        setEntities(rootEntity, response.data);
      } catch (error) {
        console.error(`Error fetching ${rootEntity} list:`, error);

        // If we get a 401 error, redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Clear token
          navigate("/login"); // Redirect to login
        }
      }
    };

    fetchEntities();
  }, [rootEntity, setEntities, navigate]);

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

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token again for delete requests

      await axios.delete(`http://localhost:5000/api/${rootEntity}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to the Authorization header
        },
      });

      setEntities(
        rootEntity,
        entitiesList.filter((entity) => entity.Id !== id)
      );
    } catch (error) {
      console.error(`Error deleting ${rootEntity} with ID ${id}:`, error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token"); // Clear token
        navigate("/login"); // Redirect to login
      }
    }
  };

  const renderDeleteButton = (rowData) => {
    return (
      <DeleteButton
        icon="pi pi-trash"
        className="p-button-danger p-button-text"
        onClick={() => handleDelete(rowData.Id, rowData.EmitterName)}
        emitterName={rowData.EmitterName}
        rootEntity={rootEntity}
      />
    );
  };

  const getColumns = (data) => {
    if (data && data.length > 0) {
      const rootProperties = formData[rootEntity]?.Properties || [];
      return rootProperties
        .filter((prop) => prop.Name !== "Id" && prop.Type !== "list")
        .map((prop) => ({
          field: prop.Name,
          header: prop.Label || prop.Name,
        }));
    }
    return [];
  };

  const renderValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    } else {
      return value;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl w-full p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <Card title={`${rootEntity} Listesi`} className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {rootEntity} Listesi
            </h1>
            <Button
              label={`Yeni ${rootEntity} Ekle`}
              icon="pi pi-plus"
              className="p-button-success"
              onClick={() => navigate("/add-entity")}
            />
          </div>
          {entitiesList.length > 0 ? (
            <DataTable
              value={entitiesList}
              selectionMode="single"
              onSelectionChange={handleRowSelect}
              scrollable
              scrollHeight="60vh"
              tableStyle={{ minWidth: "50rem" }}
              className="p-datatable-gridlines p-datatable-striped p-datatable-responsive text-sm leading-tight"
            >
              {getColumns(entitiesList).map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  body={(rowData) => renderValue(rowData[col.field])}
                  sortable
                  className="px-3 py-2"
                />
              ))}
              <Column
                body={renderDeleteButton}
                headerStyle={{ width: "4rem", textAlign: "center" }}
                bodyStyle={{ textAlign: "center", overflow: "visible" }}
              />
            </DataTable>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EntityListView;
