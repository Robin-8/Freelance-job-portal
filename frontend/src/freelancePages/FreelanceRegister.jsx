import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../api/axiosApi";
import { registerSuccess } from "../slice/clientSlice";
import toast from "react-hot-toast";

// Icons
import { User, Mail, Lock, ImageIcon, Loader2 } from "lucide-react";

const FreelanceRegister = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const profileImage = watch("profileImage");

  // Image preview
  useEffect(() => {
    if (profileImage && profileImage.length > 0) {
      const objectUrl = URL.createObjectURL(profileImage[0]);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [profileImage]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Prepare FormData
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", "freelancer");

      if (data.profileImage?.length > 0) {
        formData.append("profileImage", data.profileImage[0]);
      }

      // Send request to backend
      const res = await axiosInstance.post("/freelancer/register", formData);

      const { user, token } = res.data;

      dispatch(registerSuccess({ user, token }));
      toast.success("Registration successful!");
      navigate("/freelancer/freelancerHome");

    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Freelancer Registration</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-gray-300 text-sm">Full Name</label>
            <div className="flex items-center bg-gray-700 rounded-xl px-3 py-3 mt-1">
              <User size={20} className="text-gray-400 mr-3" />
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Enter your name"
                className="bg-transparent w-full outline-none text-white"
              />
            </div>
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div className="flex items-center bg-gray-700 rounded-xl px-3 py-3 mt-1">
              <Mail size={20} className="text-gray-400 mr-3" />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                placeholder="Enter your email"
                className="bg-transparent w-full outline-none text-white"
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <div className="flex items-center bg-gray-700 rounded-xl px-3 py-3 mt-1">
              <Lock size={20} className="text-gray-400 mr-3" />
              <input
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}
                placeholder="Enter your password"
                className="bg-transparent w-full outline-none text-white"
              />
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Profile Image */}
          <div>
            <label className="text-gray-300 text-sm">Profile Image (optional)</label>
            <div className="flex items-center bg-gray-700 rounded-xl px-3 py-3 mt-1">
              <ImageIcon size={20} className="text-gray-400 mr-3" />
              <input
                type="file"
                accept="image/*"
                {...register("profileImage")}
                className="w-full text-gray-300 bg-transparent outline-none"
              />
            </div>
            {preview && (
              <div className="mt-3 flex justify-center">
                <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-purple-500" />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold flex justify-center items-center disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already registered?{" "}
          <Link to="/freelancer/login" className="text-purple-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FreelanceRegister;
