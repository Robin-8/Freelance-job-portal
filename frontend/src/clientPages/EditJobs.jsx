import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosApi";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const EditJobs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.client);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editJobsClient", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/client/editJobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.jobs;
    },
  });

  // ------------ FORM STATE ------------
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
  });

  // Prefill form once data loads
  if (data && form.title === "") {
    setForm({
      title: data.title,
      description: data.description,
      skillsRequired: data.skillsRequired?.join(", "),
    });
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------------ UPDATE JOB ------------
  const updateJob = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put(
        `/client/updateJob/${id}`,
        {
          title: form.title,
          description: form.description,
          skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Job updated successfully!");
      navigate("/client/all");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateJob.mutate();
  };

  // ------------ LOADING UI ------------
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0d0d0d]">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (isError)
    return (
      <p className="text-center text-red-400 mt-6">
        Failed to load job details.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-[#121212] p-8 mt-10 rounded-2xl shadow-xl border border-gray-800">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-3xl font-bold text-gray-100 mb-8">
        Edit Job – {form.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="font-semibold text-gray-300">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 mt-1 outline-none transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold text-gray-300">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 mt-1 h-32 outline-none transition"
          ></textarea>
        </div>

        {/* Skills */}
        <div>
          <label className="font-semibold text-gray-300">Skills Required</label>
          <input
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-600 mt-1 outline-none transition"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={updateJob.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition shadow-md hover:shadow-blue-600/40"
        >
          {updateJob.isPending ? "Updating..." : "Update Job"}
        </button>
      </form>
    </div>
  );
};

export default EditJobs;
