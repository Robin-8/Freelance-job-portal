import { useQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../api/axiosApi";

const AdminEditJobs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.client);

  // ---------------- FETCH JOB DATA ----------------
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["editJob", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/editJobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.job;
    },
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  if (data && form.title === "") {
    setForm({
      title: data.title,
      description: data.description,
      budget: data.budget,
    });
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put(
        `/admin/updateJob/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      alert("Job updated successfully!");
      navigate("/admin/getAdminJobs");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  // ---------------- Loading Spinner ----------------
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="h-10 w-10 animate-spin border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );

  // ---------------- Error ----------------
  if (isError)
    return (
      <p className="text-center text-red-400 mt-10">
        {error?.response?.data?.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-[#121417] p-10 mt-12 shadow-xl rounded-2xl border border-[#1f232a] text-gray-200">
      
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        Edit Job – <span className="text-indigo-400">{form.title}</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Job Title */}
        <div>
          <label className="block mb-1 text-gray-400 font-medium">Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1d22] border border-[#2b3039] rounded-lg
                       text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-gray-400 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full h-32 p-3 bg-[#1a1d22] border border-[#2b3039] rounded-lg
                       text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Budget */}
        <div>
          <label className="block mb-1 text-gray-400 font-medium">Budget</label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1d22] border border-[#2b3039] rounded-lg
                       text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl
                       shadow-lg transition-all disabled:opacity-60"
          >
            {mutation.isPending ? "Updating..." : "Update Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditJobs;
