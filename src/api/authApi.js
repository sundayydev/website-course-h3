import api from './axios'; // 🔹 Import Axios đã cấu hình

const API_URL = '/auth'; // Vì `baseURL` đã có sẵn `/api`

export const register = async (userData) => {
  return await api.post(`${API_URL}/register`, userData);
};

export const forgotPassword = async (email) => {
  return api.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = async (token, newPassword) => {
  return api.post(`${API_URL}/reset-password`, { token, newPassword });
};

export const login = async (userData) => {
  return await api.post(`${API_URL}/login`, userData);
};
