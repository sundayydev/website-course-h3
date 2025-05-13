import { jwtDecode } from 'jwt-decode';
import api from './axios';

const API_URL = '/order'; // Đổi thành /Order để tránh double /api/

// Lấy tất cả đơn hàng
export const getAllOrders = async ({ pageNumber = 1, pageSize = 5 }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new Error('Token đã hết hạn');
    }

    const queryParams = new URLSearchParams();
    queryParams.append('pageNumber', pageNumber);
    queryParams.append('pageSize', pageSize);

    console.log(`Gọi API: ${API_URL}?${queryParams.toString()}`); // Thêm log để debug
    const response = await api.get(`${API_URL}?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('All orders response:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.status === 404
        ? 'Không tìm thấy endpoint /Order. Vui lòng kiểm tra backend.'
        : error.response?.data?.message || error.response?.data || error.message;
    console.error('Lỗi khi lấy danh sách đơn hàng:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Lấy đơn hàng theo userId
export const getOrdersByUserId = async (userId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new Error('Token đã hết hạn');
    }

    const response = await api.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Orders for user ${userId}:`, response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message;
    console.error(`Lỗi khi lấy đơn hàng cho user ${userId}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Lấy chi tiết đơn hàng theo orderId
export const getOrderDetailsById = async (orderId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new Error('Token đã hết hạn');
    }

    const response = await api.get(`${API_URL}/${orderId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Order details for ${orderId}:`, response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message;
    console.error(`Lỗi khi lấy chi tiết đơn hàng ${orderId}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Lấy đơn hàng theo orderId
export const getOrderById = async (orderId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new Error('Token đã hết hạn');
    }

    const response = await api.get(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Order ${orderId}:`, response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message;
    console.error(`Lỗi khi lấy đơn hàng ${orderId}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Tạo đơn hàng
export const createOrder = async (data) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new Error('Token đã hết hạn');
    }

    const newData = {
      userId: decodedToken.id,
      amount: data.amount,
      status: data.amount === 0 ? 'Paid' : 'Pending',
      orderDetails: [{
        courseId: data.courseId,
        price: data.price || data.amount,
        couponId: data.couponId || null,
        discountAmount: data.discountAmount || 0
      }]
    };

    const response = await api.post(API_URL, newData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Created order:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message;
    console.error('Lỗi khi tạo đơn hàng:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new Error('Token đã hết hạn');
    }

    console.log(`Updating status for order ${orderId} to ${status}`);
    const response = await api.put(`${API_URL}/${orderId}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`Updated order ${orderId}:`, response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message;
    console.error(`Lỗi khi cập nhật trạng thái đơn hàng ${orderId}:`, errorMessage);
    throw new Error(errorMessage);
  }
};