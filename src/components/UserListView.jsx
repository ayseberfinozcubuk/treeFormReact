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
    console.log("newUser: ", newUser);
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
      const updatedUser = { ...rowData, Role: tempRole };

      console.log("updated user: ", updatedUser);

      // Use the new endpoint to update only the role
      await axios.put(
        `http://localhost:5000/api/users/${rowData.Id}/role`,
        { Role: tempRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the local state with the new role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.Id === rowData.Id ? { ...user, Role: tempRole } : user
        )
      );

      setEditableRow(null);
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
          className="text-sm pl-2 text-left border-2 border-gray-300 rounded flex items-center"
          style={{
            width: "100%",
            height: "2rem",
          }}
        />
      );
    } else {
      return rowData[field];
    }
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="mb-4 text-2xl font-semibold text-center">
          User Management
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <Button
          label="Add User"
          icon="pi pi-plus"
          onClick={handleOpenDialog}
          className="mb-4"
        />

        <DataTable
          value={users}
          className="p-datatable-sm border rounded-lg shadow-md overflow-hidden"
          style={{ maxWidth: "100%", tableLayout: "auto" }}
        >
          <Column
            header=""
            body={(rowData, { rowIndex }) => (
              <Button
                icon="pi pi-pencil"
                className="p-button-text"
                onClick={() => handleEditRole(rowIndex, rowData.Role)}
                disabled={editableRow !== null}
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
                  header={key}
                  body={(rowData, { rowIndex }) =>
                    renderField(rowData, key, rowIndex)
                  }
                  className="text-sm px-3 py-2 truncate"
                  style={{
                    flex: key === "Role" ? "none" : "1", // Flexible width for other columns, fixed for Role
                    width: key === "Role" ? "8rem" : "auto",
                    margin: "0.5rem", // Margin for spacing
                  }}
                />
              ))}

          <Column
            body={(rowData) => (
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-text"
                onClick={() => handleDeleteUser(rowData.Id)}
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
                    tooltip="Save"
                    tooltipOptions={{ position: "top" }}
                  />
                  <Button
                    icon="pi pi-times"
                    className="p-button-secondary p-button-text text-sm"
                    onClick={handleCancelRoleChange}
                    tooltip="Cancel"
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
        />
      </div>
    </div>
  );
};

export default UserListView;
