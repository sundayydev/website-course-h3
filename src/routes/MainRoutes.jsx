// src/routes/MainRoutes.jsx
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/main/Home';
import About from '../pages/main/About';
import Login from '../pages/main/auth/Login';
import Contact from '../pages/main/Contact';
import Post from '../pages/main/Post';
import PaymentModal from '../pages/main/Payment';
import PaymentPage from '../pages/main/PaymentDetail';
import AccountSettings from '../pages/account/SettingAccount';
import ProfilePage from '../pages/account/ProFile';
const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <Home /> }, // /
    { path: 'about', element: <About /> }, // /about
    { path: 'login', element: <Login /> },
    { path: 'contact', element: <Contact /> },
    { path: 'home', element: <Home /> },
    { path: 'post', element: <Post /> },
    { path: 'payment', element: <PaymentModal /> },
    { path: 'paymentpage', element: <PaymentPage /> },
    { path: 'accountsetting', element: <AccountSettings /> },
    { path: 'profile', element: <ProfilePage /> },
  ],
};

export default MainRoutes;
