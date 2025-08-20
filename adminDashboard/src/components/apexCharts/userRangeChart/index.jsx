import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const UserRangeChart = () => {
  const [state] = useState({
    series: [
      {
        type: "rangeArea",
        name: "User Traffic",
        data: [
          { x: "Jan", y: [null, null] },
          { x: "Feb", y: [1200, 1800] },
          { x: "Mar", y: [900, 2900] },
          { x: "Apr", y: [1400, 2700] },
          { x: "May", y: [2600, 3900] },
          { x: "Jun", y: [500, 1700] },
          { x: "Jul", y: [1900, 2300] },
          { x: "Aug", y: [1000, 1500] }
        ]
      },
      {
        type: "rangeArea",
        name: "Subscription Growth",
        data: [
          { x: "Jan", y: [3100, 3400] },
          { x: "Feb", y: [4200, 5200] },
          { x: "Mar", y: [null, null] },
          { x: "Apr", y: [3400, 3900] },
          { x: "May", y: [5100, 5900] },
          { x: "Jun", y: [5400, 6700] },
          { x: "Jul", y: [4300, 4600] },
          { x: "Aug", y: [null, null] }
        ]
      },
      {
        type: "line",
        name: "Active Users",
        data: [
          { x: "Jan", y: 1500 },
          { x: "Feb", y: 1700 },
          { x: "Mar", y: 1900 },
          { x: "Apr", y: 2200 },
          { x: "May", y: 3000 },
          { x: "Jun", y: 1000 },
          { x: "Jul", y: 2100 },
          { x: "Aug", y: 1200 },
          { x: "Sep", y: 1800 },
          { x: "Oct", y: 2000 }
        ]
      },
      {
        type: "line",
        name: "Active Subscriptions",
        data: [
          { x: "Jan", y: 3300 },
          { x: "Feb", y: 4900 },
          { x: "Mar", y: 4300 },
          { x: "Apr", y: 3700 },
          { x: "May", y: 5500 },
          { x: "Jun", y: 5900 },
          { x: "Jul", y: 4500 },
          { x: "Aug", y: 2400 },
          { x: "Sep", y: 2100 },
          { x: "Oct", y: 1500 }
        ]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: "rangeArea",
        animations: {
          speed: 500
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#d4526e", "#33b2df", "#d4526e", "#33b2df"],
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: [0.24, 0.24, 1, 1]
      },
      forecastDataPoints: {
        count: 2
      },
      stroke: {
        curve: "monotoneCubic",
        width: [0, 0, 2, 2]
      },
      legend: {
        show: true,
        inverseOrder: true
      },
      markers: {
        hover: {
          sizeOffset: 5
        }
      },
      tooltip: {
        shared: true,
        intersect: false
      }
    }
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="rangeArea"
        height={350}
        width="100%"
      />
    </div>
  );
};

export default UserRangeChart;
