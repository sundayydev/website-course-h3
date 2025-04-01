import api from './axios'; // 🔹 Import Axios đã cấu hình

const API_URL = '/lessons'; // Vì `baseURL` đã có sẵn `/api`

export const getLessons = () => {
  return api.get(`${API_URL}`);
};

export const getLessonsById = (id) => {
  return api.get(`${API_URL}/${id}`);
};
export const getLessionsByCourseId = (courseId) => {
  return api.get(`${API_URL}/course/${courseId}`);
};
export const createLessons = (data) => {
  return api.post(`${API_URL}`, data);
};

export const updateLessons = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deleteLessons = (id) => {
  return api.delete(`${API_URL}/${id}`);
};
