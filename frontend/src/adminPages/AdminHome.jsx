import React from "react";
import { Link } from "react-router-dom";
import { Users, FileText, ClipboardList, Settings } from "lucide-react";

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">

      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Admin Dashboard ⚡</h1>
        <p className="text-gray-400 text-lg mt-2">
          Manage users, jobs, proposals, and system settings.
        </p>
      </div>

      {/* Cards Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

        {/* Manage Users */}
        <Link
          to="/admin/users"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl hover:bg-gray-850 transition duration-300 cursor-pointer"
        >
          <Users className="w-10 h-10 text-blue-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Manage Users</h2>
          <p className="text-gray-400 mt-2 text-sm">
            View, verify, and control user accounts.
          </p>
        </Link>

        {/* Manage Jobs */}
        <Link
          to="/admin/jobs"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <FileText className="w-10 h-10 text-green-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Job Listings</h2>
          <p className="text-gray-400 mt-2 text-sm">
            View and manage all posted jobs.
          </p>
        </Link>

        {/* Proposals */}
        <Link
          to="/admin/proposals"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <ClipboardList className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">All Proposals</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Review proposals submitted by freelancers.
          </p>
        </Link>

        {/* System Settings */}
        <Link
          to="/admin/settings"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <Settings className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">System Settings</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Configure platform-wide settings.
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="max-w-6xl mx-auto mt-16">
        <h3 className="text-2xl font-semibold mb-6">Recent Activity</h3>

        <div className="bg-gray-900 rounded-2xl p-6 shadow">
          <p className="text-gray-400">No recent admin actions yet.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;