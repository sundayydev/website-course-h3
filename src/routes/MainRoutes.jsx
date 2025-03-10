// src/routes/MainRoutes.jsx
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/main/Home';
import About from '../pages/main/About';
import Course from '../pages/main/Course';
import NotFoundPage from "../pages/main/NotFoundPage.jsx";
import Details from "@/pages/main/Details.jsx";
import FeaturedArticle from "@/pages/main/FeaturedArticle.jsx";
import Login from '../pages/main/auth/Login';
import Contact from '../pages/main/Contact';
import Post from '../pages/main/Post';
import PaymentModal from '../pages/main/Payment';
import PaymentPage from '../pages/main/PaymentDetail';
import AccountSettings from '../pages/account/SettingAccount';
import ProfilePage from '../pages/account/ProFile';
import DetailsPageCourse from "@/pages/main/DetailsPageCourse.jsx";

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <Home /> }, // /
    { path: 'about', element: <About /> }, // /about
    { path: 'course', element: <Course /> }, // /course
    { path: 'details', element: <Details /> }, // /DetailsPage
    { path: 'FeaturedArticle', element: <FeaturedArticle/>}, // FeaturedArticle
    { path: '*', element: <NotFoundPage /> }, // NotFound  404
    { path: 'login', element: <Login /> },
    { path: 'contact', element: <Contact /> },
    { path: 'DetailsPageCourse', element: <DetailsPageCourse /> },
    { path: 'post', element: <Post /> },
    { path: 'payment', element: <PaymentModal /> },
    { path: 'paymentpage', element: <PaymentPage /> },
    { path: 'accountsetting', element: <AccountSettings /> },
    { path: 'profile', element: <ProfilePage /> },
  ],
};


export default MainRoutes;
