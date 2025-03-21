import axios from 'axios';

const API_URL = 'https://localhost:7225/api/auth'; // Đổi port nếu cần

// Đăng ký
export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

// Đăng nhập
export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};
