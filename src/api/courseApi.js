import api from './axios'; // 🔹 Import Axios đã cấu hình

const API_URL = '/course'; // Vì `baseURL` đã có sẵn `/api`

export const getCourses = () => {
  return api.get(`${API_URL}`);
};

export const getCourseById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createCourse = (data) => {
  return api.post(`${API_URL}`, data);
};

export const updateCourse = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deleteCourse = (id) => {
  return api.delete(`${API_URL}/${id}`);
};
