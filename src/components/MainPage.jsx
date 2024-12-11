import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart } from "primereact/chart"; // Import Chart from PrimeReact
import axiosInstance from "../api/axiosInstance";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useFormStore } from "../store/useFormStore";
import { useUserStore } from "../store/useUserStore";

ChartJS.register(ArcElement, Tooltip, Legend);

const MainPage = ({ role, rootEntity }) => {
  const { selectFromData } = useFormStore();
  const { userData, fetchUserData } = useUserStore();

  console.log("userData: ", userData);

  const navigate = useNavigate();
  const [dataCounts, setDataCounts] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    fetchUserData();
    const fetchDataCounts = async () => {
      try {
        const rootEntityResponse = await axiosInstance.get(
          `/api/${rootEntity}/counts`
        );

        // Fetch counts dynamically for each item in selectFromData
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

        // Extract data from responses
        const rootEntities = rootEntityResponse.data;
        const selectFromDatas = selectFromDataResponses.reduce((acc, curr) => {
          acc[curr.item] = curr.data; // Collect data for each item
          return acc;
        }, {});
        const users = usersResponse.data;
        const userRoles = userRolesResponse.data;

        console.log("rootEntities Count:", rootEntities);
        console.log("selectFromDatas Count:", selectFromDatas);
        console.log("Users Count:", users);
        console.log("userRoles Count:", userRoles);

        setDataCounts({
          rootEntities,
          selectFromDatas,
          users,
          userRoles,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false); // Update loading state
      }
    };

    fetchDataCounts();
  }, []);

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

  if (loading) {
    return <div className="p-6 text-center">Yükleniyor...</div>; // Display loading indicator
  }

  const dashboardItems = [
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
      onClick: () => navigate("/entity-page", { state: { rootEntity: item } }),
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
              labels: Object.keys(dataCounts.usersRoles || {}),
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
          <div className="mt-4">
            <Chart
              type="doughnut"
              data={item.chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
              style={{ maxHeight: "200px" }}
            />
          </div>
          {/* Add additional pie chart for rolesChartData if it exists */}
          {item.rolesChartData && (
            <div className="mt-4">
              <Chart
                type="doughnut"
                data={{
                  labels: Object.keys(dataCounts.userRoles || {}).map(
                    (role) => {
                      const matchingEnum = userData.Properties.find(
                        (prop) => prop.Name === "Role"
                      )?.EnumValues?.find(
                        (enumValue) => enumValue.Value === role
                      );
                      return matchingEnum
                        ? `${matchingEnum.Label} rolündeki kullanıcı sayısı`
                        : `${role} rolündeki kullanıcı sayısı`;
                    }
                  ),
                  datasets: [
                    {
                      data: Object.values(dataCounts.userRoles || {}),
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MainPage;
