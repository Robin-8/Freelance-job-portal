import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosApi";
import { User, Mail, Briefcase, Layers, Edit } from "lucide-react";

const FreelanceProfile = () => {
  const { token } = useSelector((state) => state.client);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["freelancerProfile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/freelancer/getProfile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="text-center text-xl text-gray-400 py-10">
        Loading profile...
      </p>
    );

  if (isError)
    return (
      <p className="text-center text-xl text-red-500 py-10">
        Failed to load profile.
      </p>
    );

  const profile = data?.user;

  return (
    <div className="flex justify-center items-center py-12 bg-gray-900 min-h-screen px-4">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-3xl border border-gray-700">

        {/* Profile Header */}
        <div className="text-center">
          <div className="mx-auto bg-gray-700 p-4 rounded-full w-fit shadow-lg">
            <User className="h-20 w-20 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mt-4">
            {profile?.name || "Freelancer"}
          </h1>
          <p className="text-gray-400">{profile?.email}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Profile Info Section */}
        <div className="space-y-6 text-gray-300">

          <div className="flex items-start gap-4">
            <User className="text-gray-400 w-6 h-6" />
            <div>
              <p className="text-sm">Full Name</p>
              <p className="text-lg font-semibold text-white">{profile?.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="text-gray-400 w-6 h-6" />
            <div>
              <p className="text-sm">Email</p>
              <p className="text-lg font-semibold text-white">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Layers className="text-gray-400 w-6 h-6" />
            <div>
              <p className="text-sm">Skills</p>
              <p className="text-lg font-semibold text-white">
                {profile?.skills?.length
                  ? profile.skills.join(", ")
                  : "No skills added"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Briefcase className="text-gray-400 w-6 h-6" />
            <div>
              <p className="text-sm">Experience</p>
              <p className="text-lg font-semibold text-white">
                {profile?.experience || "Not provided"}
              </p>
            </div>
          </div>

        </div>

        {/* Update Profile Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/freelancer/updateProfile"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            <Edit className="w-5 h-5" />
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FreelanceProfile;
