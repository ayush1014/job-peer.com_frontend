import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import JobDetailsModal from "./HomeJobDetailModal";

function HomeJobs() {
  const [jobs, setJobs] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    const username = JSON.parse(sessionStorage.getItem("User")).username;
    api
      .get(`/jobs/${username}`)
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("error fetching job: ", error);
      });
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="allJobs">
        <ul className="pl-0 mt-6 space-y-6">
          {jobs
            ? jobs.slice(0, 5).map((activityItem) => (
                <li key={activityItem.id} className="relative flex gap-x-4">
                  <div
                    className="-bottom-6
                        absolute left-0 top-0 flex w-6 justify-center"
                  >
                    <div className="w-px bg-gray-200" />
                  </div>
                  {
                    <>
                      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                        {
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                        }
                      </div>
                      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                        <span className="font-medium text-gray-900">
                          Applied to{" "}
                        </span>{" "}
                        {activityItem.company_name} for {activityItem.job_title}
                        .
                      </p>
                      <time
                        dateTime={activityItem.dateTime}
                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                      >
                        {activityItem.date}
                      </time>
                    </>
                  }
                </li>
              ))
            : "No recent acitivity"}
        </ul>
      </div>
      {isModalOpen && selectedJob && (
        <JobDetailsModal job={selectedJob} closeModal={closeModal} />
      )}
    </>
  );
}

export default HomeJobs;
