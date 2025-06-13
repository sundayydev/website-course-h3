import { useState, useEffect } from 'react';
import { FaTimes, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { createPayment, createPaymentMomo } from '@/api/paymentApi';
import { getCourseById } from '@/api/courseApi';
import { getAllCoupons, getCouponByCode } from '@/api/couponApi'; 
import axios from 'axios';
const API_URL = process.env.VITE_API_URL || 'http://localhost:5221/api';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('authToken');
      return null;
    }
    return decoded.id;
  } catch {
    return null;
  }
};

const PaymentModal = ({ courseId, onClose }) => {
  const [total, setTotal] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [course, setCourse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponId, setCouponId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [coupons, setCoupons] = useState([]); // Danh sách coupon
  const [isCouponValid, setIsCouponValid] = useState(false);
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      alert('Bạn cần đăng nhập để thanh toán!');
      navigate('/login');
      return;
    }

    const fetchCourseAndCoupons = async () => {
      try {
        // Lấy thông tin khóa học
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        setTotal(courseData.price || 0);
        setOriginalTotal(courseData.price || 0);

        // Lấy danh sách coupon
        const couponData = await getAllCoupons();
        console.log(couponData.data);
        setCoupons(couponData.data || []);
      } catch (err) {
        setErrorMessage('Không thể tải thông tin khóa học hoặc coupon!');
      }
    };

    if (courseId) fetchCourseAndCoupons();
  }, [courseId, userId, navigate]);

  const applyCoupon = async (selectedCouponCode) => {
    if (!selectedCouponCode) {
      setErrorMessage('Vui lòng chọn hoặc nhập mã coupon!');
      setIsCouponValid(false);
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const coupon = await getCouponByCode(selectedCouponCode);
      const now = new Date();
      if (!coupon.data.isActive || now < new Date(coupon.data.startDate) || now > new Date(coupon.data.endDate)) {
        setErrorMessage('Mã coupon không hợp lệ hoặc đã hết hạn!');
        setIsCouponValid(false);
        return;
      }
      if (coupon.data.currentUsage >= coupon.data.maxUsage) {
        setErrorMessage('Mã coupon đã được sử dụng hết!');
        setIsCouponValid(false);
        return;
      }

      const discount = (originalTotal * coupon.data.discountPercentage) / 100;
      setDiscountAmount(discount);
      setTotal(originalTotal - discount);
      setCouponId(coupon.data.id);
      setCouponCode(selectedCouponCode);
      setErrorMessage(null);
      setIsCouponValid(true);
    } catch (error) {
      setErrorMessage(error.message);
      setIsCouponValid(false);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const orderData = {
      userId,
      courseId: course.id,
      amount: total,
      couponId,
      discountAmount,
    };

    try {
      const paymentFunction = paymentMethod === 'MOMO' ? createPaymentMomo : createPayment;
      const res = await paymentFunction(orderData);
      if (res.message) navigate(`/payment-success/${res.orderId}`);
      else if (res.paymentUrl) window.location.href = res.paymentUrl;
      else throw new Error('Không nhận được URL thanh toán');
    } catch (err) {
      navigate(`/payment-failure?error=${encodeURIComponent(err.message)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden relative flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Course Info */}
        {course && (
          <div className="md:w-1/2 p-6 border-r border-gray-200 flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <img
                  src={course.urlImage ? `${course.urlImage}` : ''}
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
                <p className="text-gray-600 text-sm">{course.category || 'Khóa học trực tuyến'}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">{course.description}</p>
          </div>
        )}

        {/* Payment */}
        <div className="md:w-1/2 p-6 bg-gray-50 flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 text-center md:text-left">
            Chi tiết thanh toán
          </h3>

          {errorMessage && (
            <div className="bg-red-100 text-red-700 text-sm p-2 rounded">{errorMessage}</div>
          )}

          {/* Coupon Box */}
          {discountAmount > 0 ? (
            <div className="flex justify-between items-center bg-green-100 text-green-700 p-2 rounded">
              <span>Đã áp dụng mã: <strong>{couponCode}</strong></span>
              <button
                onClick={() => {
                  setCouponCode('');
                  setDiscountAmount(0);
                  setTotal(originalTotal);
                  setCouponId(null);
                  setIsCouponValid(false);
                }}
                className="text-red-500 hover:underline text-sm"
              >
                Hủy
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <select
                  value={couponCode}
                  onChange={(e) => applyCoupon(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  disabled={isApplyingCoupon}
              >
                <option value="">Chọn mã coupon</option>
                {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.code}>
                      {coupon.code} - Giảm {coupon.discountPercentage}% (Tối đa {coupon.maxUsage} lần)
                    </option>
                ))}
              </select>
              <button
                  onClick={() => applyCoupon(couponCode)}
                  disabled={isApplyingCoupon}
                  className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${isApplyingCoupon ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isApplyingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}
              </button>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Phương thức thanh toán:</h4>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VNPAY"
                  checked={paymentMethod === 'VNPAY'}
                  onChange={() => setPaymentMethod('VNPAY')}
                  className="form-radio text-blue-600"
                />
                <span>VNPAY</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="MOMO"
                  checked={paymentMethod === 'MOMO'}
                  onChange={() => setPaymentMethod('MOMO')}
                  className="form-radio text-blue-600"
                />
                <span>MoMo</span>
              </label>
            </div>
          </div>

          {/* Giá */}
          <div className="text-sm space-y-1 mt-2">
            <div className="flex justify-between">
              <span>Giá gốc:</span>
              <span className={discountAmount > 0 ? 'line-through text-gray-400' : ''}>
                {originalTotal.toLocaleString()}đ
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Giảm giá:</span>
                <span>-{discountAmount.toLocaleString()}đ</span>
              </div>
            )}
          </div>

          {/* Tổng */}
          <div className="flex justify-between items-center text-lg font-bold mt-4 border-t pt-4">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{total.toLocaleString()}đ</span>
          </div>

          {/* Button */}
          <button
              onClick={handlePayment}
              disabled={isLoading || (couponCode && !isCouponValid)}
              className={`mt-2 py-3 rounded-lg text-white font-semibold ${isLoading || (couponCode && !isCouponValid)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading
                ? 'Đang xử lý...'
                : total === 0
                    ? 'Đăng ký miễn phí'
                    : 'Tiếp tục thanh toán'}
          </button>

          {total > 0 && (
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
              <FaLock className="text-red-300" /> Thanh toán an toàn qua {paymentMethod}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;