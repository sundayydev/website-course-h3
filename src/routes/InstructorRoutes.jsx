import InstructorLayout from '../layouts/InstructorLayout';
import Dashboard from '@/pages/instructor/Dashboard';
import Courses from '@/pages/instructor/Courses/Courses';
import CourseDetail from '@/pages/instructor/Courses/CourseDetail';
import AddCourse from '@/pages/instructor/Courses/AddCourse';
import EditCourse from '@/pages/instructor/Courses/EditCourse';
import AddContent from '@/pages/instructor/lessons/AddContent';
import ManageLessons from '@/pages/instructor/lessons/ManageLessons';
import OrdersDetail from '@/pages/instructor/orders/OrdersDetail';
import { ProtectedRouteInstructor } from './ProtectedRoute';
import Post from '../pages/instructor/post/Post';
import CommentByPost from '../pages/instructor/post/CommentByPost';
import AddQuiz from '@/pages/instructor/lessons/AddQuiz';
import LessonDetail from '@/pages/instructor/lessons/LessonDetail';
import QuizDetail from '@/pages/instructor/lessons/QuizDetail';
import Help from '@/pages/instructor/Help';
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
    { path: 'orders', element: <OrdersDetail /> },
    { path: 'post', element: <Post /> },
    { path: "comments/:postId", element: < CommentByPost /> },
    { path: "course/:courseId/lesson/:lessonId/add-quiz", element: <AddQuiz /> },
    { path: "course/:courseId/lesson/quiz/:quizId", element: <QuizDetail /> },
    { path: "course/:courseId/lesson/:lessonId", element: <LessonDetail /> },
    { path: "help", element: <Help /> }
  ],
};

export default InstructorRoutes;
