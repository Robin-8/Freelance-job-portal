import React from "react";

function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-red-600 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Admin Login
        </h2>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-white">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter your admin email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-white">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter your password"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        <p className="text-center text-white mt-5">
          Don't have an account?{" "}
          <a href="/admin/register" className="text-white font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
