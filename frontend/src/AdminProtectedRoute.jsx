import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.client);

  if (!token || !user) {
    return <Navigate to="/freelancer/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/freelancer/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
