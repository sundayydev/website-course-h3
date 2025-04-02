import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/api/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Activity, TrendingUp, DollarSign, Clock, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
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
    coursePopularity: []
  });
  const [loading, setLoading] = useState(true);

  // Dữ liệu mẫu cho biểu đồ
  const enrollmentData = [
    { name: 'T1', enrollments: 65 },
    { name: 'T2', enrollments: 78 },
    { name: 'T3', enrollments: 90 },
    { name: 'T4', enrollments: 85 },
    { name: 'T5', enrollments: 99 },
    { name: 'T6', enrollments: 105 },
  ];

  const courseData = [
    { name: 'React', value: 35 },
    { name: 'Node.js', value: 25 },
    { name: 'Python', value: 20 },
    { name: 'Java', value: 15 },
    { name: 'Khác', value: 5 },
  ];

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error('Không thể tải thông tin thống kê');
        console.error('Lỗi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
            <CardTitle className="text-lg font-medium text-gray-500">
              Tổng số học viên
            </CardTitle>
            <Users className="h-6 w-6 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500">
              Tổng số học viên đã đăng ký
            </p>
          </CardContent>
        </Card>

        {/* Card Số lượng đăng ký khóa học */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Đăng ký khóa học
            </CardTitle>
            <BookOpen className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-gray-500">
              Tổng số lượt đăng ký khóa học
            </p>
          </CardContent>
        </Card>

        {/* Card Số lượng đang học */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Đang học
            </CardTitle>
            <GraduationCap className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
            <p className="text-xs text-gray-500">
              Số học viên đang tham gia học tập
            </p>
          </CardContent>
        </Card>

        {/* Card Số lượng người online */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Đang online
            </CardTitle>
            <Activity className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onlineUsers}</div>
            <p className="text-xs text-gray-500">
              Số người dùng đang trực tuyến
            </p>
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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Doanh thu
            </CardTitle>
            <DollarSign className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
            </div>
            <p className="text-xs text-gray-500">
              Tổng doanh thu
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Tỷ lệ hoàn thành
            </CardTitle>
            <Award className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCompletionRate}%</div>
            <p className="text-xs text-gray-500">
              Tỷ lệ hoàn thành trung bình
            </p>
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
            <p className="text-xs text-gray-500">
              Mỗi ngày
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Tăng trưởng
            </CardTitle>
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-gray-500">
              So với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
