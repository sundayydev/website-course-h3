import { Contact } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Students from '../pages/admin/Students';
import Courses from '../pages/admin/Courses';
import CourseDetail from '../pages/admin/CourseDetail';
import LessonDetail from '../pages/admin/LessonDetail';
import PaymentManagement from '../pages/admin/PaymentManagement';
import Comment from '../pages/admin/Comment';
import PostManagement from '../pages/admin/PostManagement';
import Notifications from '../pages/admin/Notifications';
import { ProtectedRouteAdmin } from './ProtectedRoute';
import CommentByPost from '../pages/admin/CommentByPost';
import Instructors from '../pages/admin/Instructors.jsx';
import ReviewByCourse from '../pages/admin/ReviewByCourse.jsx';
import EmailManagement from '../pages/admin/email/EmailManagement.jsx';
import NotificationDetail from '../pages/admin/notifications/NotificationDetail.jsx';
import EmailDetail from '../pages/admin/email/EmailDetail.jsx';

const AdminRoutes = {
  path: '/admin',
  element: (
    <ProtectedRouteAdmin>
      <AdminLayout />
    </ProtectedRouteAdmin>
  ),
  children: [
    { index: true, element: <Dashboard /> }, // /admin (mặc định)
    { path: 'dashboard', element: <Dashboard /> }, // /admin/dashboard
    { path: 'students', element: <Students /> }, // /admin/students
    { path: 'instructors', element: <Instructors /> },
    { path: 'contact', element: <Contact /> }, // /admin/contact
    { path: 'courses', element: <Courses /> }, // /admin/courses
    { path: 'course-detail/:courseId', element: <CourseDetail /> }, // /admin/course-detail/:courseId
    { path: 'lesson-detail/:lessonId', element: <LessonDetail /> }, // /admin/lesson-detail/:lessonId
    { path: 'payment-management', element: <PaymentManagement /> }, // /admin/payment-management
    { path: 'comment', element: <Comment /> }, // /admin/comment
    { path: 'post-management', element: <PostManagement /> }, // /admin/post-management
    { path: 'notifications', element: <Notifications /> }, // /admin/userNotification
    { path: "comments/:postId", element: < CommentByPost /> },
    { path: "reviews/:courseId", element: <ReviewByCourse /> },
    { path: "emails", element: <EmailManagement /> },
    { path: "notification/:notificationId", element: <NotificationDetail /> },
    { path: 'email/:emailId', element: <EmailDetail /> },
  ],
};

export default AdminRoutes;
