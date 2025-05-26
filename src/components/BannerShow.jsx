import React, { useState, useEffect } from 'react';

const BannerShow = () => {
  const images = [
    './src/assets/imgs/banner1.png',
    './src/assets/imgs/banner2.png',
    './src/assets/imgs/banner3.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const interval = 10000; // Increased interval for better viewing

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-2xl">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentIndex ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}

        {/* Previous button */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300"
        >
          <span className="text-2xl">&lsaquo;</span>
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300"
        >
          <span className="text-2xl">&rsaquo;</span>
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerShow;
