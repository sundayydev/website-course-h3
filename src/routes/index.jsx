import { createBrowserRouter } from 'react-router-dom';
import MainRoutes from '@/routes/MainRoutes.jsx';
import AdminRoutes from '@/routes/AdminRoutes.jsx';

const router = createBrowserRouter([
  MainRoutes, // Routes của MainLayout
  AdminRoutes, // Routes của AdminLayout
]);
export default router;
