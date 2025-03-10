// src/routes/AdminRoutes.jsx
import { Contact } from 'lucide-react';
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
    { path: 'contact', element: <Contact /> }, // /admin/users
  ],
};

export default AdminRoutes;
