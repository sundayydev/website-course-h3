import React from 'react';
import BannerShow from './BannerShow';
import Course from '@/pages/main/Course.jsx';
const Home = () => {
  return (
    <div className="bg-gray-50 p-4">
      <BannerShow />
      <Course />
    </div>
  );
};

export default Home;
