import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import { login } from "../slice/clientSlice";
import toast from "react-hot-toast";

// Lucide Icons
import { Shield, Mail, Lock, Loader2 } from "lucide-react";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Admin Login Mutation
  const adminMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosInstance.post("/admin/login", formData);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(login(data));
      toast.success("Admin Login Successful!");
      navigate("/admin/home");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Login failed");
    },
  });

  const onSubmit = (data) => {
    adminMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#111827]/60 border border-white/10 
                      backdrop-blur-2xl shadow-2xl rounded-3xl p-8 animate-fadeIn">

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Shield className="text-purple-500" size={44} />
          <h2 className="text-3xl font-bold text-white tracking-wide mt-2">
            Admin Login
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Secure access to admin dashboard
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm font-medium">Email</label>

            <div className="flex items-center bg-[#1f2937] border border-white/10 
                            rounded-xl px-3 py-3 mt-1 group 
                            group-focus-within:border-purple-500 transition">

              <Mail size={20} className="text-gray-400 mr-3" />

              <input
                type="email"
                placeholder="Enter admin email"
                {...register("email", { required: "Email is required" })}
                className="bg-transparent text-white outline-none w-full"
              />
            </div>

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm font-medium">Password</label>

            <div className="flex items-center bg-[#1f2937] border border-white/10 
                            rounded-xl px-3 py-3 mt-1 group
                            group-focus-within:border-purple-500 transition">

              <Lock size={20} className="text-gray-400 mr-3" />

              <input
                type="password"
                placeholder="Enter password"
                {...register("password", { required: "Password is required" })}
                className="bg-transparent text-white outline-none w-full"
              />
            </div>

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={adminMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 
                       text-white p-3 rounded-xl font-semibold shadow-lg 
                       hover:opacity-90 transition-all flex justify-center 
                       items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adminMutation.isPending ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an admin account?{" "}
          <a
            href="/admin/register"
            className="text-purple-400 hover:underline font-semibold"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
