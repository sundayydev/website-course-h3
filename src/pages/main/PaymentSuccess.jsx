import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { BsCheck2Circle } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { addNotification } from '@/api/notificationApi';
import { getUserProfile } from '@/api/authApi';
import { isAuthenticated, removeAuthToken } from '@/api/authUtils';
import { triggerNotificationReload } from '@/reducers/notificationReducer';
import { useEffect } from 'react';

const PaymentSuccess = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get('vnp_Amount');
    const orderInfo = searchParams.get('vnp_OrderInfo');

    useEffect(() => {
        const sendPaymentNotification = async () => {
            try {
                // Kiểm tra xem người dùng đã đăng nhập chưa
                if (!isAuthenticated()) {
                    removeAuthToken();
                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                    navigate('/login');
                    return;
                }

                // Lấy thông tin hồ sơ người dùng để có userId
                const profileResponse = await getUserProfile();
                const userId = profileResponse.data.id;
                console.log('userId từ hồ sơ:', userId);

                // Chuẩn bị dữ liệu thông báo, dùng type hợp lệ từ backend
                const notificationData = {
                    type: 'NewMessage', 
                    content: `Thanh toán thành công cho đơn hàng ${id}! Số tiền: ${amount ? parseInt(amount) / 100 : 'N/A'} VND`,
                    relatedEntityId: id,
                    relatedEntityType: 'Order',
                    userIds: [userId],
                };
                console.log('Đang gửi thông báo:', notificationData);

                // Gửi thông báo qua API
                await addNotification({
                    type: notificationData.type,
                    content: notificationData.content,
                    relatedEntityId: notificationData.relatedEntityId,
                    relatedEntityType: notificationData.relatedEntityType,
                    userIds: notificationData.userIds,
                });

                // Kích hoạt tải lại danh sách thông báo trong Redux
                console.log('Đang kích hoạt triggerNotificationReload sau khi thêm thông báo');
                dispatch(triggerNotificationReload());
            } catch (error) {
                console.error('Lỗi khi gửi thông báo thanh toán:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                // Hiển thị thông báo lỗi cho người dùng
                alert('Có lỗi xảy ra khi gửi thông báo. Vui lòng thử lại sau!');
            }
        };

        sendPaymentNotification();
    }, [id, amount, navigate, dispatch]);

    const handleBackToDetails = () => {
        // Chuyển hướng người dùng về trang chính
        navigate('/');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-white px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
                <BsCheck2Circle className="text-green-500 mx-auto mb-4" size={60} />
                <h1 className="text-3xl font-semibold text-gray-800">Thanh toán thành công!</h1>
                <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua hàng.</p>

                <div className="mt-6 text-left bg-gray-50 rounded-xl p-5">
                    <h2 className="text-sm text-gray-600 font-semibold mb-1">Chi tiết giao dịch</h2>
                    <div className="text-base text-gray-800 space-y-2">
                        <p><strong>Mã đơn hàng:</strong> {id}</p>
                        {amount && <p><strong>Số tiền:</strong> <span className="text-gray-600">{parseInt(amount) / 100} VND</span></p>}
                        {orderInfo && <p><strong>Thông tin:</strong> {orderInfo}</p>}
                    </div>
                </div>

                <button
                    onClick={handleBackToDetails}
                    className="mt-8 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition duration-300"
                >
                    Quay lại trang chính
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;