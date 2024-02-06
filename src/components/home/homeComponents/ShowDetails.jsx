import React, { useEffect, useState } from 'react'
import api from '../../../config/axios';
import './viewAllJobs.css'
import { useNavigate, useParams } from 'react-router-dom';

function ViewJobs() {
  const [job, setJob] = useState([]);
  const [editmode, setEditmode] = useState(false);
  const [editJob, setEditJob] = useState({});
  const navigate = useNavigate()

  const {id} = useParams();


  useEffect(() => {
    const username = JSON.parse(sessionStorage.getItem('User')).username;
    api.get(`/jobDetail/${username}/${id}`).then(response => {
      setJob(response.data);
      // console.log('response: ', job)

    }).catch(error => {
      console.error('error fetching job: ', error);
    });
  }, [id]);



  const handleBack = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    setEditmode(true);
    setEditJob({ 
      id: job.id, // Ensure to include the job ID
      job_title: job.job_title || '', // Default to empty string if null
      company_name: job.company_name || '',
      job_description: job.job_description || '',
      job_applied_link: job.job_applied_link || ''
    });
  };

  const handleInputChange = (e, field) => {
    setEditJob(prev => ({ ...prev, [field]: e.target.value }));
  };


  const handleSave = async () => {
    try {
      const response = await api.put(`/editJobs/${editJob.id}`, editJob);
      console.log('Job edited successfully:', response.data);
      
      // Update the job with the new job data
      setJob({ ...job, ...editJob });
      setEditmode(false); // Exit edit mode
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };


  const handleCancel = () => {
    setEditmode(false)
  }

  const getApplicationStatus = () => {
    let status = [];
    if (job.application_processing) status.push('Application Processing');
    if (job.following_up) status.push('Following Up');
    if (job.interviewing) status.push('Interviewing');
    if (job.rejected) status.push('Rejected');
    return status.join(' & ') || 'Application status not selected !!'; // Join with ' & ' or default to 'Not Started'
  };

  return (
    <>
        <div>
          {!editmode ? (
            <div className='detail-mode'>
              <div className='detail-btn'>
                <button className='detail-edit' onClick={handleEditClick}>Edit Job</button>
                <button className='detail-back' onClick={handleBack}>Back</button>
              </div>
              <div className='details'>
                <p className='status'>Application Status: <span>{getApplicationStatus()}</span></p>
                <p className='job-title'><span>Title </span><br />{job.job_title}</p>
                <hr></hr>
                <p className='company-name'><span>Company Name </span><br />{job.company_name}</p>
                <hr></hr>
                <p className='job-description'><span>Job Description </span><br /><pre>{job.job_description}</pre></p>
                <hr></hr>
                <p className='date-applied'><span>Applied On </span><br />{new Date(job.job_applied_date).toLocaleString()}</p>
                <hr></hr>
                <p className='job-link'><span>Job Applied Link </span><br /><a href={job.job_applied_link} target="_blank" rel="noopener noreferrer">{job.job_applied_link}</a></p>
              </div>
            </div>
          ) : (
            <div class="edit-form">
              <input class="edit-input" type="text" value={editJob.job_title} onChange={e => handleInputChange(e, 'job_title')} placeholder="Job Title" />
              <input class="edit-input" type="text" value={editJob.company_name} onChange={e => handleInputChange(e, 'company_name')} placeholder="Company Name" />
              <textarea class="edit-textarea" value={editJob.job_description} onChange={e => handleInputChange(e, 'job_description')} placeholder="Job Description"></textarea>
              <input class="edit-input" type="text" value={editJob.job_applied_link} onChange={e => handleInputChange(e, 'job_applied_link')} placeholder="Job Link" />
              <div class="form-buttons">
                <button class="save-btn" onClick={handleSave}>Save</button>
                <button class="cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          )}
        </div>
    </>
  );
}

export default ViewJobs;
