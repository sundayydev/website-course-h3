import axios from 'axios';
import { getAuthToken } from './authUtils';


const API_URL = process.env.VITE_API_URL || 'http://localhost:5221/api/Payment';

export const getDecodedToken = () => {
  try {
    const token = getAuthToken();
    return getAuthToken(token);
  } catch (error) {
    console.error('Lỗi khi giải mã token:', error);
    throw new Error('Token không hợp lệ');
  }
};


export const createPayment = async (orderData) => {
  try {
    const token = getAuthToken();
    const formattedOrderData = {
      UserId: orderData.userId,
      Amount: orderData.amount,
      Status: orderData.amount === 0 ? 'Paid' : 'Pending',
      OrderDetails: [
        {
          CourseId: orderData.courseId,
          Price: orderData.amount + (orderData.discountAmount || 0),
          CouponId: orderData.couponId || null,
          DiscountAmount: orderData.discountAmount || 0,
        },
      ],
    };

    // Kiểm tra nếu có couponId nhưng discountAmount không hợp lệ
    if (formattedOrderData.OrderDetails[0].CouponId && formattedOrderData.OrderDetails[0].DiscountAmount <= 0) {
      throw new Error('Số tiền giảm giá không hợp lệ cho mã coupon.');
    }

    console.log('Dữ liệu đơn hàng gửi đi:', formattedOrderData);
    console.log('Token:', token);
    console.log('API URL:', `${API_URL}/create-payment-url`);

    const response = await axios.post(`${API_URL}/create-payment-url`, formattedOrderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi chi tiết:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    throw new Error(error.response?.data?.message || 'Không thể tạo URL thanh toán');
  }
};

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


export const updatePaymentStatus = async (id, status) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán');
  }
};


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
