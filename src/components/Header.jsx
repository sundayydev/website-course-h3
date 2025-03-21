import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import LogoH3 from '../assets/LogoH3.png';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaSearch, FaFacebook, FaUser, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { login, register } from '../api/api';
const Header = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
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
  // Xử lý đăng nhập
  const handleLogin = async () => {
    try {
      const response = await login(loginData);
      console.log('Login Success:', response.data);
      alert('Đăng nhập thành công!');
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      alert('Đăng nhập thất bại!');
    }
  };

  // Xử lý đăng ký
  const handleRegister = async () => {
    console.log('Dữ liệu gửi lên API:', registerData);
    try {
      const response = await register(registerData);
      console.log('Register Success:', response.data);
      alert('Đăng ký thành công!');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);

      if (error.response) {
        const { status, data } = error.response;
        console.log('Chi tiết lỗi:', data.errors);

        if (status === 400 && data.errors) {
          let errorMessages = Object.values(data.errors).flat().join('\n');
          alert(`Lỗi đăng ký:\n${errorMessages}`);
        } else {
          alert(`Lỗi đăng ký: ${data.message || 'Có lỗi xảy ra, thử lại sau.'}`);
        }
      } else if (error.request) {
        // Trường hợp request được gửi nhưng không có phản hồi từ server
        alert('Lỗi kết nối! Máy chủ không phản hồi.');
      } else {
        // Trường hợp lỗi khác (ví dụ: cấu hình sai request)
        alert(`Lỗi không xác định: ${error.message}`);
      }
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md relative">
      {/* Logo */}
      <h1 className="flex items-center space-x-2">
        <a href="/" className="rounded-lg">
          <img className="rounded-lg" src={LogoH3} alt="Logo H3" width={38} height={38} />
        </a>
        <a
          className="font-semibold text-base text-black hover:text-pink-600 hidden md:block"
          href="/"
        >
          Học Lập Trình Cùng H3
        </a>
      </h1>

      {/* Search Bar */}
      <div className="relative flex-1 md:max-w-lg mx-4">
        <input
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết, video, ..."
          className="w-full px-4 py-2 pl-10 border font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-4 ">
        <Button
          variant="outline"
          className="text-black font-semibold rounded-full hidden md:block"
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
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative h-[500px] md:h-[550px]">
            {/* Logo */}
            <div className="flex justify-center mb-4 mt-4">
              <img src={LogoH3} alt="Logo H3" className="h-10 rounded-lg" />
            </div>

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setIsLoginOpen(false)}
            >
              <FaTimes size={20} />
            </button>

            <div className="mx-4 md:mx-10">
              <h3 className="text-center text-lg md:text-2xl font-bold text-gray-700 mb-3">
                Đăng nhập vào H3
              </h3>

              {/* Email Input */}
              <div className="relative mb-3">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
                />
              </div>

              {/* Password Input */}
              <div className="relative mb-3">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
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
              <div className="flex justify-between items-center mb-4 text-xs md:text-sm">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-1" />
                  <label htmlFor="remember" className="text-gray-900">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <a href="#" className="text-blue-500 hover:text-red-500">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login Button */}
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
                onClick={async () => {
                  const success = await handleLogin(); // Gọi hàm đăng nhập
                  if (success) {
                    if (location.pathname === '/home') {
                      setIsLoginOpen(false);
                    } else {
                      navigate('/home');
                    }
                  }
                }}
              >
                Đăng nhập
              </Button>

              {/* OR Divider */}
              <div className="my-3 text-center text-gray-500 text-xs md:text-sm">HOẶC</div>

              {/* Google & Facebook Login */}
              <div className="flex flex-col gap-2">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg py-2 flex items-center justify-center text-sm md:text-base">
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Tiếp tục với Google
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center text-sm md:text-base">
                  <FaFacebook className="w-5 h-5 mr-2" />
                  Tiếp tục với Facebook
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-3 text-center mb-3">
                <span className="text-gray-600 text-xs md:text-sm">Chưa có tài khoản?</span>
                <button
                  className="text-blue-500 hover:text-green-500 text-xs md:text-sm ml-1"
                  onClick={() => {
                    setIsRegisterOpen(true);
                    setIsLoginOpen(false);
                  }}
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Register */}
      {isRegisterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative h-[500px] md:h-[550px]">
            {/* Logo */}
            <div className="flex justify-center mb-4 mt-4">
              <img src={LogoH3} alt="Logo H3" className="h-10 rounded-lg" />
            </div>

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setIsRegisterOpen(false)}
            >
              <FaTimes size={20} />
            </button>

            <div className="mx-4 md:mx-10">
              <h3 className="text-center text-lg md:text-2xl font-bold text-gray-700 mb-3">
                Đăng ký Tài Khoản
              </h3>

              {/* FullName Input */}
              <div className="relative mb-3">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={registerData.fullName}
                  required
                  placeholder="Nhập họ và tên"
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })} // Cập nhật state khi nhập
                  className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
                />
              </div>

              {/* Email Input */}
              <div className="relative mb-3">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
                />
              </div>

              {/* Password Input */}
              <div className="relative mb-3">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>

              {/* Register Button */}
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
                onClick={handleRegister}
              >
                Đăng Ký
              </Button>

              {/* OR Divider */}
              <div className="my-3 text-center text-gray-500 text-xs md:text-sm">HOẶC</div>

              {/* Google & Facebook Login */}
              <div className="flex flex-col gap-2">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg py-2 flex items-center justify-center text-sm md:text-base">
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Tiếp tục với Google
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center text-sm md:text-base">
                  <FaFacebook className="w-5 h-5 mr-2" />
                  Tiếp tục với Facebook
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-3 text-center mb-3">
                <span className="text-gray-600 text-xs md:text-sm">Đã có tài khoản?</span>
                <button
                  className="text-blue-500 hover:text-green-500 text-xs md:text-sm ml-1"
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
