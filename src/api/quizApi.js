import api from './axios';
import { getAuthToken, isAuthenticated } from './authUtils';

const API_URL = '/quiz';

export const getQuizzes = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Không thể lấy danh sách câu hỏi';
    throw new Error(errorMessage);
  }
};

export const getQuizById = async (id) => {
  if (!id) throw new Error('ID câu hỏi không được để trống');
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy câu hỏi');
    }
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin câu hỏi');
  }
};

export const saveUserAnswer = async (answerData) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!answerData?.quizId || !answerData?.userAnswer || !answerData?.lessonId) {
    console.error('Dữ liệu đáp án không hợp lệ:', answerData);
    throw new Error('Dữ liệu đáp án không hợp lệ');
  }
  try {
    const response = await api.post(`${API_URL}/user-answer`, {
      QuizId: answerData.quizId,
      UserAnswer: answerData.userAnswer,
      LessonId: answerData.lessonId,
    });
    console.log('Đáp án đã lưu:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lưu đáp án:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw new Error(error.response?.data?.message || 'Lỗi khi lưu đáp án');
  }
};

export const getUserAnswersByLessonId = async (lessonId) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!lessonId) throw new Error('ID bài học không được để trống');
  try {
    console.log('Gửi yêu cầu lấy đáp án:', lessonId);
    const response = await api.get(`${API_URL}/user-answers/lesson/${lessonId}`);
    console.log('Dữ liệu đáp án thô:', response.data);
    if (!Array.isArray(response.data)) {
      console.error('Dữ liệu trả về không phải mảng:', response.data);
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy đáp án:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 404) {
      return [];
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách đáp án');
  }
};

export const getQuizzesByLessonId = async (lessonId) => {
  if (!lessonId) throw new Error('ID bài học không được để trống');
  try {
    console.log('Gửi yêu cầu đến:', `${API_URL}/lesson/${lessonId}`);
    const response = await api.get(`${API_URL}/lesson/${lessonId}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Dữ liệu câu hỏi không phải mảng');
    }
    console.log('Dữ liệu trả về từ API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi API chi tiết:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy bài học hoặc không có câu hỏi nào.');
    }
    if (error.response?.status === 500) {
      throw new Error('Lỗi máy chủ. Vui lòng thử lại sau.');
    }
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách câu hỏi của bài học');
  }
};

export const createQuiz = async (quizData) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (
    !quizData?.Question ||
    !quizData?.Options ||
    quizData.Options.length < 2 ||
    !quizData?.CorrectAnswer
  ) {
    throw new Error('Dữ liệu câu hỏi không hợp lệ');
  }
  if (!quizData.Options.includes(quizData.CorrectAnswer)) {
    throw new Error('Đáp án đúng phải nằm trong danh sách lựa chọn');
  }
  try {
    const response = await api.post(API_URL, quizData);
    return response.data;
  } catch (error) {
    console.error('Lỗi từ API:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Không thể tạo câu hỏi mới');
  }
};

export const updateQuiz = async (id, quizData) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!id) throw new Error('ID câu hỏi không được để trống');
  if (
    !quizData?.Question ||
    !quizData?.Options ||
    quizData.Options.length < 2 ||
    !quizData?.CorrectAnswer
  ) {
    throw new Error('Dữ liệu câu hỏi không hợp lệ');
  }
  if (!quizData.Options.includes(quizData.CorrectAnswer)) {
    throw new Error('Đáp án đúng phải nằm trong danh sách lựa chọn');
  }
  try {
    const response = await api.post(`${API_URL}/${id}`, quizData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Dữ liệu đầu vào không hợp lệ');
    }
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy câu hỏi');
    }
    throw new Error(error.response?.data?.message || 'Không thể cập nhật câu hỏi');
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
    throw new Error(error.response?.data?.message || 'Không thể xóa câu hỏi');
  }
};

export const submitAndCheckAnswer = async (answerData) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!answerData?.quizId || !answerData?.userAnswer) {
    console.error('Dữ liệu đáp án không hợp lệ:', answerData);
    throw new Error('Dữ liệu đáp án không hợp lệ');
  }
  try {
    const response = await api.post(`${API_URL}/submit-answer`, {
      QuizId: answerData.quizId,
      UserAnswer: answerData.userAnswer,
    });
    const data = response.data;
    console.log('Phản hồi từ submit-answer:', data);
    return {
      isCorrect: data.isCorrect,
      message: data.feedback || (data.isCorrect ? 'Đúng rồi!' : 'Sai rồi!'),
    };
  } catch (error) {
    console.error('Lỗi khi xử lý đáp án:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw new Error(error.response?.data?.message || 'Lỗi khi xử lý đáp án');
  }
};

export const deleteUserAnswersByLessonId = async (lessonId) => {
  if (!isAuthenticated()) throw new Error('Người dùng chưa xác thực');
  if (!lessonId) throw new Error('ID bài học không được để trống');
  try {
    await api.delete(`${API_URL}/user-answers/lesson/${lessonId}`);
  } catch (error) {
    console.error('Lỗi khi xóa đáp án:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.message || 'Lỗi khi xóa đáp án');
  }
};