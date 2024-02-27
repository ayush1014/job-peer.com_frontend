import React, { useEffect, useState } from 'react';
import api from '../../../config/axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function JobStatsBarChart() {
    const [timeFrame, setTimeFrame] = useState('week');
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const username = JSON.parse(sessionStorage.getItem('User')).username;
        const timeZone = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);
        // console.log('timezone', timeZone)
        api.get(`/jobStatsByTimeFrame/${username}/${timeFrame}/${timeZone}`)
          .then(response => {
            // console.log('response: ', response)
            if (response.data && response.data.length) {
              // Transform the data here to match the format expected by Chart.js
              const transformedData = {
                labels: response.data.map(item => item.date), // Replace 'date' with the actual property name
                datasets: [{
                  label: 'Number of Applications',
                  data: response.data.map(item => item.jobCount), // Replace 'jobCount' with the actual property name
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                }]
              };
              setChartData(transformedData);
              // console.log(response.data)
            } else {
              setChartData(null);
            }
          })
          .catch(error => {
            // console.error(error);
            setChartData(null);
          });
      }, [timeFrame]);

    const handleTimeFrameChange = (event) => {
        setTimeFrame(event.target.value);
    };

    // Conditional rendering to handle when data is null
    const renderChart = () => {
        if (!chartData) {
            return <p>No data to display</p>;
        }

        return (
            <Bar 
              data={chartData} 
              options={{
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Timeframe'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Number of Applications'
                    },
                    beginAtZero: true
                  }
                }
              }} 
            />
        );
    };

    return (
        <div>
            <h2>Job Applied Statistics</h2>
            <select onChange={handleTimeFrameChange} value={timeFrame}>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="6months">6 Months</option>
                <option value="year">Year</option>
            </select>
            {renderChart()}
        </div>
    );
}

export default JobStatsBarChart;
