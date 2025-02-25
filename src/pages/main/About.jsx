import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const teamMembers = [
    {
      name: 'Alice Johnson',
      role: 'Founder & CEO',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Michael Smith',
      role: 'Lead Designer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Emily Davis',
      role: 'Marketing Specialist',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'John Doe',
      role: 'Customer Support',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
  ];

  return (
    <div className="w-full lg:h-auto h-full flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full flex flex-col justify-center items-center sm:px-4 px-2">
        <div className="lg:w-[90%] w-full mx-auto flex flex-col lg:gap-6 lg:flex-row items-center justify-center">
          {/* Ảnh chính */}
          <div className="relative">
            <img
              className="rounded-full relative object-cover right-0 lg:w-[30rem] lg:h-[30rem] sm:w-[25rem] sm:h-[25rem] w-[12rem] h-[12rem] outline sm:outline-offset-[.77em] outline-offset-[.37em] outline-pink-500 mr-4"
              src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxM3x8Zmxvd2VyfGVufDB8MHwwfHx8MTcyMDk0OTQ2MHww&ixlib=rb-4.0.3&q=80&w=1080"
              alt="About us"
            />
          </div>

          {/* Nội dung */}
          <div className="lg:w-[60%] p-4 w-full h-full shadow-xl shadow-pink-300/40 flex flex-col justify-center items-center sm:px-6 px-4 rounded-xl">
            <h2 className="text-4xl text-center text-pink-600 dark:text-pink-400 font-bold px-4 py-1 md:mt-0 mt-10">
              About Us
            </h2>
            <p className="md:text-3xl text-2xl text-center text-gray-800 dark:text-gray-200 font-bold my-5">
              We are Petal Haven S.C.
            </p>
            <p className="md:text-xl sm:text-lg text-base mt-2 text-justify sm:px-2 dark:text-gray-300">
              At Petal Haven, we believe in the transformative power of flowers. Our blooms are not
              just arrangements; they are expressions of beauty, joy, and emotion. From elegant
              bouquets to enchanting floral designs, we curate every creation with precision and
              care. Whether it's a celebration, a gesture of love, or a moment of solace, Petal
              Haven's exquisite flowers speak a language of their own, bringing nature's beauty to
              your doorstep.
            </p>

            <button
              onClick={() => navigate('/contact')}
              className="lg:mt-10 mt-6 lg:px-6 px-4 lg:py-4 py-2 bg-pink-600 rounded-sm lg:text-xl text-lg text-white font-semibold transition duration-300 hover:bg-pink-700"
            >
              Read More
            </button>
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="w-full mt-20 px-6">
        <h2 className="text-4xl text-center text-pink-600 dark:text-pink-400 font-bold mb-10">
          Meet Our Team
        </h2>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8 justify-center">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
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
