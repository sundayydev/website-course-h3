import { useState, useEffect } from 'react';
import { FaTimes, FaLock } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import api from '@/api/axios';

// Hàm lấy userId từ token
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

const PaymentModal = ({ onClose }) => {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Lấy userId từ token
  const userId = getUserIdFromToken();
  console.log(userId);
  // Kiểm tra nếu không có userId
  if (!userId) {
    alert('Bạn cần đăng nhập để thực hiện thanh toán!');
    return null; // Trả về null thay vì undefined
  }

  // Lấy thông tin khóa học từ API khi component được render
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/course/${courseId}`);
        setCourse(response.data);
        setTotal(response.data.price || 0); // Giả sử price là giá khuyến mãi
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khóa học:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    setIsLoading(true);

    if (!course || !course.id) {
      alert('Thông tin khóa học chưa được tải, vui lòng thử lại!');
      setIsLoading(false);
      return;
    }

    // Trường hợp khóa học miễn phí (total === 0)
    if (total === 0) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Bạn cần đăng nhập để đăng ký khóa học!');
        setIsLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5221/api/Payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId,
            courseId: course.id,
            totalAmount: 0
          })
        });

        if (!response.ok) {
          throw new Error('Đăng ký thất bại');
        }

        const data = await response.json();
        navigate('/payment-success', { state: { orderId: data.id } });
      } catch (error) {
        console.error('Lỗi khi đăng ký khóa học miễn phí:', error);
        navigate('/payment-failure', { state: { message: 'Đăng ký khóa học miễn phí thất bại' } });
      } finally {
        setIsLoading(false);
      }
      return; // Thoát hàm để không chạy logic thanh toán VNPay
    }

    // Logic hiện tại cho khóa học có phí
    const orderData = {
      UserId: userId,
      TotalAmount: total,
      Status: 'pending',
      CreatedAt: new Date().toISOString(),
      OrderDetails: [
        {
          Id: uuidv4(),
          OrderId: '00000000-0000-0000-0000-000000000000',
          CourseId: course.id,
          Price: total,
          CreatedAt: new Date().toISOString(),
        },
      ],
    };

    console.log('✅ Order Data to Send:', JSON.stringify(orderData, null, 2));

    try {
      const orderResponse = await api.post('/order/create', orderData);
      const orderId = orderResponse.data.id;
      console.log('✅ Order ID from backend:', orderId);

      const paymentRequest = {
        Id: orderId,
        TotalAmount: parseFloat(orderResponse.data.totalAmount),
        UserId: userId,
        Status: 'pending',
        CreatedAt: new Date().toISOString(),
        OrderDetails: [
          {
            Id: uuidv4(),
            OrderId: orderId,
            CourseId: course.id,
            Price: parseFloat(orderResponse.data.totalAmount),
            CreatedAt: new Date().toISOString(),
          },
        ],
      };
      console.log('✅ Payment Request:', JSON.stringify(paymentRequest, null, 2));

      const paymentResponse = await api.post('/payment/create-payment-url', paymentRequest);
      console.log('📌 Full Payment Response:', paymentResponse);
      console.log('📌 Payment URL:', paymentResponse.data.paymentUrl);

      if (paymentResponse.data && paymentResponse.data.paymentUrl) {
        console.log('✅ Navigating to /paymentpage with URL:', paymentResponse.data.paymentUrl);
        navigate('/paymentpage', {
          state: { paymentUrl: paymentResponse.data.paymentUrl, orderId, amount: total },
        });
      } else {
        console.error('❌ No payment URL found:', paymentResponse.data);
        alert('Không thể tạo URL thanh toán');
      }
    } catch (error) {
      console.error('❌ Lỗi:', error.response?.data || error.message);
      if (error.response && error.response.data) {
        console.error('Chi tiết lỗi từ API:', JSON.stringify(error.response.data, null, 2));
      }
      alert('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-3xl p-4 md:p-6 flex flex-col md:flex-row relative">
          <button onClick={onClose} className="absolute top-2 right-2 cursor-pointer">
            <FaTimes className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>

          {course && (
              <div className="md:w-1/2 p-4">
                <div className="flex items-center space-x-3">
                  <img
                      src={
                        course.urlImage
                            ? `http://localhost:5221/${course.urlImage}`
                            : 'https://via.placeholder.com/50'
                      }
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

            <div className="mt-3">
              {course ? (
                  <>
                    <p className="text-gray-700 font-semibold text-center md:text-left">
                      {course.title}
                    </p>
                    <div className="flex justify-between text-sm">
                      <p>Giá gốc:</p>
                      <p className="text-gray-500 line-through">
                        {course.price ? course.price.toLocaleString() : 'N/A'}đ
                      </p>
                    </div>
                    <div className="flex justify-between text-sm md:text-base">
                      <p>Giá khuyến mãi:</p>
                      <p className="text-lg font-bold text-red-600">
                        {total ? total.toLocaleString() : 'N/A'}đ
                      </p>
                    </div>
                  </>
              ) : (
                  <p>Đang tải thông tin khóa học...</p>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center text-sm md:text-lg">
              <span className="font-semibold">TỔNG</span>
              <span className="font-bold text-blue-600">
              {total ? total.toLocaleString() : 'N/A'}đ
            </span>
            </div>

            <button
                onClick={handlePayment}
                disabled={isLoading || !course}
                className={`mt-4 w-full ${
                    isLoading ? 'bg-gray-400' : 'bg-blue-600'
                } text-white py-2 md:py-3 rounded-lg text-lg hover:bg-blue-700`}
            >
              {isLoading ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center">
              <FaLock className="w-3 h-3 mr-1 text-red-300" /> Thanh toán an toàn với VnPay
            </p>
          </div>
        </div>
      </div>
  );
};

export default PaymentModal;