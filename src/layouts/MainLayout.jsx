import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useEffect } from 'react';

const MainLayout = () => {
  const location = useLocation();

  // Danh sách các trang không hiển thị Sidebar và Footer
  const hiddenRoutes = ['/account', '/account-setting', '/lesson'];
  const shouldHideLayout = hiddenRoutes.some((route) => location.pathname.includes(route));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md mb-3">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 mb-2">
        {/* Sidebar (Desktop) - Chỉ hiển thị nếu không phải trong danh sách hiddenRoutes */}
        {!shouldHideLayout && (
          <div className="hidden md:block sticky top-16 left-0 h-[260px] w-64 bg-white overflow-x-hidden overflow-y-hidden">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>

      {/* Sidebar (Mobile) - Chỉ hiển thị nếu không phải trong danh sách hiddenRoutes */}
      {!shouldHideLayout && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-md">
          <Sidebar />
        </div>
      )}

      {/* Footer - Chỉ hiển thị nếu không phải trong danh sách hiddenRoutes */}
      {!shouldHideLayout && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
