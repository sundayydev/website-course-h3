import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getNotificationById } from '@/api/notificationApi';
import { getUserById } from '@/api/userApi';
import { formatDate } from '@/utils/formatDate';

// Ánh xạ giữa type tiếng Anh và tên tiếng Việt
const typeDisplayNames = {
  LessonApproval: 'Phê duyệt bài học',
  NewMessage: 'Tin nhắn mới',
  CourseEnrollment: 'Đăng ký khóa học',
  CourseActivation: 'Khóa học chấp nhận',
  CourseDeactivation: 'Khóa học từ chối',
};

export default function NotificationDetail() {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        setLoading(true);
        const notificationData = await getNotificationById(notificationId);
        setNotification(notificationData);

        // Lấy danh sách userIds từ userNotifications
        const userIds = notificationData.userNotifications.map(un => un.userId);
        await fetchUserNames(userIds);
        setError(null);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu thông báo');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserNames = async (userIds) => {
      try {
        const nameMap = {};
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const response = await getUserById(userId);
              nameMap[userId] = response.data.fullName || response.data.name || 'Không có tên';
            } catch (error) {
              console.error(`Lỗi khi lấy tên người dùng ${userId}:`, error);
              nameMap[userId] = 'Không có tên';
            }
          })
        );
        setUserNames(nameMap);
      } catch (error) {
        console.error('Lỗi khi lấy tên người dùng:', error);
        setError('Không thể tải tên người dùng');
      }
    };

    fetchNotificationData();
  }, [notificationId]);

  // Hàm xác định trạng thái thông báo
  const getNotificationStatus = () => {
    if (!notification) return 'N/A';
    return notification.userNotifications.every(un => un.isRead) ? 'Đã đọc' : 'Chưa đọc';
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/notifications')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Quay lại
        </Button>
      </div>

      {loading ? (
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">Lỗi</h3>
          <p className="text-gray-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/notifications')}
            className="mt-4"
          >
            Quay lại
          </Button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{notification?.content || 'Thông Báo'}</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông Tin Thông Báo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Loại thông báo</h3>
                  <p className="text-lg">{typeDisplayNames[notification?.type] || notification?.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nội dung</h3>
                  <p className="text-gray-700">{notification?.content || 'Không có nội dung'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
                  <p className="text-gray-700">{formatDate(notification?.createdAt) || 'N/A'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Loại thực thể liên quan</h3>
                  <p className="text-gray-700">{notification?.relatedEntityType || 'Không có'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                  <p className="text-gray-700">{getNotificationStatus()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Người Nhận</CardTitle>
            </CardHeader>
            <CardContent>
              {notification?.userNotifications.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Chưa có người nhận nào cho thông báo này.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notification.userNotifications.map((un) => (
                    <div
                      key={un.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <h3 className="font-medium">{userNames[un.userId] || 'Đang tải...'}</h3>
                      <p className="text-sm text-gray-500">
                        Trạng thái: {un.isRead ? 'Đã đọc' : 'Chưa đọc'}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID người dùng: {un.userId}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}