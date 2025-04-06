import { jwtDecode } from 'jwt-decode';
import api from './axios';

const API_URL = '/order';

// Lấy tất cả đơn hàng (giả định cần thêm endpoint GET /api/order trong backend)
export const getAllOrders = async ({pageNumber=1, pageSize=10}) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const queryParams = new URLSearchParams();
  queryParams.append('pageNumber', pageNumber);
  queryParams.append('pageSize', pageSize);
  try {
    const response = await api.get(`${API_URL}?${queryParams.toString()}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('All orders:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error.response?.data || error.message);
    throw error;
  }
};

// Lấy đơn hàng theo userId
export const getOrdersByUserId = async (userId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Orders for user ${userId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng cho user ${userId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Lấy chi tiết đơn hàng theo orderId
export const getOrderDetailsById = async (orderId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.get(`${API_URL}/${orderId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Order details for ${orderId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết đơn hàng ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Lấy đơn hàng theo orderId (tương ứng GET /api/order/{id})
export const getOrderById = async (orderId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.get(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Order ${orderId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Tạo đơn hàng (tương ứng POST /api/order/create)
export const createOrder = async (data) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const decodedToken = jwtDecode(token);
  
  const newData = {
    userId: decodedToken.id, 
    courseId: data.courseId,
    amount: data.amount,
    status: 'Pending', 
  };

  try {
    const response = await api.post(`${API_URL}/create`, newData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Created order:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng (tương ứng PUT /api/order/{id}/status)
export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    console.log(`Updating status for order ${orderId} to ${status}`); // Thêm log để kiểm tra
    const response = await api.put(`${API_URL}/${orderId}/status`, status, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái đơn hàng ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};
export const deleteOrder = async (orderId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.delete(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Deleted order ${orderId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa đơn hàng ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};