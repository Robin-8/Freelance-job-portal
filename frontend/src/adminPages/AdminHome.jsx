import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import socket from "../socket";
import axiosInstance from "../api/axiosApi";
import { useQuery } from "@tanstack/react-query";

import { Wallet, Users, BarChart3, Briefcase, ClipboardList, Inbox, SquarePlus, Loader2 } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const AdminHome = () => {
  const { user } = useSelector((state) => state.client);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", { userId: user._id, role: "Admin" });
    }
  }, [user]);

  // ================= API Queries =================
  // Grouping queries to track overall loading state
  const { data: totalPayment, isLoading: isPaymentLoading, isError: isPaymentError } = useQuery({ queryKey: ["adminTotalPayments"], queryFn: async () => (await axiosInstance.get("/admin/total-payments")).data.total });
  const { data: freelancersApplied, isLoading: isFreelancersLoading, isError: isFreelancersError } = useQuery({ queryKey: ["adminFreelancersApplied"], queryFn: async () => (await axiosInstance.get("/admin/freelancers-applied")).data.totalApplicants });
  const { data: jobsPosted, isLoading: isJobsLoading, isError: isJobsError } = useQuery({ queryKey: ["adminJobsPosted"], queryFn: async () => (await axiosInstance.get("/admin/jobs-posted")).data.jobsPosted });
  const { data: proposalStats, isLoading: isProposalLoading, isError: isProposalError } = useQuery({ queryKey: ["adminProposalStats"], queryFn: async () => (await axiosInstance.get("/admin/proposal-stats")).data });
  const { data: monthlyPayments, isLoading: isMonthlyLoading, isError: isMonthlyError } = useQuery({ queryKey: ["adminMonthlyPayments"], queryFn: async () => (await axiosInstance.get("/admin/monthly-payments")).data.monthly });

  // Determine overall state
  const isOverallLoading = isPaymentLoading || isFreelancersLoading || isJobsLoading || isProposalLoading || isMonthlyLoading;
  const isOverallError = isPaymentError || isFreelancersError || isJobsError || isProposalError || isMonthlyError;

  // --- Prepare Data for Charts ---
  const proposalData = [
    { name: "Applied", value: proposalStats?.applied || 0 },
    { name: "Accepted", value: proposalStats?.accepted || 0 },
    { name: "Rejected", value: proposalStats?.rejected || 0 },
  ];
  const COLORS = ["#34D399", "#60A5FA", "#F87171"];

  // ================= RENDER LOGIC =================
  
  // 1. RENDER ERROR STATE
  if (isOverallError) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900 rounded-lg">
          <h2 className="text-2xl text-red-500 font-bold mb-3">Error Loading Admin Data</h2>
          <p className="text-gray-400">
            Could not fetch data from the server. Please ensure the backend is running and the API endpoints are correct.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            (Check network tab in developer tools for details.)
          </p>
        </div>
      </div>
    );
  }

  // 2. RENDER LOADING STATE
  if (isOverallLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="flex items-center text-xl text-blue-400">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          Loading Dashboard Data...
        </div>
      </div>
    );
  }

  // 3. RENDER SUCCESS STATE
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 text-lg mt-2">
          System analytics & management overview.
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <Wallet className="w-12 h-12 text-green-400" />
          <div>
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold">₹ {totalPayment || 0}</h3>
          </div>
        </div>
        {/* ... (other stat cards are fine) ... */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <Users className="w-12 h-12 text-blue-400" />
          <div>
            <p className="text-gray-400 text-sm">Freelancers Applied</p>
            <h3 className="text-2xl font-bold">{freelancersApplied || 0}</h3>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <BarChart3 className="w-12 h-12 text-yellow-400" />
          <div>
            <p className="text-gray-400 text-sm">Jobs Posted</p>
            <h3 className="text-2xl font-bold">{jobsPosted || 0}</h3>
          </div>
        </div>
      </div>

      {/* ACTION CARDS (No change needed here) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {/* ... (Link cards) ... */}
        <Link to="/admin/userMgt" className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition">
          <Users className="w-10 h-10 text-blue-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Manage Users</h2>
          <p className="text-gray-400 mt-2 text-sm">View & control all users.</p>
        </Link>
        {/* ... (rest of the action links) ... */}
        <Link to="/admin/getAdminJobs" className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition">
          <Briefcase className="w-10 h-10 text-green-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Jobs</h2>
          <p className="text-gray-400 mt-2 text-sm">Monitor all job listings.</p>
        </Link>
        <Link to="/admin/getPreposals" className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition">
          <ClipboardList className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Proposals</h2>
          <p className="text-gray-400 mt-2 text-sm">Review freelancer proposals.</p>
        </Link>
        <Link to="/admin/adminAddJob" className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition">
          <SquarePlus className="w-10 h-10 text-pink-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Add Job</h2>
          <p className="text-gray-400 mt-2 text-sm">Create and publish new job listings.</p>
        </Link>
        <Link to="/admin/chat" className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition">
          <Inbox className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Messages</h2>
          <p className="text-gray-400 mt-2 text-sm">Admin communication hub.</p>
        </Link>
      </div>


      {/* CHARTS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Monthly Revenue </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyPayments || []}>
              <Tooltip contentStyle={{ background: '#374151', border: 'none' }} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Proposal Overview </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={proposalData} outerRadius={80} dataKey="value">
                {proposalData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#374151', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;