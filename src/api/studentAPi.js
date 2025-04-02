import api from './axios';

const API_URL = '/student';

// Lấy danh sách học viên
export const getStudents = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi  lấy danh sách học viên:', error);
    throw error;
  }
};

// Thêm học viên mới
export const addStudent = async (studentData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const data = {
    fullName: studentData.fullName,
    email: studentData.email,
    password: studentData.password,
    birthDate: studentData.birthDate,
  }

  console.log('data: ', data);

  try {
    const response = await api.post(`${API_URL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm học viên:', error);
    throw error;
  }
};

// Cập nhật thông tin học viên
export const updateStudent = async (studentId, studentData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const data = {
    fullName: studentData.fullName,
    email: studentData.email,
    birthDate: studentData.birthDate,
  }

  try {
    const response = await api.put(`${API_URL}/${studentId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin học viên:', error);
    throw error;
  }
};

//Upload avatar
export const uploadAvatar = async (studentId, avatar) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const data = {
    file: avatar,
  }

  console.log('data: ', data);

  try {
    const response = await api.post(`${API_URL}/upload-avatar/${studentId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải lên avatar:', error);
    throw error;
  }
};

// Xóa học viên
export const deleteStudent = async (studentId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.delete(`${API_URL}/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa học viên:', error);
    throw error;
  }
};

// Lấy thông tin học viên theo ID
export const getStudentById = async (studentId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.get(`${API_URL}/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin học viên:', error);
    throw error;
  }
};

// Lấy danh sách học viên theo trạng thái
export const getStudentsByStatus = async (status) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.get(`${API_URL}/status/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) { 
    console.error('Lỗi khi lấy danh sách học viên theo trạng thái:', error);
    throw error;
  }
};

// Lấy danh sách học viên theo khóa học
export const getStudentsByCourse = async (courseId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await api.get(`${API_URL}/course/${courseId}`, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách học viên theo khóa học:', error);
    throw error;
  }
};