
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getReviews } from "@/api/reviewApi";
import { getUserById } from "@/api/userApi";
import defaultAvatar from '@/assets/imgs/default-avatar.jpg';


export default function CardReview() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy 5 đánh giá ngẫu nhiên
  const getRandomReviews = (reviewsArray, count) => {
    const shuffled = [...reviewsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, reviewsArray.length));
  };

  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchReviewsAndUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getReviews();
        const randomReviews = getRandomReviews(response, 5);

        // Lấy thông tin người dùng cho mỗi đánh giá
        const reviewsWithUserData = (await Promise.all(
          randomReviews.map(async (review) => {
            try {
              const userResponse = await getUserById(review.userId);
              const user = userResponse.data;
              return {
                id: review.id,
                quote: review.comment || "Không có đánh giá",
                name: user.fullName || "Người dùng ẩn danh",
                position: user.role || "Học viên",
                avatar: user.profileImage || defaultAvatar,
              };
            } catch (userError) {
              console.error(`Lỗi khi lấy thông tin người dùng ${review.userId}:`, userError);
              return null;
            }
          })
        )).filter(review => review !== null);
        setReviews(reviewsWithUserData);
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải đánh giá hoặc thông tin người dùng");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchReviewsAndUsers();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + reviews.length) % reviews.length
    );
  };

  if (isLoading) {
    return (
      <section className="w-full py-16 bg-[#f5f2ff]">
        <div className="container mx-auto px-4 md:px-6">
          <p>Đang tải...</p>
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <section className="w-full py-16 bg-[#f5f2ff]">
        <div className="container mx-auto px-4 md:px-6">
          <p>{error || "Không có đánh giá nào để hiển thị"}</p>
        </div>
      </section>
    );
  }

  return (

    <div className="container mx-auto px-4 md:px-6 p-5 mt-10">
      <div className="flex flex-col md:flex-row items-center justify-between relative">
        {/* Thẻ Đánh Giá */}
        <div className="w-full md:w-1/2 lg:w-6/12 relative z-10 md:-mr-16">
          <div
            className="bg-[#5DB996] rounded-2xl p-8 text-white shadow-lg"
            style={{ borderRadius: "20px" }}
          >
            <p className="text-base md:text-lg mb-8 italic leading-relaxed">
              "{reviews[currentIndex].quote}"
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={reviews[currentIndex].avatar}
                  alt={reviews[currentIndex].name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="text-xs md:text-sm font-light opacity-80 mb-1">
                  {reviews[currentIndex].position}
                </p>
                <h4 className="text-lg md:text-xl font-bold">
                  {reviews[currentIndex].name}
                </h4>
              </div>
            </div>
            {/* Nút Điều Hướng */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
                aria-label="Đánh giá trước"
              >
                <ChevronLeft className="w-5 h-5 text-[#5DB996]" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
                aria-label="Đánh giá tiếp theo"
              >
                <ChevronRight className="w-5 h-5 text-[#5DB996]" />
              </button>
            </div>
          </div>
        </div>

        {/* Phần Nội Dung */}
        <div className="flex items-center bg-[#D3F1DF] py-16 rounded-l-2xl w-full md:w-3/4">
          <div className="w-full md:w-10/12 lg:w-9/12 mx-auto flex flex-col items-start px-8 py-10 shadow-none">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Họ Nói Gì Về Khóa Học?
            </h2>
            <p className="text-gray-600 mb-0">
              “Những đánh giá tích cực như thế này không chỉ truyền cảm hứng, mà còn giúp bạn định hình rõ mình đang cần gì –
              và khóa học có thể mang đến điều gì để thúc đẩy sự phát triển, cầu tiến của bạn trong lĩnh vực công nghệ thông tin.”
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
