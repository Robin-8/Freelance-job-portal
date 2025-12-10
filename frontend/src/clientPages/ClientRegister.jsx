import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosApi";
import { registerSuccess } from "../slice/clientSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ClientRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = async (formData) => {
    try {
      const response = await axiosInstance.post("/client/register", formData);
      const { user, token } = response.data;

      dispatch(registerSuccess({ user, token }));
      toast.success("Registration Successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1a1a,transparent_70%)] opacity-70"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-10 relative"
      >
        <h2 className="text-4xl font-bold text-center text-white mb-6">
          Client Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="text-white block mb-1">Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Enter your full name"
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-white block mb-1">Email Address</label>
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
            <label className="text-white block mb-1">Password</label>
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

          {/* Hidden role */}
          <input {...register("role")} value="client" type="hidden" />

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 text-lg rounded-xl shadow-lg hover:shadow-green-500/30 transition-all"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-200 mt-6 text-sm">
          Already a customer?{" "}
          <Link to="/client/login" className="text-blue-400 underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ClientRegister;
