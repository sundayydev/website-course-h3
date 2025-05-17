import React from 'react';
import BannerShow from '../../components/BannerShow';
import Course from '@/pages/main/Course.jsx';
import CardPost from './CardPost';
const Home = () => {
  return (
    <div className="bg-gray-50 container mx-auto">
      <BannerShow />
      <Course />
      <CardPost />
    </div>
  );
};

export default Home;
