import React, { useState, useEffect } from "react";
import api from '../../../config/axios';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';

const applicationStatusOptions = [
  { id: 'application_processing', title: 'Application Processing' },
  { id: 'rejected', title: 'Rejected' },
  { id: 'interviewing', title: 'Interviewing' },
  { id: 'following_up', title: 'Following Up' },
];

function ShowDetails({ jobId, onBack, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const username = JSON.parse(sessionStorage.getItem("User")).username;
        const response = await api.get(`/jobDetail/${username}/${jobId}`);
        setFormData({ ...response.data, job_applied_date: new Date(response.data.job_applied_date).toLocaleString() });
      } catch (error) {
        // console.error("Error fetching job details:", error);
      }
    };
    if (jobId) fetchJobDetails();
  }, [jobId]);

  const fields = [
    { key: "job_title", label: "Job Title" },
    { key: "company_name", label: "Company Name" },
    { key: "job_description", label: "Job Description" },
    { key: "job_applied_date", label: "Applied Date" },
    { key: "job_applied_link", label: "Application Link" },
    { key: "appliedThrough", label: "Applied Through" },
  ];

  function Notification({ message, onDismiss }) {
    return (
      <div
        className={`fixed top-0 inset-x-0 mx-auto max-w-lg z-50 transform transition-all duration-500 ${notification.show ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="rounded-md bg-green-50 p-4 shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={onDismiss}
                className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const handleEdit = (field) => {
    setEditMode(field);
  };

  const handleSave = async (fieldKey) => {
    try {
      const updatedData = { [fieldKey]: formData[fieldKey] };
      await api.put(`/editJobs/${jobId}`, updatedData);
      const updatedJob = { ...formData, [fieldKey]: formData[fieldKey] }
      onUpdate(jobId, updatedJob)
      const fieldLabel = fields.find(field => field.key === fieldKey)?.label || fieldKey; // Fallback to fieldKey if not found

      setNotification({ show: true, message: `${fieldLabel} updated successfully.` });
      setEditMode(null);
    } catch (error) {
      console.error("Error updating job detail:", error);
    }
  };


  const handleChange = (e, field) => {
    setFormData((prevData) => ({ ...prevData, [field]: e.target.value }));
  };

  const handleStatusChange = async (status) => {
    try {
      const statusUpdate = {
        application_processing: false,
        rejected: false,
        interviewing: false,
        following_up: false,
        [status]: true,
      };
      await api.put(`/editJobs/${jobId}`, statusUpdate);

      const updatedFormData = { ...formData, ...statusUpdate };
      setFormData(updatedFormData);

      if (typeof onUpdate === 'function') {
        onUpdate(jobId, updatedFormData);
      }

      setNotification({ show: true, message: `${applicationStatusOptions.find(opt => opt.id === status).title} updated successfully.` });
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  if (!formData.job_title) return <div>Loading...</div>;

  return (
    <>
      {notification.show && (<Notification message={notification.message} onDismiss={() => setNotification({ show: false, message: '' })} />
      )}
      <div className="overflow-hidden bg-white p-2.5 shadow sm:rounded-lg">
        {/* Application Status Selection */}
        <div className="flex justify-end p-2">
          <button
            onClick={onBack}
            className="inline-flex items-center rounded-md bg-red-50 p-2 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            <span className="ml-2">Back to Jobs</span>
          </button>
        </div>
        <div className="mb-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Application Status</h3>
          <fieldset>
            <legend className="sr-only">Application Status</legend>
            <div className="mt-4 space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:space-x-4">
              {applicationStatusOptions.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={option.id}
                    name="application-status"
                    type="radio"
                    checked={formData[option.id]}
                    onChange={() => handleStatusChange(option.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor={option.id} className="ml-3 block text-sm font-medium text-gray-700">
                    {option.title}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>


        {/* Job Details */}
        <h3 className="text-lg font-medium leading-6 text-gray-900">Job Details</h3>
        <p className="mt-1 text-sm text-gray-500">Review and edit job application details.</p>
        <div className="mt-5 border-t border-gray-200">
          <dl>
            {fields.map(({ key, label }) => (
              <div key={key} className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="mt-3 text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <div className="flex flex-col sm:flex-row items-center w-full">
                    {editMode === key ? (
                      key === "job_description" ? (
                        <div className="flex-grow w-full sm:flex sm:items-center">
                          <textarea
                            name={key}
                            value={formData[key] || ''}
                            onChange={(e) => handleChange(e, key)}
                            className="flex-grow border border-gray-300 p-2 w-full"
                            style={{ minHeight: '100px' }}
                          />
                          <button
                            onClick={() => handleSave(key)}
                            className="mt-2 sm:mt-0 sm:ml-4 rounded-md bg-white px-4 py-2 text-md text-indigo-600 hover:text-indigo-500"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            name={key}
                            value={formData[key] || ''}
                            onChange={(e) => handleChange(e, key)}
                            className="flex-grow border border-gray-300 p-2 w-full"
                          />
                          <button
                            onClick={() => handleSave(key)}
                            className="mt-2 sm:mt-0 sm:ml-4 rounded-md bg-white px-4 py-2 text-md text-indigo-600 hover:text-indigo-500"
                          >
                            Save
                          </button>
                        </>
                      )
                    ) : (
                      <>
                        {key === "job_description" ? (
                          <div className="flex-grow w-full sm:flex sm:items-center">
                            <pre style={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              fontFamily: 'inherit',
                              fontSize: 'inherit',
                              background: '#f3f4f6',
                              borderRadius: '0.375rem',
                              padding: '0.5rem',
                              margin: '0.5rem 0',
                            }}>
                              {formData[key]}
                            </pre>
                          </div>
                        ) : key === "job_applied_link" ? (
                          <a
                            href={formData[key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              fontFamily: 'inherit',
                              fontSize: 'inherit',
                              padding: '0.5rem',
                              margin: '0.5rem 0',
                            }}
                            className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                          >
                            {formData[key]}
                          </a>
                        ) : (
                          <span className="flex-grow">{formData[key]}</span>
                        )}
                        <button
                          onClick={() => handleEdit(key)}
                          className="ml-4 rounded-md bg-white px-4 py-2 text-md text-indigo-600 hover:text-indigo-500"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div >
      </div >
    </>
  );
}

export default ShowDetails;

