import React from 'react';
import BannerShow from '../../components/BannerShow';
import Course from '@/pages/main/Course.jsx';
import CardPost from './CardPost';
import CourseForUser from './CourseForUser';
import CourseNew from './CourseNew';
const Home = () => {
  return (
    <div className="bg-gray-50 container mx-auto">
      <BannerShow />
      <CourseNew />
      <Course />
      <CourseForUser />
      <CardPost />
    </div>
  );
};

export default Home;
