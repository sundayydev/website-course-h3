import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
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
    },
});

export const { setNotifications, addNotification, markNotificationAsRead, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;