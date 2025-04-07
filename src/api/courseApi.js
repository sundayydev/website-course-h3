import { jwtDecode } from 'jwt-decode';
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

export const getCourseById = async (courseId) => {
  try {
    const response = await api.get(`${API_URL}/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khóa học:', error);
    throw error;
  }
};

export const createCourse = async (data) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const decodedToken = jwtDecode(token);
  
  const newData = {
    title: data.title,
    description: data.description, 
    price: data.price,
    instructorId: decodedToken.id,
    contents: data.contents.split('\n').filter(line => line.trim() !== '')
  };
  console.log('New Data: ', newData);
  try {
    const response = await api.post(`${API_URL}`, newData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo khóa học:', error);
    throw error;
  }
};

export const updateCourse = async (id, data) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const decodedToken = jwtDecode(token);

  const updatedData = {
    title: data.title,
    description: data.description,
    price: data.price,
    instructorId: decodedToken.id,
    contents: data.contents.split('\n').filter((line) => line.trim() !== '')
  }
  try {
    const response = await api.put(`${API_URL}/${id}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật khóa học:', error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
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
    console.error('Lỗi khi xóa khóa học:', error);
    throw error;
  }
};

export const uploadImage = async (id, urlImage) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const data = 
  {
    file: urlImage
  }
  
  try {
    const response = await api.post(`${API_URL}/upload-image/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải lên hình ảnh:', error);
    throw error;
  }
};
