import { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  Bell,
  Search,
  Trash2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getNotificationsByUser, markNotificationAsRead, deleteNotification } from '@/api/notificationApi';
import { getUserId } from '@/api/authUtils';
import { formatDate } from '@/utils/formatDate';
import { toast } from 'react-toastify';
import { setNotifications, markNotificationAsRead as markNotificationAsReadAction, deleteNotification as deleteNotificationAction } from '@/reducers/notificationReducer';
import { getCommentById } from '@/api/commentApi';
import { parse, format } from 'date-fns';
import { getCourseByInstructorId } from '@/api/courseApi';
import { getEnrollmentsByCourseId } from '@/api/enrollmentApi';
import { getReviewsByCourseId } from '@/api/reviewApi';

// Progress Bar Component
const ProgressBar = ({ completed, total }) => {
  const percentage = Math.round((completed / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`p-6 rounded-lg shadow flex items-start ${bgColor}`}>
      <div className="mr-4 p-3 rounded-full bg-white bg-opacity-30">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default function InstructorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((state) => state.notifications.notifications || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userId = getUserId();
  
  // New state for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalClasses: 0,
    completionRate: 0,
    courses: [],
    studentPerformance: [],
    upcomingClasses: []
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const instructorId = getUserId();
      const courses = await getCourseByInstructorId(instructorId);
      
      let totalStudents = 0;
      let totalCompleted = 0;
      let totalLessons = 0;
      const courseDetails = [];

      for (const course of courses) {
        const enrollments = await getEnrollmentsByCourseId(course.id);
        const reviews = await getReviewsByCourseId(course.id);
        
        totalStudents += enrollments.length;
        
        // Calculate completion rate
        const completedLessons = enrollments.reduce((acc, enrollment) => {
          return acc + (enrollment.completedLessons || 0);
        }, 0);
        
        totalCompleted += completedLessons;
        totalLessons += course.contents?.length || 0;

        courseDetails.push({
          id: course.id,
          title: course.title,
          students: enrollments.length,
          completed: completedLessons,
          total: course.contents?.length || 0,
          rating: reviews.reduce((acc, review) => acc + review.rating, 0) / (reviews.length || 1)
        });
      }

      // Calculate student performance data
      const performanceData = courseDetails.map(course => ({
        name: course.title,
        average: Math.round(course.rating * 20) // Convert 5-star rating to percentage
      }));

      setDashboardData({
        totalStudents,
        totalCourses: courses.length,
        totalClasses: totalLessons,
        completionRate: totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0,
        courses: courseDetails,
        studentPerformance: performanceData,
        upcomingClasses: courses.slice(0, 3).map(course => ({
          id: course.id,
          title: course.title,
          time: '09:00 AM - 11:00 AM', // This would need to come from a schedule API
          date: 'Hôm nay',
          students: courseDetails.find(c => c.id === course.id)?.students || 0,
          room: 'Online'
        }))
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (userId) {
      try {
        const response = await getNotificationsByUser(userId);
        dispatch(setNotifications(response || []));
        setIsLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy thông báo:', err);
        setError(err.message || 'Không thể tải thông báo');
        setIsLoading(false);
        toast.error('Không thể tải thông báo. Vui lòng thử lại!');
      }
    } else {
      setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
      setIsLoading(false);
      toast.error('Vui lòng đăng nhập để xem thông báo!');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
    
    const intervalId = setInterval(() => {
      if (userId) {
        fetchNotifications();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [userId, dispatch]);

  // Notification handlers
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
      } else {
        toast.error('Không thể điều hướng: Thông tin không hợp lệ!');
      }
    } catch (error) {
      toast.error('Không thể điều hướng: Lỗi khi lấy dữ liệu!');
    }
    setIsNotificationsOpen(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      if (!userId) {
        throw new Error('Không tìm thấy ID người dùng');
      }
      await markNotificationAsRead(notificationId, userId);
      dispatch(markNotificationAsReadAction({ notificationId, userId }));
      toast.success('Đã đánh dấu thông báo là đã đọc!');
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo:', error.response?.data || error);
      toast.error(error.response?.data?.message || error.message || 'Không thể đánh dấu thông báo!');
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center rounded-lg bg-gray-100 px-3 py-2 w-64">
            <Search size={20} className="text-gray-500" />
            <input
              className="ml-2 bg-transparent outline-none flex-1"
              type="text"
              placeholder="Tìm kiếm..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="relative p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell size={20} />
                {notifications.some((n) => n.userNotifications.some((un) => !un.isRead && un.userId === userId)) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
                        const userNotification = notification.userNotifications.find((un) => un.userId === userId);
                        if (!userNotification) return null;

                        return (
                          <div
                            key={notification.id}
                            className={`p-3 border-b flex justify-between items-center ${!userNotification.isRead ? 'bg-gray-50' : ''} cursor-pointer hover:bg-gray-100`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-semibold overflow-hidden" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}>
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
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span className="font-medium">Giảng viên</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan hoạt động của bạn.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<Users size={24} className="text-blue-700" />}
            title="Tổng sinh viên"
            value={dashboardData.totalStudents}
            bgColor="bg-blue-600"
          />
          <StatCard
            icon={<BookOpen size={24} className="text-green-700" />}
            title="Khóa học"
            value={dashboardData.totalCourses}
            bgColor="bg-green-600"
          />
          <StatCard
            icon={<Calendar size={24} className="text-purple-700" />}
            title="Buổi học"
            value={dashboardData.totalClasses}
            bgColor="bg-purple-600"
          />
          <StatCard
            icon={<BarChart3 size={24} className="text-orange-700" />}
            title="Tỉ lệ hoàn thành"
            value={`${dashboardData.completionRate}%`}
            bgColor="bg-orange-600"
          />
        </div>

        {/* Charts & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Student Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Hiệu suất trung bình của sinh viên
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.studentPerformance}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">Thông báo mới nhất</h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <p className="text-center text-gray-500">Đang tải thông báo...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : notifications.length === 0 ? (
                <p className="text-center text-gray-500">Chưa có thông báo nào.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div
                        className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                          notification.userNotifications?.[0]?.isRead
                            ? 'bg-gray-400'
                            : 'bg-blue-500'
                        }`}
                      ></div>
                      <div className="ml-3">
                        <p
                          className={`text-sm ${
                            notification.userNotifications?.[0]?.isRead
                              ? 'text-gray-500'
                              : 'text-gray-800'
                          }`}
                        >
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t text-center">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Xem tất cả thông báo
              </a>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-800">Lịch giảng dạy sắp tới</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sinh viên
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.upcomingClasses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.room}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t text-center">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Xem lịch đầy đủ
            </a>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-800">Tiến độ khóa học</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên khóa học
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Sinh viên
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                    Tiến độ
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Hoàn thành
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-64">
                      <ProgressBar completed={course.completed} total={course.total} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round((course.completed / course.total) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t text-center">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Xem tất cả khóa học
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}