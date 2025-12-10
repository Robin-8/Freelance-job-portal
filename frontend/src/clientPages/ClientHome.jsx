import React, { useState, useEffect } from "react";
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

// Recharts
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ClientHome = () => {
  const { user } = useSelector((state) => state.client);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", {
        userId: user._id,
        role: "Client",
      });
    }
  }, [user]);

  // Fetch Total Payments
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const { data } = await axiosInstance.get(`/payment/client/total`);
        setTotalPayment(data.total);
      } catch (err) {
        console.log("Total payment fetch error", err);
      }
    };

    if (user?._id) fetchTotal();
  }, [user]);

  // Fetch Payment Summary
  const { data: paymentSummary } = useQuery({
    queryKey: ["clientPaymentSummary"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/payment/client/summary`);
      return res.data;
    },
  });

  const paymentData = paymentSummary?.monthly || [];

  const proposalData = [
    { name: "Applied", value: 62 },
    { name: "Accepted", value: 24 },
    { name: "Rejected", value: 14 },
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
            <h3 className="text-2xl font-bold">62</h3>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow flex items-center gap-5">
          <BarChart3 className="w-12 h-12 text-yellow-400" />
          <div>
            <p className="text-gray-400 text-sm">Jobs Posted</p>
            <h3 className="text-2xl font-bold">18</h3>
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
          <p className="text-gray-400 mt-2 text-sm">
            View & manage your posted jobs.
          </p>
        </Link>

        <Link
          to="/client/preposal"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <ClipboardList className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Proposals</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Review freelancer proposals.
          </p>
        </Link>

        <Link
          to="/client/chat"
          className="group bg-gray-900 p-6 rounded-2xl shadow hover:bg-gray-850 transition"
        >
          <Inbox className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
          <h2 className="text-xl font-semibold mt-4">Messages</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Chat with freelancers.
          </p>
        </Link>
      </div>

      {/* MONTHLY PAYMENT CHART */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">
            Monthly Payment Summary
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentData}>
              <Tooltip />
              <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PROPOSAL PIE CHART */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">
            Proposal Overview
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={proposalData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {proposalData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
