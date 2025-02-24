import LogoH3 from '../assets/LogoH3.png';
import { FaSearch } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md">
      <h1 className="flex items-center space-x-2">
        <a href="/" className="rounded-lg">
          <img className="rounded-lg" src={LogoH3} alt="Logo H3" width={38} height={38} />
        </a>
        <a className="font-semibold text-base text-black hover:text-pink-600" href="/">
          Học Lập Trình Cùng H3
        </a>
      </h1>

      <div className="relative flex-1 max-w-lg mx-4">
        <input
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết, video, ..."
          className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" className="text-black font-semibold rounded-full">
          Đăng ký
        </Button>
        <Button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full font-semibold">
          Đăng nhập
        </Button>
      </div>
    </header>
  );
};

export default Header;
