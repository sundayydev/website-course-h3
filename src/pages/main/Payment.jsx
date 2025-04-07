import { useState, useEffect } from 'react';
import { FaTimes, FaLock } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '@/api/axios';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error('Lỗi khi giải mã token:', error);
    return null;
  }
};

const PaymentModal = () => {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      alert('Bạn cần đăng nhập để thực hiện thanh toán!');
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      try {
        console.log(`Fetching course with ID: ${courseId}`);
        const response = await api.get(`/course/${courseId}`);
        setCourse(response.data);
        setTotal(response.data.price || 0);
        console.log('Course fetched successfully:', response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khóa học:', error);
        setErrorMessage('Không thể tải thông tin khóa học. Vui lòng thử lại sau.');
      }
    };
    fetchCourse();
  }, [courseId, userId, navigate]);

  const handlePayment = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    if (!course || !course.id) {
      setErrorMessage('Thông tin khóa học chưa được tải!');
      setIsLoading(false);
      return;
    }

    const orderData = {
      UserId: userId,
      CourseId: course.id,
      Amount: total,
      Status: 'Pending',
      CreatedAt: new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(/,/, ''),
    };

    console.log('Order data to be sent:', orderData);

    try {
      const paymentResponse = await api.post('/payment/create-payment-url', orderData);
      console.log('Payment response:', paymentResponse.data);

      if (paymentResponse.status !== 200 || !paymentResponse.data) {
        throw new Error('Không thể tạo đơn hàng từ server');
      }

      const { paymentUrl, orderId, isFree, message } = paymentResponse.data;

      if (isFree) {
        console.log(message);
        navigate('/payment-success', { state: { orderId } });
      } else if (paymentUrl) {
        console.log('Redirecting to VnPay:', paymentUrl);
        window.location.href = paymentUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán hoặc thông tin đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error.response?.data || error.message);
      setErrorMessage(`Thanh toán thất bại: ${error.response?.data?.message || error.message}`);
      navigate('/payment-failure', { state: { error: error.response?.data?.message || error.message } });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) return null;

  const handleClose = () => {
    navigate(-1); // Quay lại trang trước (Details)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-3xl p-4 md:p-6 flex flex-col md:flex-row relative">
        <button onClick={handleClose} className="absolute top-2 right-2 cursor-pointer">
          <FaTimes className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>

        {course && (
          <div className="md:w-1/2 p-4">
            <div className="flex items-center space-x-3">
              <img
                src={course.urlImage ? import.meta.env.VITE_API_URL+`/${course.urlImage}` : 'https://via.placeholder.com/50'}
                alt={course.title}
                className="w-12 h-12 rounded-full"
              />
              <h2 className="text-lg md:text-xl font-bold">{course.title}</h2>
            </div>
            <p className="text-gray-600 mt-3 text-sm md:text-base">{course.description}</p>
          </div>
        )}

        <div className="md:w-1/2 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-center md:text-left">Chi tiết thanh toán</h3>

          {errorMessage && (
            <div className="mt-3 p-2 bg-red-100 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <div className="mt-3">
            {course ? (
              <>
                <p className="text-gray-700 font-semibold text-center md:text-left">{course.title}</p>
                <div className="flex justify-between text-sm md:text-base">
                  <p>Giá khuyến mãi:</p>
                  <p className="text-lg font-bold text-red-600">{total.toLocaleString()}đ</p>
                </div>
              </>
            ) : (
              <p>Đang tải thông tin khóa học...</p>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center text-sm md:text-lg">
            <span className="font-semibold">TỔNG</span>
            <span className="font-bold text-blue-600">{total.toLocaleString()}đ</span>
          </div>
          <button
            onClick={handlePayment}
            disabled={isLoading || !course}
            className={`mt-4 w-full ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white py-2 md:py-3 rounded-lg text-lg hover:bg-blue-700`}
          >
            {isLoading ? 'Đang xử lý...' : total === 0 ? 'Đăng ký miễn phí' : 'Tiếp tục thanh toán'}
          </button>
          {total > 0 && (
            <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center">
              <FaLock className="w-3 h-3 mr-1 text-red-300" /> Thanh toán an toàn với VnPay
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;