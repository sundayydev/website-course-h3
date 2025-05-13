import { jwtDecode } from 'jwt-decode';
import api from './axios';

const API_URL = '/enrollment';

const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token');
  return token;
};

const getUserId = () => {
  const token = getAuthToken();
  const decoded = jwtDecode(token);
  if (!decoded.id) throw new Error('Token không hợp lệ');
  return decoded.id;
};

export const getEnrollments = async () => {
  const token = getAuthToken();
  try {
    const response = await api.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đăng ký:', error);
    throw error;
  }
};

export const getEnrollmentByUserId = async () => {
  const token = getAuthToken();
  const userId = getUserId();
  try {
    const response = await api.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy đăng ký cho user ${userId}:`, error);
    throw error;
  }
};

export const getEnrollmentsByCourseId = async (courseId) => {
  const token = getAuthToken();
  try {
    const response = await api.get(`${API_URL}/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách đăng ký cho khóa học ${courseId}:`, error);
    throw error;
  }
};

export const createEnrollment = async (courseId) => {
  try {
    const token = getAuthToken();
    const userId = getUserId();
    const response = await api.post(
        API_URL,
        {
          UserId: userId,
          CourseId: courseId,
          Status: "Enrolled"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
    );
    return response;
  } catch (error) {
    console.error('Lỗi khi tạo đăng ký:', error.response?.data || error.message);
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw error;
  }
};

export const updateEnrollment = async (id, data) => {
  const token = getAuthToken();
  try {
    const response = await api.put(
        `${API_URL}/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
    );
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật đăng ký ${id}:`, error);
    throw error;
  }
};

export const deleteEnrollment = async (id) => {
  const token = getAuthToken();
  try {
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa đăng ký ${id}:`, error);
    throw error;
  }
};