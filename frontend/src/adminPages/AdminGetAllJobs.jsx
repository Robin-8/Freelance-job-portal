import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosApi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminGetAllJobs = () => {
  const { token } = useSelector((state) => state.client);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getJobs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/getJobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.jobs;
    },
  });

  // 🔥 FIXED HANDLE DELETE
  const handleDelete = async (id) => {
  try {
    await axiosInstance.delete(`/admin/deleteJob/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Job soft-deleted!");
    queryClient.invalidateQueries(["getJobs"]); // refresh list
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete job");
  }
};


  if (isLoading) return <p>Loading jobs...</p>;
  if (isError) return <p>Error loading jobs</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-white tracking-wide">
        Admin – All Posted Jobs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((job) => (
          <div
            key={job._id}
            className="bg-gray-800/70 border border-gray-700 p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-white mb-2">
              {job.title}
            </h2>

            <p className="text-gray-300 text-sm mb-4">{job.description}</p>

            <div className="space-y-2 text-sm text-gray-400">
              <p>
                <span className="font-semibold text-gray-200">Budget:</span>{" "}
                {job.budget}
              </p>
              <p>
                <span className="font-semibold text-gray-200">Skills:</span>{" "}
                {job.skillsRequired.join(", ")}
              </p>
            </div>

            <div className="mt-5 flex gap-3">
              <Link to={`/admin/editJobs/${job._id}`}>
                <button className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white">
                  View
                </button>
              </Link>

              {/* 🔥 DELETE WORKING */}
              <button
                onClick={() => handleDelete(job._id)}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGetAllJobs;
