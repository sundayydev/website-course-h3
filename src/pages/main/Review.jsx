/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import { getReviewsByCourseId, createReview, updateReview } from '../../api/reviewApi';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const Review = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsByCourseId(courseId);
        if (response && Array.isArray(response)) {
          setReviews(response);
          
          // Check if current user has already reviewed
          const authToken = localStorage.getItem('authToken');
          if (authToken) {
            const decodedToken = jwtDecode(authToken);
            const userReview = response.find(review => review.userId === decodedToken.id);
            if (userReview) {
              setExistingReview(userReview);
              setRating(userReview.rating);
              setReviewText(userReview.comment || '');
            }
          }
        } else {
          console.error('Invalid reviews data format');
          setReviews([]);
          toast.error('Dữ liệu đánh giá không hợp lệ.');
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách đánh giá:', error);
        toast.error(error.message || 'Lỗi khi tải danh sách đánh giá.');
        setReviews([]);
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

  // Handle submit review
  const handleSubmitReview = async () => {
    // Kiểm tra các trường bắt buộc
    if (!rating || !reviewText) {
      toast.error('Bạn cần chọn sao và nhập bình luận!');
      return;
    }

    setIsSubmitting(true);
    const authToken = localStorage.getItem('authToken');

    if (!authToken || authToken.split('.').length !== 3) {
      toast.error('Token không hợp lệ hoặc thiếu cấu trúc.');
      setIsSubmitting(false);
      return;
    }

    try {
      const reviewData = {
        courseId: courseId,
        rating: rating,
        comment: reviewText
      };

      let response;
      if (existingReview) {
        // Update existing review
        response = await updateReview(existingReview.id, reviewData);
        setReviews(prevReviews => prevReviews.map(review => 
          review.id === existingReview.id ? response : review
        ));
        toast.success('Đánh giá đã được cập nhật thành công!');
        console.log('Đánh giá đã được cập nhật:', response);
      } else {
        // Create new review
        response = await createReview(reviewData);
        setReviews(prevReviews => [...prevReviews, response]);
        setExistingReview(response);
        toast.success('Đánh giá đã được gửi thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      toast.error(error.message || 'Lỗi khi gửi đánh giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-pink-500 mb-4">Đánh giá khóa học</h3>

      {/* Đánh giá theo sao */}
      <div className="flex items-center space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={24}
            className={`cursor-pointer ${rating >= star ? 'text-yellow-500' : 'text-gray-300'} hover:scale-110 transition-transform`}
            onClick={() => handleStarClick(star)}
          />
        ))}
      </div>

      {/* Form nhập bình luận */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Viết đánh giá của bạn..."
        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
        rows="4"
      />

      {/* Nút gửi đánh giá */}
      <button
        onClick={handleSubmitReview}
        className={`flex items-center ${
          existingReview ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'
        } text-white py-2 px-4 rounded-lg transition duration-200`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Đang gửi...' : existingReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
        <Send className="ml-2" size={18} />
      </button>

      {/* Hiển thị các đánh giá đã có */}
      {reviews.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg text-gray-700 mb-4">Đánh giá của người khác:</h4>
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="border-b pb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={review.userProfileImage ? `${import.meta.env.VITE_API_URL}${review.userProfileImage}` : 'https://i.pravatar.cc/150'}
                    alt={review.userFullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                    onError={(e) => (e.target.src = 'https://i.pravatar.cc/150')}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="font-semibold text-gray-800">{review.userFullName || 'Ẩn danh'}</p>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={16}
                              className={review.rating >= star ? 'text-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;