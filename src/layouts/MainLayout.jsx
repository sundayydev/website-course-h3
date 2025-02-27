import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar (Desktop) */}
        <div className="hidden md:block sticky top-16 h-[calc(50vh-7.6rem)] w-64 bg-white overflow-x-hidden overflow-y-hidden">
          <Sidebar />
        </div>
        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Sidebar (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
