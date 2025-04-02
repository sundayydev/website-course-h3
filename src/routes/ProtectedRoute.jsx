import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
