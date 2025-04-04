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

export const getEnrollment = () => api.get(API_URL);

export const getEnrollmentByUserId = async () => {
  const token = getAuthToken();
  const userId = getUserId();
  
  const response = await api.get(`${API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const getEnrollmentById = (id) => api.get(`${API_URL}/${id}`);

export const createEnrollment = async (courseId) => {
  const token = getAuthToken();
  const userId = getUserId();

  return await api.post(API_URL, 
    { userId, courseId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', 
      },
    }
  );
};

export const updateEnrollment = (id, data) => api.put(`${API_URL}/${id}`, data);

export const deleteEnrollment = (id) => api.delete(`${API_URL}/${id}`);
