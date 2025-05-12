import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import LogoH3 from '../assets/LogoH3.png';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaSearch, FaFacebook, FaUser, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser, setIsLoggedIn, setToken } from '@/reducers/authReducer';
import { forgotPassword, login, register, resetPassword, getUserProfile, logout as logoutApi } from '../api/authApi';
import CoursePopup from './CoursePopup';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // State for form data
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ fullName: '', email: '', password: '' });
  const [resetPasswordData, setResetPasswordData] = useState({ email: '', resetCode: '', newPassword: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ courses: [], posts: [] });
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // User loading state
  const [isUserLoading, setIsUserLoading] = useState(false);

  const togglePopup = () => setPopupOpen(!isPopupOpen);
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const forgotPasswordRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsUserLoading(true);
        try {
          const userResponse = await getUserProfile();
          if (userResponse.data) {
            dispatch(setUser(userResponse.data));
            dispatch(setIsLoggedIn(true));
            dispatch(setToken(token));
            localStorage.setItem('user', JSON.stringify(userResponse.data));
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch(logout());
        } finally {
          setIsUserLoading(false);
        }
      }
    };
    fetchUserData();
  }, [dispatch]);

  // Axios interceptor for auth token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  // Handle click outside to close modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) setIsLoginOpen(false);
      if (registerRef.current && !registerRef.current.contains(event.target)) setIsRegisterOpen(false);
      if (forgotPasswordRef.current && !forgotPasswordRef.current.contains(event.target)) setIsForgotPasswordOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults({ courses: [], posts: [] });
      setIsSearchDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/search/all`, {
        params: { keyword: searchQuery },
      });

      const courses = response.data.courses || [];
      const posts = response.data.posts || [];

      setSearchResults({
        courses: courses.slice(0, 5),
        posts: posts.slice(0, 5),
      });
      setIsSearchDropdownOpen(true);
    } catch (error) {
      console.error('Search Error:', error);
      toast.error('Không thể tìm kiếm, vui lòng thử lại!');
      setSearchResults({ courses: [], posts: [] });
      setIsSearchDropdownOpen(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search with 0.5-second delay
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setIsSearchDropdownOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle login
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }
    try {
      const response = await login(loginData);
      const { token, email, role } = response.data;
      localStorage.setItem('authToken', token);
      const userResponse = await getUserProfile();
      if (userResponse.data) {
        dispatch(setUser({ ...userResponse.data, email, role }));
        dispatch(setIsLoggedIn(true));
        dispatch(setToken(token));
        localStorage.setItem('user', JSON.stringify({ ...userResponse.data, email, role }));
        setIsLoginOpen(false);
        toast.success('Đăng nhập thành công!');
        navigate('/');
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  // Handle register
  const handleRegister = async () => {
    if (!registerData.fullName || !registerData.email || !registerData.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      await register(registerData);
      toast.success('Đăng ký thành công, vui lòng đăng nhập!');
      setIsRegisterOpen(false);
      setIsLoginOpen(true);
    } catch (error) {
      console.error('Register Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error('Vui lòng nhập email!');
      return;
    }
    try {
      await forgotPassword(forgotEmail);
      toast.success('Mã OTP đã được gửi qua email thành công!');
      setIsForgotPasswordOpen(false);
      setResetPasswordData({ ...resetPasswordData, email: forgotEmail });
      setIsResetPasswordOpen(true);
    } catch (error) {
      console.error('Forgot Password Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Email không tồn tại hoặc có lỗi xảy ra!');
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!resetPasswordData.email || !resetPasswordData.resetCode || !resetPasswordData.newPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(resetPasswordData.email, resetPasswordData.resetCode, resetPasswordData.newPassword);
      toast.success('Mật khẩu đã được đặt lại thành công!');
      setTimeout(() => {
        setIsResetPasswordOpen(false);
        setIsLoginOpen(true);
      }, 2000);
    } catch (error) {
      console.error('Reset Password Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Lỗi đặt lại mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      toast.success('Đăng xuất thành công!');
      dispatch(logout());
      dispatch(setUser(null));
      dispatch(setIsLoggedIn(false));
      dispatch(setToken(null));
      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Đăng xuất thất bại!');
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md relative">
      {/* Logo */}
      <h1 className="flex items-center space-x-2">
        <a href="/" className="rounded-lg">
          <img className="rounded-lg" src={LogoH3} alt="Logo H3" width={38} height={38} />
        </a>
        <a className="font-semibold text-base text-black hover:text-pink-600 hidden md:block" href="/">
          Học Lập Trình Cùng H3
        </a>
      </h1>

      {/* Search Bar */}
      <div className="relative flex-1 md:max-w-lg mx-4" ref={searchRef}>
        <input
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết, video, ..."
          className="w-full px-4 py-2 pl-10 border font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
        />

        {/* Search Dropdown */}
        {isSearchDropdownOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 z-50 max-h-96 overflow-y-auto">
            {isSearching ? (
              <p className="p-4 text-gray-500">Đang tải...</p>
            ) : searchResults.courses.length === 0 && searchResults.posts.length === 0 ? (
              <p className="p-4 text-gray-500">Không tìm thấy kết quả</p>
            ) : (
              <>
                {/* Courses */}
                {searchResults.courses.length > 0 && (
                  <div className="p-2">
                    <h4 className="font-semibold text-gray-700">KHÓA HỌC</h4>
                    {searchResults.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(`/details/${course.id}`);
                          setIsSearchDropdownOpen(false);
                        }}
                      >
                        <div className="flex justify-between">
                          <span>{course.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Posts */}
                {searchResults.posts.length > 0 && (
                  <div className="p-2">
                    <h4 className="font-semibold text-gray-700">BÀI VIẾT</h4>
                    {searchResults.posts.map((post) => (
                      <div
                        key={post.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(`/detailspost/${post.id}`);
                          setIsSearchDropdownOpen(false);
                        }}
                      >
                        <div className="flex justify-between">
                          <span>{post.title}</span>
                          <span className="text-gray-500">{post.user?.fullName || 'Ẩn danh'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* User Actions */}
      <div className="flex items-center justify-between space-x-4">
        <div>
          <button className="p-3" onClick={togglePopup}>
            Khóa học của tôi
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {!isLoggedIn && (
            <>
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
            </>
          )}
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold shadow-xl hover:bg-blue-800">
                  {isUserLoading ? '?' : user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-2 shadow-lg rounded-2xl m-4">
                {isUserLoading ? (
                  <div className="p-3 text-center text-gray-500">Đang tải...</div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.profileImage || LogoH3} alt="User Avatar" />
                        <AvatarFallback className="bg-blue-500 text-white font-bold">
                          {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user?.fullName || 'Người dùng'}</p>
                        <p className="text-gray-500 text-sm break-words">{user?.email || 'email'}</p>
                      </div>
                    </div>
                    <hr />
                    <DropdownMenuItem
                      className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => navigate('/profile')}
                    >
                      Trang cá nhân
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => navigate('/write-blog')}
                    >
                      Viết blog
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => navigate('/my-posts')}
                    >
                      Bài viết của tôi
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => navigate('/saved-posts')}
                    >
                      Bài viết đã lưu
                    </DropdownMenuItem>
                    <hr />
                    <DropdownMenuItem
                      className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => navigate('/settings')}
                    >
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-red-500"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Popup khóa học */}
      <CoursePopup isOpen={isPopupOpen} onClose={togglePopup} />

      {/* Popup Login */}
      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative h-[500px] md:h-[550px]" ref={loginRef}>
            <div className="flex justify-center mb-4 mt-4">
              <img src={LogoH3} alt="Logo H3" className="h-10 rounded-lg" />
            </div>
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
              <div className="flex justify-between items-center mb-4 text-xs md:text-sm">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-1" />
                  <label htmlFor="remember" className="text-gray-900">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <button
                  className="text-blue-500 hover:text-red-500"
                  onClick={() => {
                    setIsForgotPasswordOpen(true);
                    setIsLoginOpen(false);
                  }}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
                onClick={handleLogin}
              >
                Đăng nhập
              </Button>
              <div className="my-3 text-center text-gray-500 text-xs md:text-sm">HOẶC</div>
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
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative h-[500px] md:h-[550px]" ref={registerRef}>
            <div className="flex justify-center mb-4 mt-4">
              <img src={LogoH3} alt="Logo H3" className="h-10 rounded-lg" />
            </div>
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
              <div className="relative mb-3">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={registerData.fullName}
                  required
                  placeholder="Nhập họ và tên"
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
                />
              </div>
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
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
                onClick={handleRegister}
              >
                Đăng Ký
              </Button>
              <div className="my-3 text-center text-gray-500 text-xs md:text-sm">HOẶC</div>
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

      {/* Popup Forgot Password */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={forgotPasswordRef} className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setIsForgotPasswordOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-center text-lg font-bold text-gray-700 mb-3">Quên Mật Khẩu</h3>
            <div className="relative mb-3">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Nhập email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <Button
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
              onClick={handleForgotPassword}
            >
              Gửi Yêu Cầu
            </Button>
          </div>
        </div>
      )}

      {/* Popup Reset Password */}
      {isResetPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setIsResetPasswordOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-center text-lg font-bold text-gray-700 mb-3">Đặt Lại Mật Khẩu</h3>
            <div className="relative mb-3">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Nhập email"
                value={resetPasswordData.email}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, email: e.target.value })}
                className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="relative mb-3">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập mã xác nhận"
                value={resetPasswordData.resetCode}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, resetCode: e.target.value })}
                className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="relative mb-3">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu mới"
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
            <Button
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận đặt lại mật khẩu'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;