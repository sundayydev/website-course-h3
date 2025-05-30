// src/components/NotificationList.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationAsRead } from '@/reducers/notificationReducer';

const NotificationList = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);

  const handleMarkAsRead = (notificationId, userId) => {
    dispatch(markNotificationAsRead({ notificationId, userId }));
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold mb-4">Thông báo</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Không có thông báo</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-3 rounded-lg transition-colors ${notification.userNotifications[0]?.isRead ? 'bg-gray-50' : 'bg-blue-50'
                }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{notification.content}</span>
                {!notification.userNotifications[0]?.isRead && (
                  <button
                    onClick={() =>
                      handleMarkAsRead(
                        notification.id,
                        notification.userNotifications[0]?.userId
                      )
                    }
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;