import { useState } from 'react';
import {
  User,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  Bell,
  Search,
  Menu,
  Home,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dữ liệu mẫu
const studentPerformanceData = [
  { name: 'Tuần 1', average: 65 },
  { name: 'Tuần 2', average: 70 },
  { name: 'Tuần 3', average: 68 },
  { name: 'Tuần 4', average: 75 },
  { name: 'Tuần 5', average: 78 },
  { name: 'Tuần 6', average: 82 },
];

const upcomingClasses = [
  {
    id: 1,
    title: 'Lập trình Web nâng cao',
    time: '09:00 AM - 11:00 AM',
    date: 'Hôm nay',
    students: 28,
    room: 'A203',
  },
  {
    id: 2,
    title: 'Cơ sở dữ liệu',
    time: '01:00 PM - 03:00 PM',
    date: 'Hôm nay',
    students: 32,
    room: 'B101',
  },
  {
    id: 3,
    title: 'Thuật toán và cấu trúc dữ liệu',
    time: '09:00 AM - 12:00 PM',
    date: 'Ngày mai',
    students: 25,
    room: 'C305',
  },
];

const courses = [
  { id: 1, title: 'Lập trình Web nâng cao', students: 28, completed: 45, total: 60 },
  { id: 2, title: 'Cơ sở dữ liệu', students: 32, completed: 32, total: 48 },
  { id: 3, title: 'Thuật toán và cấu trúc dữ liệu', students: 25, completed: 18, total: 36 },
  { id: 4, title: 'Lập trình hướng đối tượng', students: 30, completed: 24, total: 45 },
];

const notifications = [
  { id: 1, content: 'Sinh viên Nguyễn Văn A đã nộp bài tập', time: '10 phút trước' },
  { id: 2, content: 'Lịch họp khoa vào ngày 12/05/2025', time: '1 giờ trước' },
  { id: 3, content: 'Hạn chấm điểm giữa kỳ: 15/05/2025', time: '2 giờ trước' },
];

// Biểu đồ theo dõi tiến độ khóa học
const ProgressBar = ({ completed, total }) => {
  const percentage = Math.round((completed / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

// Card hiển thị số liệu
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
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span className="font-medium">TS. Nguyễn Văn A</span>
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
            value="145"
            bgColor="bg-blue-600"
          />
          <StatCard
            icon={<BookOpen size={24} className="text-green-700" />}
            title="Khóa học"
            value="6"
            bgColor="bg-green-600"
          />
          <StatCard
            icon={<Calendar size={24} className="text-purple-700" />}
            title="Buổi học tuần này"
            value="12"
            bgColor="bg-purple-600"
          />
          <StatCard
            icon={<BarChart3 size={24} className="text-orange-700" />}
            title="Tỉ lệ hoàn thành"
            value="78%"
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
                  data={studentPerformanceData}
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
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-800">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                {upcomingClasses.map((course) => (
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
                    Khóa học
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sinh viên
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiến độ
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hoàn thành
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
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
