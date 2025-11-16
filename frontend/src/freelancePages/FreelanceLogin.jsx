import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosApi";
import { useDispatch } from "react-redux";
import { login } from "../slice/clientSlice";
import { Link } from "react-router-dom";

const FreelanceLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/freelancer/login", formData);
      const { user, token } = response.data;

      dispatch(login({ user, token }));
      alert("✅ Login Successful!");

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      {/* Login Card */}
      <div className="bg-red-700 w-full max-w-md rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Freelancer Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-white font-medium mb-1">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-black font-bold text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-white font-medium mb-1">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className="w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-black font-bold text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Navigation */}
        <p className="text-center text-black font-bold mt-5 text-sm">
          Don’t have an account?{" "}
          <Link to="/freelancer/register" className="text-white underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FreelanceLogin;
