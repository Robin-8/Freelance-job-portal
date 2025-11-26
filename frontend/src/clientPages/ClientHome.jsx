import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, PlusCircle, ClipboardList, Inbox } from "lucide-react";
import { useSelector } from "react-redux";
import socket from "../socket";

const ClientHome = () => {
  const { user } = useSelector((state) => state.client);

  // Join socket room
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", {
      userId: user._id,
      role: "Client",
    });

    console.log("Client joined socket room:", user._id);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Welcome Back 👋</h1>
        <p className="text-gray-400 text-lg mt-2">
          Manage your jobs, proposals, and freelancers efficiently.
        </p>
      </div>

      {/* Actions (Cards Section) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {/* Post a Job */}
        <Link
          to="/client/addJob"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl hover:bg-gray-850 transition duration-300 cursor-pointer"
        >
          <PlusCircle className="w-10 h-10 text-green-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Post a New Job</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Create job listing and hire the best freelancer.
          </p>
        </Link>

        {/* My Jobs */}
        <Link
          to="/client/all"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <Briefcase className="w-10 h-10 text-blue-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">My Jobs</h2>
          <p className="text-gray-400 mt-2 text-sm">
            View and manage your posted jobs.
          </p>
        </Link>

        {/* Received Proposals */}
        <Link
          to="/client/preposal"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <ClipboardList className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Proposals Received</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Check proposals sent by freelancers.
          </p>
        </Link>

        {/* Messages */}
        <Link
          to="/client/messages"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <Inbox className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Messages</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Chat with freelancers in real time.
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="max-w-6xl mx-auto mt-16">
        <h3 className="text-2xl font-semibold mb-6">Recent Activity</h3>

        <div className="bg-gray-900 rounded-2xl p-6 shadow">
          <p className="text-gray-400">No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
