import api from './axios'; // 🔹 Import Axios đã cấu hình

const API_URL = '/post'; // Vì `baseURL` đã có sẵn `/api`

export const getAllPost = () => {
  return api.get(`${API_URL}`);
};

export const getPostById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const createPost = (data) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  console.log(data);

  return api.post(`${API_URL}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePost = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deletePost = (id) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  return api.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadImage = (id, file) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  // Tạo FormData object để gửi file
  const formData = new FormData();
  formData.append('file', file); // 'file' là key mà server mong đợi

  return api.post(`${API_URL}/upload-image/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Không cần set thủ công vì FormData tự xử lý
    },
  });
};
