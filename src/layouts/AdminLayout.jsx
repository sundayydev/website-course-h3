import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/admin-sidebar.jsx';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
