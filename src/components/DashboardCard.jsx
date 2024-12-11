import React from "react";
import { Chart } from "primereact/chart";

const DashboardCard = ({ item, dataCounts, userData }) => {
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

  return (
    <div
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
      {rolesChartData && (
        <div className="mt-4">
          <Chart
            type="doughnut"
            data={rolesChartData}
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
  );
};

export default DashboardCard;
