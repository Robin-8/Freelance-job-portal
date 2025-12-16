import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi"; // Assuming this is your configured axios instance
import { login } from "../slice/clientSlice"; // Your Redux slice action
import toast from "react-hot-toast";

// Icons
import { Shield, Mail, Lock, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ------------------ AUTO REDIRECT IF ALREADY LOGGED IN ------------------ */
  useEffect(() => {
    // Read the correct, consistent keys from Local Storage
    const token = localStorage.getItem("token");
    const userInfoString = localStorage.getItem("userInfo"); 

    if (token && userInfoString) {
      try {
        const user = JSON.parse(userInfoString);
        if (user.role === "admin") {
          navigate("/admin/home", { replace: true });
        }
      } catch (e) {
        // Ignore if userInfo is malformed, treat as not logged in
      }
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ------------------ ADMIN LOGIN MUTATION ------------------ */
  const adminLoginMutation = useMutation({
    mutationFn: async (formData) => {
      // Assumes your backend login endpoint is /admin/login
      const res = await axiosInstance.post("/admin/login", formData);
      return res.data;
    },

    onSuccess: (data) => {
      /* ------------------ ROLE SAFETY CHECK ------------------ */
      if (data?.user?.role !== "admin") {
        toast.error("Access denied. Admin only.");
        return;
      }

      /* ------------------ PERSIST SESSION (CORRECT KEYS) ------------------ */
      // data.token must be a string (the JWT)
      localStorage.setItem("token", data.token); 
      // Use the consistent key 'userInfo'
      localStorage.setItem("userInfo", JSON.stringify(data.user)); 
      
      // OPTIONAL: Clean up the old, conflicting keys if they exist in the browser
      localStorage.removeItem("role");
      localStorage.removeItem("user");


      /* ------------------ UPDATE REDUX ------------------ */
      dispatch(login(data));

      toast.success("Admin login successful");

      navigate("/admin/home", { replace: true });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Admin login failed. Check credentials."
      );
    },
  });

  const onSubmit = (formData) => {
    adminLoginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] px-4">
      <div
        className="w-full max-w-md bg-[#111827]/70 backdrop-blur-xl
                   border border-white/10 shadow-2xl rounded-3xl p-8"
      >
        {/* ------------------ HEADER ------------------ */}
        <div className="flex flex-col items-center mb-6">
          <Shield size={44} className="text-purple-500" />
          <h2 className="text-3xl font-bold text-white mt-2">
            Admin Login
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Secure access to admin dashboard
          </p>
        </div>

        {/* ------------------ FORM ------------------ */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div
              className="flex items-center bg-[#1f2937] border border-white/10
                         rounded-xl px-3 py-3 mt-1 focus-within:border-purple-500"
            >
              <Mail size={20} className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="admin@example.com"
                {...register("email", { required: "Email is required" })}
                className="bg-transparent text-white outline-none w-full"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <div
              className="flex items-center bg-[#1f2937] border border-white/10
                         rounded-xl px-3 py-3 mt-1 focus-within:border-purple-500"
            >
              <Lock size={20} className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="bg-transparent text-white outline-none w-full"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={adminLoginMutation.isPending}
            className="w-full flex justify-center items-center gap-2
                       bg-gradient-to-r from-purple-600 to-blue-600
                       text-white p-3 rounded-xl font-semibold shadow-lg
                       hover:opacity-90 transition disabled:opacity-50"
          >
            {adminLoginMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* ------------------ FOOTER ------------------ */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an admin account?{" "}
          <Link
            to="/admin/register"
            className="text-purple-400 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;