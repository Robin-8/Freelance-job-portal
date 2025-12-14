import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosApi";
import { registerSuccess } from "../slice/clientSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";
import { UserCircle } from "lucide-react";

const ClientRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        role: "client",
        profileImage, // ✅ ImageKit URL
      };

      const res = await axiosInstance.post("/client/register", payload);

      const { user, token } = res.data;

      dispatch(registerSuccess({ user, token }));
      toast.success("Registration successful");
      navigate("/client/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1a1a,transparent_70%)] opacity-70"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-10"
      >
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          Client Registration
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-green-500 mb-3"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <UserCircle size={64} className="text-gray-400" />
            </div>
          )}

          <ImageUpload
            folder="/client-profiles"
            onSuccess={(res) => {
              setProfileImage(res.url);
              toast.success("Image uploaded");
            }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-white text-sm">Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-white text-sm">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                  message:
                    "Password must include uppercase, lowercase, number, and special character",
                },
              })}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-green-500/30"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/client/login" className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ClientRegister;
