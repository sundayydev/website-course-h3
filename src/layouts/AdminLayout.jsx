import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/admin-sidebar.jsx';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 w-full">
        {/* Sidebar - fixed width, hidden on mobile */}
        <AdminSidebar className="w-[250px] border-r bg-white shadow-sm hidden lg:block" />

        {/* Main content area - takes remaining space */}
        <main className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-0">
            <SidebarTrigger className="lg:hidden p-4" /> {/* Nút toggle sidebar trên mobile */}
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;