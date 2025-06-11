// src/api/categoryApi.js
import api from './axios';

const API_URL = '/category';

export const getCategories = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh mục ID ${id}:`, error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật danh mục ID ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo danh mục:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Lỗi khi xóa danh mục ID ${id}:`, error);
    throw error;
  }
};