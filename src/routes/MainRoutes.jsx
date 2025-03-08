// src/routes/MainRoutes.jsx
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/main/Home';
import About from '../pages/main/About';
import Course from '../pages/main/Course';
import NotFoundPage from "../pages/main/NotFoundPage.jsx";
import Details from "@/pages/main/Details.jsx";
import FeaturedArticle from "@/pages/main/FeaturedArticle.jsx";


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
  ],
};

export default MainRoutes;
