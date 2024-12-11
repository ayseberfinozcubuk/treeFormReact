import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useFormStore } from "../store/useFormStore";
import { useUserStore } from "../store/useUserStore";
import DashboardCard from "./DashboardCard";
import axiosInstance from "../api/axiosInstance";

ChartJS.register(ArcElement, Tooltip, Legend);

const createChartData = (total, recent, entityName) => ({
  labels: [
    `Şimdiye kadar oluşturulmuş ${entityName} sayısı`,
    `Bir ay içerisinde oluşturulmuş ${entityName} sayısı`,
  ],
  datasets: [
    {
      data: [Math.max(total - recent || 0, 0), recent || 0],
      backgroundColor: ["#42A5F5", "#66BB6A"],
      hoverBackgroundColor: ["#64B5F6", "#81C784"],
    },
  ],
});

const MainPage = ({ role, rootEntity }) => {
  const { selectFromData } = useFormStore();
  const { userData, fetchUserData } = useUserStore();

  const navigate = useNavigate();
  const [dataCounts, setDataCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDataCountsReceived, setIsDataCountsReceived] = useState(false);
  const [dashboardItems, setDashboardItems] = useState([]);

  useEffect(() => {
    const fetchDataCounts = async () => {
      try {
        fetchUserData();
        const rootEntityResponse = await axiosInstance.get(
          `/api/${rootEntity}/counts`
        );
        const selectFromDataResponses = await Promise.all(
          selectFromData.map(async (item) => {
            const response = await axiosInstance.get(`/api/${item}/counts`);
            return { item, data: response.data };
          })
        );
        const usersResponse = await axiosInstance.get("/api/users/counts");
        const userRolesResponse = await axiosInstance.get(
          "/api/users/role-counts"
        );

        const rootEntities = rootEntityResponse.data;
        const selectFromDatas = selectFromDataResponses.reduce((acc, curr) => {
          acc[curr.item] = curr.data;
          return acc;
        }, {});
        const users = usersResponse.data;
        const userRoles = userRolesResponse.data;

        setDataCounts({
          rootEntities,
          selectFromDatas,
          users,
          userRoles,
        });
        setIsDataCountsReceived(true); // Mark data as received
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchDataCounts();
  }, [rootEntity, selectFromData, fetchUserData]);

  useEffect(() => {
    if (isDataCountsReceived) {
      // Assign dashboard items when data counts are received
      const items = [
        {
          label: `${rootEntity} Ekranı`,
          icon: "pi pi-list",
          onClick: () => navigate("/list", { state: { rootEntity } }),
          chartData: createChartData(
            dataCounts.rootEntities.total,
            dataCounts.rootEntities.recent,
            rootEntity
          ),
        },
        ...selectFromData.map((item) => ({
          label: `${item} Ekranı`,
          icon: "pi pi-list",
          onClick: () =>
            navigate("/entity-page", { state: { rootEntity: item } }),
          chartData: createChartData(
            dataCounts.selectFromDatas[item]?.total || 0,
            dataCounts.selectFromDatas[item]?.recent || 0,
            item
          ),
        })),
        ...(role === "admin"
          ? [
              {
                label: "Kullanıcı Ekranı",
                icon: "pi pi-users",
                onClick: () => navigate("/user-settings"),
                chartData: createChartData(
                  dataCounts.users.total,
                  dataCounts.users.recent,
                  "kullanıcı"
                ),
                rolesChartData: {
                  labels: Object.keys(dataCounts.userRoles || {}),
                  datasets: [
                    {
                      data: Object.values(dataCounts.userRoles || {}),
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
                },
              },
            ]
          : []),
      ];
      setDashboardItems(items);
    }
  }, [
    isDataCountsReceived,
    dataCounts,
    role,
    rootEntity,
    selectFromData,
    navigate,
  ]);

  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return <div className="p-6 text-center">Yükleniyor main...</div>;
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="flex flex-wrap gap-4 justify-center max-w-full">
        {isDataCountsReceived &&
          dashboardItems.map((item, index) => (
            <DashboardCard key={index} item={item} dataCounts={dataCounts} />
          ))}
      </div>
    </div>
  );
};

export default MainPage;
