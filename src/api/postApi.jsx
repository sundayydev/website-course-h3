import api from './axios'; // 🔹 Import Axios đã cấu hình

const API_URL = '/post'; // Vì `baseURL` đã có sẵn `/api`

export const getPost = () => {
  return api.get(`${API_URL}`);
};

export const getPostById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createPost = (data) => {
  return api.post(`${API_URL}`, data);
};

export const updatePost = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deletePost = (id) => {
  return api.delete(`${API_URL}/${id}`);
};
