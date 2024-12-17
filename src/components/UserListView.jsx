import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axiosInstance from "../api/axiosInstance";
import AddUserDialog from "./AddUserDialog";
import DeleteButton from "./DeleteButton";
import useUserStore from "../store/useUserStore";
import { Toast } from "primereact/toast";
import {
  showToast,
  showConfirmationToast,
  checkUserExists,
} from "../utils/utils";

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
  // console.log("(editable row): ", editableRow);
  const [tempRole, setTempRole] = useState(null);

  const navigate = useNavigate();

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

  const handleOpenDialog = () => {
    setIsDialogVisible(true);
  };

  const handleSaveNewUser = async (newUser) => {
    try {
      newUser.CreatedBy = currentUser.Id;
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
      //setEditableRow(rowIndex);
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

      if (currentUser && userId === currentUser.Id) {
        showToast(
          toast.current,
          "error",
          "Silme İşlemi Engellendi",
          "Kendinizi silemezsiniz."
        );
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

      if (currentUser && selectedUser.Id === currentUser.Id) {
        showToast(
          toast.current,
          "error",
          "Düzenleme İşlemi Engellendi",
          "Kendi rolünüzü değiştiremezsiniz."
        );
        return;
      }

      // Set up for role editing
      // console.log("handle edit role (editable row)");
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
      // Fetch the latest UpdatedDate from the backend
      const response = await axiosInstance.get(
        `/api/users/${rowData.Id}?updatedDateOnly=true`
      );
      const latestUpdatedDate = response.data?.UpdatedDate;
      // console.log("latestUpdatedDate: ", latestUpdatedDate);
      // console.log("rowData.UpdatedDate: ", rowData.UpdatedDate);

      if (
        latestUpdatedDate !== rowData.UpdatedDate &&
        latestUpdatedDate !== null
      ) {
        // If UpdatedDate doesn't match, show a conflict message and navigate back
        showToast(
          toast.current,
          "error",
          "Çakışma",
          "Bu kayıt başka bir kullanıcı tarafından güncellenmiş. Listeye yönlendiriliyorsunuz."
        );

        setTimeout(() => navigate("/user-settings"), 3000);
        fetchUsers(); // Refresh the user list
        setEditableRow(null);
        return;
      }

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
        UpdatedBy: currentUser.Id,
      });

      fetchUsers(); // Refresh the list
      showToast(
        toast.current,
        "success",
        "Başarıyla Güncellendi",
        `${rowData.Name} başarıyla güncellendi!`
      );
      // console.log("handle edit role 2 (editable row)");

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
          // console.log("handle cancel role (editable row)");

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl w-full p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <Toast ref={toast} />
        <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
          Kullanıcı Yönetimi
        </h2>

        {error && (
          <p className="text-red-600 mb-4 bg-red-100 p-2 rounded text-center">
            {error}
          </p>
        )}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Kullanıcı Listesi
          </h1>
          <Button
            label="Kullanıcı Ekle"
            icon="pi pi-plus"
            onClick={handleOpenDialog}
            className="p-button-success"
            disabled={editableRow !== null}
          />
        </div>

        <DataTable
          value={users}
          className="p-datatable-sm p-datatable-gridlines border rounded-lg shadow-md overflow-hidden"
        >
          {users.length > 0 &&
            Object.keys(users[0])
              .filter(
                (key) =>
                  key !== "Id" &&
                  key !== "UpdatedBy" &&
                  key !== "CreatedBy" &&
                  key !== "UpdatedDate" &&
                  key !== "CreatedDate"
              )
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
            header="Aksiyonlar"
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
