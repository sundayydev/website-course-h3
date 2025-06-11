import log from '@/utils/logging'; // Assuming you have a logging utility

import { getAuthToken } from './authUtils';
import api from './axios';

const API_URL = '/notification';

// Lấy danh sách thông báo
export const getNotifications = async () => {
    try {
        const response = await api.get(`${API_URL}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thông báo:', error);
        throw error;
    }
};

export const getPaginatedNotifications = (pageNumber = 1, pageSize = 5) => {
    return api.get(`${API_URL}/paginated`, {
        params: {
            pageNumber,
            pageSize,
        },
    });
};

export const getNotificationsByUser = async (userId) => {
    try {
        const response = await api.get(`${API_URL}/by-user/${userId}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thông báo theo người dùng:', error);
        throw error;
    }
};

// Lấy thông báo theo ID
export const getNotificationById = async (notificationId) => {
    try {
        const response = await api.get(`${API_URL}/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin thông báo:', error);
        throw error;
    }
};

// Thêm thông báo mới
export const addNotification = async (notificationData) => {
    const newData = {
        type: notificationData.type,
        content: notificationData.content,
        relatedEntityId: notificationData.relatedEntityId || null,
        relatedEntityType: notificationData.relatedEntityType || null,
        userIds: notificationData.userIds,
    };
    log.info('Thêm thông báo mới:', newData);
    try {
        const response = await api.post(`${API_URL}`, newData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo thông báo:', error);
        throw error;
    }
};

// Xóa thông báo
export const deleteNotification = async (notificationId) => {
    try {
        const response = await api.delete(`${API_URL}/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa thông báo:', error);
        throw error;
    }
};

export const markNotificationAsRead = async (notificationId, userId) => {
    try {
        const response = await api.put(
            `${API_URL}/${notificationId}/mark-as-read`,
            userId,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
        throw error;
    }
};