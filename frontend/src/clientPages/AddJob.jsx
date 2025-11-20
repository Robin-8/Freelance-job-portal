import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import { useSelector } from "react-redux";

const AddJob = () => {
  const { register, handleSubmit, reset } = useForm();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const client = useSelector((state) => state.client.user);


  const queryClient = useQueryClient();

  // ------------------------
  // React Query → Post Mutation
  // ------------------------
  const jobMutation = useMutation({
    mutationFn: async (newJob) => {
      return await axiosInstance.post("/client/addJob", newJob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]); 
      alert("Job posted successfully!");
      reset();
      setSkills([]);
    },
    onError: () => {
      alert("Error posting job!");
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      skillsRequired: skills,
      postedBy: client?.id,
    };

    jobMutation.mutate(payload);
  };

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-black flex justify-center py-10 px-4">
      <div className="bg-red-600 w-full max-w-3xl shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Post a New Job
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-white font-semibold mb-1">Job Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter job title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-1">Description</label>
            <textarea
              {...register("description", { required: true })}
              rows="4"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Explain job details..."
            ></textarea>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-white font-semibold mb-1">Skills Required</label>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Budget Type */}
          <div>
            <label className="block text-white font-semibold mb-1">Budget Type</label>
            <select
              {...register("budgetType")}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-white font-semibold mb-1">Budget</label>
            <input
              type="number"
              {...register("budget", { required: true })}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Minimum ₹10"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-white font-semibold mb-1">Deadline</label>
            <input
              type="date"
              {...register("deadline", { required: true })}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Place */}
          <div>
            <label className="block text-white font-semibold mb-1">Location / Place</label>
            <input
              {...register("place", { required: true })}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Eg: Remote, Kochi..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={jobMutation.isLoading}
            className={`w-full text-white py-3 rounded-xl mt-3 text-lg font-semibold 
              ${jobMutation.isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            {jobMutation.isLoading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
