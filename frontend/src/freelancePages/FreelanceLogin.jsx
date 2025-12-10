import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosApi";
import { useDispatch } from "react-redux";
import { login } from "../slice/clientSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ICONS
import { Mail, Lock, Loader2 } from "lucide-react";

const FreelanceLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("/freelancer/login", formData);
      const { user, token } = res.data;

      dispatch(login({ user, token }));
      toast.success("Login Successful!");

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      navigate("/freelancer/freelancerHome");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-[#111827]/60 backdrop-blur-xl border border-white/10 
                      shadow-2xl rounded-3xl p-8 animate-fadeIn">

        <h2 className="text-3xl font-bold text-center text-white mb-7 tracking-wide">
          Freelancer Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div className="relative group">
            <label className="text-gray-300 text-sm">Email</label>
            <div className="flex items-center bg-[#1f2937] rounded-xl border border-white/10 
                            px-3 py-3 mt-1 group-focus-within:border-purple-500 transition">
              <Mail size={20} className="text-gray-400 mr-3" />
              <input
                {...register("email", { required: "Email is required" })}
                className="bg-transparent outline-none text-white w-full"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative group">
            <label className="text-gray-300 text-sm">Password</label>
            <div className="flex items-center bg-[#1f2937] rounded-xl border border-white/10 
                            px-3 py-3 mt-1 group-focus-within:border-purple-500 transition">
              <Lock size={20} className="text-gray-400 mr-3" />
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="bg-transparent outline-none text-white w-full"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 flex justify-center items-center
              bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl 
              font-semibold shadow-lg hover:opacity-90 transition-all 
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Navigation */}
        <p className="text-center text-gray-400 mt-5 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/freelancer/register"
            className="text-purple-400 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FreelanceLogin;
