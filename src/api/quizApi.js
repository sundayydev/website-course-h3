/* eslint-disable no-unused-vars */
import api from './axios';
import { getAuthToken, isAuthenticated } from './authUtils';

const API_URL = '/quiz';

/**
 * Lấy tất cả các câu hỏi
 * @returns {Promise<Array>} Danh sách các câu hỏi (QuizDTO)
 * @throws {Error} Nếu yêu cầu thất bại
 */
export const getQuizzes = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || 'Không thể lấy danh sách câu hỏi';
    throw new Error(errorMessage);
  }
};

/**
 * Lấy câu hỏi theo ID
 * @param {string} id - ID của câu hỏi
 * @returns {Promise<Object>} Thông tin chi tiết câu hỏi (QuizDTO)
 * @throws {Error} Nếu câu hỏi không tồn tại hoặc yêu cầu thất bại
 */
export const getQuizById = async (id) => {
  if (!id) throw new Error('ID câu hỏi không được để trống');
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy câu hỏi');
    }
    throw new Error(error.response?.data || 'Lỗi khi lấy thông tin câu hỏi');
  }
};

export const getQuizzesByLessonId = async (lessonId) => {
  if (!lessonId) throw new Error('ID bài học không được để trống');
  try {
    console.log('Gửi yêu cầu đến:', `${API_URL}/lesson/${lessonId}`); // Log URL
    const response = await api.get(`${API_URL}/lesson/${lessonId}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu câu hỏi không phải mảng');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes by lesson:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy bài học');
    }
    throw new Error(error.response?.data || 'Không thể lấy danh sách câu hỏi của bài học');
  }
};

export const createQuiz = async (quizData) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!quizData?.Question || !quizData?.Options || quizData.Options.length < 2 || !quizData?.CorrectAnswer) {
    throw new Error('Dữ liệu câu hỏi không hợp lệ');
  }
  if (!quizData.Options.includes(quizData.CorrectAnswer)) {
    throw new Error('Đáp án đúng phải nằm trong danh sách lựa chọn');
  }
  try {
    const response = await api.post(API_URL, quizData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Dữ liệu đầu vào không hợp lệ');
    }
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy bài học');
    }
    throw new Error(error.response?.data || 'Không thể tạo câu hỏi mới');
  }
};

export const updateQuiz = async (id, quizData) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!id) throw new Error('ID câu hỏi không được để trống');
  if (!quizData?.Question || !quizData?.Options || quizData.Options.length < 2 || !quizData?.CorrectAnswer) {
    throw new Error('Dữ liệu câu hỏi không hợp lệ');
  }
  if (!quizData.Options.includes(quizData.CorrectAnswer)) {
    throw new Error('Đáp án đúng phải nằm trong danh sách lựa chọn');
  }
  try {
    const response = await api.put(`${API_URL}/${id}`, quizData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Dữ liệu đầu vào không hợp lệ');
    }
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy câu hỏi');
    }
    throw new Error(error.response?.data || 'Không thể cập nhật câu hỏi');
  }
};

export const deleteQuiz = async (id) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!id) throw new Error('ID câu hỏi không được để trống');
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy câu hỏi');
    }
    throw new Error(error.response?.data || 'Không thể xóa câu hỏi');
  }
};

export const submitAnswer = async (answerData) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!answerData?.quizId || !answerData?.userAnswer) {
    throw new Error('Dữ liệu đáp án không hợp lệ');
  }
  try {
    const response = await api.post(`${API_URL}/submit-answer`, {
      QuizId: answerData.quizId,
      UserAnswer: answerData.userAnswer,
    });
    console.log('Phản hồi từ submit-answer:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi đáp án:', error);
    throw new Error(error.response?.data || 'Lỗi khi gửi trạng thái trả lời');
  }
};