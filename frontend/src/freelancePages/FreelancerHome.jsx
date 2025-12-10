import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ClipboardList, User, Star, Inbox } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import socket from "../socket";

import CompanyLogos from "../components/CompanyLogos";
import FeaturedJobs from "./FeaturedJobs ";

const FreelancerHome = () => {
  const { token, user } = useSelector((state) => state.client);

  // Join socket room
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", {
      userId: user._id,
      role: "Freelancer",
    });

  }, [user]);

  // Fetch proposal count
  const { data: proposalData } = useQuery({
    queryKey: ["proposalCount"],
    queryFn: async () => {
      const res = await axiosInstance.get("/freelancer/preposalCount", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold">Welcome Freelancer 👋</h1>
        <p className="text-gray-400 text-lg mt-2">
          Find jobs, manage proposals, and showcase your skills.
        </p>
      </div>

      {/* Actions Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {/* Find Jobs */}
        <Link
          to="/freelancer/searchJobs"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl hover:bg-gray-850 transition cursor-pointer"
        >
          <Search className="w-10 h-10 text-blue-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Find Jobs</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Explore freelance opportunities based on your skills.
          </p>
        </Link>

        {/* Your Proposals */}
        <Link
          to="/freelancer/getPreposal"
          className="group relative bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl hover:bg-gray-850 transition cursor-pointer"
        >
          {/* Badge */}
          {proposalData?.count > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              {proposalData.count}
            </span>
          )}

          <ClipboardList className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Your Proposals</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Track all proposals you've submitted.
          </p>
        </Link>

        {/* Your Profile */}
        <Link
          to="/freelancer/getProfile"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl hover:bg-gray-850 transition cursor-pointer"
        >
          <User className="w-10 h-10 text-green-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Your Profile</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Update your skills, experience, and portfolio.
          </p>
        </Link>
        <Link
          to="/freelancer/chat"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <Inbox className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Messages</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Chat with freelancers in real time.
          </p>
        </Link>
      </div>

      {/* Company Logos */}
      <div className="overflow-hidden mt-16">
        <CompanyLogos />
      </div>

      {/* Featured Jobs */}
      <div className="max-w-6xl mx-auto mt-16">
        <h3 className="text-2xl font-semibold mb-6">Featured Opportunities</h3>
        <FeaturedJobs />
      </div>
    </div>
  );
};

export default FreelancerHome;
