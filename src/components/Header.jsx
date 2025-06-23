import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import LogoH3 from '../assets/LogoH3.png';
import { FaSearch } from 'react-icons/fa';
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
import { logout, setUser, setIsLoggedIn, setToken, refreshHome } from '@/reducers/authReducer';
import { forgotPassword, login, register, resetPassword, getUserProfile, logout as logoutApi } from '../api/authApi';
import CoursePopup from './Popup/CoursePopup';
import { Bell, Trash2 } from 'lucide-react';
import { getNotificationsByUser, deleteNotification, markNotificationAsRead } from '@/api/notificationApi';
import { format, parse } from 'date-fns';
import { setNotifications, markNotificationAsRead as markNotificationAsReadAction, deleteNotification as deleteNotificationAction } from '@/reducers/notificationReducer';
import { getCommentById } from '@/api/commentApi';
import { getOrderById } from '../api/orderApi';
import LoginPopup from './Popup/LoginPopup';
import RegisterPopup from './Popup/RegisterPopup';
import ForgotPasswordPopup from './Popup/ForgotPasswordPopup';
import ResetPasswordPopup from './Popup/ResetPasswordPopup';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.notifications);
  const notificationTrigger = useSelector((state) => state.notifications.notificationTrigger || 0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ fullName: '', email: '', password: '' });
  const [resetPasswordData, setResetPasswordData] = useState({ email: '', resetCode: '', newPassword: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ courses: [], posts: [] });
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const togglePopup = () => setPopupOpen(!isPopupOpen);
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const forgotPasswordRef = useRef(null);
  const searchRef = useRef(null);

  // Lấy thông tin người dùng khi component mount
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

  const fetchNotifications = async () => {
    if (isLoggedIn && user?.id) {
      try {
        const response = await getNotificationsByUser(user.id);
        dispatch(setNotifications(response));
      } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();

    const intervalId = setInterval(() => {
      if (isLoggedIn && user?.id) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, user?.id, notificationTrigger, dispatch]);

  // Xử lý click ngoài để đóng các popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target))
        setIsLoginOpen(false);
      if (registerRef.current && !registerRef.current.contains(event.target))
        setIsRegisterOpen(false);
      if (
        forgotPasswordRef.current &&
        !forgotPasswordRef.current.contains(event.target)
      )
        setIsForgotPasswordOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target))
        setIsSearchDropdownOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tìm kiếm sản phẩm
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
      setSearchResults({ courses: [], posts: [] });
      setIsSearchDropdownOpen(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search với độ trễ 0.5 giây
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

  const handleNotificationClick = async (notification) => {
    const entityId = notification.relatedEntityId;
    const entityType = notification.relatedEntityType;

    try {
      if (entityType === 'Comment' && entityId) {
        const commentResponse = await getCommentById(entityId);
        const postId = commentResponse?.postId;

        if (postId) {
          navigate(`/detailspost/${postId}`);
        } else {
          toast.error('Không thể điều hướng: Không tìm thấy bài viết!');
        }
      } else if (entityType === 'Course' && entityId) {
        navigate(`/details/${entityId}`);
      } else if (entityType === 'Review' && entityId) {
        navigate(`/details/${entityId}`);
      } else if (entityType === 'Order' && entityId) {
        const orderResponse = await getOrderById(entityId);
        const courseId = orderResponse.orderDetails?.[0]?.courseId;
        if (courseId) {
          navigate(`/details/${courseId}`);
        } else {
          toast.error('Không thể điều hướng: Không tìm thấy khóa học liên quan!');
        }
      } else {
        toast.error('Không thể điều hướng: Thông tin không hợp lệ!');
      }
    } catch (error) {
      toast.error('Không thể điều hướng: Lỗi khi lấy dữ liệu!');
    }
    setIsNotificationsOpen(false);
  };

  // Xử lý đăng nhập
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    try {
      const response = await login(loginData);
      const { token, email, role } = response.data;
      localStorage.setItem('authToken', token);
      window.dispatchEvent(new Event('authTokenChanged'));
      const userResponse = await getUserProfile();
      if (userResponse.data) {
        dispatch(setUser({ ...userResponse.data, email, role }));
        dispatch(setIsLoggedIn(true));
        dispatch(setToken(token));
        localStorage.setItem('user', JSON.stringify({ ...userResponse.data, email, role }));
        setIsLoginOpen(false);
        toast.success('Đăng nhập thành công!');
        navigate('/');
        dispatch(refreshHome());
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại!';
      toast.error(errorMessage);
    }
  };

  // Xử lý đăng ký
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

  // Xử lý quên mật khẩu
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

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (!resetPasswordData.email || !resetPasswordData.resetCode || !resetPasswordData.newPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(resetPasswordData.email, resetPasswordData.resetCode, resetPasswordData.newPassword);
      toast.success('Mật khẩu đã được đặt lại thành công!');
      setResetPasswordData({ email: '', resetCode: '', newPassword: '' }); // Clear resetPasswordData
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

  // Xử lý đăng xuất
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

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      dispatch(deleteNotificationAction(notificationId));
      toast.success('Xóa thông báo thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
      toast.error('Không thể xóa thông báo!');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const userId = user?.id;
      if (!userId) {
        throw new Error('Không tìm thấy ID người dùng');
      }
      await markNotificationAsRead(notificationId, userId);
      dispatch(markNotificationAsReadAction({ notificationId, userId }));
      toast.success('Đã đánh dấu thông báo là đã đọc!');
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo:', error.response?.data || error);
      toast.error(
        error.response?.data?.message || error.message || 'Không thể đánh dấu thông báo!'
      );
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md relative">
      {/* Logo */}
      <h1 className="flex items-center space-x-2">
        <a href="/" className="rounded-lg">
          <img className="rounded-lg" src={LogoH3} alt="Logo H3" width={38} height={38} />
        </a>
        <a className="font-semibold text-base text-black hover:text-emerald-600 hidden md:block" href="/">
          Học Lập Trình Cùng H3
        </a>
      </h1>

      {/* Search Bar */}
      <div className="relative flex-1 md:max-w-lg mx-4" ref={searchRef}>
        <input
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết, video, ..."
          className="w-full px-4 py-2 pl-10 border font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
                {/* Courses Section */}
                {searchResults.courses.length > 0 && (
                  <div className="p-4 border-b">
                    <h4 className="font-semibold text-gray-700 mb-3">KHÓA HỌC</h4>
                    {searchResults.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-200"
                        onClick={() => {
                          navigate(`/details/${course.id}`);
                          setIsSearchDropdownOpen(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800">{course.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Posts Section */}
                {searchResults.posts.length > 0 && (
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">BÀI VIẾT</h4>
                    {searchResults.posts.map((post) => (
                      <div
                        key={post.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-200"
                        onClick={() => {
                          navigate(`/detailspost/${post.id}`);
                          setIsSearchDropdownOpen(false);
                        }}
                      >
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <span className="truncate text-gray-800">{post.title}</span>
                          <span className="text-sm text-gray-500 text-right">{post.user?.fullName || 'Ẩn danh'}</span>
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
        {isLoggedIn && (
          <div className="relative" ref={notificationRef}>
            <button
              className="p-2 relative"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="h-6 w-6 text-gray-600 hover:text-emerald-500" />
              {notifications.some((n) => n.userNotifications.some((un) => !un.isRead && un.userId === user.id)) && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500 text-center">Không có thông báo</p>
                ) : (
                  [...notifications]
                    .sort((a, b) => {
                      const dateA = a.createdAt
                        ? parse(a.createdAt, "dd-MM-yyyy HH:mm:ss", new Date())
                        : new Date(0);
                      const dateB = b.createdAt
                        ? parse(b.createdAt, "dd-MM-yyyy HH:mm:ss", new Date())
                        : new Date(0);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .map((notification) => {
                      const userNotification = notification.userNotifications.find(un => un.userId === user.id);
                      if (!userNotification) return null;

                      return (
                        <div
                          key={notification.id}
                          className={`p-3 border-b flex justify-between items-center ${!userNotification.isRead ? 'bg-gray-50' : ''
                            } cursor-pointer hover:bg-gray-100`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex-1">
                            <p
                              className="text-sm font-semibold overflow-hidden"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {notification.content}
                            </p>

                            <div className="flex justify-between items-center text-xs text-gray-500 gap-2 mt-1">
                              <span>
                                {notification.createdAt
                                  ? (() => {
                                    try {
                                      const parsedDate = parse(
                                        notification.createdAt,
                                        "dd-MM-yyyy HH:mm:ss",
                                        new Date()
                                      );
                                      return isNaN(parsedDate.getTime())
                                        ? "Ngày không hợp lệ"
                                        : format(parsedDate, "dd/MM/yyyy HH:mm:ss");
                                    } catch (error) {
                                      return "Ngày không hợp lệ";
                                    }
                                  })()
                                  : "Ngày không hợp lệ"}
                              </span>
                              <span>{userNotification.isRead ? 'Đã đọc' : 'Chưa đọc'}</span>
                            </div>

                            {!userNotification.isRead && (
                              <button
                                className="text-blue-500 hover:text-blue-700 text-xs mt-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                              >
                                Đánh dấu đã đọc
                              </button>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                    .filter(Boolean)
                )}
              </div>
            )}
          </div>
        )}
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
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full font-semibold"
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
                  {isUserLoading ? (
                    '?'
                  ) : user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="User Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user?.fullName?.charAt(0).toUpperCase() || 'U'
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-2 shadow-lg rounded-2xl m-4">
                {isUserLoading ? (
                  <div className="p-3 text-center bg-gray-500">Đang tải...</div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 ">
                      <Avatar>
                        <AvatarImage src={user?.profileImage || LogoH3} alt="User Avatar" className="object-cover" />
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
                      onClick={() => navigate('/write-blog')}>
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

      {/* Popups */}
      <LoginPopup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        loginData={loginData}
        setLoginData={setLoginData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleLogin={handleLogin}
        openRegister={() => {
          setIsRegisterOpen(true);
          setIsLoginOpen(false);
        }}
        openForgotPassword={() => {
          setIsForgotPasswordOpen(true);
          setIsLoginOpen(false);
        }}
        loginRef={loginRef}
      />
      <RegisterPopup
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        registerData={registerData}
        setRegisterData={setRegisterData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleRegister={handleRegister}
        openLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
        registerRef={registerRef}
      />
      <ForgotPasswordPopup
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        forgotEmail={forgotEmail}
        setForgotEmail={setForgotEmail}
        handleForgotPassword={handleForgotPassword}
        forgotPasswordRef={forgotPasswordRef}
      />
      <ResetPasswordPopup
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        resetPasswordData={resetPasswordData}
        setResetPasswordData={setResetPasswordData}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        handleResetPassword={handleResetPassword}
        loading={loading}
      />
    </header>
  );
};

export default Header;