import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEntityStore } from "../store/useEntityStore";
import { useFormStore } from "../store/useFormStore";
import DeleteButton from "./DeleteButton";
import { showToast, onToastClose } from "../utils/utils";
import { Toast } from "primereact/toast";

const EntityListView = ({ rootEntity: defaultRootEntity }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const rootEntity = location.state?.rootEntity || defaultRootEntity;

  const { entities, setEntities } = useEntityStore();
  const { formData } = useFormStore();
  const [role, setRole] = useState("read");
  const [refreshEntites, setRefreshEntities] = useState(false);

  const toast = useRef(null); // Toast reference
  const toastTimeoutRef = useRef(null); // Reference to store the timeout ID

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // Fetch user from local storage
        if (!user || !user.Id) {
          console.error("User ID is missing. Redirecting to login.");
          navigate("/login");
          return;
        }
        setRole(user.role); // Assume backend responds with { role: "admin" }
      } catch (error) {
        console.error("Failed to fetch user role:", error);

        // Redirect to login if not authenticated
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUserRole();
    setRefreshEntities((prev) => !prev);
  }, [navigate]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        // Fetch entities
        const response = await axiosInstance.get(`/api/${rootEntity}`);
        console.log("response.data: ", response.data);
        setEntities(rootEntity, response.data);
      } catch (error) {
        console.error(`Error fetching ${rootEntity} list:`, error);

        // Redirect to login if not authenticated
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchEntities();
  }, [refreshEntites]);

  const entitiesList = entities[rootEntity]
    ? Object.values(entities[rootEntity])
    : [];

  const handleRowSelect = (e) => {
    const selected = e.value;
    const id = selected.Id; // Get the ID of the selected entity
    // Navigate to the details page and pass the ID in the URL
    navigate(`/details/${id}`, { state: { rootEntity } }); // Pass rootEntity
  };

  const handleDelete = async (id) => {
    try {
      // Check if the entity is being updated by another user
      const response = await axiosInstance.get(`/api/${rootEntity}/${id}`);
      const selectedEntity = response.data;

      if (selectedEntity?.UpdatedBy && selectedEntity.UpdatedBy !== id) {
        if (toast.current) {
          showToast(
            toast.current,
            "warn",
            "Silme Engellendi",
            `Bu kayıt şu anda başka bir kullanıcı tarafından güncelleniyor.`
          );
        }
        return;
      }

      // Proceed with deletion
      await axiosInstance.delete(`/api/${rootEntity}/${id}`);
      setRefreshEntities((prev) => !prev);

      if (toast.current) {
        showToast(
          toast.current,
          "success",
          "Başarıyla Silindi",
          "Kayıt başarıyla silindi."
        );
      }
    } catch (error) {
      console.error(`Error deleting ${rootEntity} with ID ${id}:`, error);

      if (toast.current) {
        showToast(
          toast.current,
          "error",
          "Silme Hatası",
          "Silme işlemi esnasında bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    }
  };

  const renderDeleteButton = (rowData) => {
    return (
      <DeleteButton
        icon="pi pi-trash"
        className="p-button-danger p-button-text"
        onClick={() => handleDelete(rowData.Id)}
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
            {role !== "read" && (
              <Button
                label={`Yeni ${rootEntity} Ekle`}
                icon="pi pi-plus"
                className="p-button-success"
                onClick={() =>
                  navigate("/add-entity", { state: { rootEntity } })
                }
              />
            )}
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
      <Toast ref={toast} onHide={() => onToastClose(toastTimeoutRef.current)} />
    </div>
  );
};

export default EntityListView;
