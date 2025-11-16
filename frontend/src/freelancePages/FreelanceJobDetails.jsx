import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosApi";

const FreelanceJobDetails = () => {
  const { id } = useParams();

  // -----------------------------
  // States
  // -----------------------------
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  // -----------------------------
  // Fetch Job Details
  // -----------------------------
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobDetails", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/freelancer/job/${id}`);
      return res.data.job;
    },
    retry: 1,
  });

  // -----------------------------
  // Apply Job (Mutation) — MUST BE BEFORE ANY RETURNS
  // -----------------------------
const applyMutation = useMutation({
  mutationFn: async () => {
    return await axiosInstance.post(
      `/freelancer/applyJob/${id}`,
      { coverLetter, bidAmount },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  },
  onSuccess: () => {
    alert("Applied Successfully!");
  },
  onError: (err) => {
    alert(err?.response?.data?.message || "Something went wrong.");
  },
});


  // -----------------------------
  // Conditional Rendering
  // -----------------------------
  if (isLoading)
    return <p className="text-center text-white mt-10">Loading job...</p>;

  if (isError)
    return (
      <p className="text-red-500 text-center mt-10">
        Error loading job: {error?.response?.data?.message || error.message}
      </p>
    );

  const job = data;

  if (!job)
    return (
      <p className="text-center text-white mt-10">Job not found or deleted.</p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-xl mt-10 text-white">
      <h1 className="text-3xl font-bold">{job.title}</h1>

      <p className="text-gray-300 mt-3">{job.description}</p>

      <p className="mt-3 text-blue-400 font-semibold">
        Skills Required:{" "}
        {Array.isArray(job.skillsRequired)
          ? job.skillsRequired.join(", ")
          : job.skillsRequired}
      </p>

      <p className="mt-1 text-green-400 font-semibold">Budget: ₹{job.budget}</p>

      <hr className="my-6 border-gray-700" />

      <h2 className="text-xl mb-3 font-semibold">Apply for this Job</h2>

      <textarea
        placeholder="Write your cover letter..."
        className="w-full p-4 rounded-lg bg-gray-800 text-white"
        rows={4}
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
      />

      <input
        type="number"
        placeholder="Your bid amount"
        className="w-full p-4 mt-3 rounded-lg bg-gray-800 text-white"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />

      <button
        onClick={() => applyMutation.mutate()}
        className="mt-5 bg-green-600 p-3 rounded-lg text-white w-full"
      >
        Submit Proposal
      </button>
    </div>
  );
};

export default FreelanceJobDetails;
