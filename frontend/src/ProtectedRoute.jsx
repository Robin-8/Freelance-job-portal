import { Navigate } from "react-router-dom";
import React from 'react'
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/freelancer/login" replace />;
};

export default ProtectedRoute;
