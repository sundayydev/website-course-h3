import { jwtDecode } from 'jwt-decode';
import api from './axios';

// Đặt API_URL thành '/Comment' cho API bình luận
const API_URL = '/Comment';

// Lấy token từ localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token');
  return token;
};

// Lấy userId từ token
const getUserId = () => {
  const token = getAuthToken();
  try {
    const decoded = jwtDecode(token);
    if (!decoded.id) throw new Error('Token không hợp lệ: Không có id');
    return decoded.id;
  } catch (error) {
    throw new Error('Lỗi giải mã token: ' + error.message);
  }
};

// Lấy tất cả bình luận (GET /api/Comment)
export const getComments = async () => {
  const token = getAuthToken();
  try {
    const response = await api.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bình luận:', error);
    throw error;
  }
};

// Lấy bình luận theo userId (GET /api/Comment/user/{userId})
export const getCommentsByUserId = async () => {
  const token = getAuthToken();
  const userId = getUserId();
  try {
    const response = await api.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy bình luận theo userId:', error);
    throw error;
  }
};

// Lấy bình luận theo ID (GET /api/Comment/{id})
export const getCommentById = async (id) => {
  const token = getAuthToken();
  try {
    const response = await api.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bình luận ID ${id}:`, error);
    throw error;
  }
};

export const getCommentsByPostId = async (postId) => {
  const token = getAuthToken();
  try {
    const response = await api.get(`${API_URL}/Post`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        postId: postId, 
      },
    });
    console.log('Dữ liệu trả về:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bình luận theo postId ${postId}:`, error.response?.data || error.message);
    throw error;
  }
};
// Tạo bình luận mới (POST /api/Comment)
export const createComment = async (commentData) => {
  const token = getAuthToken();
  const userId = getUserId();
  try {
    const response = await api.post(
      API_URL,
      {
        userId: userId, // Gửi userId từ token
        ...commentData,  // Các trường khác như content, courseId, v.v.
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo bình luận:', error);
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw error;
  }
};

// Cập nhật bình luận (PUT /api/Comment/{id})
export const updateComment = async (id, commentData) => {
  const token = getAuthToken();
  try {
    const response = await api.put(
      `${API_URL}/${id}`,
      commentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật bình luận ID ${id}:`, error);
    throw error;
  }
};

// Xóa bình luận (DELETE /api/Comment/{id})
export const deleteComment = async (id) => {
  const token = getAuthToken();
  try {
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa bình luận ID ${id}:`, error);
    throw error;
  }
};