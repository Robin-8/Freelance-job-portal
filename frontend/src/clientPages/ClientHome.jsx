import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Users,
  BarChart3,
  Briefcase,
  PlusCircle,
  ClipboardList,
  Inbox,
} from "lucide-react";
import { useSelector } from "react-redux";
import socket from "../socket";
import axiosInstance from "../api/axiosApi";
import { useQuery } from "@tanstack/react-query";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const ClientHome = () => {
  const { user } = useSelector((state) => state.client);
  const [totalPayment, setTotalPayment] = useState(0);

  // Join socket room
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", { userId: user._id, role: "Client" });
    }
  }, [user]);

  // Fetch total freelancers applied
  const { data: freelancerSummary } = useQuery({
    queryKey: ["clientFreelancerApplied"],
    queryFn: async () => {
      const res = await axiosInstance.get("/client/total-freelancers");
      return res.data;
    },
    enabled: !!user?._id,
  });

  // Fetch jobs posted count
  const { data: jobsSummary } = useQuery({
    queryKey: ["clientJobsPosted"],
    queryFn: async () => {
      const res = await axiosInstance.get("/client/jobs-posted");
      return res.data;
    },
    enabled: !!user?._id,
  });

  // Fetch monthly payment summary
  const { data: paymentSummary } = useQuery({
    queryKey: ["clientPaymentSummary"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/payment/client/summary`);
      return res.data;
    },
    enabled: !!user?._id,
  });

  // Fetch proposal statistics
  const { data: proposalStats } = useQuery({
    queryKey: ["clientProposalStats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/client/proposal-stats");
      return res.data;
    },
    enabled: !!user?._id,
  });

  // Fetch total payment
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const { data } = await axiosInstance.get(`/payment/client/total`);
        setTotalPayment(data.total || 0);
      } catch (err) {
        console.log("Total payment fetch error", err);
      }
    };
    if (user?._id) fetchTotal();
  }, [user]);

  if (!user) return <div className="p-4 text-white">Please login</div>;

  // Defaults
  const totalFreelancersApplied = freelancerSummary?.totalApplicants || 0;
  const jobsPosted = jobsSummary?.jobsPosted || 0;

  // Format payment data for BarChart
  const monthlyPayments =
    paymentSummary?.monthly?.map((item) => ({
      month: item.month || "N/A",
      amount: item.amount || 0,
    })) || [];

  // Format proposal data for PieChart
  const proposalData = [
    { name: "Applied", value: proposalStats?.applied || 0 },
    { name: "Accepted", value: proposalStats?.accepted || 0 },
    { name: "Rejected", value: proposalStats?.rejected || 0 },
  ];
  const COLORS = ["#34D399", "#60A5FA", "#F87171"];

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="text-gray-400 text-lg mt-2">
          Overview of your job activities & analytics.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <Wallet className="w-12 h-12 text-green-400" />
          <div>
            <p className="text-gray-400 text-sm">Total Spent</p>
            <h3 className="text-2xl font-bold">₹ {totalPayment}</h3>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <Users className="w-12 h-12 text-blue-400" />
          <div>
            <p className="text-gray-400 text-sm">Freelancers Applied</p>
            <h3 className="text-2xl font-bold">{totalFreelancersApplied}</h3>
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

      {/* ACTION CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <Link
          to="/client/addJob"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <PlusCircle className="w-10 h-10 text-green-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Post a New Job</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Create job listing and hire the best freelancer.
          </p>
        </Link>

        <Link
          to="/client/all"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <Briefcase className="w-10 h-10 text-blue-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">My Jobs</h2>
          <p className="text-gray-400 mt-2 text-sm">View & manage your posted jobs.</p>
        </Link>

        <Link
          to="/client/preposal"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <ClipboardList className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Proposals</h2>
          <p className="text-gray-400 mt-2 text-sm">Review freelancer proposals.</p>
        </Link>

        <Link
          to="/client/chat"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <Inbox className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Messages</h2>
          <p className="text-gray-400 mt-2 text-sm">Chat with freelancers.</p>
        </Link>
      </div>

      {/* CHARTS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
        {/* Monthly Payment BarChart */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Monthly Payment Summary</h3>
          {monthlyPayments.length === 0 ? (
            <p className="text-gray-400">No payment data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyPayments}>
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Proposal PieChart */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Proposal Overview</h3>
          {proposalData.reduce((sum, p) => sum + p.value, 0) === 0 ? (
            <p className="text-gray-400">No proposals submitted yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={proposalData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {proposalData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
