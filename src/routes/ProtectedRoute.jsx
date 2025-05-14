import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, allowedRoles = ['Admin', 'Instructor'] }) => {
  const { user } = useAuth();

  // If no user is authenticated, redirect to home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user's role is in the allowed roles array
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
