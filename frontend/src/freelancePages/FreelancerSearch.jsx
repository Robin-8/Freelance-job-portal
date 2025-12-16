import React, { useState } from "react";
import axiosInstance from "../api/axiosApi";
import { Link } from "react-router-dom";

const FreelancerSearch = () => {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setJobs([]);

      const res = await axiosInstance.get(
        `/freelancer/allJobs?title=${search}`
      );

      if (!res.data.jobs || res.data.jobs.length === 0) {
        setError("No job found. We will add it later.");
      } else {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      setError("Error fetching jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <div className="flex gap-2 w-full max-w-xl">
          <input
            type="text"
            placeholder="Search job title..."
            className="p-5 rounded-2xl bg-gray-800 text-white flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-green-600 px-5 rounded-2xl text-white"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-white">Searching jobs...</p>}

      {/* Error or No Jobs */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Jobs list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-gray-900 p-5 rounded-xl shadow hover:shadow-lg"
          >
            <h3 className="font-bold text-lg text-white">{job.title}</h3>
            <p className="text-white mt-1 line-clamp-2">{job.description}</p>
            <p className="text-sm text-blue-400 font-semibold mt-2">
              💰 Budget: ₹{job.budget}
            </p>
            <p className="text-sm mt-1 text-white">
              🛠 Skills: {job.skillsRequired}
            </p>
            <Link to={`/freelancer/applyJob/${job._id}`}>
              <button className="p-2 px-3 bg-green-600 text-white font-bold rounded-md">
                Apply Job
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerSearch;
