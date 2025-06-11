import api from './axios';
import { getAuthToken } from './authUtils';
const API_URL = '/instructor';

export const getInstructors = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.filter((user) => user.role === 'Instructor');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách giảng viên');
  }
};

export const getInstructorById = async (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data.role !== 'Instructor') {
      throw new Error('Người dùng không phải là giảng viên');
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Không thể lấy thông tin giảng viên ID ${id}`);
  }
};

export const createInstructor = async (instructorData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.post(
      API_URL,
      { ...instructorData, role: 'Instructor' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tạo giảng viên');
  }
};

export const updateInstructor = async (id, instructorData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.put(
      `${API_URL}/${id}`,
      { ...instructorData, role: 'Instructor' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Không thể cập nhật giảng viên ID ${id}`);
  }
};

export const deleteInstructor = async (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return null;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Không thể xóa giảng viên ID ${id}`);
  }
};

export const uploadAvatar = async (file) => { // Bỏ instructorId
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await api.post(`/api/instructor/upload-image`, formData, { // Sửa endpoint
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải lên ảnh đại diện');
  }
};