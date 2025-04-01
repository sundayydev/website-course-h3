// src/routes/MainRoutes.jsx
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/main/Home';
import About from '../pages/main/About';
import Contact from '../pages/main/Contact';
import Post from '../pages/main/Post';
import PaymentModal from '../pages/main/Payment';
import PaymentPage from '../pages/main/PaymentDetail';
import PostDetails from '../pages/main/PostDetails';
import Details from '../pages/main/Details';
import DetailsPageCourse from '../pages/main/DetailsPageCourse';
import NotFound from '../pages/main/NotFoundPage';
const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <Home /> }, // /
    { path: 'about', element: <About /> }, // /about
    { path: 'contact', element: <Contact /> },
    { path: 'post', element: <Post /> },
    { path: 'payment', element: <PaymentModal /> },
    { path: 'paymentpage', element: <PaymentPage /> },
    { path: 'detailspost/:id', element: <PostDetails /> },
    { path: 'details/:courseId', element: <Details /> },
    { path: 'detailsPageCourse/:lessonId', element: <DetailsPageCourse /> },
    { path: '*', element: <NotFound /> },
  ],
};

export default MainRoutes;
