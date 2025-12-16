import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ClientLogin from "./clientPages/ClientLogin";
import FreelancerHome from "./freelancePages/FreelancerHome";
import FreelancerSearch from "./freelancePages/FreelancerSearch";
import FreelanceJobDetails from "./freelancePages/FreelanceJobDetails";
import FreelanceRegister from "./freelancePages/FreelanceRegister";
import FreelanceLogin from "./freelancePages/FreelanceLogin";
import ClientHome from "./clientPages/ClientHome";
import AdminHome from "./adminPages/AdminHome";
import ProposalsReceived from "./clientPages/ProposalsReceived";
import AdminLogin from "./adminPages/AdminLogin";
import AdminRegister from "./adminPages/AdminRegister";
import FreelancerSentProposals from "./freelancePages/FreelancerSentProposals";
import AddJob from "./clientPages/AddJob";
import FreelanceUpdateProfile from "./freelancePages/FreelanceUpdateProfile";
import FreelanceProfile from "./freelancePages/FreelanceProfile";
import ClientRegister from "./clientPages/ClientRegister";
import AdminMgtUsers from "./adminPages/AdminMgtUsers";
import AdminGetAllJobs from "./adminPages/AdminGetAllJobs";
import AdminGetPreposals from "./adminPages/AdminGetPreposals";
import AdminEditJobs from "./adminPages/AdminEditJobs";
import ClientGetJobs from "./clientPages/ClientGetJobs";
import EditJobs from "./clientPages/EditJobs";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import socket from "./socket";
import ChatBox from "./chat/ChatBox";
import ChatPage from "./chat/ChatPage";
import Payment from "./payment/Payment";
import ProtectedRoute from "./ProtectedRoute";
import { Toaster } from "react-hot-toast";
import AdminAddJob from "./adminPages/AdminAddJob";
import AdminProtectedRoute from "./AdminProtectedRoute";

function App() {
  const { user } = useSelector((state) => state.client);

  useEffect(() => {
    if (user) {
      // Handle both old format (id) and new format (_id)
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
          {/* Public routes */}
          <Route path="/freelancer/register" element={<FreelanceRegister />} />
          <Route path="/freelancer/login" element={<FreelanceLogin />} />

          {/* PROTECTED FREELANCER ROUTES */}
          <Route
            path="/freelancer/freelancerHome"
            element={
              <ProtectedRoute>
                <FreelancerHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/searchJobs"
            element={
              <ProtectedRoute>
                <FreelancerSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/applyJob/:id"
            element={
              <ProtectedRoute>
                <FreelanceJobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/getPreposal"
            element={
              <ProtectedRoute>
                <FreelancerSentProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/updateProfile"
            element={
              <ProtectedRoute>
                <FreelanceUpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/getProfile"
            element={
              <ProtectedRoute>
                <FreelanceProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Client */}
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/home" element={<ClientHome />} />
          <Route path="/client/preposal" element={<ProposalsReceived />} />
          <Route path="/client/addJob" element={<AddJob />} />
          <Route path="/client/all" element={<ClientGetJobs />} />
          <Route path="/client/editJobs/:id" element={<EditJobs />} />
          <Route path="/client/payment" element={<Payment />} />
          <Route path="/client/chat" element={<ChatPage />} />

          {/* Admin */}
          <Route
            path="/admin/home"
            element={
              <AdminProtectedRoute>
                <AdminHome />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/adminAddJob" element={<AdminAddJob />} />
          <Route path="/admin/userMgt" element={<AdminMgtUsers />} />
          <Route path="/admin/getAdminJobs" element={<AdminGetAllJobs />} />
          <Route path="/admin/getPreposals" element={<AdminGetPreposals />} />
          <Route path="/admin/editJobs/:id" element={<AdminEditJobs />} />
          <Route path="/admin/chat" element={<ChatPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
