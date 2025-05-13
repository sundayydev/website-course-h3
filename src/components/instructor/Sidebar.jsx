import {
  Menu,
  User,
  Home,
  BookOpen,
  Calendar,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pathname = useLocation().pathname;
  console.log('pathname', pathname);

  return (
    <div
      className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h2 className="text-xl font-bold">EduDash</h2>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-800"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-4">
          {sidebarOpen ? (
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium">TS. Nguyễn Văn A</p>
                <p className="text-sm text-gray-400">Giảng viên</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User size={20} />
              </div>
            </div>
          )}
        </div>

        <nav className="mt-6 flex-1">
          <div className="px-4 space-y-1">
            <NavLink
              to="/instructor"
              className={`flex items-center p-3 text-white rounded-lg ${pathname === '/instructor' ? 'bg-blue-700' : 'hover:bg-gray-800 text-gray-400'}`}
            >
              <Home size={20} />
              {sidebarOpen && <span className="ml-4">Dashboard</span>}
            </NavLink>
            <NavLink
              to="/instructor/courses"
              className={`flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg ${pathname === '/instructor/courses' ? 'bg-blue-700 text-white' : ''}`}
            >
              <BookOpen size={20} />
              {sidebarOpen && <span className="ml-4">Khóa học</span>}
            </NavLink>
            <NavLink
              to="/instructor/schedule"
              className={`flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg ${pathname === '/schedule' ? 'bg-blue-700 text-white' : ''}`}
            >
              <Calendar size={20} />
              {sidebarOpen && <span className="ml-4">Lịch giảng dạy</span>}
            </NavLink>
            <NavLink
              to="/instructor/students"
              className={`flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg ${pathname === '/students' ? 'bg-blue-700 text-white' : ''}`}
            >
              <Users size={20} />
              {sidebarOpen && <span className="ml-4">Sinh viên</span>}
            </NavLink>
            <NavLink
              to="/instructor/reports"
              className={`flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg ${pathname === '/reports' ? 'bg-blue-700 text-white' : ''}`}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span className="ml-4">Báo cáo</span>}
            </NavLink>
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <div className="space-y-1">
            <NavLink
              to="/instructor/settings"
              className={`flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg ${pathname === '/settings' ? 'bg-blue-700 text-white' : ''}`}
            >
              <Settings size={20} />
              {sidebarOpen && <span className="ml-4">Cài đặt</span>}
            </NavLink>
            <NavLink
              to="/instructor/help"
              className={`flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg ${pathname === '/help' ? 'bg-blue-700 text-white' : ''}`}
            >
              <HelpCircle size={20} />
              {sidebarOpen && <span className="ml-4">Trợ giúp</span>}
            </NavLink>
            <NavLink
              to="/instructor/logout"
              className={`flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg ${pathname === '/logout' ? 'bg-blue-700 text-white' : ''}`}
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="ml-4">Đăng xuất</span>}
            </NavLink>
          </div>
        </div>

        <div className="p-4 mt-auto">
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg"
            >
              <Settings size={20} />
              {sidebarOpen && <span className="ml-4">Cài đặt</span>}
            </a>
            <a
              href="#"
              className="flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg"
            >
              <HelpCircle size={20} />
              {sidebarOpen && <span className="ml-4">Trợ giúp</span>}
            </a>
            <a
              href="#"
              className="flex items-center p-3 text-gray-400 hover:bg-gray-800 rounded-lg"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="ml-4">Đăng xuất</span>}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
