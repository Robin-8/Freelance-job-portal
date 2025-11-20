import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosApi";
import { registerSuccess } from "../slice/clientSlice";

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
      return res.data;
    },
    onSuccess: (data) => {
      // Adjust based on your API response shape.
      // If API returns { user, token } use that, otherwise inspect `data`.
      const user = data.user ?? data?.userData ?? null;
      const token = data.token ?? data?.accessToken ?? null;

      if (user && token) {
        dispatch(registerSuccess({ user, token }));
        // navigate to admin home (or login) after register
        navigate("/admin/home");
      } else {
        // If API returns different shape, navigate to admin login:
        navigate("/admin/login");
      }
    },
    onError: (err) => {
      // show friendly message, can be improved with toast
      alert(err.response?.data?.message || "Registration failed");
    },
  });

  const onSubmit = (formData) => {
    adminRegMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-red-600 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Admin Register
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-white">Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-yellow-200 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-white">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-yellow-200 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-white">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-yellow-200 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={adminRegMutation.isLoading}
            className={`w-full ${
              adminRegMutation.isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white py-3 rounded-xl text-lg font-semibold shadow-md transition transform`}
          >
            {adminRegMutation.isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-white mt-5">
          Already have an account?{" "}
          <a href="/admin/login" className="text-white font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminRegister;
