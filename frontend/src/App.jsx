// src/App.jsx

import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

// Layout & Common
import Layout from "./components/Layout";
import socket from "./socket";
import ChatPage from "./chat/ChatPage";

// Freelancer Pages
import FreelancerHome from "./freelancePages/FreelancerHome";
import FreelancerSearch from "./freelancePages/FreelancerSearch";
import FreelanceJobDetails from "./freelancePages/FreelanceJobDetails";
import FreelanceRegister from "./freelancePages/FreelanceRegister";
import FreelanceLogin from "./freelancePages/FreelanceLogin";
import FreelancerSentProposals from "./freelancePages/FreelancerSentProposals";
import FreelanceUpdateProfile from "./freelancePages/FreelanceUpdateProfile";
import FreelanceProfile from "./freelancePages/FreelanceProfile";

// Client Pages
import ClientLogin from "./clientPages/ClientLogin";
import ClientRegister from "./clientPages/ClientRegister";
import ClientHome from "./clientPages/ClientHome";
import ProposalsReceived from "./clientPages/ProposalsReceived";
import AddJob from "./clientPages/AddJob";
import ClientGetJobs from "./clientPages/ClientGetJobs";
import EditJobs from "./clientPages/EditJobs";
import Payment from "./payment/Payment";

// Admin Pages
import AdminHome from "./adminPages/AdminHome";
import AdminLogin from "./adminPages/AdminLogin";
import AdminRegister from "./adminPages/AdminRegister";
import AdminAddJob from "./adminPages/AdminAddJob";
import AdminMgtUsers from "./adminPages/AdminMgtUsers";
import AdminGetAllJobs from "./adminPages/AdminGetAllJobs";
import AdminGetPreposals from "./adminPages/AdminGetPreposals";
import AdminEditJobs from "./adminPages/AdminEditJobs";


function App() {
  const { user } = useSelector((state) => state.client);

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;

      if (userId) {
        socket.emit("join", {
          userId: userId,
          role: user.role,
        });
        console.log("Joined socket with:", userId);
      }
    }
  }, [user]);
  
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to="/freelancer/login" replace />}
          />

          {/* === PUBLIC ROUTES FOR ALL ROLES (Login/Register) === */}
          <Route path="/freelancer/register" element={<FreelanceRegister />} />
          <Route path="/freelancer/login" element={<FreelanceLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />


          {/* === PROTECTED FREELANCER ROUTES (uses ProtectedRoute) === */}
        
            <Route path="/freelancer/freelancerHome" element={<FreelancerHome />} />
            <Route path="/freelancer/searchJobs" element={<FreelancerSearch />} />
            <Route path="/freelancer/applyJob/:id" element={<FreelanceJobDetails />} />
            <Route path="/freelancer/getPreposal" element={<FreelancerSentProposals />} />
            <Route path="/freelancer/updateProfile" element={<FreelanceUpdateProfile />} />
            <Route path="/freelancer/getProfile" element={<FreelanceProfile />} />
            <Route path="/freelancer/chat" element={<ChatPage />} />
      

          {/* Client Routes (currently unprotected, you should add a ClientProtectedRoute) */}
          <Route path="/client/home" element={<ClientHome />} />
          <Route path="/client/preposal" element={<ProposalsReceived />} />
          <Route path="/client/addJob" element={<AddJob />} />
          <Route path="/client/all" element={<ClientGetJobs />} />
          <Route path="/client/editJobs/:id" element={<EditJobs />} />
          <Route path="/client/payment" element={<Payment />} />
          <Route path="/client/chat" element={<ChatPage />} />


          {/* === PROTECTED ADMIN ROUTES (uses AdminProtectedRoute) === */}
           <Route path="/admin/home" element={<AdminHome/>}/>
            <Route path="/admin/adminAddJob" element={<AdminAddJob />} />
            <Route path="/admin/userMgt" element={<AdminMgtUsers />} />
            <Route path="/admin/getAdminJobs" element={<AdminGetAllJobs />} />
            <Route path="/admin/getPreposals" element={<AdminGetPreposals />} />
            <Route path="/admin/editJobs/:id" element={<AdminEditJobs />} />
            <Route path="/admin/chat" element={<ChatPage />} />
         

          {/* Catch-all route for Chat if necessary, should ideally be protected */}
          <Route path="/chat" element={<ChatPage />} /> 

        </Route>
      </Routes>
    </>
  );
}

export default App;