import React, { useState, useEffect } from 'react';
const BannerShow = () => {
    const images = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YfWiVVS33hOdPRzKCd3vsfj31zXvM6ajtg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVN6nug1YWjqxTIEIZNbiaV6db8mvWWm7Oxw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlY5S9if3otF4kWAnwznYdyGhIaZU1yKXM5N37Z0WU1QFrYkO4ZVmBYZQhN9W3N-aMuzg&usqp=CAU',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const interval = 3000;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="container mx-auto">
            <div className="relative w-full h-[270px] overflow-hidden rounded-2xl mt-16">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={image}
                        alt={`Slide ${index}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}

            {/* Previous button */}
            <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
                &#10094;
            </button>

            {/* Next button */}
            <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
                &#10095;
            </button>

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full ${
                            index === currentIndex
                                ? 'bg-white'
                                : 'bg-gray-500'
                        }`}
                    />
                ))}
            </div>
        </div>
        </div>
    );
};

export default BannerShow;
