import api from './axios'; // 🔹 Import Axios đã cấu hình

const API_URL = '/user'; // Vì `baseURL` đã có sẵn `/api`

// Hàm lấy thông tin người dùng
export const getUserInfo = async () => {
   const token = localStorage.getItem('authToken');
   if (!token) {
     throw new Error('Không tìm thấy token');
   }
 
   // Gửi yêu cầu GET để lấy thông tin người dùng
   return api.get(`${API_URL}/profile`, {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json',
     }
   });
};