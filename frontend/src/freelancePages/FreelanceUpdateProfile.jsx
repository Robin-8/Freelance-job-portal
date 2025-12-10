import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import toast from "react-hot-toast";

const FreelanceUpdateProfile = () => {
  const { token } = useSelector((state) => state.client);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["freelancerProfile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/freelancer/getProfile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },

  
    onSuccess: (data) => {
      reset({
        name: data.user.name,
        email: data.user.email,
        password: "",
      });
    },
  });

  // Update Profile Mutation
  const updateMutation = useMutation({
    mutationFn: async (updateData) => {
      const res = await axiosInstance.put(
        "/freelancer/updateProfile",
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["freelancerProfile"]);
      toast.success("Profile updated successfully");
    },

    onError: () => {
      toast.error("Profile update failed");
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
    };

    updateMutation.mutate(payload);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full p-3 border rounded"
            placeholder="Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          {/* Email */}
          <input
            {...register("email", { required: "Email is required" })}
            className="w-full p-3 border rounded"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Password */}
          <input
            {...register("password")}
            type="password"
            className="w-full p-3 border rounded"
            placeholder="New Password (optional)"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default FreelanceUpdateProfile;
