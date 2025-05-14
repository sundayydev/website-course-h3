import { createBrowserRouter } from 'react-router-dom';
import MainRoutes from '@/routes/MainRoutes.jsx';
import AdminRoutes from '@/routes/AdminRoutes.jsx';
import InstructorRoutes from '@/routes/InstructorRoutes.jsx';

const router = createBrowserRouter([
  MainRoutes, // Routes của MainLayout
  AdminRoutes, // Routes của AdminLayout
  InstructorRoutes, // Routes của InstructorLayout
]);
export default router;
