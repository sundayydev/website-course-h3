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
  Mail,
  CreditCard
} from 'lucide-react';
import LogoH3 from '@/assets/LogoH3.png';

const sidebarItems = [
  {
    section: 'Tổng quan',
    items: [
      { icon: <LayoutDashboard size={16} />, text: 'Trang Chủ', path: '/admin/dashboard' },
      { icon: <Users size={16} />, text: 'Học viên', path: '/admin/students' },
      { icon: <Users size={16} />, text: 'Giảng viên', path: '/admin/instructors' },
    ],
  },
  {
    section: 'Quản lý nội dung',
    items: [
      { icon: <GraduationCap size={16} />, text: 'Khóa học', path: '/admin/courses' },
      { icon: <BookOpenText size={16} />, text: 'Bài viết', path: '/admin/post-management?page=1' },
      { icon: <MessageSquare size={16} />, text: 'Bình luận', path: '/admin/comment' },
      { icon: <BookOpen size={16} />, text: 'Thông báo', path: '/admin/notifications?page=1' },
      { icon: <Mail size={16} />, text: 'Email', path: '/admin/emails' },
      { icon: <CreditCard size={16} />, text: 'Thanh toán', path: '/admin/payment-management' }
    ],
  },
  {
    section: 'Cài đặt',
    items: [
      { icon: <Settings size={16} />, text: 'Cài đặt', path: '/admin/settings' },
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
    if (window.confirm('bạn có muốn đăng xuất?')) {
      try {
        await logout();
        removeAuthToken();
        toast.success('đăng xuất thành công');
        navigate('/');
      } catch (err) {
        console.error('Logout error:', err);
        toast.error('Logout failed');
      }
    }
  };

  return (
    <aside className={`flex flex-col h-screen p-[16px] ${className}`}>
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
          Đăng xuất
        </Button>
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          © 2025 H3 Academy
        </div>
      </div>
    </aside>
  );
}