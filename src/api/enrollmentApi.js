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
  return await api.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getEnrollmentByUserId = async () => {
  const token = getAuthToken();
  const userId = getUserId();
  
  return await api.get(`${API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getEnrollmentsByCourseId = async (courseId) => {
  const token = getAuthToken();
  try {
    const response = await api.get(`${API_URL}/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Giả sử trả về mảng các enrollment
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
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw error;
  }
};

export const updateEnrollment = async (id, data) => {
  const token = getAuthToken();
  return await api.put(
    `${API_URL}/${id}`, 
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const deleteEnrollment = async (id) => {
  const token = getAuthToken();
  return await api.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
