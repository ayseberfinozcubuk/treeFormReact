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
          // Custom formatter to wrap text
          formatter: (value) => {
            const maxLength = 15; // Maximum characters per line
            if (value.length > maxLength) {
              return value
                .match(new RegExp(`.{1,${maxLength}}`, "g"))
                .join("\n");
            }
            return value;
          },
        },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            // Optional: Format tooltip title if needed
            return tooltipItems[0].label;
          },
        },
        bodyFont: {
          size: 10, // Smaller text size
        },
        titleFont: {
          size: 10, // Slightly smaller title font size
        },
        //padding: 10, // Adjust padding for better appearance
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  };

  return (
    <div
      className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-md cursor-pointer text-center"
      onClick={item.onClick}
      style={{ maxWidth: "280px", fontSize: "0.9rem" }} // Reduced max width and font size
    >
      <i className={`${item.icon} text-xl`}></i>
      <div className="mt-2">{item.label}</div>
      {/* Display total count above the chart */}
      <div className="mt-2 text-sm font-semibold text-gray-500">
        Toplam {item.label.replace(" Ekranı", "")} Sayısı: {total}
      </div>
      <div className="mt-2">
        <Chart
          type="doughnut"
          data={item.chartData}
          options={chartOptions}
          style={{ maxHeight: "150px" }}
        />
      </div>
      {rolesChartData && (
        <div className="mt-2">
          <Chart
            type="doughnut"
            data={rolesChartData}
            options={chartOptions}
            style={{ maxHeight: "150px" }}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
