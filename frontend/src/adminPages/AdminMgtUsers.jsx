import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import { useSelector } from "react-redux";
import { ShieldCheck, UserMinus, Users } from "lucide-react";

const AdminMgtUsers = () => {
  const { token } = useSelector((state) => state.client);
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  // Fetch all users
  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/getUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.users;
    },
  });

  // Delete user
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosInstance.delete(`/admin/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["adminUsers"]),
  });

  // Block / unblock user
  const blockMutation = useMutation({
    mutationFn: async (id) => {
      return axiosInstance.put(
        `/admin/blockUser/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => queryClient.invalidateQueries(["adminUsers"]),
  });

  if (isLoading)
    return (
      <p className="text-xl text-center text-white mt-16 animate-pulse">
        Loading users...
      </p>
    );

  // Filter logic
  const filteredUsers =
    filter === "all" ? data : data.filter((u) => u.role === filter);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-10 h-10 text-green-400" />
          <h1 className="text-4xl font-bold">User Management</h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8">
          {["all", "client", "freelancer"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-xl font-medium transition border 
              ${
                filter === type
                  ? "bg-green-500 border-green-400 text-white shadow-md"
                  : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Table Wrapper */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-300 text-left border-b border-gray-700">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers?.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-gray-850 transition"
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4 capitalize text-blue-400">{user.role}</td>

                  <td className="p-4">
                    {user.isBlocked ? (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => blockMutation.mutate(user._id)}
                      className="px-4 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500 rounded-lg text-sm hover:bg-yellow-500 hover:text-black transition"
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => deleteMutation.mutate(user._id)}
                      className={`px-4 py-1 rounded-lg text-sm transition flex items-center gap-1
    ${
      user.isDeleted
        ? "bg-green-600 hover:bg-green-700"
        : "bg-red-600 hover:bg-red-700"
    }`}
                    >
                      <UserMinus size={14} />
                      {user.isDeleted ? "Restore" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers?.length === 0 && (
            <p className="text-gray-400 text-center mt-6">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMgtUsers;
