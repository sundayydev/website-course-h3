import api from './axios';
import { getAuthToken } from './authUtils';
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

export const getUserByProfile = async (id) => {
  const token = getAuthToken();
  return await api.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

}

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
export const uploadProfileImage = async (file, userId) => {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(`${API_URL}/${userId}/upload-profile-image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
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
