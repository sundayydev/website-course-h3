import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import axios from 'axios';

const Review = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5221/api/Review/Course/${courseId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  // Handle star click to select rating
  const handleStarClick = (star) => {
    setRating(star);
  };

  // Giải mã JWT token thủ công
  const decodeJWT = (token) => {
    // Tách token thành ba phần: header, payload và signature
    const [header, payload, signature] = token.split('.');

    if (!payload) {
      throw new Error('Token không hợp lệ');
    }

    // Giải mã phần payload từ base64Url
    const base64Url = payload.replace(/-/g, '+').replace(/_/g, '/'); // Chuẩn hóa base64Url
    const base64 = atob(base64Url); // Giải mã base64 thành chuỗi
    const decodedPayload = JSON.parse(base64); // Chuyển đổi chuỗi thành object JSON

    return decodedPayload; // Trả về payload đã giải mã
  };

  // Handle submit review
  const handleSubmitReview = async () => {
    // Kiểm tra các trường bắt buộc
    if (!rating || !reviewText) {
      setError('Bạn cần chọn sao và nhập bình luận!');
      return;
    }

    setIsSubmitting(true);
    const authToken = localStorage.getItem('authToken');

    if (!authToken || authToken.split('.').length !== 3) {
      setError('Token không hợp lệ hoặc thiếu cấu trúc');
      setIsSubmitting(false);
      return;
    }

    try {
      // Giải mã token
      const decodedToken = decodeJWT(authToken);

      // Lấy userId từ token đã giải mã
      const userId = decodedToken.userId;

      console.log('User ID from Token:', userId);

      const reviewData = {
        courseId: courseId,
        rating: rating,
        comment: reviewText,
        userId: userId, // Sử dụng userId từ token giải mã
      };

      // Gửi request để thêm đánh giá
      const response = await axios.post('http://localhost:5221/api/Review', reviewData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Cập nhật danh sách đánh giá
      setReviews((prevReviews) => [...prevReviews, response.data]);
      setReviewText('');
      setRating(0);
      setError('');
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      setError('Lỗi khi gửi đánh giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Đánh giá khóa học</h3>

      {/* Đánh giá theo sao */}
      <div className="flex items-center space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={rating >= star ? 'text-yellow-500' : 'text-gray-300'}
            onClick={() => handleStarClick(star)}
          />
        ))}
      </div>

      {/* Form nhập bình luận */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Viết đánh giá của bạn..."
        className="w-full p-3 border rounded-lg mb-4"
        rows="4"
      />

      {/* Nút gửi đánh giá */}
      <button
        onClick={handleSubmitReview}
        className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        <Send className="ml-2" size={18} />
      </button>

      {/* Hiển thị các đánh giá đã có */}
      {reviews.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold">Đánh giá của người khác:</h4>
          <div className="space-y-4 mt-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="border-b py-4">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={review.rating >= star ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
