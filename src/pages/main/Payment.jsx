import { useState } from 'react';
import { FaHandPointRight, FaTimes, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PaymentModal = ({ onClose }) => {
  const navigate = useNavigate();
  const originalPrice = 3299000;
  const discountPrice = 1399000;
  const [coupon, setCoupon] = useState('');
  const [total, setTotal] = useState(discountPrice);

  const applyCoupon = () => {
    if (coupon.toLowerCase() === 'giam10') {
      setTotal(discountPrice * 0.9);
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-3xl p-4 md:p-6 flex flex-col md:flex-row relative">
        {/* Nút đóng */}
        <button onClick={onClose} className="absolute top-2 right-2 cursor-pointer">
          <FaTimes className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>

        {/* Phần thông tin khóa học */}
        <div className="md:w-1/2 p-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/50"
              alt="Khóa học"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-lg md:text-xl font-bold">Khóa học JavaScript Pro</h2>
          </div>
          <p className="text-gray-600 mt-3 text-sm md:text-base">
            Khóa học giúp bạn làm chủ JavaScript và xây dựng ứng dụng thực tế.
          </p>
          <h3 className="hidden md:block font-semibold mt-4">Bạn nhận được gì?</h3>
          <ul className="hidden md:block list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
            <li>Hiểu sâu về JavaScript</li>
            <li>Thành thạo tư duy lập trình</li>
            <li>Xây dựng ứng dụng web phức tạp</li>
            <li>Làm việc với API, RESTful</li>
            <li>Ứng dụng thực tế</li>
          </ul>
        </div>

        {/* Phần thanh toán */}
        <div className="md:w-1/2 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-center md:text-left">Chi tiết thanh toán</h3>

          <div className="mt-3">
            <p className="text-gray-700 font-semibold text-center md:text-left">
              Khóa học JavaScript Pro
            </p>
            <div className="flex justify-between text-sm">
              <p>Giá gốc:</p>
              <p className="text-gray-500 line-through">{originalPrice.toLocaleString()}đ</p>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <p>Giá khuyến mãi:</p>
              <p className="text-lg font-bold text-red-600">{discountPrice.toLocaleString()}đ</p>
            </div>
          </div>

          {/* Nhập mã giảm giá */}
          <div className="mt-4">
            <input
              type="text"
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Nhập mã giảm giá"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button
              onClick={applyCoupon}
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Áp dụng
            </button>
          </div>

          <p className="text-sm text-blue-500 mt-2 cursor-pointer flex items-center justify-center md:justify-start">
            <FaHandPointRight className="w-4 h-4 mr-2 text-yellow-500" /> Xem danh sách mã giảm giá
          </p>

          {/* Tổng tiền */}
          <div className="mt-4 flex justify-between items-center text-sm md:text-lg">
            <span className="font-semibold">TỔNG</span>
            <span className="font-bold text-blue-600">{total.toLocaleString()}đ</span>
          </div>

          {/* Nút thanh toán */}
          <button
            onClick={() => navigate('/paymentpage')}
            className="mt-4 w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg text-lg hover:bg-blue-700"
          >
            Tiếp tục thanh toán
          </button>

          <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center">
            <FaLock className="w-3 h-3 mr-1 text-red-300" /> Thanh toán an toàn với SePay
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
