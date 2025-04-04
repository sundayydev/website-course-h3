import api from './axios';
import { jwtDecode } from 'jwt-decode';
const API_URL = '/review';

export const getReviewsByCourseId = async (courseId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.get(`${API_URL}/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const response = await api.post(API_URL, {
      ...reviewData,
      userId: userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá:', error);
    throw error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const response = await api.put(`${API_URL}/${reviewId}`, {
      ...reviewData,
      userId: userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật đánh giá:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const response = await api.delete(`${API_URL}/${reviewId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { userId: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error);
    throw error;
  }
};
