import React from "react";

function AdminRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-red-600 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Admin Register
        </h2>

        <form className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-white">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-white">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="Enter email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-white">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="Create a password"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-green-700 transition transform hover:scale-[1.02]"
          >
            Register
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
