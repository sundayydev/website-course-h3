import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.VITE_API_URL || 'http://localhost:5221/api/Payment';

/**
 * Lấy token từ localStorage
 * @returns {string} - Token xác thực
 * @throws {Error} - Nếu không tìm thấy token
 */
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token xác thực');
  return token;
};

/**
 * Giải mã token để lấy thông tin
 * @returns {Object} - Thông tin từ token
 * @throws {Error} - Nếu token không hợp lệ
 */
export const getDecodedToken = () => {
  try {
    const token = getAuthToken();
    return jwtDecode(token);
  } catch (error) {
    console.error('Lỗi khi giải mã token:', error);
    throw new Error('Token không hợp lệ');
  }
};

/**
 * Tạo URL thanh toán
 * @param {Object} orderData - Dữ liệu đơn hàng { userId, courseId, amount }
 * @returns {Promise<Object>} - Kết quả chứa paymentUrl hoặc thông báo
 */
export const createPayment = async (orderData) => {
  try {
    const token = getAuthToken();
    // Định dạng dữ liệu theo CreateOrderDto của backend
    const formattedOrderData = {
      UserId: orderData.userId,
      Amount: orderData.amount,
      OrderDetails: [
        {
          CourseId: orderData.courseId,
        },
      ],
    };

    console.log('Dữ liệu đơn hàng gửi đi:', formattedOrderData);

    const response = await axios.post(`${API_URL}/create-payment-url`, formattedOrderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo URL thanh toán:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tạo URL thanh toán');
  }
};

/**
 * Lấy danh sách thanh toán theo khóa học
 * @param {string} courseId - ID của khóa học
 * @returns {Promise<Object>} - Danh sách thanh toán
 */
export const getPaymentsByCourseId = async (courseId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thanh toán của khóa học:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách thanh toán');
  }
};

/**
 * Cập nhật trạng thái thanh toán
 * @param {string} id - ID thanh toán
 * @param {string} status - Trạng thái mới
 * @returns {Promise<Object>} - Kết quả cập nhật
 */
export const updatePaymentStatus = async (id, status) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán');
  }
};

/**
 * Xử lý callback thanh toán từ VnPay
 * @param {Object} queryParams - Tham số query từ callback
 * @returns {Promise<Object>} - Kết quả xử lý callback
 */
export const paymentCallback = async (queryParams) => {
  try {
    const token = getAuthToken();
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await axios.get(`${API_URL}/payment-callback?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi xử lý callback thanh toán:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể xử lý callback thanh toán');
  }
};

/**
 * Xuất báo cáo thanh toán
 * @param {string} startDate - Ngày bắt đầu
 * @param {string} endDate - Ngày kết thúc
 * @returns {Promise<Blob>} - File báo cáo dạng Blob
 */
export const exportPaymentReport = async (startDate, endDate) => {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams({ startDate, endDate }).toString();
    const response = await axios.get(`${API_URL}/export?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi xuất báo cáo thanh toán:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể xuất báo cáo thanh toán');
  }
};