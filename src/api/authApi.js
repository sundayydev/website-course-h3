import api from './axios'; // Import Axios đã cấu hình

const API_URL = '/auth'; // baseURL đã có sẵn '/api'

export const register = async (userData) => {
  return await api.post(`${API_URL}/register`, userData);
};

export const login = async (userData) => {
  return await api.post(`${API_URL}/login`, userData);
};

export const logout = async () => {
  return await api.post(`${API_URL}/logout`);
};

export const forgotPassword = async (email) => {
  return await api.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = async (email, resetCode, newPassword) => {
  return await api.post(`${API_URL}/reset-password`, { email, resetCode, newPassword });
};

export const getUserProfile = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  return await api.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};