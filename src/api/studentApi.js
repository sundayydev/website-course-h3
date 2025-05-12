import api from './axios';

const API_URL = 'http://localhost:5221/api/student'; // Cập nhật port backend

// Hàm kiểm tra định dạng Guid
const isValidGuid = (id) => {
  const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return typeof id === 'string' && guidRegex.test(id);
};

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
    console.error('Lỗi khi lấy danh sách học viên:', error);
    throw error;
  }
};

// Thêm học viên mới
export const addStudent = async (studentData) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

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

// Tải lên avatar
export const uploadAvatar = async (studentId, avatar) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  if (!isValidGuid(studentId)) {
    throw new Error('ID học viên không đúng định dạng Guid');
  }

  if (!(avatar instanceof File)) {
    throw new Error('Avatar phải là một tệp hợp lệ');
  }

  const formData = new FormData();
  formData.append('file', avatar);

  console.log('Dữ liệu gửi đi:', formData);

  try {
    const response = await api.post(`${API_URL}/upload-avatar/${studentId}`, formData, {
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

  if (!isValidGuid(studentId)) {
    throw new Error('ID học viên không đúng định dạng Guid');
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

  if (!isValidGuid(studentId)) {
    throw new Error('ID học viên không đúng định dạng Guid');
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

// // Lấy danh sách học viên theo trạng thái (Chú thích vì endpoint không tồn tại)
// export const getStudentsByStatus = async (status) => {
//   const token = localStorage.getItem('authToken');
//   if (!token) {
//     throw new Error('Không tìm thấy token');
//   }

//   try {
//     const response = await api.get(`${API_URL}/status/${status}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách học viên theo trạng thái:', error);
//     throw error;
//   }
// };

// // Lấy danh sách học viên theo khóa học (Chú thích vì endpoint không tồn tại)
// export const getStudentsByCourse = async (courseId) => {
//   const token = localStorage.getItem('authToken');
//   if (!token) {
//     throw new Error('Không tìm thấy token');
//   }

//   try {
//     const response = await api.get(`${API_URL}/course/${courseId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách học viên theo khóa học:', error);
//     throw error;
//   }
// };