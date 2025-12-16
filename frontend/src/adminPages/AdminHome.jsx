// src/adminPages/AdminHome.jsx

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import socket from "../socket";
import axiosInstance from "../api/axiosApi";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  Users,
  BarChart3,
  Briefcase,
  ClipboardList,
  Inbox,
  SquarePlus,
  Loader2,
} from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const AdminHome = () => {
  const { user } = useSelector((state) => state.client);

  // Join socket room
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", { userId: user._id, role: "admin" });
      console.log("Socket join:", user._id);
    }
  }, [user]);

  // ====================== API Queries ======================
  const {
    data: totalPayment = 0,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = useQuery({
    queryKey: ["adminTotalPayments"],
    queryFn: async () => (await axiosInstance.get("/admin/total-payments")).data.total || 0,
  });

  const {
    data: freelancersApplied = 0,
    isLoading: isFreelancersLoading,
    isError: isFreelancersError,
  } = useQuery({
    queryKey: ["adminFreelancersApplied"],
    queryFn: async () => (await axiosInstance.get("/admin/freelancers-applied")).data.totalApplicants || 0,
  });

  const {
    data: jobsPosted = 0,
    isLoading: isJobsLoading,
    isError: isJobsError,
  } = useQuery({
    queryKey: ["adminJobsPosted"],
    queryFn: async () => (await axiosInstance.get("/admin/jobs-posted")).data.jobsPosted || 0,
  });

  const {
    data: proposalStats = { applied: 0, accepted: 0, rejected: 0 },
    isLoading: isProposalLoading,
    isError: isProposalError,
  } = useQuery({
    queryKey: ["adminProposalStats"],
    queryFn: async () => (await axiosInstance.get("/admin/proposal-stats")).data || { applied: 0, accepted: 0, rejected: 0 },
  });

  const {
    data: monthlyPayments = [],
    isLoading: isMonthlyLoading,
    isError: isMonthlyError,
  } = useQuery({
    queryKey: ["adminMonthlyPayments"],
    queryFn: async () => (await axiosInstance.get("/admin/monthly-payments")).data.monthly || [],
  });

  // Overall loading and error
  const isOverallLoading =
    isPaymentLoading || isFreelancersLoading || isJobsLoading || isProposalLoading || isMonthlyLoading;
  const isOverallError =
    isPaymentError || isFreelancersError || isJobsError || isProposalError || isMonthlyError;

  // Debug logs
  console.log({ totalPayment, freelancersApplied, jobsPosted, proposalStats, monthlyPayments });

  // ====================== Chart Data ======================
  const proposalData = [
    { name: "Applied", value: proposalStats?.applied || 0 },
    { name: "Accepted", value: proposalStats?.accepted || 0 },
    { name: "Rejected", value: proposalStats?.rejected || 0 },
  ];
  const COLORS = ["#34D399", "#60A5FA", "#F87171"];

  // ====================== Render ======================
  if (isOverallError) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="bg-gray-900 p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Data</h2>
          <p className="text-gray-400">Check API endpoints and network tab.</p>
        </div>
      </div>
    );
  }

  if (isOverallLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <span>Loading Dashboard Data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">System analytics & management overview.</p>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <Wallet className="w-12 h-12 text-green-400" />
          <div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold">₹ {totalPayment}</h3>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <Users className="w-12 h-12 text-blue-400" />
          <div>
            <p className="text-gray-400 text-sm">Freelancers Applied</p>
            <h3 className="text-2xl font-bold">{freelancersApplied}</h3>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <BarChart3 className="w-12 h-12 text-yellow-400" />
          <div>
            <p className="text-gray-400 text-sm">Jobs Posted</p>
            <h3 className="text-2xl font-bold">{jobsPosted}</h3>
          </div>
        </div>
      </div>

      {/* ACTION LINKS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <Link
          to="/admin/userMgt"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <Users className="w-10 h-10 text-blue-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Manage Users</h2>
          <p className="text-gray-400 mt-2 text-sm">View & control all users.</p>
        </Link>

        <Link
          to="/admin/getAdminJobs"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <Briefcase className="w-10 h-10 text-green-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Jobs</h2>
          <p className="text-gray-400 mt-2 text-sm">Monitor all job listings.</p>
        </Link>

        <Link
          to="/admin/getPreposals"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <ClipboardList className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Proposals</h2>
          <p className="text-gray-400 mt-2 text-sm">Review freelancer proposals.</p>
        </Link>

        <Link
          to="/admin/adminAddJob"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <SquarePlus className="w-10 h-10 text-pink-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Add Job</h2>
          <p className="text-gray-400 mt-2 text-sm">Create new job listings.</p>
        </Link>

        <Link
          to="/admin/chat"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <Inbox className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Messages</h2>
          <p className="text-gray-400 mt-2 text-sm">Admin communication hub.</p>
        </Link>
      </div>

      {/* CHARTS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyPayments}>
              <Tooltip contentStyle={{ background: "#374151", border: "none" }} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Proposal Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={proposalData} outerRadius={80} dataKey="value">
                {proposalData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#374151", border: "none" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
