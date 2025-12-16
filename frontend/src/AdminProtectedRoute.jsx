// AdminProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  // 1. Get state from Redux (preferred source)
  const { user, token } = useSelector((state) => state.client);
  
  // 2. Fallback to Local Storage if Redux state is empty (for page reload scenario)
  //    NOTE: Ensure your clientSlice hydrates Redux from localStorage correctly.
  const storedToken = localStorage.getItem("token");
  const storedUserInfo = localStorage.getItem("userInfo");
  
  let isAuthenticated = !!token || !!storedToken;
  let userRole = user?.role;
  
  // If Redux state is empty but Local Storage has data, parse the role from Local Storage
  if (!userRole && storedUserInfo) {
    try {
      const storedUser = JSON.parse(storedUserInfo);
      userRole = storedUser.role;
    } catch (e) {
      console.error("Failed to parse user info from storage:", e);
      isAuthenticated = false; // Treat as unauthenticated if data is corrupted
    }
  }

  // --- PROTECTION LOGIC ---

  // A. Check for Authentication
  if (!isAuthenticated) {
    // If no token/user found in Redux or Local Storage, redirect to Admin Login
    return <Navigate to="/admin/login" replace />;
  }

  // B. Check for Authorization (Role)
  if (userRole !== "admin") {
    // If logged in, but not an admin (e.g., freelancer or client)
    
    // Recommended Action: Redirect them to the login page for their appropriate role,
    // or simply redirect them out of the admin area.
    console.warn(`User role '${userRole}' attempting to access admin route. Redirecting.`);
    
    // Since your app defaults to freelancer login on the root path,
    // redirecting to freelancer/login is a strong way to force them to the correct area.
    return <Navigate to="/freelancer/login" replace />; 
  }

  // C. Authorized and Authenticated Admin
  return children;
};

export default AdminProtectedRoute;