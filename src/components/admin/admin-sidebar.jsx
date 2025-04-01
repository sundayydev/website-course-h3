import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  CreditCard,
  Users,
  MessageSquare,
  Box,
  FileText,
  BarChart,
  Settings,
  Shield,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import LogoH3 from '@/assets/LogoH3.png';
import { NavLink, useLocation } from 'react-router-dom';

// Danh sách sidebar items
const sidebarItems = [
  {
    section: 'Tổng quan',
    items: [
      { icon: <Home size={16} />, text: 'Trang chủ', path: '/admin', active: true },
      { icon: <CreditCard size={16} />, text: 'Giao dịch' },
      { icon: <Users size={16} />, text: 'Học viên', path: '/admin/students' },
      { icon: <MessageSquare size={16} />, text: 'Message', badge: '8' },
    ],
  },
  {
    section: 'Tools',
    items: [
      { icon: <Box size={16} />, text: 'Khóa học', path: '/admin/courses' },
      { icon: <FileText size={16} />, text: 'Bài giảng', path: '/admin/lessons' },
      { icon: <BarChart size={16} />, text: 'Analytics' },
      { icon: <Settings size={16} />, text: 'Automation', badge: 'BETA', badgeType: 'beta' },
    ],
  },
  {
    section: 'Support',
    items: [
      { icon: <Settings size={16} />, text: 'Cài đặt' },
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
          Admin H3
        </a>
      </h1>

      {/* Sidebar Items */}
      <nav className="mt-4 flex flex-col space-y-2">
        {sidebarItems.map((group, index) => (
          <div key={index}>
            <div className="text-gray-400 uppercase text-xs font-semibold">{group.section}</div>
            {group.items.map((item, idx) => {
              item.active = item.path && location.pathname === item.path;
              return <SidebarItem key={idx} {...item} />;
            })}
          </div>
        ))}
      </nav>

      <Separator className="my-4" />

      {/* Footer */}
      <div className="mt-auto">
        <Card className="p-3 flex items-center justify-between bg-gray-100">
          <div>
            <div className="text-sm font-semibold">Team</div>
            <div className="text-gray-600 text-sm">Marketing</div>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </Card>
        <Button className="w-full mt-3 bg-pink-600 text-white">Upgrade Plan</Button>
      </div>

      <div className="text-center text-gray-500 text-xs mt-4">© 2025 H3.io, Inc.</div>
    </aside>
  );
}

// eslint-disable-next-line react/prop-types
function SidebarItem({ icon, text, badge, badgeType, active, path }) {
  return (
    <NavLink to={path}>
      <div
        className={`flex items-center p-2 rounded-lg ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        {icon}
        <span className="ml-2">{text}</span>
        {badge && (
          <span
            className={`ml-auto px-2 py-0.5 text-xs rounded-full font-semibold ${badgeType === 'beta' ? 'bg-pink-200 text-pink-600' : 'bg-red-200 text-red-700'}`}
          >
            {badge}
          </span>
        )}
      </div>
    </NavLink>
  );
}
