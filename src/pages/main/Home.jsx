import React from 'react';
import BannerShow from '../../components/BannerShow';
import Course from '@/pages/main/Course.jsx';
import CardPost from '@/pages/main/card/CardPost';
import CourseForUser from './CourseForUser';
import CourseNew from './CourseNew';
import CardInfo from './card/CardInfo';
import CardReview from './card/CardReview';
import CountdownTimer from '@/components/CountdownTimer';

const Home = () => {

  const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return (
    <div className="mx-auto px-4 py-8 bg-slate-50 container">
      <BannerShow />
      <div className="p-4 mx-auto">
        <div className="bg-[#FF8282] rounded-[25px] shadow-md p-10 mb-8 border-4 border-red-400">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg border-2 border-red-300">
              <span className="text-2xl font-bold text-red-500">
                FLASH <span className="text-black">SALE</span>
              </span>
              <span className="text-gray-600 text-sm">Kết thúc trong</span>
              <CountdownTimer endTime={endTime} />
            </div>
          </div>
          <div className=" bg-white rounded-[25px] border-2 border-red-300">
            <CourseNew />
          </div>
        </div>
      </div>
      <CourseForUser />
      <Course />
      <CardInfo />
      <CardPost />
      <CardReview />
    </div>
  );
};

export default Home;