import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axiosInstance from "../api/axiosInstance";
import AddUserDialog from "./AddUserDialog";
import DeleteButton from "./DeleteButton";
import useUserStore from "../store/useUserStore";
import { Toast } from "primereact/toast";
import { showToast, showConfirmationToast } from "../utils/utils";

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

  const [currentUser, setCurrentUser] = useState(null); // State for the current user
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editableRow, setEditableRow] = useState(null);
  const [tempRole, setTempRole] = useState(null);

  const toast = useRef(null); // Toast reference
  const confirmCancelMessage =
    "İşlemi iptal etmek istediğinizden emin misiniz?";

  useEffect(() => {
    // Fetch users, roles, and user data
    fetchUsers();
    fetchRoles();
    fetchUserData();

    // Fetch current user from localStorage
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      setCurrentUser(JSON.parse(userFromStorage));
    }
  }, [fetchUsers, fetchRoles, fetchUserData]);

  // Helper function to check if the user exists
  const checkUserExists = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return !!response.data; // Return true if user exists, false otherwise
    } catch (error) {
      return false; // Treat error as user not existing
    }
  };

  const handleOpenDialog = () => {
    setIsDialogVisible(true);
  };

  const handleSaveNewUser = async (newUser) => {
    try {
      const response = await axiosInstance.post("/api/users/add", newUser);
      addUser(response.data);
      setIsDialogVisible(false);
    } catch (error) {
      showToast(
        toast.current,
        "error",
        "İşlem gerçekleşemedi",
        "Hata: İşlem gerçekleştirilemedi."
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userExists = await checkUserExists(userId);
      if (!userExists) {
        showToast(
          toast.current,
          "error",
          "Kullanıcı Mevcut Değil",
          "Bu kullanıcı artık mevcut değil."
        );
        fetchUsers(); // Refresh the latest user list
        return;
      }

      // Proceed with deletion if the user exists
      await axiosInstance.delete(`/api/users/${userId}`);
      deleteUser(userId);

      showToast(
        toast.current,
        "success",
        "Başarıyla Silindi",
        "Kullanıcı başarıyla silindi."
      );

      // Fetch the latest user list after deletion
      fetchUsers();
    } catch (error) {
      console.error("Error while deleting user:", error);
      showToast(
        toast.current,
        "error",
        "İşlem gerçekleşemedi",
        "Hata: İşlem gerçekleştirilemedi."
      );
    }
  };

  const handleEditRole = async (rowIndex, initialRole, userId) => {
    if (!currentUser) {
      showToast(
        toast.current,
        "error",
        "Kullanıcı Hatası",
        "Giriş yapmış kullanıcı bulunamadı."
      );
      return;
    }

    try {
      // Fetch user information from the backend
      const response = await axiosInstance.get(`/api/users/${userId}`);
      const selectedUser = response.data;

      // Check the UpdatedBy property
      if (selectedUser.UpdatedBy && selectedUser.UpdatedBy !== currentUser.Id) {
        showToast(
          toast.current,
          "warn",
          "Erişim Engellendi",
          "Bu kullanıcı başka bir admin tarafından düzenleniyor."
        );
        return;
      }

      // If UpdatedBy is null or undefined, update it with the current user's ID
      if (!selectedUser.UpdatedBy) {
        await axiosInstance.patch(`/api/users/user-updatedby`, {
          id: userId,
          updatedBy: currentUser.Id,
        });

        fetchUsers(); // Refresh the user list
      }

      // Set up for role editing
      setEditableRow(rowIndex);
      setTempRole(initialRole);
    } catch (error) {
      // console.error("Error while editing role:", error);
      showToast(
        toast.current,
        "error",
        "Kullanıcı Mevcut Değil",
        "Bu kullanıcı artık mevcut değil."
      );

      // Fetch the latest user list
      fetchUsers();

      return;
    }
  };

  const handleRoleChange = (newRole) => {
    setTempRole(newRole);
  };

  const handleSaveRoleChange = async (rowData) => {
    if (tempRole === rowData.Role) {
      showToast(
        toast.current,
        "info",
        "Değişiklik Yok",
        "Girilen bilgiler mevcut verilerle aynı. Güncelleme yapılmadı."
      );
      setEditableRow(null);
      setTempRole(null);
      return;
    }

    try {
      const userExists = await checkUserExists(rowData.Id);
      if (!userExists) {
        showToast(
          toast.current,
          "error",
          "Kullanıcı Mevcut Değil",
          "Bu kullanıcı artık mevcut değil."
        );
        fetchUsers(); // Refresh the user list
        return;
      }

      // Update the user's role
      await axiosInstance.put(`/api/users/${rowData.Id}/role`, {
        Role: tempRole,
      });

      // Reset the UpdatedBy property
      await axiosInstance.patch(`/api/users/user-updatedby`, {
        id: rowData.Id,
        updatedBy: null,
      });

      fetchUsers(); // Refresh the list
      showToast(
        toast.current,
        "success",
        "Başarıyla Güncellendi",
        `${rowData.Name} başarıyla güncellendi!`
      );
      setEditableRow(null);
      setTempRole(null);
    } catch (error) {
      console.error("Error while saving role change:", error);
      showToast(
        toast.current,
        "error",
        "İşlem gerçekleşemedi",
        "Hata: İşlem gerçekleştirilemedi."
      );
    }
  };

  const handleCancelRoleChange = async (rowData) => {
    try {
      const userExists = await checkUserExists(rowData.Id);
      if (!userExists) {
        showToast(
          toast.current,
          "error",
          "Kullanıcı Mevcut Değil",
          "Bu kullanıcı artık mevcut değil."
        );
        fetchUsers(); // Refresh the user list
        return;
      }

      // Show confirmation toast before resetting the UpdatedBy property
      showConfirmationToast(toast.current, confirmCancelMessage, async () => {
        try {
          // Reset the UpdatedBy property
          await axiosInstance.patch(`/api/users/user-updatedby`, {
            id: rowData.Id,
            updatedBy: null,
          });

          setEditableRow(null);
          setTempRole(null);

          showToast(
            toast.current,
            "info",
            "İşlem İptal Edildi",
            "Değişiklikler başarıyla iptal edildi."
          );
        } catch (error) {
          console.error("Error while resetting UpdatedBy property:", error);
          showToast(
            toast.current,
            "error",
            "İşlem gerçekleşemedi",
            "Hata: İşlem gerçekleştirilemedi."
          );
        }
      });
    } catch (error) {
      console.error("Error while canceling role change:", error);
      showToast(
        toast.current,
        "error",
        "İşlem gerçekleşemedi",
        "Hata: İşlem gerçekleştirilemedi."
      );
    }
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
      <Toast ref={toast} />

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
          {users.length > 0 &&
            Object.keys(users[0])
              .filter((key) => key !== "Id" && key !== "UpdatedBy") // Exclude UpdatedBy
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
                    onClick={() => handleCancelRoleChange(rowData)}
                    tooltip="İptal Et"
                  />
                </div>
              ) : (
                <div className="flex gap-2">
                  <DeleteButton
                    onClick={() => handleDeleteUser(rowData.Id)}
                    className="p-button-danger p-button-text"
                    emitterName={rowData.UserName}
                    rootEntity="kullanıcı"
                    tooltip="Sil"
                  />
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-text"
                    onClick={() =>
                      handleEditRole(rowIndex, rowData.Role, rowData.Id)
                    }
                    tooltip="Düzenle"
                    disabled={editableRow !== null}
                  />
                </div>
              )
            }
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
