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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="h-10 w-10 animate-spin border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isError)
    return (
      <p className="text-center text-red-600 mt-10">
        {error?.response?.data?.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 mt-10 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Edit Job – {form.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
  
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

       
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Budget</label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            {mutation.isPending ? "Updating..." : "Update Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditJobs;
