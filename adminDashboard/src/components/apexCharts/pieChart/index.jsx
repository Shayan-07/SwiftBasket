import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = () => {

  let _seed = 42;
  Math.random = function () {
    _seed = (_seed * 16807) % 2147483647;
    return (_seed - 1) / 2147483646;
  };

  const [state] = useState({
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        width: '100%',
        type: 'pie',
      },
      labels: ['Electronics', 'Fashion', 'Beauty', 'Grocery', 'Wellness'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%'
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="pie"
        width={'100%'}
      />
    </div>
  );
};

export default PieChart;
