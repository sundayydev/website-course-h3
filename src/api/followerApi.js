import api from './axios';
import { getAuthToken } from './authUtils';
const API_URL = '/follower';

// Get all followers
export const getAllFollowers = async () => {
  try {
    return await api.get(API_URL);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người theo dõi');
  }
};

// Get follower by ID
export const getFollowerById = async (id) => {
  try {
    return await api.get(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin người theo dõi');
  }
};

// Get followers of a user
export const getFollowersByUser = async (userId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    return await api.get(`${API_URL}/followers/${userId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người theo dõi của người dùng');
  }
};

// Get users a user is following
export const getFollowingByUser = async (userId) => {
  const token = getAuthToken();;
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    return await api.get(`${API_URL}/following/${userId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng đang theo dõi');
  }
};

// Create a new follow relationship
export const createFollower = async (followerData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.post(API_URL, {
      FollowerId: followerData.followerId, // Đảm bảo khớp với DTO
      FollowingId: followerData.userId,    // Đổi userId thành FollowingId
      CreatedAt: new Date().toISOString()  // Thêm nếu backend yêu cầu
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi tạo mối quan hệ theo dõi');
  }
};
// Delete a follow relationship
export const deleteFollower = async (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    return await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi xóa mối quan hệ theo dõi');
  }
};