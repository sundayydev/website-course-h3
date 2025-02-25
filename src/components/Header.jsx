import { useState, useRef, useEffect } from 'react';
import LogoH3 from '../assets/LogoH3.png';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaSearch, FaFacebook, FaUser, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginRef = useRef(null);
  const registerRef = useRef(null);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setIsLoginOpen(false);
      }
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setIsRegisterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md relative">
      {/* Logo */}
      <h1 className="flex items-center space-x-2">
        <a href="/" className="rounded-lg">
          <img className="rounded-lg" src={LogoH3} alt="Logo H3" width={38} height={38} />
        </a>
        <a className="font-semibold text-base text-black hover:text-pink-600" href="/">
          Học Lập Trình Cùng H3
        </a>
      </h1>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-lg mx-4">
        <input
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết, video, ..."
          className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Buttons */}

      {/* Buttons */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          className="text-black font-semibold rounded-full"
          onClick={() => setIsRegisterOpen(true)}
        >
          Đăng ký
        </Button>

        <Button
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full font-semibold"
          onClick={() => setIsLoginOpen(true)}
        >
          Đăng nhập
        </Button>
      </div>

      {/* Popup Login */}
      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl relative">
            {/* Logo */}
            <div className="flex justify-center mb-4 mt-[40px]">
              <img src={LogoH3} alt="Logo H3" className="h-12 rounded-lg" />
            </div>

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setIsLoginOpen(false)}
            >
              <FaTimes size={20} />
            </button>

            <div className="mr-[60px] ml-[60px]">
              <h3 className="text-center text-[28px] font-bold text-gray-700 mb-4">
                Đăng nhập vào H3
              </h3>

              {/* Email Input */}
              <div className="relative mb-3">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Password Input */}
              <div className="relative mb-3">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  className="w-full px-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember" className="text-gray-900 text-sm">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <a href="#" className="text-blue-500 hover:text-red-500 text-sm">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login Button */}
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl">
                Đăng nhập
              </Button>

              {/* OR Divider */}
              <div className="my-3 text-center text-gray-500 text-sm">HOẶC</div>

              {/* Google & Facebook Login */}
              <div className="flex flex-col gap-2">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl py-2 flex items-center justify-center">
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Tiếp tục với Google
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-2 flex items-center justify-center">
                  <FaFacebook className="w-5 h-5 mr-2" />
                  Tiếp tục với Facebook
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-3 text-center mb-5">
                <span className="text-gray-600 text-sm">Chưa có tài khoản?</span>
                <button
                  className="text-blue-500 hover:text-green-500 text-sm ml-2 mt-5"
                  onClick={() => {
                    setIsRegisterOpen(true);
                    setIsLoginOpen(false);
                  }}
                >
                  Đăng ky ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Popup Register */}
      {isRegisterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl relative">
            {/* Logo */}
            <div className="flex justify-center mb-4 mt-[40px]">
              <img src={LogoH3} alt="Logo H3" className="h-12 rounded-lg" />
            </div>

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setIsRegisterOpen(false)}
            >
              <FaTimes size={20} />
            </button>

            <div className="mr-[60px] ml-[60px]">
              <h3 className="text-center text-[28px] font-bold text-gray-700 mb-4">
                Đăng ky Tai Khoan
              </h3>
              {/* FullName Input */}
              <div className="relative mb-3">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ho va ten"
                  className="w-full px-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Email Input */}
              <div className="relative mb-3">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Password Input */}
              <div className="relative mb-3">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  className="w-full px-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>

              {/* Login Button */}
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl">
                Đăng Ky
              </Button>

              {/* OR Divider */}
              <div className="my-3 text-center text-gray-500 text-sm">HOẶC</div>

              {/* Google & Facebook Login */}
              <div className="flex flex-col gap-2">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl py-2 flex items-center justify-center">
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Tiếp tục với Google
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-2 flex items-center justify-center">
                  <FaFacebook className="w-5 h-5 mr-2" />
                  Tiếp tục với Facebook
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-3 text-center mb-5">
                <span className="text-gray-600 text-sm">Chưa có tài khoản?</span>
                <button
                  className="text-blue-500 hover:text-green-500 text-sm ml-2"
                  onClick={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                  }}
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
