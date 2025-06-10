import api from './axios';

const API_URL = '/message';

export const getAllMessages = async () => {
  try {
    const response = await api.get(`${API_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin nhắn:', error);
    throw error;
  }
};

export const getMessageById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tin nhắn theo Id:', error);
    throw error;
  }
};

export const getMessagesByChat = async (chatId) => {
  try {
    const response = await api.get(`${API_URL}/chat/${chatId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tin nhắn theo ChatId:', error);
    throw error;
  }
};

export const createMessage = async (createMessageDto) => {
  try {
    const response = await api.post(`${API_URL}`, createMessageDto, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo tin nhắn:', error);
    throw error;
  }
};

export const updateMessage = async (id, updateMessageDto) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, updateMessageDto, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật tin nhắn:', error);
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // Thêm Authorization nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa tin nhắn:', error);
    throw error;
  }
};