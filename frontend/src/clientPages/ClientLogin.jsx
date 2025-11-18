import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosApi";
import { useDispatch } from "react-redux";
import { login } from "../slice/clientSlice";
import { Link, useNavigate } from "react-router-dom";

const ClientLogin = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate =useNavigate()

  const onSubmit = async (formData) => {
    try {
      const response = await axiosInstance.post("/client/login", formData);
      const { user, token } = response.data;
      dispatch(login({ user, token }));
      alert("✅ Login Successful!");
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      navigate("/client/home")
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Login Card */}
      <div className="bg-red-600 w-full max-w-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Client Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-white font-medium mb-1">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-white font-medium mb-1">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            Login
          </button>
        </form>

        {/* Don't have an account */}
        <p className="text-center text-black font-bold mt-5 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/client/register"
            className="text-white underline font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ClientLogin;
