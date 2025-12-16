import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// Icons
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

  /* ---------------- MUTATION ---------------- */

  const jobMutation = useMutation({
    mutationFn: async (newJob) => {
      const res = await axiosInstance.post("/admin/addJob", newJob);
      return res.data;
    },

    onMutate: () => {
      toast.loading("Posting job...", { id: "job" });
    },

    onSuccess: () => {
      toast.success("Job posted successfully!", { id: "job" });
      queryClient.invalidateQueries(["jobs"]);
      reset();
      setSkills([]);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to post job",
        { id: "job" }
      );
    },
  });

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = (data) => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    const payload = {
      ...data,
      skillsRequired: skills,
      postedBy: client?._id,
    };

    jobMutation.mutate(payload);
  };

  /* ---------------- SKILLS ---------------- */

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (skills.includes(skillInput.trim())) {
      toast.error("Skill already added");
      return;
    }
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-gray-900/60 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white flex justify-center items-center gap-3">
            <Briefcase className="text-blue-400" />
            Post a New Job
          </h1>
          <p className="text-gray-400 mt-2">
            Create a job posting and reach the best freelancers
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Job Title */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex gap-2 items-center">
              <Briefcase size={18} /> Job Title
            </label>
            <input
              {...register("title", { required: true })}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter job title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex gap-2 items-center">
              <FileText size={18} /> Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows={4}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Explain job details..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex gap-2 items-center">
              <Tags size={18} /> Skills Required
            </label>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl"
              >
                <Plus />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-900/30 text-blue-300 px-4 py-1 rounded-full flex gap-2 items-center border border-blue-700"
                >
                  {skill}
                  <X
                    size={18}
                    className="cursor-pointer text-red-400 hover:text-red-500"
                    onClick={() => removeSkill(i)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Budget Type */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex gap-2 items-center">
              <IndianRupee size={18} /> Budget Type
            </label>
            <select
              {...register("budgetType")}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex gap-2 items-center">
              <IndianRupee size={18} /> Budget (₹)
            </label>
            <input
              type="number"
              {...register("budget", { required: true })}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex gap-2 items-center">
              <CalendarDays size={18} /> Deadline
            </label>
            <input
              type="date"
              {...register("deadline", { required: true })}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Place */}
          <div>
            <label className="text-gray-300 font-semibold mb-2 flex gap-2 items-center">
              <MapPin size={18} /> Location / Place
            </label>
            <input
              {...register("place", { required: true })}
              className="w-full p-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Remote, Kochi, Bangalore..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={jobMutation.isLoading}
            className={`w-full py-3 rounded-2xl text-lg font-semibold ${
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
