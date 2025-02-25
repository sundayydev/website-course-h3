// src/routes/AdminRoutes.jsx
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';

const AdminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <Dashboard /> }, // /admin (mặc định)
    { path: 'dashboard', element: <Dashboard /> }, // /admin/dashboard
    { path: 'users', element: <Users /> }, // /admin/users
  ],
};

export default AdminRoutes;
