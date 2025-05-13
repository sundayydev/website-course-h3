import api from './axios';
import {jwtDecode} from 'jwt-decode';
const API_URL = '/user';

export const getUsers = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  return await api.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getUserById = async (id) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  return await api.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const createUser = async (userData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  return await api.post(API_URL, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateUser = async (id, userData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  return await api.put(`${API_URL}/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  return await api.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Upload ảnh đại diện
export const uploadProfileImage = async (file) => {
  const token = localStorage.getItem('authToken');
  if (!token || typeof token !== 'string' || token.trim() === '') {
    throw new Error('Token không hợp lệ hoặc không tồn tại');
  }

  // Loại bỏ "Bearer " nếu có
  const cleanToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

  let decodedToken;
  try {
    decodedToken = jwtDecode(cleanToken);
  } catch (error) {
    throw new Error('Không thể giải mã token: ' + error.message);
  }

  const userId = decodedToken.id;
  if (decodedToken.exp * 1000 < Date.now()) {
    throw new Error('Token đã hết hạn');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(`${API_URL}/${userId}/upload-profile-image`, formData, {
      headers: { Authorization: `Bearer ${cleanToken}` },
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi tải ảnh');
  }
};

export const updateUserPassword = async (id, passwordData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  return await api.put(`${API_URL}/${id}/password`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};