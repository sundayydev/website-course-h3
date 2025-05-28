import { NavLink } from 'react-router-dom';
import { FaHome, FaEnvelope, FaNewspaper, FaInfoCircle } from 'react-icons/fa';

// Danh sách sidebar items
const sidebarItems = [
  {
    items: [
      { path: '/', icon: <FaHome size={25} />, text: 'Trang chủ' },
      { path: '/contact', icon: <FaEnvelope size={25} />, text: 'Liên hệ' },
      { path: '/post?page=1', icon: <FaNewspaper size={25} />, text: 'Bài viết', },
      { path: '/about', icon: <FaInfoCircle size={25} />, text: 'Giới thiệu' },
    ],
  },
];

const Sidebar = () => {
  return (
    <aside
      className="bg-white md:p-4 flex flex-col 
      md:w-[115px] md:min-h-screen md:relative 
      fixed bottom-0 w-full border-t md:border-0"
    >
      {/* Sidebar Items */}
      <nav className="mt-1 flex md:flex-col justify-center md:justify-start ">
        {sidebarItems.map((group, index) => (
          <div key={index} className="flex md:block">
            {group.items.map((item, idx) => (
              <SidebarItem key={idx} {...item} />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

// eslint-disable-next-line react/prop-types
const SidebarItem = ({ icon, text, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 m-2
        ${isActive ? 'bg-gray-100 text-emerald-500 font-semibold' : 'text-gray-600 hover:bg-gray-50'} `
      }
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-xs font-medium">{text}</span>
    </NavLink>
  );
};

export default Sidebar;
