import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axiosInstance from "../api/axiosInstance";
import AddUserDialog from "./AddUserDialog";
import DeleteButton from "./DeleteButton";
import useUserStore from "../store/useUserStore";

const UserListView = () => {
  const {
    users,
    roles,
    userData,
    fetchUsers,
    fetchRoles,
    fetchUserData,
    addUser,
    deleteUser,
    error,
  } = useUserStore();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editableRow, setEditableRow] = useState(null);
  const [tempRole, setTempRole] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchUserData();
  }, [fetchUsers, fetchRoles, fetchUserData]);

  const handleOpenDialog = () => {
    setIsDialogVisible(true);
  };

  const handleSaveNewUser = async (newUser) => {
    try {
      const response = await axiosInstance.post("/api/users/add", newUser);
      addUser(response.data);
      setIsDialogVisible(false);
    } catch (error) {
      console.error("Failed to add user:", error.response?.data || error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/api/users/${userId}`);
      deleteUser(userId);
    } catch (error) {
      console.error("Failed to delete user:", error.response?.data || error);
    }
  };

  const handleEditRole = (rowIndex, initialRole) => {
    setEditableRow(rowIndex);
    setTempRole(initialRole);
  };

  const handleRoleChange = (newRole) => {
    setTempRole(newRole);
  };

  const handleSaveRoleChange = async (rowData) => {
    try {
      await axiosInstance.put(`/api/users/${rowData.Id}/role`, {
        Role: tempRole,
      });
      fetchUsers(); // Refresh the list
      setEditableRow(null);
    } catch (error) {
      console.error("Failed to update role:", error.response?.data || error);
    }
  };

  const handleCancelRoleChange = () => {
    setEditableRow(null);
    setTempRole(null);
  };

  const getRoleOptions = () => {
    return (
      userData?.Properties.find((prop) => prop.Name === "Role")?.EnumValues.map(
        (enumVal) => ({
          label: enumVal.Label,
          value: enumVal.Value,
        })
      ) || []
    );
  };

  const renderRoleField = (rowData, rowIndex) => {
    const roleOptions = getRoleOptions();

    if (editableRow === rowIndex) {
      return (
        <Dropdown
          value={tempRole}
          options={roleOptions}
          onChange={(e) => handleRoleChange(e.value)}
          placeholder="Select Role"
          className="text-sm w-full"
        />
      );
    }

    const roleLabel =
      roleOptions.find((role) => role.value === rowData.Role)?.label ||
      rowData.Role;

    return <span>{roleLabel}</span>;
  };

  const getColumnHeader = (fieldKey) => {
    return (
      userData?.Properties.find((prop) => prop.Name === fieldKey)?.Label ||
      fieldKey
    );
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="mb-4 text-2xl font-semibold text-center">
          Kullanıcı Yönetimi
        </h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <Button
          label="Kullanıcı Ekle"
          icon="pi pi-plus"
          onClick={handleOpenDialog}
          className="mb-4"
          disabled={editableRow !== null}
        />

        <DataTable
          value={users}
          className="p-datatable-sm border rounded-lg shadow-md overflow-hidden"
        >
          <Column
            header="Actions"
            body={(rowData, { rowIndex }) =>
              editableRow === rowIndex ? (
                <div className="flex gap-2">
                  <Button
                    icon="pi pi-check"
                    className="p-button-success p-button-text"
                    onClick={() => handleSaveRoleChange(rowData)}
                    tooltip="Kaydet"
                  />
                  <Button
                    icon="pi pi-times"
                    className="p-button-secondary p-button-text"
                    onClick={handleCancelRoleChange}
                    tooltip="İptal Et"
                  />
                </div>
              ) : (
                <Button
                  icon="pi pi-pencil"
                  className="p-button-text"
                  onClick={() => handleEditRole(rowIndex, rowData.Role)}
                  tooltip="Düzenle"
                  disabled={editableRow !== null}
                />
              )
            }
            style={{ width: "8rem" }}
          />

          {users.length > 0 &&
            Object.keys(users[0])
              .filter((key) => key !== "Id")
              .map((key) => (
                <Column
                  key={key}
                  field={key}
                  header={getColumnHeader(key)}
                  body={(rowData, { rowIndex }) =>
                    key === "Role"
                      ? renderRoleField(rowData, rowIndex)
                      : rowData[key]
                  }
                  className="text-sm px-3 py-2 truncate"
                />
              ))}

          <Column
            body={(rowData) => (
              <DeleteButton
                onClick={() => handleDeleteUser(rowData.Id)}
                className="p-button-danger p-button-text"
                emitterName={rowData.UserName}
                rootEntity="kullanıcı"
              />
            )}
            style={{ width: "4rem" }}
          />
        </DataTable>

        <AddUserDialog
          visible={isDialogVisible}
          onHide={() => setIsDialogVisible(false)}
          onSave={handleSaveNewUser}
          roles={roles}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default UserListView;
