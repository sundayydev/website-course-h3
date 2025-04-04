import api from './axios';

const API_URL = '/payment';

export const createPayment = async (paymentData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.post(`${API_URL}/create-payment-url`, paymentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo thanh toán:', error);
    throw error;
  }
};

export const getPaymentStatus = async (orderId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.get(`${API_URL}/status/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
    throw error;
  }
};