import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormStore } from "../store/useFormStore";

const MainPage = ({ role, rootEntity }) => {
  const navigate = useNavigate();
  const { selectFromData } = useFormStore();

  const dashboardItems = [
    {
      label: `${rootEntity} Ekranı`,
      icon: "pi pi-list",
      onClick: () => navigate("/list", { state: { rootEntity } }), // Navigate with rootEntity state
    },
    ...selectFromData.map((item) => ({
      label: `${item} Ekranı`,
      icon: "pi pi-list",
      onClick: () => navigate("/entity-page", { state: { rootEntity: item } }), // Navigate with item as rootEntity state
    })),
    ...(role === "admin"
      ? [
          {
            label: "Kullanıcı Ekranı",
            icon: "pi pi-users",
            onClick: () => navigate("/user-settings"), // Navigate to user settings
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {dashboardItems.map((item, index) => (
        <div
          key={index}
          className="p-6 bg-blue-300 hover:bg-blue-400 text-white font-medium rounded-lg shadow-md cursor-pointer text-center"
          onClick={item.onClick}
        >
          <i className={`${item.icon} text-2xl mb-2`}></i>
          <div>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default MainPage;
