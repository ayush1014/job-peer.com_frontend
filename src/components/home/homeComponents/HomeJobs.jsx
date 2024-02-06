import React, { useEffect, useState } from 'react'
import api from '../../../config/axios';
import './viewAllJobs.css'
import JobDetailsModal from './HomeJobDetailModal';

function HomeJobs() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedJobId, setSelectedJobId] = useState(null);


    useEffect(() => {
        const username = JSON.parse(sessionStorage.getItem('User')).username;
        api.get(`/jobs/${username}`).then(response => {
            setJobs(response.data);
        }).catch(error => {
            console.error('error fetching job: ', error);
        });
    }, []);

    const getShadowClass = (job) => {
        if (job.interviewing) return 'shadow-green';
        if (job.rejected) return 'shadow-red';
        if (job.application_processing && job.following_up) return 'shadow-orange';
        if (job.application_processing) return 'shadow-blue';
        if (job.following_up) return 'shadow-yellow';
        return 'shadow-normal';
    };

    const handleJob = (id) => {
        // Use a function that returns another function to handle the click event
        return () => {
            const job = jobs.find(j => j.id === id); // Find the job by id
            setSelectedJob(job); // Set the selected job state
            console.log(selectedJob)
            setIsModalOpen(true); // Open the modal
        };
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className='allJobs'>
                <ul style={{ overflow: 'hidden', overflowY: 'auto', height: 'fit-content', padding: '0%', paddingBottom: '5%', marginTop:'10%' }}>
                    {jobs.length > 0 ? (
                        jobs.slice(0, 5).map(j => (
                            <li key={j.id}
                                className={getShadowClass(j)}
                                onClick={handleJob(j.id)}
                                style={{ fontSize: '120%', minHeight: '10%', maxHeight: 'fit-content', padding: '2%', margin: 'auto', wordWrap: 'break-word', width: '50%' }}>
                                {/* JobId: {j.id}<br /> */}
                                <span style={{ color: 'black', fontWeight: '600' }}>{j.job_title}</span><br />
                                <span style={{ fontWeight: '400' }}>{j.company_name}</span><br />
                            </li>
                        ))
                    ) : (
                        <p style={{ margin: '20%' }}>No jobs available or data is still loading.</p>
                    )}
                </ul>
            </div>
            {isModalOpen && selectedJob && (
                <JobDetailsModal job={selectedJob} closeModal={closeModal} />
            )}
        </>
    );
}

export default HomeJobs;
