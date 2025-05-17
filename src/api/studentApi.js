import api from './axios';
import { getAuthToken } from './authUtils';

const API_URL = '/student';

// Hàm kiểm tra định dạng Guid
const isValidGuid = (id) => {
  const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return typeof id === 'string' && guidRegex.test(id);
};

// Lấy danh sách học viên
export const getStudents = async () => {
  try {
    getAuthToken(); // Kiểm tra token
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách học viên:', error);
    throw error;
  }
};

// Thêm học viên mới
export const addStudent = async (studentData) => {
  try {
    getAuthToken(); // Kiểm tra token
    if (!studentData || !studentData.fullName || !studentData.email) {
      throw new Error('Dữ liệu học viên không hợp lệ');
    }

    const data = {
      fullName: studentData.fullName,
      email: studentData.email,
      password: studentData.password,
      birthDate: studentData.birthDate,
    };

    console.log('Dữ liệu gửi đi:', data);

    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm học viên:', error);
    throw error;
  }
};

// Cập nhật thông tin học viên
export const updateStudent = async (studentId, studentData) => {
  try {
    getAuthToken(); // Kiểm tra token
    if (!isValidGuid(studentId)) {
      throw new Error('ID học viên không đúng định dạng Guid');
    }

    if (!studentData || !studentData.fullName || !studentData.email) {
      throw new Error('Dữ liệu học viên không hợp lệ');
    }

    const data = {
      fullName: studentData.fullName,
      email: studentData.email,
      birthDate: studentData.birthDate,
    };

    const response = await api.put(`${API_URL}/${studentId}`, data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin học viên:', error);
    throw error;
  }
};

// Tải lên avatar
export const uploadAvatar = async (studentId, avatar) => {
  try {
    getAuthToken(); // Kiểm tra token
    if (!isValidGuid(studentId)) {
      throw new Error('ID học viên không đúng định dạng Guid');
    }

    if (!(avatar instanceof File)) {
      throw new Error('Avatar phải là một tệp hợp lệ');
    }

    const formData = new FormData();
    formData.append('file', avatar);

    console.log('Dữ liệu gửi đi:', formData);

    const response = await api.post(`${API_URL}/upload-avatar/${studentId}`, formData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải lên avatar:', error);
    throw error;
  }
};

// Xóa học viên
export const deleteStudent = async (studentId) => {
  try {
    getAuthToken(); // Kiểm tra token
    if (!isValidGuid(studentId)) {
      throw new Error('ID học viên không đúng định dạng Guid');
    }

    const response = await api.delete(`${API_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa học viên:', error);
    throw error;
  }
};

// Lấy thông tin học viên theo ID
export const getStudentById = async (studentId) => {
  try {
    getAuthToken(); // Kiểm tra token
    if (!isValidGuid(studentId)) {
      throw new Error('ID học viên không đúng định dạng Guid');
    }

    const response = await api.get(`${API_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin học viên:', error);
    throw error;
  }
};