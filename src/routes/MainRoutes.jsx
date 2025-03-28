// src/routes/MainRoutes.jsx
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/main/Home';
import About from '../pages/main/About';
import Contact from '../pages/main/Contact';
import Post from '../pages/main/Post';
import PaymentModal from '../pages/main/Payment';
import PaymentPage from '../pages/main/PaymentDetail';
import AccountSettings from '../pages/account/SettingAccount';
import ProfilePage from '../pages/account/ProFile';
import PostDetails from '../pages/main/PostDetails';
import Details from '../pages/main/Details';
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
    { path: 'accountsetting', element: <AccountSettings /> },
    { path: 'profile', element: <ProfilePage /> },
    { path: 'detailspost/:id', element: <PostDetails /> },
    { path: 'details/:courseId', element: <Details /> },
  ],
};

export default MainRoutes;
