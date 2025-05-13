import Sidebar from '@/components/instructor/Sidebar';
import { Outlet } from 'react-router-dom';

const InstructorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidbar Instructor */}
      <Sidebar />

      <Outlet />
    </div>
  );
};

export default InstructorLayout;
