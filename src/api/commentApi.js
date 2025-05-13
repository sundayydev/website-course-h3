import { jwtDecode } from 'jwt-decode';
import api from './axios';

const API_URL = '/Comment'; // Đồng bộ với backend: endpoint là "api/Comment"

const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token');
  return token;
};

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
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách bình luận');
  }
};

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
    throw new Error(error.response?.data?.message || 'Không thể lấy bình luận theo userId');
  }
};

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
    throw new Error(error.response?.data?.message || `Không thể lấy bình luận ID ${id}`);
  }
};

export const getCommentsByPostId = async (postId) => {
  const token = getAuthToken();
  try {
    const response = await api.get(`${API_URL}/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Dữ liệu trả về:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bình luận theo postId ${postId}:`, error);
    throw new Error(error.response?.data?.message || `Không thể lấy bình luận theo postId ${postId}`);
  }
};

export const createComment = async (commentData) => {
  const token = getAuthToken();
  const userId = getUserId();
  try {
    const response = await api.post(
      API_URL,
      {
        userId: userId,
        postId: commentData.postId,
        content: commentData.content,
        parentCommentId: commentData.parentCommentId || null,
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
    throw new Error(error.response?.data?.message || 'Không thể tạo bình luận');
  }
};

export const updateComment = async (id, commentData) => {
  const token = getAuthToken();
  try {
    const response = await api.put(
      `${API_URL}/${id}`,
      {
        content: commentData.content, // Chỉ gửi content theo UpdateCommentDto
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
    console.error(`Lỗi khi cập nhật bình luận ID ${id}:`, error);
    throw new Error(error.response?.data?.message || `Không thể cập nhật bình luận ID ${id}`);
  }
};

export const deleteComment = async (id) => {
  const token = getAuthToken();
  try {
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || null; // Backend trả về NoContent, nên có thể trả về null
  } catch (error) {
    console.error(`Lỗi khi xóa bình luận ID ${id}:`, error);
    throw new Error(error.response?.data?.message || `Không thể xóa bình luận ID ${id}`);
  }
};