import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import AddUserDialog from "./AddUserDialog";

const UserListView = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editableRow, setEditableRow] = useState(null);
  const [error, setError] = useState("");
  const [tempRole, setTempRole] = useState(null);

  // Fetch users and roles on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        setError("Failed to fetch users.");
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/roles"
        );
        setRoles(response.data);
      } catch (error) {
        setError("Failed to fetch roles.");
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const handleOpenDialog = () => {
    setIsDialogVisible(true);
  };

  const handleSaveNewUser = async (newUser) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/users/add",
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers([...users, response.data]);
      setIsDialogVisible(false);
    } catch (error) {
      setError("Failed to add user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.Id !== userId));
    } catch (error) {
      setError("Failed to delete user.");
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
      const token = localStorage.getItem("token");
      const updatedUser = { ...rowData, Role: tempRole }; // Update the role in the rowData object

      await axios.put(
        `http://localhost:5000/api/users/${rowData.Id}`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.Id === rowData.Id ? updatedUser : user))
      );

      setEditableRow(null); // Exit edit mode
    } catch (error) {
      setError("Failed to update role.");
    }
  };

  const handleCancelRoleChange = () => {
    setEditableRow(null);
    setTempRole(null);
  };

  const renderField = (rowData, field, rowIndex) => {
    if (field === "Role" && editableRow === rowIndex) {
      return (
        <Dropdown
          value={tempRole}
          options={roles.map((role) => ({ label: role, value: role }))}
          onChange={(e) => handleRoleChange(e.value)}
          placeholder="Select Role"
          style={{ width: "100%" }}
        />
      );
    } else {
      return rowData[field];
    }
  };

  return (
    <div className="p-4">
      <h2>User Management</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div className="mb-4">
        <Button
          label="Add User"
          icon="pi pi-plus"
          onClick={handleOpenDialog}
          className="mb-2"
        />
      </div>

      <DataTable value={users} className="p-datatable-sm">
        <Column
          body={(rowData, { rowIndex }) => (
            <Button
              icon="pi pi-pencil"
              className="p-button-text"
              onClick={() => handleEditRole(rowIndex, rowData.Role)}
              disabled={editableRow !== null}
              style={{ width: "2.5rem" }}
            />
          )}
        />
        {users.length > 0 &&
          Object.keys(users[0])
            .filter((key) => key !== "Id")
            .map((key) => (
              <Column
                key={key}
                field={key}
                header={key}
                body={(rowData, { rowIndex }) =>
                  renderField(rowData, key, rowIndex)
                }
                style={{ width: "10rem" }}
              />
            ))}
        <Column
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              className="p-button-danger p-button-text"
              onClick={() => handleDeleteUser(rowData.Id)}
              style={{ width: "2.5rem" }}
            />
          )}
        />
        <Column
          body={(rowData, { rowIndex }) =>
            editableRow === rowIndex ? (
              <div className="flex gap-2" style={{ minWidth: "6rem" }}>
                <Button
                  label="Save"
                  icon="pi pi-check"
                  className="p-button-success p-button-text"
                  onClick={() => handleSaveRoleChange(rowData)}
                />
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  className="p-button-secondary p-button-text"
                  onClick={handleCancelRoleChange}
                />
              </div>
            ) : null
          }
        />
      </DataTable>

      <AddUserDialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        onSave={handleSaveNewUser}
        roles={roles}
      />
    </div>
  );
};

export default UserListView;
