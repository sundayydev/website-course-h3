import api from './axios';
import { getAuthToken } from './authUtils';

const API_URL = '/student';

// Hàm kiểm tra định dạng Guid
const isValidGuid = (id) => {
  const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return typeof id === 'string' && guidRegex.test(id);
};

// Retry mechanism
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Lấy danh sách học viên
export const getStudents = async () => {
  try {
    getAuthToken();
    const response = await retry(() => api.get(API_URL));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách học viên:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách học viên');
  }
};

// Lấy thông tin học viên theo ID
export const getStudentById = async (studentId) => {
  try {
    getAuthToken();
    if (!isValidGuid(studentId)) {
      throw new Error('ID học viên không đúng định dạng Guid');
    }
    const response = await retry(() => api.get(`${API_URL}/${studentId}`));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin học viên:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải thông tin học viên');
  }
};

// Thêm học viên mới
export const addStudent = async (studentData) => {
  try {
    getAuthToken();
    if (!studentData?.fullName || !studentData?.email) {
      throw new Error('Họ tên và email là bắt buộc');
    }

    const data = {
      fullName: studentData.fullName,
      email: studentData.email,
      password: studentData.password,
      birthDate: studentData.birthDate ? new Date(studentData.birthDate).toISOString().split('T')[0] : undefined,
      role: studentData.role || 'Student',
      phone: studentData.phone || undefined,
      profileImage: studentData.profileImage || undefined,
    };

    const response = await retry(() => api.post(API_URL, data));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm học viên:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể thêm học viên');
  }
};

// Cập nhật thông tin học viên
export const updateStudent = async (studentId, studentData) => {
  try {
    getAuthToken();
    if (!isValidGuid(studentId)) {
      throw new Error('ID học viên không đúng định dạng Guid');
    }
    if (!studentData?.fullName || !studentData?.email) {
      throw new Error('Họ tên và email là bắt buộc');
    }

    const data = {
      fullName: studentData.fullName,
      email: studentData.email,
    };

    // Chỉ thêm các trường nếu có giá trị hợp lệ
    if (studentData.password) {
      data.password = studentData.password;
    }
    if (studentData.birthDate) {
      data.birthDate = new Date(studentData.birthDate).toISOString().split('T')[0];
    }
    if (studentData.profileImage) {
      data.profileImage = studentData.profileImage;
    }
    if (studentData.phone) {
      data.phone = studentData.phone;
    }

    const response = await retry(() => api.put(`${API_URL}/${studentId}`, data));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật học viên:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể cập nhật học viên');
  }
};

// Tải lên avatar
export const uploadAvatar = async (file) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`${API_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải lên hình ảnh:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể tải lên hình ảnh');
  }
};

// Xóa học viên
export const deleteStudent = async (studentId) => {
  try {
    getAuthToken();
    if (!isValidGuid(studentId)) {
      throw new Error('ID học viên không đúng định dạng Guid');
    }
    const response = await retry(() => api.delete(`${API_URL}/${studentId}`));
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa học viên:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Không thể xóa học viên');
  }
};