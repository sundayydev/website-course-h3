
import api from './axios';
import { getAuthToken, getUserId } from './authUtils';
const API_URL = '/Comment';


export const getComments = async () => {
  try {
    const response = await api.get(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
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
    throw new Error(error.response?.data?.message || `Không thể lấy bình luận ID ${id}`);
  }
};

export const getCommentsByPostId = async (postId) => {

  try {
    const response = await api.get(`${API_URL}/post/${postId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Không thể lấy bình luận theo postId ${postId}`
    );
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
    throw new Error(error.response?.data?.message || 'Không thể tạo bình luận');
  }
};

export const updateComment = async (id, commentData) => {
  const token = getAuthToken();
  try {
    const response = await api.put(
      `${API_URL}/${id}`,
      {
        content: commentData.content,
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
    return response.data || null;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Không thể xóa bình luận ID ${id}`);
  }
};
