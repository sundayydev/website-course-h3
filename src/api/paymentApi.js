import api from './axios';
import { getAuthToken } from './authUtils';

const API_URL = '/payment';

// Lấy tất cả thanh toán
export const getAllPayments = async () => {
  const token = getAuthToken();
  return await api.get(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Lấy thanh toán theo ID
export const getPaymentById = async (id) => {
  const token = getAuthToken();
  return await api.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Lấy thanh toán theo người dùng
export const getPaymentsByUserId = async (userId) => {
  const token = getAuthToken();
  return await api.get(`${API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Lấy thanh toán theo khóa học
export const getPaymentsByCourseId = async (courseId) => {
  const token = getAuthToken();
  return await api.get(`${API_URL}/course/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (id, status) => {
  const token = getAuthToken();
  return await api.patch(`${API_URL}/${id}/status`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Hoàn tiền
export const refundPayment = async (id, reason) => {
  const token = getAuthToken();
  return await api.post(`${API_URL}/${id}/refund`, { reason }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Lấy thống kê thanh toán
export const getPaymentStatistics = async (period = 'month') => {
  const token = getAuthToken();
  return await api.get(`${API_URL}/statistics?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Xuất báo cáo thanh toán
export const exportPaymentReport = async (startDate, endDate) => {
  const token = getAuthToken();
  return await api.get(`${API_URL}/export`, {
    params: { startDate, endDate },
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob'
  });
}; 