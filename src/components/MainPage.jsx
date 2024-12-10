import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart } from "primereact/chart"; // Import Chart from PrimeReact
import axiosInstance from "../api/axiosInstance";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useFormStore } from "../store/useFormStore";

ChartJS.register(ArcElement, Tooltip, Legend);

const MainPage = ({ role, rootEntity }) => {
  const { selectFromData } = useFormStore();

  const navigate = useNavigate();
  const [dataCounts, setDataCounts] = useState({
    emitters: { total: 0, recent: 0 },
    platforms: { total: 0, recent: 0 },
    users: { total: 0, recent: 0 },
  });

  useEffect(() => {
    const fetchDataCounts = async () => {
      try {
        const emittersResponse = await axiosInstance.get("/api/emitter/counts");
        const platformsResponse = await axiosInstance.get(
          "/api/platform/counts"
        );
        const usersResponse = await axiosInstance.get("/api/users/counts");

        const emitters = emittersResponse.data;
        const platforms = platformsResponse.data;
        const users = usersResponse.data;

        console.log("Emitters Count:", emitters);
        console.log("Platforms Count:", platforms);
        console.log("Users Count:", users);

        setDataCounts({
          emitters,
          platforms,
          users,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchDataCounts();
  }, []);

  const createChartData = (total, recent) => ({
    labels: ["Before Last Month", "Last Month"],
    datasets: [
      {
        data: [Math.max(total - recent || 0, 0), recent || 0],
        backgroundColor: ["#42A5F5", "#66BB6A"],
        hoverBackgroundColor: ["#64B5F6", "#81C784"],
      },
    ],
  });

  const staticChartData = {
    labels: ["Before Last Month", "Last Month"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#42A5F5", "#66BB6A"],
        hoverBackgroundColor: ["#64B5F6", "#81C784"],
      },
    ],
  };

  console.log("Chart Data:", createChartData(50, 10));

  const dashboardItems = [
    {
      label: `${rootEntity} Ekranı`,
      icon: "pi pi-list",
      onClick: () => navigate("/list", { state: { rootEntity } }),
      chartData: createChartData(
        dataCounts.emitters.total,
        dataCounts.emitters.recent
      ),
    },
    ...selectFromData.map((item) => ({
      label: `${item} Ekranı`,
      icon: "pi pi-list",
      onClick: () => navigate("/entity-page", { state: { rootEntity: item } }),
      chartData: createChartData(
        dataCounts.platforms.total,
        dataCounts.platforms.recent
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
              dataCounts.users.recent
            ),
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
            <Chart
              type="doughnut"
              data={staticChartData}
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
        </div>
      ))}
    </div>
  );
};

export default MainPage;
