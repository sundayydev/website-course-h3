
import api from './axios';

const API_URL = '/notification';

// Hàm kiểm tra định dạng Guid
const isValidGuid = (id) => {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return typeof id === 'string' && guidRegex.test(id);
};

// Lấy danh sách thông báo
export const getNotifications = async () => {
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
        console.error('Lỗi khi lấy danh sách thông báo:', error);
        throw error;
    }
};
export const getNotificationsByUser = async (userId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Không tìm thấy token');
    }
    if (!isValidGuid(userId)) {
        throw new Error('ID người dùng không đúng định dạng Guid');
    }
    try {
        const response = await api.get(`${API_URL}/by-user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông báo theo user:', error);
        throw error;
    }
};

// Lấy thông báo theo ID
export const getNotificationById = async (notificationId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Không tìm thấy token');
    }

    if (!isValidGuid(notificationId)) {
        throw new Error('ID thông báo không đúng định dạng Guid');
    }

    try {
        const response = await api.get(`${API_URL}/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
        throw error;
    }
};

// Thêm thông báo mới
export const addNotification = async (notificationData) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Không tìm thấy token');
    }

    if (
        !notificationData ||
        !notificationData.type ||
        !notificationData.content ||
        !notificationData.userIds ||
        !Array.isArray(notificationData.userIds)
    ) {
        throw new Error('Dữ liệu thông báo không hợp lệ');
    }

    // Kiểm tra định dạng Guid cho userIds
    const isValidGuid = (id) => {
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return typeof id === 'string' && guidRegex.test(id);
    };

    if (!notificationData.userIds.every(isValidGuid)) {
        throw new Error('Một hoặc nhiều userId không đúng định dạng Guid');
    }

    const data = {
        type: notificationData.type,
        content: notificationData.content,
        relatedEntityId: notificationData.relatedEntityId || null,
        relatedEntityType: notificationData.relatedEntityType || null,
        userIds: notificationData.userIds,
    };

    try {
        console.log('Gửi dữ liệu thông báo:', data); // Log dữ liệu gửi đi
        const response = await api.post(`${API_URL}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm thông báo:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
        });
        throw error;
    }
};

// Xóa thông báo
export const deleteNotification = async (notificationId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Không tìm thấy token');
    }

    if (!isValidGuid(notificationId)) {
        throw new Error('ID thông báo không đúng định dạng Guid');
    }

    try {
        const response = await api.delete(`${API_URL}/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa thông báo:', error);
        throw error;
    }
};
export const markNotificationAsRead = async (notificationId, userId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Không tìm thấy token');
    }
    if (!isValidGuid(notificationId)) {
        throw new Error('ID thông báo không đúng định dạng Guid');
    }
    if (!isValidGuid(userId)) {
        throw new Error('ID người dùng không đúng định dạng Guid');
    }
    try {
        const response = await api.put(
            `${API_URL}/${notificationId}/mark-as-read`,
            userId, // Gửi userId trực tiếp
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đánh dấu thông báo là đã đọc:', error.response?.data || error);
        throw error;
    }
};