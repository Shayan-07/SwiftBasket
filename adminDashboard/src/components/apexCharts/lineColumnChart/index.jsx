import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const LineColumnChart = () => {
  const [state] = useState({
    series: [
      {
        name: 'Sales',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
      },
      {
        name: 'Expenses',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
      },
      {
        name: 'Revenue',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: [
        '01/01/2023', '02/01/2023', '03/01/2023', '04/01/2023',
        '05/01/2023', '06/01/2023', '07/01/2023', '08/01/2023',
        '09/01/2023', '10/01/2023', '11/01/2023'
      ],
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        show: false
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            return typeof y !== 'undefined' ? `$${y.toFixed(0)}` : y;
          }
        }
      }
    }
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="line"
        height={350}
        width={'100%'}
      />
    </div>
  );
};

export default LineColumnChart;
