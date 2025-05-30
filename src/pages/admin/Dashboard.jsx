import { useEffect, useState } from 'react';
import { getStudents } from '@/api/studentApi';
import { getEnrollments } from '@/api/enrollmentApi';
import { getAllProgress } from '@/api/progressApi';
import { getComments } from '@/api/commentApi';
import { getCourses } from '@/api/courseApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, BookOpen, MessageSquare, PlusCircle } from 'lucide-react';
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
import { parse, isWithinInterval, startOfWeek, endOfWeek, format, startOfDay, endOfDay } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    commentsToday: 0,
    newCourses: 0,
    totalEnrollments: 0,
  });
  const [enrollments, setEnrollments] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [comments, setComments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Xử lý dữ liệu đăng ký theo tháng
  const getEnrollmentDataByMonth = (enrollments) => {
    const monthlyCounts = {};
    enrollments.forEach((enrollment) => {
      try {
        const parsedDate = parse(enrollment.createdAt, 'dd-MM-yyyy HH:mm:ss', new Date());
        if (isNaN(parsedDate.getTime())) {
          console.warn(`Ngày không hợp lệ trong đăng ký: ${enrollment.createdAt}`);
          return;
        }
        const monthYear = format(parsedDate, 'MMM yyyy');
        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
      } catch (e) {
        console.warn(`Lỗi phân tích ngày trong đăng ký: ${enrollment.createdAt}`, e);
      }
    });
    return Object.entries(monthlyCounts)
      .sort()
      .map(([name, enrollments]) => ({ name, enrollments }));
  };

  // Tính số bài học hoàn thành trong tuần
  const getWeeklyCompletedLessons = (progresses) => {
    const today = new Date();
    return progresses.filter((progress) => {
      if (progress.status.toLowerCase() !== 'completed') return false;
      try {
        const progressDate = parse(progress.createdAt, 'dd-MM-yyyy HH:mm:ss', new Date());
        if (isNaN(progressDate.getTime())) {
          console.warn(`Ngày không hợp lệ trong tiến độ: ${progress.createdAt}`);
          return false;
        }
        return isWithinInterval(progressDate, {
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 }),
        });
      } catch (e) {
        console.warn(`Lỗi phân tích ngày trong tiến độ: ${progress.createdAt}`, e);
        return false;
      }
    }).length;
  };

  // Tính số bình luận hôm nay
  const getCommentsToday = (comments) => {
    const today = new Date();
    return comments.filter((comment) => {
      try {
        const commentDate = parse(comment.createdAt, 'dd-MM-yyyy HH:mm:ss', new Date());
        if (isNaN(commentDate.getTime())) {
          console.warn(`Ngày không hợp lệ trong bình luận: ${comment.createdAt}`);
          return false;
        }
        return isWithinInterval(commentDate, {
          start: startOfDay(today),
          end: endOfDay(today),
        });
      } catch (e) {
        console.warn(`Lỗi phân tích ngày trong bình luận: ${comment.createdAt}`, e);
        return false;
      }
    }).length;
  };

  // Tính số khóa học mới trong 30 ngày (dùng cho thẻ thống kê)
  const getNewCourses = (courses) => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    return courses.filter((course) => {
      try {
        const courseDate = parse(course.createdAt, 'dd-MM-yyyy HH:mm:ss', new Date());
        if (isNaN(courseDate.getTime())) {
          console.warn(`Ngày không hợp lệ trong khóa học: ${course.createdAt}`);
          return false;
        }
        return courseDate >= thirtyDaysAgo;
      } catch (e) {
        console.warn(`Lỗi phân tích ngày trong khóa học: ${course.createdAt}`, e);
        return false;
      }
    }).length;
  };

  // Lấy các khóa học mới trong 7 ngày qua cho biểu đồ
  const getNewCoursesLast7Days = (courses) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
    const newCourses = courses.filter((course) => {
      try {
        const courseDate = parse(course.createdAt, 'dd-MM-yyyy HH:mm:ss', new Date());
        if (isNaN(courseDate.getTime())) {
          console.warn(`Ngày không hợp lệ trong khóa học: ${course.createdAt}`);
          return false;
        }
        return courseDate >= sevenDaysAgo;
      } catch (e) {
        console.warn(`Lỗi phân tích ngày trong khóa học: ${course.createdAt}`, e);
        return false;
      }
    });

    return newCourses.length > 0
      ? newCourses.map((course) => ({
        name: course.title || `Khóa học ${course.id}`,
        value: 1,
      }))
      : [{ name: 'Không có khóa học mới', value: 1 }];
  };

  // Màu sắc cho biểu đồ
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];

  // Nhãn tùy chỉnh cho biểu đồ tròn
  const renderCustomizedLabel = ({ name, percent, cx, cy, midAngle, outerRadius }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, enrollmentsResponse, progressResponse, commentsResponse, coursesResponse] =
          await Promise.all([
            getStudents(),
            getEnrollments(),
            getAllProgress(),
            getComments(),
            getCourses(),
          ]);

        if (!Array.isArray(studentsResponse)) {
          throw new Error('Dữ liệu học viên không hợp lệ');
        }

        if (!Array.isArray(enrollmentsResponse.data)) {
          console.error('Dữ liệu đăng ký không phải là mảng:', enrollmentsResponse.data);
          throw new Error('Dữ liệu đăng ký không hợp lệ');
        }

        setEnrollments(enrollmentsResponse.data);
        setProgresses(progressResponse);
        setComments(commentsResponse);
        setCourses(coursesResponse);
        setEnrollmentData(getEnrollmentDataByMonth(enrollmentsResponse.data));

        // Tính số giảng viên duy nhất từ khóa học
        const uniqueInstructors = [...new Set(coursesResponse.map((course) => course.instructorId))].length;

        setStats({
          totalStudents: studentsResponse.length,
          totalInstructors: uniqueInstructors,
          commentsToday: getCommentsToday(commentsResponse),
          newCourses: getNewCourses(coursesResponse),
          totalEnrollments: enrollmentsResponse.data.length,
        });
      } catch (error) {
        toast.error('Không thể tải dữ liệu bảng điều khiển');
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const enrolledStudentsCount = [...new Set(enrollments.map((e) => e.userId))].length;
  const weeklyCompletedLessons = getWeeklyCompletedLessons(progresses);
  const coursePopularityData = getNewCoursesLast7Days(courses);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 w-full min-h-screen">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-500">Thống kê tổng quan</h1>
          <div className="text-sm text-gray-500">
            Cập nhật lần cuối: {format(new Date(), 'dd/MM/yyyy HH:mm')}
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Tổng số học viên</CardTitle>
              <Users className="h-6 w-6 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-gray-500">Tổng số học viên đã đăng ký</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Học viên đăng ký khóa học</CardTitle>
              <BookOpen className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledStudentsCount}</div>
              <p className="text-xs text-gray-500">Số học viên đã đăng ký ít nhất một khóa học</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Số lượng giảng viên</CardTitle>
              <Users className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInstructors}</div>
              <p className="text-xs text-gray-500">Tổng số giảng viên</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Bình luận hôm nay</CardTitle>
              <MessageSquare className="h-6 w-6 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.commentsToday}</div>
              <p className="text-xs text-gray-500">Số bình luận được tạo hôm nay</p>
            </CardContent>
          </Card>
        </div>

        {/* Phần biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-white shadow-lg w-full">
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                        }}
                      />
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

          <Card className="bg-white shadow-lg w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Phân bố khóa học mới (7 ngày qua)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {coursePopularityData.length === 1 &&
                  coursePopularityData[0].name === 'Không có khóa học mới' ? (
                  <p className="text-center text-gray-500">Không có khóa học mới trong 7 ngày qua</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={coursePopularityData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        innerRadius={30}
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={2}
                      >
                        {coursePopularityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                        }}
                        formatter={(value, name) => [`${value} khóa học`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-sm text-gray-700">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thống kê bổ sung */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-white shadow-lg w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Khóa học mới</CardTitle>
              <PlusCircle className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newCourses}</div>
              <p className="text-xs text-gray-500">Số khóa học mới trong 30 ngày qua</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-gray-500">Bài học hoàn thành</CardTitle>
              <PlusCircle className="h-6 w-6 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyCompletedLessons}</div>
              <p className="text-xs text-gray-500">Số bài học hoàn thành trong tuần</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;