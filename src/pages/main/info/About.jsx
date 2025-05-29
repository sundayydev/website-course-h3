import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaHandshake, FaGraduationCap, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Thư viện cho hiệu ứng động

const About = () => {
  const navigate = useNavigate();

  // Dữ liệu cho phần Giá trị cốt lõi
  const missions = [
    {
      icon: <FaRocket className="text-5xl text-emerald-500" />,
      title: "Sứ mệnh",
      description: "Mang đến kiến thức lập trình chất lượng, dễ tiếp cận cho mọi người, góp phần phát triển nguồn nhân lực công nghệ Việt Nam."
    },
    {
      icon: <FaHandshake className="text-5xl text-emerald-500" />,
      title: "Cam kết",
      description: "Đảm bảo chất lượng đào tạo với giảng viên giàu kinh nghiệm, nội dung cập nhật và hỗ trợ học viên tận tâm."
    },
    {
      icon: <FaGraduationCap className="text-5xl text-emerald-500" />,
      title: "Giá trị cốt lõi",
      description: "Chất lượng - Nhiệt huyết - Sáng tạo - Trách nhiệm là những giá trị chúng tôi luôn hướng đến."
    },
    {
      icon: <FaUsers className="text-5xl text-emerald-500" />,
      title: "Cộng đồng",
      description: "Xây dựng cộng đồng học tập năng động, kết nối và hỗ trợ lẫn nhau trong hành trình phát triển."
    }
  ];

  // Dữ liệu cho phần Đội ngũ
  const teamMembers = [
    {
      id: '64d8dce6-bf4f-4ece-bdcc-ef7db89e178f',
      name: 'Ngô Mạnh Hùng',
      role: 'Developer & CEO',
      image: 'https://asd.mediacdn.vn/adt/tuyendungvccorp/lap-trinh-vien-la-gi_1b33bae8-ab72-4134-bb77-8d9df3b29def.jpg',
      description: 'Với hơn 8 năm kinh nghiệm phát triển phần mềm và quản lý dự án.'
    },
    {
      id: '891580b3-4226-4f1f-ade9-195409165d14',
      name: 'Lê Hữu Duy Hoàng',
      role: 'Lead Designer',
      image: `https://res.cloudinary.com/dybzjxgt4/image/upload/v1748438598/iiaihadh1ei9eemdk7dy.png`,
      description: 'Chuyên gia thiết kế UX/UI với nhiều năm kinh nghiệm trong lĩnh vực giáo dục trực tuyến.'
    },
    {
      id: '4942876c-c54a-48c7-95eb-6146baa8c6a1',
      name: 'Lê Hoài Huân',
      role: 'Developer',
      image: 'https://res.cloudinary.com/dybzjxgt4/image/upload/v1748407977/duwbvopnkwxugjou568o.jpg',
      description: 'Full-stack developer với đam mê về công nghệ mới và giảng dạy.'
    },
  ];

  // Dữ liệu cho phần Thống kê
  const stats = [
    { number: "5000+", label: "Học viên đã tốt nghiệp" },
    { number: "95%", label: "Tỷ lệ hài lòng" },
    { number: "80%", label: "Tỷ lệ có việc làm sau 3 tháng" },
    { number: "300+", label: "Doanh nghiệp đối tác" }
  ];

  // Dữ liệu cho phần Đối tác
  const partners = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png" }
  ];

  // Cấu hình hiệu ứng động
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      {/* Phần Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full py-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                Khám phá <span className="text-emerald-600">H3</span> - Nền tảng học<br /> lập trình hàng đầu
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Chúng tôi tin rằng mọi người đều có thể học lập trình. Với phương pháp đào tạo hiện đại
                và đội ngũ giảng viên tận tâm, H3 cam kết đồng hành cùng bạn trên con đường trở thành
                lập trình viên chuyên nghiệp.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-emerald-600 text-white rounded-full text-lg font-semibold 
                hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Bắt đầu hành trình
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <img
                className="rounded-3xl shadow-2xl w-full object-cover h-96"
                src="./src/assets/imgs/about.jpg"
                alt="About H3"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Phần Thống kê */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-6 lg:px-12 py-20"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg 
              transition-all duration-300 text-center transform hover:-translate-y-2- transform hover:-translate-y-2"
            >
              <div className="text-5xl font-extrabold text-emerald-600 mb-3">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Phần Đối tác */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-6 lg:px-12 py-20 bg-gray-50 dark:bg-gray-800"
      >
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Đối tác công nghệ
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-10">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="w-36 lg:w-48 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-16 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Phần Giá trị cốt lõi */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-6 lg:px-12 py-20"
      >
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Giá trị cốt lõi của chúng tôi
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md 
              hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                {mission.icon}
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4 mb-3">
                  {mission.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  {mission.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Phần Đội ngũ */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-6 lg:px-12 py-20 bg-gray-50 dark:bg-gray-800"
      >
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Đội ngũ chuyên gia của chúng tôi
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id || index}
              variants={itemVariants}
              className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl 
                transition-all duration-300 transform hover:-translate-y-2 ${member.id ? 'cursor-pointer' : ''}`}
              onClick={() => member.id && navigate(`/profile/${member.id}`)}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  className="w-40 h-40 rounded-full object-cover mb-6 border-4 border-emerald-500 
                  transition-transform duration-300 hover:scale-105"
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  {member.description} {/* Sửa lỗi: dùng member.description thay vì mission.description */}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Phần Kêu gọi hành động */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-emerald-600 py-20"
      >
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Sẵn sàng bắt đầu hành trình học lập trình của bạn?
          </h2>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-white text-emerald-600 rounded-full text-lg font-semibold 
            hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Liên hệ ngay
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;