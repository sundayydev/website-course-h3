import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';

const MainLayout = () => {
  const location = useLocation();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  // Danh sách các trang không hiển thị Sidebar và Footer
  const hiddenRoutes = ['/account', '/setting', '/lesson', '/detailsPageCourse', '*', '/NotFoundPage', '/404', '/instructor', '/admin'];
  const shouldHideComponents = hiddenRoutes.some((route) => location.pathname.includes(route));

  // Kiểm tra xem có phải đang ở trang NotFoundPage không
  useEffect(() => {
    // Kiểm tra tất cả các cách có thể để xác định NotFoundPage
    const isNotFound =
      location.pathname === '*' ||
      location.pathname === '/NotFoundPage' ||
      location.pathname.includes('NotFoundPage') ||
      location.pathname === '/404' ||
      // Kiểm tra URL hiện tại (thực tế) có chứa NotFoundPage không
      window.location.href.includes('NotFoundPage') ||
      window.location.href.includes('/404');

    setIsNotFoundPage(isNotFound);

    // Debug
    console.log('Current path:', location.pathname);
    console.log('Is NotFoundPage:', isNotFound);

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
        {/* Sidebar (Desktop) - Chỉ hiển thị nếu không thuộc các route cần ẩn và không phải trang 404 */}
        {!shouldHideComponents && !isNotFoundPage && (
          <div className="hidden md:block sticky top-16 left-0 h-[300px] w-26 bg-white overflow-x-hidden overflow-y-hidden">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Sidebar (Mobile) - Chỉ hiển thị nếu không thuộc các route cần ẩn và không phải trang 404 */}
      {!shouldHideComponents && !isNotFoundPage && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-md">
          <Sidebar />
        </div>
      )}

      {/* Footer - Chỉ hiển thị nếu không thuộc các route cần ẩn và không phải trang 404 */}
      {!shouldHideComponents && !isNotFoundPage && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
