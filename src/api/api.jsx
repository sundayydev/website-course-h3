import axios from 'axios';

const API_URL = 'http://localhost:5221/api/auth';

// Đăng ký
export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

// Đăng nhập
export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};
