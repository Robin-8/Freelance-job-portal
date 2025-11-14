import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosApi";
import { registerSuccess } from "../slice/clientSlice";

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
      alert("✅ Registration Successful!");
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-0 py-0">
      {/* Registration Card */}
      <div className="bg-red-600 w-full max-w-md rounded-2xl shadow-xl p-8 relative">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Client Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-white font-medium mb-1">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-medium mb-1">
              Email Address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
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
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Hidden Role */}
          <input {...register("role")} value="client" type="hidden" />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            Register
          </button>
        </form>

        {/* Already a customer */}
        <p className="text-center text-black font-bold mt-5 text-sm">
          Already a customer?{" "}
          <Link
            to="/client/login"
            className="text-white font-semibold underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ClientRegister;
