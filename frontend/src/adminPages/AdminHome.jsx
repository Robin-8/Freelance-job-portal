import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import socket from "../socket";
import axiosInstance from "../api/axiosApi";

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

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminHome = () => {
  console.log("first")
  const { user } = useSelector((state) => state.client);


  useEffect(() => {
    if (user?._id) {
      socket.emit("join", { userId: user._id, role: "admin" });
    }
  }, [user]);

  /* ================= API QUERIES ================= */

  const { data: totalPayment, isLoading: payLoad, isError: payErr } =
    useQuery({
      queryKey: ["adminTotalPayments"],
      queryFn: async () =>
        (await axiosInstance.get("/admin/total-payments")).data.total,
    });

  const {
    data: freelancersApplied,
    isLoading: freeLoad,
    isError: freeErr,
  } = useQuery({
    queryKey: ["adminFreelancersApplied"],
    queryFn: async () =>
      (await axiosInstance.get("/admin/freelancers-applied")).data
        .totalApplicants,
  });

  const { data: jobsPosted, isLoading: jobLoad, isError: jobErr } = useQuery({
    queryKey: ["adminJobsPosted"],
    queryFn: async () =>
      (await axiosInstance.get("/admin/jobs-posted")).data.jobsPosted,
  });

  const {
    data: proposalStats,
    isLoading: propLoad,
    isError: propErr,
  } = useQuery({
    queryKey: ["adminProposalStats"],
    queryFn: async () =>
      (await axiosInstance.get("/admin/proposal-stats")).data,
  });

  const {
    data: monthlyPayments,
    isLoading: monthLoad,
    isError: monthErr,
  } = useQuery({
    queryKey: ["adminMonthlyPayments"],
    queryFn: async () =>
      (await axiosInstance.get("/admin/monthly-payments")).data.monthly,
  });

  const isLoading =
    payLoad || freeLoad || jobLoad || propLoad || monthLoad;
  const isError = payErr || freeErr || jobErr || propErr || monthErr;

  /* ================= CHART DATA ================= */

  const proposalData = [
    { name: "Applied", value: proposalStats?.applied || 0 },
    { name: "Accepted", value: proposalStats?.accepted || 0 },
    { name: "Rejected", value: proposalStats?.rejected || 0 },
  ];

  const COLORS = ["#34D399", "#60A5FA", "#F87171"];

  /* ================= ERROR STATE ================= */

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-red-500">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-400 mt-2">
            Please verify backend status and API endpoints.
          </p>
        </div>
      </div>
    );
  }

  /* ================= LOADING STATE ================= */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-blue-400 animate-spin mr-3" />
        <span className="text-lg text-blue-400">
          Loading Admin Dashboard...
        </span>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 text-lg mt-2">
          System analytics & management overview
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6 mt-10">
        <StatCard
          icon={<Wallet className="w-12 h-12 text-green-400" />}
          title="Total Revenue"
          value={`₹ ${totalPayment || 0}`}
        />
        <StatCard
          icon={<Users className="w-12 h-12 text-blue-400" />}
          title="Freelancers Applied"
          value={freelancersApplied || 0}
        />
        <StatCard
          icon={<BarChart3 className="w-12 h-12 text-yellow-400" />}
          title="Jobs Posted"
          value={jobsPosted || 0}
        />
      </div>

      {/* ACTION CARDS */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <AdminLink to="/admin/userMgt" icon={<Users />} title="Manage Users" />
        <AdminLink to="/admin/getAdminJobs" icon={<Briefcase />} title="Jobs" />
        <AdminLink
          to="/admin/getPreposals"
          icon={<ClipboardList />}
          title="Proposals"
        />
        <AdminLink
          to="/admin/adminAddJob"
          icon={<SquarePlus />}
          title="Add Job"
        />
        <AdminLink to="/admin/chat" icon={<Inbox />} title="Messages" />
      </div>

      {/* CHARTS */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 mt-16">
        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyPayments || []}>
              <Tooltip />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Proposal Overview">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={proposalData} dataKey="value" outerRadius={80}>
                {proposalData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const StatCard = ({ icon, title, value }) => (
  <div className="bg-gray-900 p-6 rounded-2xl flex items-center gap-5">
    {icon}
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

const AdminLink = ({ to, icon, title }) => (
  <Link
    to={to}
    className="group bg-gray-900 p-6 rounded-2xl hover:bg-gray-800 transition"
  >
    <div className="w-10 h-10 text-blue-400 group-hover:scale-110 transition">
      {icon}
    </div>
    <h2 className="text-xl font-semibold mt-4">{title}</h2>
    <p className="text-gray-400 text-sm mt-1">
      Manage {title.toLowerCase()}
    </p>
  </Link>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-gray-900 p-6 rounded-2xl">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default AdminHome;
