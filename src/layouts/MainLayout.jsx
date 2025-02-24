import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar (có thể ẩn nếu không cần) */}
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-4">
          <Outlet /> {/* Hiển thị nội dung của từng trang */}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
