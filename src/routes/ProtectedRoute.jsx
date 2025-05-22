import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
export const ProtectedRouteAdmin = ({ children, allowedRoles = ['Admin'] }) => {
  const { user } = useAuth();
  console.log('Allowed roles:', allowedRoles);

  // If no user is authenticated, redirect to home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user's role is in the allowed roles array
  if (!allowedRoles.includes(user?.role)) {

    console.log('User role:', user?.role);
    return <Navigate to="/" replace />;
  }

  return children;
};

export const ProtectedRouteInstructor = ({ children, allowedRoles = ['Instructor'] }) => {
  const { user } = useAuth();
  console.log('Allowed roles:', allowedRoles);

  // If no user is authenticated, redirect to home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user's role is in the allowed roles array
  if (!allowedRoles.includes(user?.role)) {

    console.log('User role:', user?.role);
    return <Navigate to="/" replace />;
  }

  return children;
};
