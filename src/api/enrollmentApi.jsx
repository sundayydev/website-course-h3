import api from './axios'; // 🔹 Import Axios đã cấu hình

const API_URL = '/enrollment'; // Vì `baseURL` đã có sẵn `/api`

export const getEnrollment = () => {
  return api.get(`${API_URL}`);
};
export const getEnrollmentByUserId = (userId) => {
  return api.get(`${API_URL}/user/${userId}`);
};
export const getEnrollmentById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createEnrollment = (data) => {
  return api.post(`${API_URL}`, data);
};

export const updateEnrollment = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deleteEnrollment = (id) => {
  return api.delete(`${API_URL}/${id}`);
};
