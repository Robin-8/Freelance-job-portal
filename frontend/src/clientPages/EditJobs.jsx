import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosApi";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

  // Prefill form once data is loaded
  if (data && form.title === "") {
    setForm({
      title: data.title,
      description: data.description,
      skillsRequired: data.skillsRequired?.join(", "),
    });
  }

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------------ UPDATE JOB MUTATION ------------
  const updateJob = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put(
        `/client/updateJob/${id}`,
        {
          title: form.title,
          description: form.description,
          skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      alert("Job updated successfully!");
      navigate("/client/all");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateJob.mutate();
  };

  // ---------------- LOADING ----------------
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (isError)
    return (
      <p className="text-center text-red-600 mt-6">
        Something went wrong while fetching job details.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 mt-10 rounded-2xl shadow-lg">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Edit Job – {form.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="font-semibold text-gray-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 mt-1 h-32"
          ></textarea>
        </div>

        
        <div>
          <label className="font-semibold text-gray-700">
            Skills Required
          </label>
          <input
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 mt-1"
          />
        </div>

       
        <button
          type="submit"
          disabled={updateJob.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition"
        >
          {updateJob.isPending ? "Updating..." : "Update Job"}
        </button>
      </form>
    </div>
  );
};

export default EditJobs;
