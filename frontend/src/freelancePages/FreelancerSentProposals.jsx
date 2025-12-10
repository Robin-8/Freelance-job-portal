import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";

const FreelancerSentProposals = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getAllPreposals"],
    queryFn: async () => {
      const res = await axiosInstance.get("/freelancer/getPreposal");
      return res.data;
    },
  });

  const proposals = data?.preposal || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0d0d0d]">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-400 mt-10">
        Error loading proposals...
      </p>
    );

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-100 mb-10 text-center">
        Sent Proposals
      </h1>

      {/* No Proposals */}
      {proposals.length === 0 && (
        <p className="text-center text-gray-400 text-lg">
          You haven't sent any proposals yet.
        </p>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {proposals.map((item) => (
          <div
            key={item._id}
            className="bg-[#121212] rounded-2xl p-6 border border-gray-800 shadow-xl hover:shadow-blue-600/20 transition transform hover:-translate-y-1"
          >
            {/* Job Title */}
            <h2 className="text-xl font-semibold text-white mb-3">
              {item.job.title}
            </h2>

            {/* Budget */}
            <p className="text-gray-300 text-sm">
              <span className="font-semibold text-gray-200">Budget:</span> ₹
              {item.job.budget}
            </p>

            {/* Deadline */}
            <p className="text-gray-300 text-sm mb-3">
              <span className="font-semibold text-gray-200">Deadline:</span>{" "}
              {new Date(item.job.deadline).toLocaleDateString()}
            </p>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
              ${
                item.status === "pending"
                  ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                  : item.status === "accepted"
                  ? "bg-green-500/20 text-green-300 border border-green-500/40"
                  : "bg-red-500/20 text-red-300 border border-red-500/40"
              }`}
            >
              {item.status.toUpperCase()}
            </span>

            {/* Sent Date */}
            <p className="text-xs text-gray-500 mt-4">
              Sent on: {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerSentProposals;
