import { createSlice } from '@reduxjs/toolkit';
const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        notificationTrigger: 0,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        markNotificationAsRead: (state, action) => {
            const { notificationId, userId } = action.payload;
            state.notifications = state.notifications.map((notification) =>
                notification.id === notificationId
                    ? {
                        ...notification,
                        userNotifications: notification.userNotifications.map((un) =>
                            un.userId === userId ? { ...un, isRead: true } : un
                        ),
                    }
                    : notification
            );
        },
        deleteNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },
        triggerNotificationReload: (state) => {
            state.notificationTrigger = (state.notificationTrigger || 0) + 1; // Đảm bảo không NaN
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markNotificationAsRead,
    deleteNotification,
    triggerNotificationReload,
} = notificationSlice.actions;
export default notificationSlice.reducer;