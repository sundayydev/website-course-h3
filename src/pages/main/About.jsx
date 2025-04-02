import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const teamMembers = [
    {
      name: 'Ngô Mạnh Hùng',
      role: 'Developer & CEO',
      image:
        'https://asd.mediacdn.vn/adt/tuyendungvccorp/lap-trinh-vien-la-gi_1b33bae8-ab72-4134-bb77-8d9df3b29def.jpg',
    },
    {
      name: 'Lê Hữu Duy Hoàng',
      role: 'Lead Designer',
      image: 'https://laptrinhcuocsong.com/images/lap-trinh-vien.png',
    },
    {
      name: 'Lê Hoài Huân',
      role: 'Developer',
      image:
        'https://cdni.iconscout.com/illustration/premium/thumb/man-coder-programming-on-computer-7771249-6200255.png?f=webp',
    },
  ];

  return (
    <div className="w-full lg:h-auto h-full flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full flex flex-col justify-center items-center sm:px-4 px-2">
        <div className="lg:w-[98%] w-full mx-auto flex flex-col lg:gap-6 lg:flex-row items-center justify-center">
          {/* Ảnh chính */}
          <div className="relative">
            <img
              className="rounded-full relative object-cover right-0 lg:w-[30rem] lg:h-[30rem] sm:w-[25rem] sm:h-[25rem] w-[12rem] h-[12rem] outline sm:outline-offset-[.77em] outline-offset-[.37em] outline-pink-500 mr-4"
              src="https://watermark.lovepik.com/photo/20211201/large/lovepik-programmer-professional-image-picture_501301385.jpg"
              alt="About us"
            />
          </div>

          {/* Nội dung */}
          <div className="lg:w-[55%] p-4 w-full h-full shadow-xl shadow-pink-300/40 flex flex-col justify-center items-center sm:px-6 px-4 rounded-xl">
            <h2 className="text-4xl text-center text-pink-600 dark:text-pink-400 font-bold px-4 py-1 md:mt-0 mt-10">
              Về chúng tôi
            </h2>
            <p className="md:text-3xl text-2xl text-center text-gray-800 dark:text-gray-200 font-bold my-5">
              Chúng tôi là H3
            </p>
            <p className="md:text-xl sm:text-lg text-base mt-2 text-justify sm:px-2 dark:text-gray-300">
              Chào mừng bạn đến với Web học lập trình H3 – nền tảng học lập trình hàng đầu dành cho
              mọi đối tượng, từ người mới bắt đầu đến lập trình viên chuyên nghiệp. Sứ mệnh của
              chúng tôi Chúng tôi cam kết cung cấp các khóa học chất lượng cao, dễ hiểu và thực
              tiễn, giúp người học nhanh chóng nắm vững kiến thức lập trình và áp dụng vào thực tế.
              Với đội ngũ giảng viên giàu kinh nghiệm, chúng tôi luôn cập nhật những công nghệ mới
              nhất để mang lại trải nghiệm học tập tốt nhất.
            </p>

            <button
              onClick={() => navigate('/contact')}
              className="lg:mt-10 mt-6 lg:px-4 px-5 lg:py-4 py-3 bg-pink-600 rounded-xl lg:text-xl text-lg text-white font-semibold transition duration-300 hover:bg-pink-700"
            >
              Liên hệ
            </button>
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="w-full mt-20 px-6">
        <h2 className="text-4xl text-center text-pink-600 dark:text-pink-400 font-bold mb-10">
          Gặp gỡ đội ngũ của chúng tôi
        </h2>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 justify-around">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center w-full max-w-xs"
            >
              <img
                className="w-32 h-32 rounded-full object-cover mb-4"
                src={member.image}
                alt={member.name}
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                {member.name}
              </h3>
              <p className="text-pink-600 dark:text-pink-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
