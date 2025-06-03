import api from './axios';

const API_URL = '/email';

export const getAllEmails = async () => {
  try {
    const response = await api.get(`${API_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách email:', error);
    throw error;
  }
};

export const getEmailById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy email theo Id:', error);
    throw error;
  }
};

export const getEmailsBySourceType = async (sourceType) => {
  try {
    const response = await api.get(`${API_URL}/by-type/${sourceType}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy email theo SourceType:', error);
    throw error;
  }
};