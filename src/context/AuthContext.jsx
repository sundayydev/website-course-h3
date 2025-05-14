import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, getUserProfile, logout as logoutApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Khởi tạo user từ localStorage nếu có
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  useEffect(() => {
    if (token) {
      checkUser();
    }
  }, [token]);

  const checkUser = async () => {
    try {
      const response = await getUserProfile();
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        throw new Error('Không lấy được thông tin người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra user:', error);
      setUser(null);
      setToken('');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await login({ email, password });
      const { token, email: userEmail, role } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
        setToken(token);

        const userResponse = await getUserProfile();
        if (userResponse.data) {
          setUser({ ...userResponse.data, email: userEmail, role });
          localStorage.setItem(
            'user',
            JSON.stringify({ ...userResponse.data, email: userEmail, role })
          );
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Đăng nhập thất bại:', error.response?.data);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken('');
      setUser(null);
    } catch (error) {
      console.error('Đăng xuất thất bại:', error.response?.data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
