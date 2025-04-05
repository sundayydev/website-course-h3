import { FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import LogoH3 from '../assets/LogoH3.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Cột 1: Logo + Thông tin liên hệ */}
        <div>
          <h1 className="flex items-center space-x-2">
            <a href="/" className="rounded-lg">
              <img className="rounded-lg" src={LogoH3} alt="Logo H3" width={40} height={40} />
            </a>
            <a className="font-semibold text-lg text-white hover:text-pink-200" href="/">
              Học Lập Trình Cùng H3
            </a>
          </h1>
          <p className="mt-3 text-sm">
            <strong>Điện thoại:</strong> 07 9782 3018
          </p>
          <p className="text-sm">
            <strong>Email:</strong> contact@developer.edu.vn
          </p>
          <p className="text-sm">
            <strong>Địa chỉ:</strong> Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội
          </p>
          <img
            src="https://images.dmca.com/Badges/dmca-badge-w250-2x1-03.png"
            alt="DMCA Protected"
            className="mt-3 w-24"
          />
        </div>

        {/* Cột 2: Về H3 */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">VỀ H3</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Liên hệ
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Điều khoản
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Bảo mật
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Sản phẩm */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">SẢN PHẨM</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Game Nester
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Game CSS Diner
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Game CSS Selectors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Game Froggy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Game Froggy Pro
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Game Scoops
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Công cụ */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">CÔNG CỤ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Tạo CV xin việc
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Rút gọn liên kết
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Clip-path maker
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Snippet generator
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                CSS Grid generator
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Cảnh báo sờ tay lên mặt
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 5: Công ty */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">
            CÔNG TY CỔ PHẦN CÔNG NGHỆ GIÁO DỤC H3
          </h3>
          <p className="text-sm">
            <strong>Mã số thuế:</strong> 0909090909
          </p>
          <p className="text-sm">
            <strong>Ngày thành lập:</strong> 01/03/2025
          </p>
          <p className="mt-2 text-sm">
            Lĩnh vực hoạt động: Giáo dục, công nghệ - lập trình. Chúng tôi tập trung xây dựng và
            phát triển các sản phẩm mang lại giá trị cho cộng đồng lập trình viên Việt Nam.
          </p>

          {/* Mạng xã hội */}
          <div className="flex space-x-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaYoutube size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-xs mt-10">
        © 2025 H3. Nền tảng học lập trình hàng đầu Việt Nam (Bốc phét)
      </div>
    </footer>
  );
};

export default Footer;
