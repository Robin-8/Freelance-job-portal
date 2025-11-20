import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosApi";

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

  if (isLoading) return <p className="text-center text-xl text-gray-500">Loading...</p>;
  if (isError) return <p className="text-center text-xl text-red-500">Failed to load profile</p>;

  const profile = data?.user;

  return (
    <div className="flex justify-center items-center py-10 bg-black min-h-screen">
      <div className="bg-red-600 shadow-xl rounded-2xl p-8 w-full max-w-2xl">

        {/* Header */}
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="avatar"
            className="w-28 h-28 rounded-full mx-auto shadow mb-4 border"
          />

          <h1 className="text-3xl font-bold text-white">
            {profile?.name || "Freelancer"}
          </h1>
          <p className="text-white">{profile?.email}</p>
        </div>

        {/* Divider */}
        <hr className="my-6" />

        {/* Profile Details */}
        <div className="space-y-5 text-white">
          <div>
            <p className="text-sm text-white">Full Name</p>
            <p className="text-lg font-semibold">{profile?.name}</p>
          </div>

          <div>
            <p className="text-sm text-white">Email</p>
            <p className="text-lg font-semibold">{profile?.email}</p>
          </div>

          <div>
            <p className="text-sm text-white">Skills</p>
            <p className="font-semibold">
              {profile?.skills?.length
                ? profile.skills.join(", ")
                : "No skills added"}
            </p>
          </div>

          <div>
            <p className="text-sm text-white">Experience</p>
            <p className="font-semibold">
              {profile?.experience || "Not provided"}
            </p>
          </div>
        </div>

        {/* Update Profile Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/freelancer/updateProfile"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FreelanceProfile;
