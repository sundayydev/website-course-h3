import api from './axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = '/user';

// Hàm lấy thông tin người dùng
export const getUserInfo = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.get(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUserInfo = async (userId, userData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.put(`${API_URL}/profile/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    throw error;
  }
};

// Upload ảnh đại diện
export const uploadProfileImage = async (file) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(`${API_URL}/profile/upload-avatar/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    throw error;
  }
};