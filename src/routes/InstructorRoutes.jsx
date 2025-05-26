import InstructorLayout from '../layouts/InstructorLayout';
import Dashboard from '@/pages/instructor/Dashboard';
import Courses from '@/pages/instructor/Courses/Courses';
import CourseDetail from '@/pages/instructor/Courses/CourseDetail';
import AddCourse from '@/pages/instructor/Courses/AddCourse';
import EditCourse from '@/pages/instructor/Courses/EditCourse';
import AddContent from '@/pages/instructor/lessons/AddContent';
import ManageLessons from '@/pages/instructor/lessons/ManageLessons';
import OdersDetail from '@/pages/instructor/oders/OdersDetail';
import { ProtectedRouteInstructor } from './ProtectedRoute';
const InstructorRoutes = {
  path: '/instructor', // Đường dẫn chính cho Instructor
  element: (
    <ProtectedRouteInstructor>
      {' '}
      {/* Chỉ cho phép người dùng có vai trò Instructor */}
      <InstructorLayout />
    </ProtectedRouteInstructor>
  ),
  children: [
    { index: true, element: <Dashboard /> }, //(mặc định)
    { path: 'courses', element: <Courses /> },
    { path: 'course/add', element: <AddCourse /> },
    { path: 'course/:id', element: <CourseDetail /> }, // Đường dẫn cho trang chi tiết khóa học
    { path: 'course/:courseId/edit', element: <EditCourse /> },
    { path: 'course/:courseId/content/add', element: <AddContent /> },
    { path: 'course/:courseId/lessons', element: <ManageLessons /> },
    { path: 'orders', element: <OdersDetail /> },
  ],
};

export default InstructorRoutes;
