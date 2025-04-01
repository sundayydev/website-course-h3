import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5221/api',
  withCredentials: true,
});

//Thêm Interceptor để tự động gửi token trong mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
