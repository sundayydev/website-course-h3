import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/api/dashboardApi';
import { getStudents } from '@/api/studentApi';
import { getEnrollments } from '@/api/enrollmentApi';
import { getAllProgress } from '@/api/progressApi';
import { getPaymentsByCourseId } from '@/api/paymentApi';
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
  Legend,
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
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm xử lý dữ liệu đăng ký theo tháng
  const getEnrollmentDataByMonth = (enrollments) => {
    const monthlyCounts = {};

    enrollments.forEach((enrollment) => {
      const date = new Date(enrollment.createdAt);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    return Object.keys(monthlyCounts)
      .sort((a, b) => {
        const [monthA, yearA] = a.split('-').map(Number);
        const [monthB, yearB] = b.split('-').map(Number);
        if (yearA !== yearB) {
          return yearA - yearB;
        }
        return monthA - monthB;
      })
      .map((key) => ({
        name: `T${key.split('-')[0]}`,
        enrollments: monthlyCounts[key],
      }));
  };

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, enrollmentsResponse, progressResponse] = await Promise.all([
          getStudents(),
          getEnrollments(),
          getAllProgress(),
        ]);

        if (!Array.isArray(studentsResponse)) {
          throw new Error('Dữ liệu học viên không hợp lệ');
        }

        studentsResponse.forEach((student) => {
          const guidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
          if (!guidRegex.test(student.id)) {
            console.warn(`ID học viên không hợp lệ: ${student.id}`);
          }
        });

        if (!Array.isArray(enrollmentsResponse.data)) {
          console.error('Dữ liệu đăng ký không phải mảng:', enrollmentsResponse.data);
          throw new Error('Dữ liệu đăng ký không hợp lệ');
        }

        setStudents(studentsResponse);
        setEnrollments(enrollmentsResponse.data);
        setProgresses(progressResponse);
        setCourses([]); // Giả sử chưa có API lấy khóa học

        // Tính tổng doanh thu từ thanh toán
        let totalRevenue = 0;
        const courseIds = [...new Set(enrollmentsResponse.data.map((e) => e.courseId))];
        for (const courseId of courseIds) {
          try {
            const payments = await getPaymentsByCourseId(courseId);
            if (Array.isArray(payments)) {
              totalRevenue += payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
            }
          } catch (error) {
            console.warn(`Không thể lấy thanh toán cho khóa học ${courseId}:`, error);
          }
        }

        setStats((prev) => ({ ...prev, totalRevenue }));
      } catch (error) {
        toast.error('Không thể tải dữ liệu học viên, đăng ký hoặc tiến trình');
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats((prev) => ({ ...prev, ...data, totalRevenue: prev.totalRevenue }));
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
  const enrolledStudentsCount = [...new Set(enrollments.map((e) => e.userId))].length;

  // Tính số lượng học viên đang học (dựa trên trạng thái 'in progress')
  // Tính số lượng học viên đang học (dựa trên trạng thái 'in progress')
  const studyingStudentsCount = [
    ...new Set(
      progresses.filter((p) => p.status.toLowerCase() === 'in progress').map((p) => p.userId)
    ),
  ].length;
  // Dữ liệu cho PieChart (phân bố khóa học)
  const coursePopularityData =
    enrollments.length > 0
      ? Object.entries(
          enrollments.reduce((acc, enrollment) => {
            const courseId = enrollment.courseId;
            acc[courseId] = (acc[courseId] || 0) + 1;
            return acc;
          }, {})
        ).map(([courseId, count]) => ({
          name: `Khóa học ${courseId}`,
          value: count,
        }))
      : [{ name: 'Không có dữ liệu', value: 1 }];

  // Tính phần trăm cho nhãn
  const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(1)}%`;
  };

  // Dữ liệu cho LineChart (đăng ký theo tháng)
  const enrollmentData = getEnrollmentDataByMonth(enrollments);

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

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Học viên đăng ký khóa học
            </CardTitle>
            <BookOpen className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledStudentsCount}</div>
            <p className="text-xs text-gray-500">Số học viên đã đăng ký ít nhất một khóa học</p>
          </CardContent>
        </Card>

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
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Đăng ký theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {enrollmentData.length === 0 ? (
                <p className="text-center text-gray-500">Không có dữ liệu đăng ký</p>
              ) : (
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
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Phân bố khóa học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {coursePopularityData.length === 1 &&
              coursePopularityData[0].name === 'Không có dữ liệu' ? (
                <p className="text-center text-gray-500">Không có dữ liệu khóa học</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={coursePopularityData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                    >
                      {coursePopularityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
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
            <p className="text-xs text-gray-500">Tổng doanh thu từ các giao dịch</p>
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
