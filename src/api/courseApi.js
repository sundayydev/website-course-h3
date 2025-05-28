import { getAuthToken, getUserId } from './authUtils';
import api from './axios';

const API_URL = '/course';

export const getCourses = async () => {
  try {
    const response = await api.get(`${API_URL}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khóa học:', error);
    throw error;
  }
};

export const getActiveCourses = async () => {
  try {
    const response = await api.get(`${API_URL}/active`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khóa học đã kích hoạt:', error);
    throw error;
  }
};

export const getCourseById = async (courseId) => {
  try {
    const response = await api.get(`${API_URL}/${courseId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khóa học:', error);
    throw error;
  }
};

export const createCourse = async (data) => {
  const newData = {
    title: data.title,
    description: data.description,
    price: data.price,
    instructorId: getUserId(),
    contents: data.contents,
    categoryId: data.categoryId,
    urlImage: data.urlImage
  };
  try {
    const response = await api.post(`${API_URL}`, newData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo khóa học:', error);
    throw error;
  }
};

export const updateCourse = async (id, data) => {
  const token = getAuthToken();
  const updatedData = {
    title: data.title,
    description: data.description,
    price: data.price,
    instructorId: getUserId(),
    categoryId: data.categoryId,
    contents: data.contents,
    urlImage: data.urlImage,
  };
  try {
    const response = await api.put(`${API_URL}/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật khóa học:', error);
    throw error;
  }
};

export const approveCourse = async (id, status) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.put(`${API_URL}/${id}/approve`, { Activate: status }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái khóa học:', error);
    throw error;
  }
};


export const deleteCourse = async (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa khóa học:', error);
    throw error;
  }
};

export const uploadImage = async (urlImage) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("file", urlImage); // "file" phải trùng với tên trong controller
  try {
    const response = await api.post(`${API_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải lên hình ảnh:', error);
    throw error;
  }
};

export const getCourseByInstructorId = async (instructorId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }
  try {
    const response = await api.get(`${API_URL}/instructor/${instructorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy khóa học theo instructorId:', error);
    throw error;
  }
};

export const getCoursesByCategoryId = async (categoryId) => {
  try {
    const response = await api.get(`${API_URL}/category/${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy khóa học theo categoryId:', error);
    throw error;
  }
};