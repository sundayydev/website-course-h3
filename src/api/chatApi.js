import api from './axios';

const API_URL = '/chat';

export const getAllChats = async () => {
  try {
    const response = await api.get(`${API_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chat:', error);
    throw error;
  }
};

export const getChatById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chat theo Id:', error);
    throw error;
  }
};

export const getChatsByUser = async (userId) => {
  try {
    const response = await api.get(`${API_URL}/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chat theo UserId:', error);
    throw error;
  }
};

export const createChat = async (createChatDto) => {
  try {
    const response = await api.post(`${API_URL}`, createChatDto, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo chat:', error);
    throw error;
  }
};

export const deleteChat = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa chat:', error);
    throw error;
  }
};