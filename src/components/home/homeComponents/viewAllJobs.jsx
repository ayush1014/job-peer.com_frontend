import React, { useEffect, useState } from 'react';
import api from '../../../config/axios';
import './viewAllJobs.css';
import '../../../App.css'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

export default function ViewJobs() {
  const [jobs, setJobs] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [editmode, setEditmode] = useState(false);
  const [editJob, setEditJob] = useState({});
  const [search, setSearch] = useState('');
  const [checkSearch, setCheckSearch] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const username = JSON.parse(sessionStorage.getItem('User')).username;
    api.get(`/jobs/${username}`).then(response => {
      setJobs(response.data);
    }).catch(error => {
      console.error('error fetching job: ', error);
    });
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDetail = (id) => {
    setSelectedJobId(id);
    setShowDetail(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/deleteJobs/${id}`);
      console.log('Job Deleted Successfully');
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      if (checkSearch) {
        setFilteredJobs(prevFilteredJobs => prevFilteredJobs.filter(job => job.id !== id));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleBack = () => {
    setShowDetail(false);
    setSelectedJobId(null);
  };

  const handleEditClick = () => {
    setEditmode(true);
    setEditJob({ ...jobs.find(job => job.id === selectedJobId) });
  };

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  const handleInputChange = (e, field) => {
    setEditJob(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/editJobs/${editJob.id}`, editJob);
      console.log('edited job successfully');
      setEditmode(false);
      setJobs(prevJobs => prevJobs.map(j => j.id === editJob.id ? { ...j, ...editJob } : j));
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleCancel = () => {
    setEditmode(false);
  };

  const handleCheckboxChange = async (jobId, field) => {
    const updatedJob = { ...jobs.find(job => job.id === jobId) };
    updatedJob[field] = !updatedJob[field];

    // Enforce rules
    if (field === 'interviewing') {
      updatedJob.application_processing = false;
      updatedJob.following_up = false;
      updatedJob.rejected = false;
    } else if (field === 'rejected') {
      updatedJob.application_processing = false;
      updatedJob.interviewing = false;
    } else if (field === 'application_processing') {
      updatedJob.interviewing = false;
      updatedJob.rejected = false;
    } else if (field === 'following_up') {
      updatedJob.interviewing = false;
    }

    try {
      await api.put(`/editJobs/${jobId}`, updatedJob);
      setJobs(prevJobs => prevJobs.map(j => j.id === jobId ? updatedJob : j));
      setFilteredJobs(prevFilteredJobs => prevFilteredJobs.map(j => j.id === jobId ? updatedJob : j));
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const getShadowClass = (job) => {
    if (job.interviewing) return 'shadow-green';
    if (job.rejected) return 'shadow-red';
    if (job.application_processing && job.following_up) return 'shadow-orange';
    if (job.application_processing) return 'shadow-blue';
    if (job.following_up) return 'shadow-yellow';
    return 'shadow-normal';
  };

  const getApplicationStatus = (job) => {
    let status = [];
    if (job.application_processing) status.push('Application Processing');
    if (job.following_up) status.push('Following Up');
    if (job.interviewing) status.push('Interviewing');
    if (job.rejected) status.push('Rejected');
    return status.join(' & ') || 'Application status not selected !!';
  };

  const handleSearch = async () => {
    if (search.trim()) {
      const username = JSON.parse(sessionStorage.getItem('User')).username;
      try {
        const response = await api.get(`/jobs/${username}`, {
          params: { search: search.trim() },
        });
        setFilteredJobs(response.data);
        setCheckSearch(true);
      } catch (error) {
        console.error('Error searching jobs:', error);
      }
    } else {
      setFilteredJobs(jobs);
      setCheckSearch(false);
    }
  };
 

  const [jobStatus, setJobStatus] = useState();
  const handleStatus = (stat) => {
    setJobStatus(stat)
  }
  return (
    
    <ul role="list" className="pt-6 pr-6 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
           {jobs ? jobs.map((person) => (
        <li key={person.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-md font-medium text-gray-900">{person.company_name}</h3>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">{person.job_title}</p>
              <p className="truncate text-sm gray-500">Applied on: {new Date(Date.parse(person.createdAt)).toLocaleDateString()}</p>

            </div>
            {person.application_processing === 1 ? (
    <span class="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Badge</span>

  ) : person.following_up === 1 ? (
    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
      Badge
    </span>
  ) : person.interviewing === 1 ? (
    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
      Badge
    </span>
  ) : person.rejected === 1 ? (
    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
      Badge
    </span>
  ) : (
    // Render application_processing badge when all properties are 0
    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
      Applied
    </span>
  )}
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <button
                  onClick={() => handleDetail(person.id)}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  Details
                </button>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <button
                  onClick={() => handleDelete(person.id)}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </li>
         )): (<p>No jobs available or data is still loading.</p>)}
    </ul>
  )
}
