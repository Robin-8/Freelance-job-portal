import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import toast from "react-hot-toast";
import { User, Mail, Lock, Save } from "lucide-react";

const FreelanceUpdateProfile = () => {
  const { token } = useSelector((state) => state.client);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ───────────────────────────────
  // FETCH PROFILE
  // ───────────────────────────────
  const { isLoading } = useQuery({
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

  // ───────────────────────────────
  // UPDATE PROFILE
  // ───────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async (updateData) => {
      const res = await axiosInstance.put(
        "/freelancer/updateProfile",
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
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
    updateMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-blue-600/20">
            <User className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Update Profile
            </h2>
            <p className="text-gray-400 text-sm">
              Manage your freelancer account details
            </p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-center">Loading profile...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  {...register("email", { required: "Email is required" })}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                New Password (optional)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  {...register("password")}
                  type="password"
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Leave empty to keep current password"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Password will only update if you enter a new one
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={updateMutation.isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition
                ${
                  updateMutation.isLoading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              <Save className="w-5 h-5" />
              {updateMutation.isLoading ? "Updating..." : "Save Changes"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default FreelanceUpdateProfile;
