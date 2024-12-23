import React from "react";
import { Chart } from "primereact/chart";
import { useUserStore } from "../store/useUserStore";

const DashboardCard = ({ item, dataCounts }) => {
  const { userData } = useUserStore();

  // Determine the total count for the entity
  const total = item.chartData?.datasets[0]?.data?.reduce(
    (sum, value) => sum + value,
    0
  );

  const rolesChartData = item.rolesChartData && {
    labels: Object.keys(dataCounts.userRoles || {}).map((role) => {
      const matchingEnum = userData.Properties.find(
        (prop) => prop.Name === "Role"
      )?.EnumValues?.find((enumValue) => enumValue.Value === role);
      return matchingEnum
        ? `${matchingEnum.Label} rolündeki kullanıcı sayısı`
        : `${role} rolündeki kullanıcı sayısı`;
    }),
    datasets: [
      {
        data: Object.values(dataCounts.userRoles || {}),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        displayColors: true, // Show the color cube
        callbacks: {
          title: () => "", // Remove the title
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw; // Get the numerical value
            // Format the label with space after the color cube
            return `  ${label}: ${value}`;
          },
        },
        bodySpacing: 5,
        bodyFont: { size: 10 },
        boxWidth: 10, // Cube width
        boxHeight: 10, // Cube height
        padding: 10, // Add padding around tooltip content
      },
    },
  };

  return (
    <div
      className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-md cursor-pointer text-center"
      onClick={item.onClick}
      style={{ maxWidth: "280px", fontSize: "0.9rem" }}
    >
      <i className={`${item.icon} text-xl font-bold`}></i>

      {/* Title with reduced margin */}
      <div
        className="mt-0.5 font-bold"
        style={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {item.label}
      </div>

      {/* Total count with reduced spacing */}
      <div className="mt-0.5 text-sm font-semibold text-gray-500">
        Toplam {item.label.replace(" Ekranı", "")} Sayısı: {total}
      </div>

      {/* Smaller chart radius */}
      <div className="mt-1">
        <Chart
          type="doughnut"
          data={item.chartData}
          options={{
            ...chartOptions,
            cutout: "45%", // Reduced inner radius
            radius: "55%", // Smaller outer radius
          }}
          style={{ maxHeight: "150px" }}
        />
      </div>

      {rolesChartData && (
        <div className="mt-0.5">
          <Chart
            type="doughnut"
            data={rolesChartData}
            options={{
              ...chartOptions,
              cutout: "45%", // Reduced inner radius
              radius: "55%", // Smaller outer radius
            }}
            style={{ maxHeight: "170px" }}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
