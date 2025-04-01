import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center md:p-4 bg-white mt-20 md:mt-0">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Avatar + Tên */}
          <div className="w-full md:w-1/3 text-center mb-6 md:mb-0">
            <img
              src="https://i.pravatar.cc/300"
              alt="Profile"
              className="rounded-full w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-4 border-4 border-pink-500 transition-transform duration-300 hover:scale-105"
              onClick={() => setIsModalOpen(true)}
            />
            <h1 className="text-xl sm:text-2xl font-bold text-pink-500 mb-1 sm:mb-2">John Doe</h1>
            <p className="text-gray-600 text-sm sm:text-base">Software Developer</p>
            <div className="flex justify-center mt-3 sm:mt-4">
              <button className="bg-pink-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-300 flex items-center gap-2">
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="w-full md:w-2/3 md:pl-8">
            <Section title="About Me">
              <p className="text-gray-700 text-sm sm:text-base">
                Passionate software developer with 5 years of experience in web technologies. I love
                creating user-friendly applications and solving complex problems.
              </p>
            </Section>

            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            </Section>

            <Section title="Contact Information">
              <ul className="space-y-2 text-gray-700">
                <ContactItem icon={<FaEnvelope />} text="john.doe@example.com" />
                <ContactItem icon={<FaPhone />} text="+1 (555) 123-4567" />
                <ContactItem icon={<FaMapMarkerAlt />} text="San Francisco, CA" />
              </ul>
            </Section>
          </div>
        </div>
      </div>

      {/* Modal Hiển thị ảnh khi click vào Avatar */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <img
              src="https://i.pravatar.cc/600"
              alt="Profile Enlarged"
              className="rounded-lg shadow-2xl w-full"
            />
            <button
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Component hiển thị từng phần nội dung (About, Skills, Contact)
const Section = ({ title, children }) => (
  <div className="mb-4 sm:mb-6">
    <h2 className="text-lg sm:text-xl font-semibold text-pink-500 mb-2 sm:mb-4">{title}</h2>
    {children}
  </div>
);

// Component hiển thị từng kỹ năng với hiệu ứng hover
const SkillTag = ({ skill }) => (
  <span className="px-3 py-1 rounded-full text-xs sm:text-sm bg-indigo-100 text-pink-500 transition-colors duration-300 cursor-pointer hover:bg-pink-700 hover:text-white">
    {skill}
  </span>
);

// Component hiển thị thông tin liên hệ với icon
const ContactItem = ({ icon, text }) => (
  <li className="flex items-center gap-2 text-sm sm:text-lg">
    <span className="text-pink-500">{icon}</span>
    {text}
  </li>
);

export default ProfilePage;
