import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Import Axios đã cấu hình

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Lấy token từ LocalStorage khi load trang

  useEffect(() => {
    if (token) {
      checkUser(); // Nếu có token, kiểm tra đăng nhập
    }
  }, [token]);

  const checkUser = async () => {
    try {
      const response = await api.get('/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token'); // Xóa token nếu lỗi xác thực
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token); // Lưu token vào localStorage
      setToken(token);
      await checkUser();
    } catch (error) {
      console.error('Đăng nhập thất bại', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Xóa token khỏi localStorage
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>{children}</AuthContext.Provider>
  );
};
