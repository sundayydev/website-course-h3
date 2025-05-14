import api from './axios';

// Đặt API_URL thành '/Category' cho API bình luận
const API_URL = '/Category';

// Lấy danh sách danh mục (GET /api/Category)
export const getCategories = async () => {
  try {
    const response = await api.get(API_URL);

    console.log('Danh sách danh mục:', response.data);

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    throw error;
  }
};

// Lấy danh mục theo ID (GET /api/Category/{id})
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh mục ID ${id}:`, error);
    throw error;
  }
};
