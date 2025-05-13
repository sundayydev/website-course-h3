import api from './axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = '/review';

// Lấy tất cả đánh giá
export const getReviews = async () => {
  try {
    const response = await api.get(`${API_URL}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu đánh giá không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error);
    throw new Error('Không thể lấy danh sách đánh giá');
  }
};

// Lấy đánh giá theo ID
export const getReviewById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy đánh giá');
    }
    console.error('Lỗi khi lấy thông tin đánh giá:', error);
    throw new Error('Lỗi khi lấy thông tin đánh giá');
  }
};

// Lấy đánh giá theo khóa học
export const getReviewsByCourseId = async (courseId) => {
  try {
    const response = await api.get(`${API_URL}/course/${courseId}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu đánh giá không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá của khóa học:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error('Không thể lấy danh sách đánh giá của khóa học');
  }
};

// Lấy đánh giá theo người dùng
export const getReviewsByUserId = async (userId) => {
  try {
    const response = await api.get(`${API_URL}/user/${userId}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu đánh giá không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá của người dùng:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error('Không thể lấy danh sách đánh giá của người dùng');
  }
};

// Tạo đánh giá mới
export const createReview = async (reviewData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const decodedToken = jwtDecode(token);
  const newData = {
    userId: decodedToken.id,
    courseId: reviewData.courseId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  };

  try {
    const response = await api.post(`${API_URL}`, newData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá:', error);
    throw new Error(error.response?.data || 'Không thể tạo đánh giá mới');
  }
};

// Cập nhật đánh giá
export const updateReview = async (id, reviewData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const decodedToken = jwtDecode(token);
  const updatedData = {
    userId: decodedToken.id,
    courseId: reviewData.courseId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  };

  try {
    const response = await api.put(`${API_URL}/${id}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật đánh giá:', error);
    throw new Error(error.response?.data || 'Không thể cập nhật đánh giá');
  }
};

// Xóa đánh giá
export const deleteReview = async (id) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error);
    throw new Error(error.response?.data || 'Không thể xóa đánh giá');
  }
};