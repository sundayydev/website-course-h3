// src/routes/MainRoutes.jsx
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/main/Home';
import About from '../pages/main/About';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <Home /> }, // /
    { path: 'about', element: <About /> }, // /about
  ],
};

export default MainRoutes;
