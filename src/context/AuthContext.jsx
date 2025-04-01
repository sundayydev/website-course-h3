import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios'; // Import Axios đã cấu hình

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Khởi tạo user từ localStorage nếu có
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('authToken') || ''); // Lấy token từ LocalStorage khi load trang

  useEffect(() => {
    if (token) {
      checkUser(); // Nếu có token, kiểm tra đăng nhập
    }
  }, [token]);

  const checkUser = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        throw new Error('Không lấy được thông tin người dùng');
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra user:', error);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token);
        setToken(token);
        
        const userResponse = await api.get('/user/profile');
        if (userResponse.data) {
          setUser(userResponse.data);
          localStorage.setItem('user', JSON.stringify(userResponse.data));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Xóa token khỏi localStorage
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
