import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosApi";
import { useSelector } from "react-redux";

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

  // Delete User
  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      return axiosInstance.delete(`/admin/deleteUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
    },
  });

  // Block / Unblock User
  const blockMutation = useMutation({
    mutationFn: async (id) => {
      return axiosInstance.put(`/admin/blockUser/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
    },
  });

  if (isLoading)
    return <p className="text-xl text-center mt-10">Loading users...</p>;

  // Filtered data
  const filteredUsers =
    filter === "all" ? data : data.filter((u) => u.role === filter);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">User Management</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {["all", "client", "freelancer"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-5 py-2 rounded-lg border 
              ${filter === item ? "bg-green-600 text-white" : "bg-white"}`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-green-400 text-gray-700 ">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers?.map((user) => (
              <tr key={user._id} className="border-b border-black">
                <td classnName="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">
                  {user.isBlocked ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>

                <td className="p-3 flex gap-3">
                  <button
                    className="px-3 py-1 bg-yellow-400 text-sm rounded"
                    onClick={() => blockMutation.mutate(user._id)}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    className="px-3 py-1 bg-red-500 text-sm text-white rounded"
                    onClick={() => deleteMutation.mutate(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMgtUsers;
