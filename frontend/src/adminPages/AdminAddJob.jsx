import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// Lucide Icons
import {
  Briefcase,
  FileText,
  Tags,
  IndianRupee,
  CalendarDays,
  MapPin,
  Plus,
  X,
} from "lucide-react";

const AdminAddJob = () => {
  const { register, handleSubmit, reset } = useForm();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const client = useSelector((state) => state.client.user);
  const queryClient = useQueryClient();

  const jobMutation = useMutation({
    mutationFn: async (newJob) => {
      return await axiosInstance.post("/admin/addJob", newJob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      toast.success("Job posted successfully!");
      reset();
      setSkills([]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error posting job");
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      skillsRequired: skills,
      postedBy: client?._id,
    };
    jobMutation.mutate(payload);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-3xl bg-gray-900/60 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex justify-center gap-3 items-center">
            <Briefcase className="text-blue-400" /> Post a New Job
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            Create a job posting and reach the best freelancers.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Job Title */}
          <div>
            <label className="text-gray-300 font-semibold flex items-center gap-2 mb-2">
              <Briefcase size={18} /> Job Title
            </label>
            <input
              {...register("title", { required: true })}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter job title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-300 font-semibold flex items-center gap-2 mb-2">
              <FileText size={18} /> Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows="4"
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Explain job details..."
            ></textarea>
          </div>

          {/* Skills */}
          <div>
            <label className="text-gray-300 font-semibold flex items-center gap-2 mb-2">
              <Tags size={18} /> Skills Required
            </label>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl flex items-center justify-center text-white"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-3 mt-4">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-900/30 text-blue-300 px-4 py-1 rounded-full flex items-center gap-2 border border-blue-700"
                >
                  {skill}
                  <X
                    className="cursor-pointer text-red-400 hover:text-red-500"
                    size={18}
                    onClick={() => removeSkill(i)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Budget Type */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <IndianRupee size={18} /> Budget Type
            </label>
            <select
              {...register("budgetType")}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <IndianRupee size={18} /> Budget (₹)
            </label>
            <input
              type="number"
              {...register("budget", { required: true })}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter amount"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <CalendarDays size={18} /> Deadline
            </label>
            <input
              type="date"
              {...register("deadline", { required: true })}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Place */}
          <div>
            <label className="text-gray-300 font-semibold flex items-center gap-2 mb-2">
              <MapPin size={18} /> Location / Place
            </label>
            <input
              {...register("place", { required: true })}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Eg: Remote, Kochi, Bangalore..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={jobMutation.isLoading}
            className={`w-full py-3 rounded-2xl text-xl font-semibold transition ${
              jobMutation.isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {jobMutation.isLoading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddJob;
