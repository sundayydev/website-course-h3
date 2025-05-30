import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '@/api/authApi';
import { removeAuthToken } from '@/api/authUtils';
import { toast } from 'react-toastify';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpenText,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import LogoH3 from '@/assets/LogoH3.png';

const sidebarItems = [
  {
    section: 'Overview',
    items: [
      { icon: <LayoutDashboard size={16} />, text: 'Dashboard', path: '/admin/dashboard' },
      { icon: <Users size={16} />, text: 'Students', path: '/admin/students' },
      { icon: <Users size={16} />, text: 'Instructors', path: '/admin/instructors' },
    ],
  },
  {
    section: 'Content Management',
    items: [
      { icon: <GraduationCap size={16} />, text: 'Courses', path: '/admin/courses' },
      { icon: <BookOpenText size={16} />, text: 'Posts', path: '/admin/post-management?page=1' },
      { icon: <MessageSquare size={16} />, text: 'Comments', path: '/admin/comment' },
      { icon: <BookOpen size={16} />, text: 'Notifications', path: '/admin/Notifications' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { icon: <Settings size={16} />, text: 'System Settings', path: '/admin/settings' },
    ],
  },
];

export default function AdminSidebar({ className }) {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState(
    sidebarItems.reduce((acc, group) => ({ ...acc, [group.section]: true }), {})
  );

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        removeAuthToken();
        toast.success('Logged out successfully');
        navigate('/login');
      } catch (err) {
        console.error('Logout error:', err);
        toast.error('Logout failed');
      }
    }
  };

  return (
    <aside className={`flex flex-col h-screen p-4 ${className}`}>
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6">
        <NavLink to="/admin" className="rounded-lg">
          <img src={LogoH3} alt="H3 Academy" className="w-10 h-10 rounded-lg" />
        </NavLink>
        <NavLink to="/admin" className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-pink-600">
          H3 Admin
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((group) => (
          <div key={group.section}>
            <button
              className="flex items-center w-full text-sm font-medium text-gray-500 dark:text-gray-300 uppercase py-2"
              onClick={() => toggleSection(group.section)}
            >
              {expandedSections[group.section] ? (
                <ChevronDown size={16} className="mr-2" />
              ) : (
                <ChevronRight size={16} className="mr-2" />
              )}
              {group.section}
            </button>
            {expandedSections[group.section] && (
              <div className="space-y-1 ml-4">
                {group.items.map((item) => (
                  <NavLink
                    key={item.text}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-pink-50 hover:text-pink-600 ${isActive ? 'bg-pink-50 text-pink-600' : ''
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3 text-sm font-medium">{item.text}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Admin</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">System Administrator</div>
          </div>
          <ChevronDown size={16} className="text-gray-500 dark:text-gray-300" />
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-900"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          © 2025 H3 Academy
        </div>
      </div>
    </aside>
  );
}