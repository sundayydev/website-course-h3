import React, { useState, useEffect } from 'react';

const BannerShow = () => {
  // Mảng chứa thông tin cho 5 banner
  const banners = [
    {
      gradient: 'linear-gradient(to right, #FF6B6B, #F5A623)', // Đỏ đến cam
      title: 'Học lập trình để thành công',
      description:
        'H3 được nhắc tới ở mọi nơi, ở đâu có cơ hội việc làm cho nghề IT và có những con người yêu thích lập trình H3 sẽ ở đó.',
      image: './src/assets/imgs/coding-orange.png',
    },
    {
      gradient: 'linear-gradient(to right, #4CAF50, #A8E6CF)',// Xanh ngọc đến xanh dương
      title: 'Coding là một nghệ thuật',
      description:
        'H3 mang đến những khóa học lập trình chất lượng, giúp bạn biến đam mê thành kỹ năng thực thụ.',
      image: './src/assets/imgs/coding-green.png'
    },
    {
      gradient: 'linear-gradient(to right, #FF9A8B, #FF6A88)', // Hồng phấn đến hồng đậm
      title: 'Chọn H3 chọn nền móng của tương lai',
      description:
        'H3 không chỉ dạy lập trình, mà còn xây dựng nền tảng vững chắc cho sự nghiệp IT của bạn.',
      image: './src/assets/imgs/coding-pink.png'
    },
    {
      gradient: 'linear-gradient(to right, #A1C4FD, #C2E9FB)', // Xanh lam nhạt đến xanh nhạt
      title: 'Biến ý tưởng thành hiện thực',
      description:
        'H3 cung cấp công cụ và kiến thức để bạn hiện thực hóa mọi ý tưởng lập trình của mình.',
      image: './src/assets/imgs/coding-bule.png'
    },
    {
      gradient: 'linear-gradient(to right, #FDB99B, #F6D365)', // Cam nhạt đến vàng nhạt
      title: 'Hành trình chinh phục IT bắt đầu từ đây',
      description:
        'H3 đồng hành cùng bạn trên con đường trở thành lập trình viên chuyên nghiệp.',
      image: './src/assets/imgs/coding-gray.png'
    },
  ];

  // Quản lý chỉ số banner hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);
  // Thời gian chuyển banner (3 giây)
  const interval = 5000;

  // Tự động chuyển banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, interval);

    // Dọn dẹp timer khi component unmount
    return () => clearInterval(timer);
  }, [banners.length]);

  // Chuyển đến banner trước đó
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  // Chuyển đến banner tiếp theo
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // Chuyển đến banner cụ thể theo chỉ số
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="p-4 mx-auto">
      {/* Container cho slideshow */}
      <div className="relative w-full h-[270px] overflow-hidden rounded-2xl mt-16">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ background: banner.gradient }} // Áp dụng gradient nền
          >
            {/* Nội dung bên trái: Tiêu đề, mô tả, nút */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-1/2 ml-5">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
                {banner.title}
              </h2>
              <p className="text-white text-sm md:text-lg mb-4">
                {banner.description}
              </p>
              <button className="px-4 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-all">
                Đăng ký kênh
              </button>
            </div>

            {/* Hình minh họa bên phải */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 mr-5">
              <img
                src={banner.image}
                alt={`Illustration ${index + 1}`}
                className="w-[300px] h-[300px] md:w-[500px] md:h-[280px] object-contain"
              />
            </div>
          </div>
        ))}

        {/* Nút chuyển về banner trước */}
        <button
          onClick={goToPrevious}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-xl hover:bg-gray-200 transition-all"
        >
          ❮
        </button>

        {/* Nút chuyển đến banner tiếp theo */}
        <button
          onClick={goToNext}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-xl hover:bg-gray-200 transition-all"
        >
          ❯
        </button>

        {/* Chỉ báo banner */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerShow;