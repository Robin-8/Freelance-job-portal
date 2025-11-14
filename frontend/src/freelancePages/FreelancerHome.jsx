import React from "react";
import { Link } from "react-router-dom";
import CompanyLogos from "../components/CompanyLogos";
import FeaturedJobs from "./FeaturedJobs ";

const FreelancerHome = () => {
  return (
    <div className="bg-black-100 min-h-screen p-6">
      {/* Header */}
      <div className="text-white">
        <h1 className="text-5xl font-bold flex justify-center">
          Welcome Freelancer 👋
        </h1>
        <p className="mt-2  flex justify-center text-2xl">
          Find freelance jobs, submit proposals, and manage your profile.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/jobs"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg border hover:border-blue-500 transition-all"
        >
          <h2 className="text-xl font-bold">Find Jobs</h2>
          <p className="text-gray-600 mt-2">
            Explore available freelance projects and apply.
          </p>
        </Link>

        <Link
          to="/freelancer/proposals"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg border hover:border-blue-500 transition-all"
        >
          <h2 className="text-xl font-bold">Your Proposals</h2>
          <p className="text-gray-600 mt-2">
            Track your proposal status anytime.
          </p>
        </Link>

        <Link
          to="/freelancer/profile"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg border hover:border-blue-500 transition-all"
        >
          <h2 className="text-xl font-bold">Your Profile</h2>
          <p className="text-gray-600 mt-2">
            Update skills, experience, and portfolio.
          </p>
        </Link>
      </div>

      <div className="overflow-hidden bg-black py-4 mt-5 ">
        <CompanyLogos/>
      </div>
      <div>
          <h1 className="text-white font-bold text-2xl flex justify-center">Featured Opportunities</h1>
      </div>
         <FeaturedJobs/>
    </div>
  );
};

export default FreelancerHome;
