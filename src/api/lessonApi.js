import api from './axios';

const API_URL = '/lesson';

// Lấy tất cả bài học
export const getLessons = async () => {
  try {
    const response = await api.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw new Error('Không thể lấy danh sách bài học');
  }
};

// Lấy bài học theo ID
export const getLessonById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy bài học');
    }
    throw new Error('Lỗi khi lấy thông tin bài học');
  }
};

// Lấy bài học theo khóa học
export const getLessonsByCourseId = async (courseId) => {
  try {
    const response = await api.get(`${API_URL}/course/${courseId}`);
    console.log('API Response:', response);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu bài học không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching lessons:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error('Không thể lấy danh sách bài học của khóa học');
  }
};

// Lấy bài học theo chương
export const getLessonsByChapterId = async (chapterId) => {
  try {
    const response = await api.get(`${API_URL}/chapter/${chapterId}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu bài học không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching lessons by chapter:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error('Không thể lấy danh sách bài học của chương');
  }
};

// Tạo bài học mới
export const createLesson = async (lessonData) => {
  try {
    const response = await api.post(API_URL, lessonData);
    return response.data;
  } catch (error) {
    throw new Error('Không thể tạo bài học mới');
  }
};

// Cập nhật bài học
export const updateLesson = async (id, lessonData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, lessonData);
    return response.data;
  } catch (error) {
    throw new Error('Không thể cập nhật bài học');
  }
};

// Xóa bài học
export const deleteLesson = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Không thể xóa bài học');
  }
};