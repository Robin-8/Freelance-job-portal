import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosApi";
import { registerSuccess } from "../slice/clientSlice";
import toast from "react-hot-toast";

// Lucide icons
import { User, Mail, Lock, ImageIcon, Loader2 } from "lucide-react";

const FreelanceRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const dispatch = useDispatch();

  const profileImage = watch("profileImage");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Image Preview
  useEffect(() => {
    if (profileImage && profileImage.length > 0) {
      const file = profileImage[0];
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [profileImage]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      dataToSend.append("role", "freelancer");

      if (formData.profileImage?.length > 0) {
        dataToSend.append("profileImage", formData.profileImage[0]);
      }

      const res = await axiosInstance.post("/freelancer/register", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { user, token } = res.data;

      dispatch(registerSuccess({ user, token }));
      toast.success("Registration Successful!");

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#111827]/60 backdrop-blur-xl border border-white/10 
                      shadow-2xl rounded-3xl p-8 animate-fadeIn">

        <h2 className="text-3xl font-bold text-center text-white mb-7 tracking-wide">
          Freelancer Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Full Name */}
          <div className="relative group">
            <label className="text-gray-300 text-sm">Full Name</label>
            <div className="flex items-center bg-[#1f2937] rounded-xl border border-white/10 
                            px-3 py-3 mt-1 group-focus-within:border-purple-500 transition">
              <User size={20} className="text-gray-400 mr-3" />
              <input
                {...register("name", { required: "Name is required" })}
                className="bg-transparent text-white outline-none w-full"
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-sm mt-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative group">
            <label className="text-gray-300 text-sm">Email Address</label>
            <div className="flex items-center bg-[#1f2937] rounded-xl border border-white/10 
                            px-3 py-3 mt-1 group-focus-within:border-purple-500 transition">
              <Mail size={20} className="text-gray-400 mr-3" />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="bg-transparent text-white outline-none w-full"
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
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters required" },
                })}
                className="bg-transparent text-white outline-none w-full"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Profile Image */}
          <div>
            <label className="text-gray-300 text-sm">Profile Image (Optional)</label>

            <div className="flex items-center bg-[#1f2937] border border-white/10 
                            rounded-xl px-3 py-3 mt-1">
              <ImageIcon size={20} className="text-gray-400 mr-3" />
              <input
                type="file"
                accept="image/*"
                {...register("profileImage")}
                className="text-gray-300 bg-transparent outline-none w-full"
              />
            </div>

            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-lg"
                />
              </div>
            )}
          </div>

          <input {...register("role")} type="hidden" value="freelancer" />

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 flex justify-center items-center
              bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl 
              font-semibold shadow-lg hover:opacity-90 transition-all 
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already a user?{" "}
          <Link className="text-purple-400 hover:underline font-semibold" to="/freelancer/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FreelanceRegister;
