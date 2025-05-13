import InstructorLayout from '../layouts/InstructorLayout';
import ProtectedRoute from './ProtectedRoute';

import Dashboard from '@/pages/instructor/Dashboard';
import Courses from '@/pages/instructor/Courses/Courses';
import CourseDetail from '@/pages/instructor/Courses/CourseDetail';

const InstructorRoutes = {
  path: '/instructor', // Đường dẫn chính cho Instructor
  element: (
    <ProtectedRoute allowRoles={['Instructor']}>
      {' '}
      {/* Chỉ cho phép người dùng có vai trò Instructor */}
      <InstructorLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Dashboard /> }, //(mặc định)
    { path: 'courses', element: <Courses /> },
    { path: 'course/:id', element: <CourseDetail /> }, // Đường dẫn cho trang chi tiết khóa học
  ],
};

export default InstructorRoutes;
