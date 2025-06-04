import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getEmailById } from '@/api/emailApi';
import { formatDate } from '@/utils/formatDate';

// Ánh xạ sourceType và status sang tiếng Việt
const typeLabels = {
  Assignment: 'Bài tập',
  PasswordReset: 'Đặt lại mật khẩu',
  Contact: 'Liên hệ',
  Payment: 'Thanh toán',
};

const statusLabels = {
  Sent: 'Đã gửi',
  Draft: 'Bản nháp',
  Failed: 'Thất bại',
  Pending: 'Đang chờ',
};

export default function EmailDetail() {
  const { emailId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        setLoading(true);
        const emailData = await getEmailById(emailId);
        setEmail(emailData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu email');
      } finally {
        setLoading(false);
      }
    };

    fetchEmailData();
  }, [emailId]);

  return (
    <div className="w-full px-4 py-8 min-h-screen overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/emails')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Quay lại
        </Button>
      </div>

      {loading ? (
        <div className="w-full">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">Lỗi</h3>
          <p className="text-gray-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/emails')}
            className="mt-4"
          >
            Quay lại
          </Button>
        </div>
      ) : (
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-6">{email?.subject || 'Email'}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cơ Bản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ID</h3>
                    <p className="text-lg">{email?.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Người gửi</h3>
                    <p className="text-gray-700">{email?.senderEmail || 'Không có'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Người nhận</h3>
                    <p className="text-gray-700">{email?.receiverEmail || 'Không có'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tiêu đề</h3>
                    <p className="text-gray-700">{email?.subject || 'Không có'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Bổ Sung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Loại</h3>
                    <p className="text-pink-500 font-medium">{typeLabels[email?.sourceType] || 'Không có'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                    <p className="text-gray-700">{statusLabels[email?.status] || 'Không có'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Thời gian gửi</h3>
                    <p className="text-gray-700">{formatDate(email?.sentAt) || 'Không có'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Nội Dung Email</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-gray-700 prose"
                  dangerouslySetInnerHTML={{ __html: email?.message || 'Không có nội dung' }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}