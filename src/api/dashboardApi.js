import api from './axios';

const API_URL = '/dashboard';

export const getDashboardStats = async () => {
   const token = localStorage.getItem('authToken');
   if (!token) {
     throw new Error('Không tìm thấy token');
   }
  try {
    const response = await api.get(`${API_URL}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin thống kê:', error);
    throw error;
  }
}; 