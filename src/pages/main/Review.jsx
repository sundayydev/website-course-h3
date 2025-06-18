/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import { getReviewsByCourseId, createReview, updateReview, deleteReview } from '../../api/reviewApi';
import { toast } from 'react-toastify';
import { getUserId, isAuthenticated } from '../../api/authUtils';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../assets/imgs/default-avatar.jpg';
import { formatDate } from '../../utils/formatDate';
import { getEnrollmentByUserId } from '../../api/enrollmentApi';

const getUserAvatar = (userProfileImage) => {
  return userProfileImage ? userProfileImage : defaultAvatar;
};

// Review Component
const Review = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editReviewId, setEditReviewId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const currentUserId = isAuthenticated() ? getUserId() : null;

  // Fetch reviews and enrollment data
  const fetchReviews = useCallback(async () => {
    if (!courseId) {
      toast.error('Không có ID khóa học!');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Lấy danh sách đánh giá
      const response = await getReviewsByCourseId(courseId);
      if (Array.isArray(response)) {
        setReviews(response);
        const userReview = response.find((review) => review.userId === currentUserId);
        if (userReview) {
          setEditReviewId(userReview.id);
          setRating(userReview.rating);
          setReviewText(userReview.comment || '');
        }
      } else {
        setReviews([]);
        toast.error('Dữ liệu đánh giá không hợp lệ.');
      }

      // Kiểm tra đăng ký
      if (isAuthenticated()) {
        const enrollmentResponse = await getEnrollmentByUserId();
        if (Array.isArray(enrollmentResponse.data)) {
          const isUserEnrolled = enrollmentResponse.data.some(
            (enrollment) => enrollment.courseId === courseId
          );
          setIsEnrolled(isUserEnrolled);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Không thể tải dữ liệu. Vui lòng thử lại!');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, currentUserId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle star click
  const handleStarClick = (star) => {
    if (!isEnrolled) {
      toast.error('Bạn cần đăng ký khóa học để đánh giá!');
      return;
    }
    setRating(star);
  };

  // Handle submit review
  const handleSubmitReview = async () => {
    if (!isEnrolled) {
      toast.error('Bạn cần đăng ký khóa học để đánh giá!');
      return;
    }

    if (!rating || !reviewText.trim()) {
      toast.error('Bạn cần chọn số sao và nhập nội dung đánh giá!');
      return;
    }

    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để thực hiện hành động này!');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = { courseId, rating, comment: reviewText };
      let response;
      if (editReviewId) {
        response = await updateReview(editReviewId, reviewData);
        setReviews((prev) =>
          prev.map((review) => (review.id === editReviewId ? response : review))
        );
        toast.success('Đánh giá đã được cập nhật thành công!');
      } else {
        response = await createReview(reviewData);
        setReviews((prev) => [...prev, response]);
        setEditReviewId(response.id);
        toast.success('Đánh giá đã được gửi thành công!');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi đánh giá!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (!isEnrolled) {
      toast.error('Bạn cần đăng ký khóa học để xóa đánh giá!');
      return;
    }

    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để thực hiện hành động này!');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      if (reviewId === editReviewId) {
        setEditReviewId(null);
        setRating(0);
        setReviewText('');
      }
      toast.success('Đánh giá đã được xóa thành công!');
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa đánh giá!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render individual review
  const RenderReview = ({ review }) => {
    const isOwner = currentUserId === review.userId;

    return (
      <div className="flex items-start space-x-3 mt-2">
        <Link to={`/profile/${review.userId}`}>
          <img
            src={getUserAvatar(review.userProfileImage)}
            alt={review.userFullName || 'Ẩn danh'}
            className="w-10 h-10 rounded-full object-cover "
            onError={(e) => (e.target.src = defaultAvatar)}
          />
        </Link>

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
            {isOwner && !editReviewId && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!isEnrolled) {
                      toast.error('Bạn cần đăng ký khóa học để sửa đánh giá!');
                      return;
                    }
                    setEditReviewId(review.id);
                    setRating(review.rating);
                    setReviewText(review.comment || '');
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-700 whitespace-pre-line mt-1">{review.comment}</p>
          <p className="text-sm text-gray-500 mt-2">{formatDate(review.createdAt)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
      {isLoading ? (
        <p className="text-center text-gray-500">Đang tải đánh giá...</p>
      ) : (
        <>
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
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Viết đánh giá của bạn..."
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows="4"
            disabled={!isEnrolled}
          />
          <button
            onClick={handleSubmitReview}
            className={`flex items-center ${editReviewId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white py-2 px-4 rounded-lg transition duration-200`}
            disabled={isSubmitting || !isEnrolled}
          >
            {isSubmitting ? 'Đang xử lý...' : editReviewId ? 'Lưu chỉnh sửa' : 'Gửi đánh giá'}
            <Send className="ml-2" size={18} />
          </button>

          {reviews.length > 0 ? (
            <div className="mt-6">
              <h4 className="font-semibold text-lg text-gray-700 mb-4">Đánh giá của người dùng:</h4>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <React.Fragment key={review.id}>
                    {index > 0 && <hr className="border-gray-200" />}
                    <RenderReview review={review} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">Chưa có đánh giá nào.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Review;