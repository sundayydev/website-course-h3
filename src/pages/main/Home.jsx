import React from 'react';
import BannerShow from '../../components/BannerShow';
import Course from '@/pages/main/Course.jsx';
import CardPost from './CardPost';
import CourseForUser from './CourseForUser';
import CourseNew from './CourseNew';
const Home = () => {
  return (
    <div className="mx-auto px-4 py-8 bg-slate-50">
      <BannerShow />
      <CourseForUser />
      <CourseNew />
      <Course />
      <CardPost />
    </div>
  );
};

export default Home;
