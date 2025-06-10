// src/routes/MainRoutes.jsx
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/main/Home';
import About from '../pages/main/info/About.jsx';
import Contact from '../pages/main/info/Contact';
import Post from '../pages/main/Post';
import PaymentModal from '../pages/main/Payment';
import PaymentPage from '../pages/main/PaymentDetail';
import PostDetails from '../pages/main/PostDetails';
import Details from '../pages/main/Details';
import DetailsPageCourse from '../pages/main/DetailsPageCourse';
import NotFound from '../pages/main/NotFoundPage';
import PaymentSuccess from '../pages/main/PaymentSuccess.jsx';
import PaymentFailure from '@/pages/main/PaymentFailure.jsx';
import ProfilePage from '../pages/main/account/ProFile.jsx';
import AccountSettings from '../pages/main/account/SettingAccount.jsx';
import UserProfile from '../pages/main/UserProfile.jsx';
import Terms from '../pages/main/info/Terms.jsx';
import PrivacyPolicy from '../pages/main/info/PrivacyPolicy.jsx';
import CardInfo from '../pages/main/card/CardInfo.jsx';
import CardReview from '../pages/main/card/CardReview.jsx';
import ChatPage from '../pages/main/chat/ChatPage.jsx';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <Home /> }, // /
    { path: 'about', element: <About /> }, // /about
    { path: 'terms', element: <Terms /> },
    { path: 'privacy', element: <PrivacyPolicy /> },
    { path: 'contact', element: <Contact /> },
    { path: 'post', element: <Post /> },
    { path: 'payment/:courseId', element: <PaymentModal /> },
    { path: 'paymentpage', element: <PaymentPage /> },
    { path: 'detailspost/:id', element: <PostDetails /> },
    { path: 'details/:courseId', element: <Details /> },
    { path: 'detailsPageCourse/:lessonId', element: <DetailsPageCourse /> },
    { path: '*', element: <NotFound /> },
    { path: 'payment-success/:id', element: <PaymentSuccess /> },
    { path: 'payment-failure', element: <PaymentFailure /> },
    { path: 'profile', element: <ProfilePage /> },
    { path: 'setting', element: <AccountSettings /> },
    { path: 'profile/:id', element: <UserProfile /> },
    { path: 'cardinfo', element: <CardInfo /> },
    { path: 'cardreview', element: <CardReview /> },
    { path: 'chat/:chatId', element: <ChatPage /> }
  ],
};

export default MainRoutes;
