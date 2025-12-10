import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import { registerSuccess } from "../slice/clientSlice";
import toast from "react-hot-toast";

// Lucide icons
import { User, Mail, Lock, Loader2 } from "lucide-react";

function AdminRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const adminRegMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosInstance.post("/admin/adminRegister", formData);
      return res.data; // Expect { user, token } ideally
    },
    onSuccess: (data) => {
      const user = data.user ?? data?.userData ?? null;
      const token = data.token ?? data?.accessToken ?? null;

      if (user && token) {
        dispatch(registerSuccess({ user, token }));
        toast.success("Admin registration successful");
        navigate("/admin/home");
      } else {
        toast.success("Registered — please login");
        navigate("/admin/login");
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Registration failed");
    },
  });

  const onSubmit = (payload) => adminRegMutation.mutate(payload);

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-lg bg-gradient-to-br from-[#0b0b0b] to-[#111111] 
                   border border-white/6 backdrop-blur-sm shadow-2xl rounded-3xl p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center
                       bg-gradient-to-br from-[#1f1f2e] to-[#0f1724] border border-white/8"
          >
            <User size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Admin Register</h1>
            <p className="text-sm text-gray-400">Create an admin account for dashboard access</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Full name</label>
            <div className="flex items-center gap-3 bg-[#0f1720] border border-white/6 rounded-xl px-3 py-2">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
                className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
              />
            </div>
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <div className="flex items-center gap-3 bg-[#0f1720] border border-white/6 rounded-xl px-3 py-2">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                placeholder="admin@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                })}
                className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <div className="flex items-center gap-3 bg-[#0f1720] border border-white/6 rounded-xl px-3 py-2">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                placeholder="Create a strong password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={adminRegMutation.isLoading}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl text-white font-semibold 
                        transition transform ${adminRegMutation.isLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"} 
                        bg-gradient-to-r from-[#4c00ff] to-[#00a3ff] shadow-lg`}
          >
            {adminRegMutation.isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/admin/login" className="text-[#7dd3fc] font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
