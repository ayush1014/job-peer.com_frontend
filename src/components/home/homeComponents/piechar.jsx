import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

function PieChart() {
    const [jobStats, setJobStats] = useState(null); // Initialize with null

    useEffect(() => {
        const username = JSON.parse(sessionStorage.getItem('User')).username;
        const fetchJobStats = async () => {
            try {
                const response = await api.get(`/jobStats/${username}`);
                setJobStats(response.data);
            } catch (error) {
                console.error('Error fetching job stats:', error);
            }
        };

        fetchJobStats();
    }, []);

    const checkAllStatsZero = (stats) => {
        // console.log('pie_stats: ', stats)
        return stats && Object.values(stats).every(value => value === 0);
    };

    const areAllStatsZero = jobStats ? checkAllStatsZero(jobStats) : false;

    const chartData = jobStats ? {
        labels: ['Application Processing', 'Following Up', 'Interviewing', 'Rejected'],
        datasets: [
            {
                label: 'Job Application Status',
                data: [jobStats.application_processing, jobStats.following_up, jobStats.interviewing, jobStats.rejected],
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            }
        ]
    } : null;

    return (
        <div>
            <h2>Application Status Statistics</h2>
            {jobStats == null ? (
                <p>Loading...</p> // Show a loading message or spinner
            ) : areAllStatsZero ? (
                <p style={{ color: 'red' }}>Please update application status to see stats...</p>
            ) : (
                <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false, aspectRatio:1}} />
            )}
        </div>
    );
}

export default PieChart;
