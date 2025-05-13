import api from './axios';

const API_URL = '/chapter';

// Lấy tất cả chương
export const getChapters = async () => {
  try {
    const response = await api.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw new Error('Không thể lấy danh sách chương');
  }
};

// Lấy chương theo ID
export const getChapterById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy chương');
    }
    throw new Error('Lỗi khi lấy thông tin chương');
  }
};

// Lấy chương theo khóa học
export const getChaptersByCourseId = async (courseId) => {
  try {
    const response = await api.get(`${API_URL}/course/${courseId}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu chương không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching chapters:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error('Không thể lấy danh sách chương của khóa học');
  }
};

// Tạo chương mới
export const createChapter = async (chapterData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.post(API_URL, chapterData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Không thể tạo chương mới');
  }
};

// Cập nhật chương
export const updateChapter = async (id, chapterData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.put(`${API_URL}/${id}`, chapterData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Không thể cập nhật chương');
  }
};

// Xóa chương
export const deleteChapter = async (id) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Không thể xóa chương');
  }
};