import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
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
  const [tempRole, setTempRole] = useState("read");

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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/users/add",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      addUser(response.data);
      setIsDialogVisible(false);
    } catch (error) {
      console.error("Failed to add user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      deleteUser(userId);
    } catch (error) {
      console.error("Failed to delete user.");
    }
  };

  const handleEditRole = (rowIndex, initialRole = "read") => {
    setEditableRow(rowIndex);
    setTempRole(initialRole);
  };

  const handleRoleChange = (newRole) => {
    setTempRole(newRole);
  };

  const handleSaveRoleChange = async (rowData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/${rowData.Id}/role`,
        { Role: tempRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchUsers(); // Refresh the list
      setEditableRow(null);
    } catch (error) {
      console.error("Failed to update role.");
    }
  };

  const handleCancelRoleChange = () => {
    setEditableRow(null);
    setTempRole("read");
  };

  // Retrieve the labels for the dropdown options from userData
  const getRoleOptions = () => {
    const roleField = userData?.Properties.find((prop) => prop.Name === "Role");
    return (
      roleField?.EnumValues.map((enumVal) => ({
        label: enumVal.Label,
        value: enumVal.Value,
      })) || []
    );
  };

  // Function to render Role field with dropdown when in edit mode
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
    } else {
      // Display the label for the current role instead of value
      return (
        roleOptions.find((role) => role.value === rowData.Role)?.label ||
        rowData.Role
      );
    }
  };

  const getColumnHeader = (fieldKey) => {
    const field = userData?.Properties.find((prop) => prop.Name === fieldKey);
    return field?.Label || fieldKey;
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
            header=""
            body={(rowData, { rowIndex }) => (
              <Button
                icon="pi pi-pencil"
                className="p-button-text"
                onClick={() => handleEditRole(rowIndex, rowData.Role)}
                disabled={editableRow !== null && editableRow !== rowIndex}
              />
            )}
            style={{ width: "4rem" }}
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
                  style={{
                    flex: key === "Role" ? "none" : "1",
                    width: key === "Role" ? "8rem" : "auto",
                  }}
                />
              ))}

          <Column
            body={(rowData, { rowIndex }) => (
              <DeleteButton
                onClick={() => handleDeleteUser(rowData.Id)}
                className="p-button-danger p-button-text"
                emitterName={rowData.UserName}
                rootEntity="kullanıcı"
                disabled={editableRow !== null && editableRow !== rowIndex}
              />
            )}
            style={{ width: "4rem" }}
          />

          <Column
            body={(rowData, { rowIndex }) =>
              editableRow === rowIndex ? (
                <div className="flex gap-2">
                  <Button
                    icon="pi pi-check"
                    className="p-button-success p-button-text text-sm"
                    onClick={() => handleSaveRoleChange(rowData)}
                    tooltip="Kaydet"
                    tooltipOptions={{ position: "top" }}
                  />
                  <Button
                    icon="pi pi-times"
                    className="p-button-secondary p-button-text text-sm"
                    onClick={handleCancelRoleChange}
                    tooltip="İptal Et"
                    tooltipOptions={{ position: "top" }}
                  />
                </div>
              ) : null
            }
            style={{ width: "8rem" }}
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
