import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import React from "react";

const fetchFeaturedJobs = async () => {
    const res = await axiosInstance.get("/freelancer/allJobs?sort=latest");

  return res.data.jobs.slice(0, 4);
};

const FeaturedJobs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featuredJobs"],
    queryFn: fetchFeaturedJobs,
    staleTime: 1000 * 60,
  });

  if (isLoading)
    return <p className="text-center text-white">Loading Featured Jobs...</p>;

  if (error)
    return (
      <p className="text-center text-red-500">Error loading featured jobs</p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {data.map((job) => (
        <div
          key={job._id}
          className="bg-gray-900 p-5 rounded-xl shadow hover:shadow-lg"
        >
          <h3 className="font-bold text-lg text-white">{job.title}</h3>

          <p className="text-white mt-1 line-clamp-2 ">{job.description}</p>

          <p className="text-sm text-blue-600 font-semibold mt-2">
            💰 Budget: ₹{job.budget}
          </p>

          <p className="text-sm mt-1 text-white">
            🛠 Skills: {job.skillsRequired}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedJobs;
