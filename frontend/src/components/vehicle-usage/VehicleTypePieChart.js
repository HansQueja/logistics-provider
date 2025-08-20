// src/components/VehicleTypePieChart.js
'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components Chart.js needs for a Pie chart
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const VehicleTypePieChart = ({ data }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Distribution of Vehicle Types',
            },
        },
    };

    return <Pie data={data} options={options} />;
};

export default VehicleTypePieChart;