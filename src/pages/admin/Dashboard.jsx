import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/api/dashboardApi';
import { getStudents } from '@/api/studentApi';
import { getEnrollments } from '@/api/enrollmentApi';
import { getAllProgress } from '@/api/progressApi'; // Thêm import này
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Users,
  BookOpen,
  Activity,
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  Book,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEnrollments: 0,
    activeStudents: 0,
    onlineUsers: 0,
    totalRevenue: 0,
    averageCompletionRate: 0,
    recentEnrollments: [],
    coursePopularity: [],
  });
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [progresses, setProgresses] = useState([]); // Thêm state cho tiến trình
  const [loading, setLoading] = useState(true);

  // Dữ liệu mẫu cho biểu đồ LineChart
  const enrollmentData = [
    { name: 'T1', enrollments: 65 },
    { name: 'T2', enrollments: 78 },
    { name: 'T3', enrollments: 90 },
    { name: 'T4', enrollments: 85 },
    { name: 'T5', enrollments: 99 },
    { name: 'T6', enrollments: 105 },
  ];

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy danh sách học viên, đăng ký và tiến trình
        const [studentsResponse, enrollmentsResponse, progressResponse] = await Promise.all([
          getStudents(),
          getEnrollments(),
          getAllProgress(), // Gọi API để lấy tất cả tiến trình
        ]);

        // Kiểm tra dữ liệu học viên
        if (!Array.isArray(studentsResponse)) {
          throw new Error('Dữ liệu học viên không hợp lệ');
        }

        // Kiểm tra định dạng Guid cho Id của học viên
        studentsResponse.forEach((student) => {
          const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
          if (!guidRegex.test(student.id)) {
            console.warn(`ID học viên không hợp lệ: ${student.id}`);
          }
        });

        // Kiểm tra dữ liệu đăng ký
        if (!Array.isArray(enrollmentsResponse.data)) {
          throw new Error('Dữ liệu đăng ký không hợp lệ');
        }

        // Kiểm tra dữ liệu tiến trình
        if (!Array.isArray(progressResponse)) {
          throw new Error('Dữ liệu tiến trình không hợp lệ');
        }

        setStudents(studentsResponse);
        setEnrollments(enrollmentsResponse.data);
        setProgresses(progressResponse); // Lưu danh sách tiến trình
        setCourses([]); // Gán mảng rỗng vì getCourses bị chú thích

        console.log('Students:', studentsResponse);
        console.log('Enrollments:', enrollmentsResponse.data);
        console.log('Progresses:', progressResponse);
      } catch (error) {
        toast.error('Không thể tải dữ liệu học viên, đăng ký hoặc tiến trình');
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error('Không thể tải thông tin thống kê');
        console.error('Lỗi khi lấy thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchStats();
  }, []);

  // Tính số lượng học viên đã đăng ký khóa học
  const enrolledStudentsCount = [...new Set(enrollments.map((e) => e.UserId))].length;

  // Tính số lượng học viên đang học (dựa trên trạng thái 'in progress')
  const studyingStudentsCount = [...new Set(
      progresses
          .filter((p) => p.status.toLowerCase() === 'in progress') // Chuẩn hóa trạng thái
          .map((p) => p.userId)
  )].length;

  // Dữ liệu cho PieChart (phân bố khóa học)
  const coursePopularityData = courses.length > 0
      ? courses.map((course) => ({
        name: course.title,
        value: enrollments.filter((enrollment) => enrollment.CourseId === course.id).length,
      }))
      : [{ name: 'Không có dữ liệu', value: 1 }];

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
    );
  }

  return (
      <div className="p-6 space-y-6 w-[calc(1520px-250px)]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-500">Thống kê tổng quan</h1>
          <div className="text-sm text-gray-500">
            Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
          </div>
        </div>

        {/* Card Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Tổng số học viên */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Tổng số học viên</CardTitle>
              <Users className="h-6 w-6 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-gray-500">Tổng số học viên đã đăng ký</p>
            </CardContent>
          </Card>

          {/* Card Số lượng học viên đăng ký khóa học */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Học viên đăng ký khóa học</CardTitle>
              <BookOpen className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledStudentsCount}</div>
              <p className="text-xs text-gray-500">Số học viên đã đăng ký ít nhất một khóa học</p>
            </CardContent>
          </Card>

          {/* Card Số lượng học viên đang học */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Học viên đang học</CardTitle>
              <Book className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyingStudentsCount}</div>
              <p className="text-xs text-gray-500">Số học viên đang học (trạng thái in progress)</p>
            </CardContent>
          </Card>

          {/* Card Số lượng người online */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Đang online</CardTitle>
              <Activity className="h-6 w-6 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.onlineUsers}</div>
              <p className="text-xs text-gray-500">Số người dùng đang trực tuyến</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ đăng ký theo tháng */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Đăng ký theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="enrollments"
                        stroke="#FF6B6B"
                        strokeWidth={2}
                        dot={{ fill: '#FF6B6B', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Biểu đồ phân bố khóa học */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Phân bố khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {courses.length === 0 ? (
                    <p className="text-center text-gray-500">Không có dữ liệu khóa học</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                            data={coursePopularityData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            nameKey="name"
                        >
                          {coursePopularityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Doanh thu</CardTitle>
              <DollarSign className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    stats.totalRevenue
                )}
              </div>
              <p className="text-xs text-gray-500">Tổng doanh thu</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Tỷ lệ hoàn thành</CardTitle>
              <Award className="h-6 w-6 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCompletionRate}%</div>
              <p className="text-xs text-gray-500">Tỷ lệ hoàn thành trung bình</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">
                Thời gian học trung bình
              </CardTitle>
              <Clock className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-gray-500">Mỗi ngày</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Tăng trưởng</CardTitle>
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15%</div>
              <p className="text-xs text-gray-500">So với tháng trước</p>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Dashboard;