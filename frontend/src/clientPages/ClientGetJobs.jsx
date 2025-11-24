import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosApi";
import { Loader2, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ClientGetJobs = () => {
  const { token } = useSelector((state) => state.client);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllJobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/client/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.jobs;
    },
  });

  // LOADING UI
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  // ERROR UI
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold">
          Something went wrong. Please try again.
        </p>
      </div>
    );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center flex items-center justify-center gap-3">
        <Briefcase className="h-8 w-8 text-blue-600" />
        Available Jobs
      </h1>

      {/* JOB GRID */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:scale-[1.02]"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {job.title}
            </h2>

            <p className="text-gray-600 line-clamp-3 mb-4">{job.description}</p>

            <div className="mb-4">
              <p className="text-sm text-gray-700 font-semibold">
                Skills Required:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skillsRequired?.length > 0 ? (
                  job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">
                    No skills listed
                  </span>
                )}
              </div>
            </div>

            <Link to={`/client/editJobs/${job._id}`}>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-all">
                View Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientGetJobs;
