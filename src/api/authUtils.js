import { jwtDecode } from 'jwt-decode';

// Lấy token xác thực từ localStorage
export const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token');
  return token;
};

// Lấy ID người dùng từ token JWT
export const getUserId = () => {
  const token = getAuthToken();
  const decoded = jwtDecode(token);
  if (!decoded.id) throw new Error('Token không hợp lệ');
  return decoded.id;
};

// Kiểm tra xem người dùng đã đăng nhập hay chưa
export const isAuthenticated = () => {
  try {
    const token = getAuthToken();
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Lưu token vào localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Xóa token khỏi localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};
