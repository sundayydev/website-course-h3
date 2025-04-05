import api from './axios'; // 🔹 Import Axios đã cấu hình

const API_URL = '/lessons'; // Vì `baseURL` đã có sẵn `/api`

export const getLessons = () => {
  return api.get(`${API_URL}`);
};

export const getLessonById = (id) => {
  return api.get(`${API_URL}/${id}`)
    .then(response => {
      if (response.status === 404) {
        throw new Error('Không tìm thấy bài học');
      }
      return response.data;
    })
    .catch(error => {
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy bài học');
      }
      throw error;
    });
};

export const getLessonsByCourseId = (courseId) => {
  return api.get(`${API_URL}/course/${courseId}`);
};

export const createLesson = (data) => {
  return api.post(`${API_URL}`, data);
};

export const updateLesson = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deleteLesson = (id) => {
  return api.delete(`${API_URL}/${id}`);
};
