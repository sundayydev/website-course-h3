import { Contact } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Students from '../pages/admin/Students';
import Courses from '../pages/admin/Courses';
import CourseDetail from '../pages/admin/CourseDetail';
import LessonDetail from '../pages/admin/LessonDetail';
import PaymentManagement from '../pages/admin/PaymentManagement';
import Comment from '../pages/admin/Comment';
import PostManagement from '../pages/admin/PostManagement';

const AdminRoutes = {
  path: '/admin',
  element: (
    <ProtectedRoute> 
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Dashboard /> }, // /admin (mặc định)
    { path: 'dashboard', element: <Dashboard /> }, // /admin/dashboard
    { path: 'students', element: <Students /> }, // /admin/students
    { path: 'contact', element: <Contact /> }, // /admin/contact
    { path: 'courses', element: <Courses /> }, // /admin/courses
    { path: 'course-detail/:courseId', element: <CourseDetail /> }, // /admin/course-detail/:courseId
    { path: 'lesson-detail/:lessonId', element: <LessonDetail /> }, // /admin/lesson-detail/:lessonId
    { path: 'payment-management', element: <PaymentManagement /> }, // /admin/payment-management
    { path: 'comment', element: <Comment /> }, // /admin/comment
    { path: 'post-management', element: <PostManagement /> }, // /admin/post-management
  ],
};

export default AdminRoutes;
