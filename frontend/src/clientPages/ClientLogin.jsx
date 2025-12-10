import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosApi";
import { useDispatch } from "react-redux";
import { login } from "../slice/clientSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ClientLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const response = await axiosInstance.post("/client/login", formData);
      const { user, token } = response.data;

      dispatch(login({ user, token }));
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      toast.success("Login Successful!");
      navigate("/client/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Radial gradient lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1a1a,transparent_70%)] opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#111,#000_80%)] opacity-60"></div>

      {/* Glass-effect card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-10"
      >
        <h2 className="text-4xl font-bold text-center text-white mb-6">
          Client Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-white text-sm mb-1 block">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm mb-1 block">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Enter your password"
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-blue-500/40 transition-all"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-300 mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/client/register" className="text-blue-400 underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ClientLogin;
