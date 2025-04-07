import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  GraduationCap,
  BookOpenText,
  Settings,
  Shield,
  HelpCircle,
  ChevronDown,
  DollarSign,
  BookOpen
} from 'lucide-react';
import LogoH3 from '@/assets/LogoH3.png';
import { NavLink, useLocation } from 'react-router-dom';

// Danh sách sidebar items
const sidebarItems = [
  {
    section: 'Tổng quan',
    items: [
      { icon: <LayoutDashboard size={16} />, text: 'Dashboard', path: '/admin/dashboard' },
      { icon: <DollarSign size={16} />, text: 'Quản lý thanh toán', path: '/admin/payment-management' },
      { icon: <Users size={16} />, text: 'Quản lý học viên', path: '/admin/students' },
    ],
  },
  {
    section: 'Quản lý khóa học & bài viết',
    items: [
      { icon: <GraduationCap size={16} />, text: 'Khóa học', path: '/admin/courses' },
      { icon: <BookOpenText size={16} />, text: 'Bài viết', path: '/admin/post-management' },
      { icon: <CreditCard size={16} />, text: 'Quản lý khóa học', path: '/admin/course-management', badge: 'NEW', badgeType: 'beta' },
     { icon: <BookOpen size={16} />, text: 'Bình luận bài viết', path: '/admin/comment' },
    ],
  },
  {
    section: 'Cài đặt & Hỗ trợ',
    items: [
      { icon: <Settings size={16} />, text: 'Cài đặt hệ thống' },
      { icon: <Shield size={16} />, text: 'Bảo mật' },
      { icon: <HelpCircle size={16} />, text: 'Trợ giúp' },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-4 flex flex-col">
      {/* Logo */}
      <h1 className="flex items-center space-x-2">
        <a href="/admin" className="rounded-lg">
          <img className="rounded-lg" src={LogoH3} alt="Logo H3" width={38} height={38} />
        </a>
        <a className="font-semibold text-base text-black hover:text-pink-600" href="/admin">
          H3 Admin
        </a>
      </h1>

      {/* Sidebar Items */}
      <nav className="mt-6 flex flex-col space-y-4">
        {sidebarItems.map((group, index) => (
          <div key={index}>
            <div className="text-gray-500 uppercase text-xs font-bold mb-2">{group.section}</div>
            {group.items.map((item, idx) => {
              item.active = item.path && location.pathname === item.path;
              return <SidebarItem key={idx} {...item} />;
            })}
            {index < sidebarItems.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <Card className="p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <div>
            <div className="text-sm font-semibold">Tài khoản</div>
            <div className="text-gray-600 text-sm">Admin</div>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </Card>
      </div>

      <div className="text-center text-gray-500 text-xs mt-4">© 2024 H3 Academy</div>
    </aside>
  );
}

// eslint-disable-next-line react/prop-types
function SidebarItem({ icon, text, badge, badgeType, active, path }) {
  return (
    <NavLink to={path || '#'}>
      <div
        className={`flex items-center p-2.5 rounded-lg transition-colors ${
          active 
            ? 'bg-pink-50 text-pink-600' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'
        }`}
      >
        {icon}
        <span className="ml-3 font-medium">{text}</span>
        {badge && (
          <span
            className={`ml-auto px-2 py-0.5 text-xs rounded-full font-semibold ${
              badgeType === 'beta' 
                ? 'bg-pink-100 text-pink-600' 
                : 'bg-red-100 text-red-600'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </NavLink>
  );
}
