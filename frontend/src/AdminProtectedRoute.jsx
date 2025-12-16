// middleware/AdminProtectedRoute.jsx (Corrected Logic)

import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userInfoString = localStorage.getItem("userInfo");
  let role = null;

  // 1. Check for token
  if (!token || !userInfoString) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // 2. Safely parse user info to get the role
  try {
      const user = JSON.parse(userInfoString);
      role = user.role;
  } catch (e) {
      console.error("Failed to parse userInfo for Admin check:", e);
      return <Navigate to="/admin/login" replace />;
  }

  // 3. Check for authorization (Role)
  if (role !== "admin") {
    // If they are logged in but not an admin (e.g., a freelancer), redirect them away from the admin area
    return <Navigate to="/freelancer/login" replace />; 
  }

  // 4. If token exists and the role is 'admin', allow access
  return children;
};

export default AdminProtectedRoute;