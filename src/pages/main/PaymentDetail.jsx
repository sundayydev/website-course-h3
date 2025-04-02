import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code'; // Import QRCode từ react-qr-code

const PaymentPage = () => {
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const storedData = location.state || JSON.parse(localStorage.getItem('paymentData'));
    if (storedData) {
      setPaymentData(storedData);
      localStorage.setItem('paymentData', JSON.stringify(storedData));
    } else {
      console.error('Không có thông tin thanh toán!');
    }
  }, [location.state]);

  if (!paymentData) {
    return <p className="text-center text-red-500">Lỗi: Không có thông tin thanh toán.</p>;
  }

  const { paymentUrl, orderId, amount } = paymentData;

  const handleVNPayPayment = () => {
    window.location.href = paymentUrl;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
      <h2 className="text-xl font-bold text-center text-red-500">Quét mã QR để thanh toán</h2>
      <p className="text-sm text-center text-gray-600 mt-2">Mở app ngân hàng và quét mã QR</p>
      <p className="text-gray-700 text-center">Mã đơn hàng: {orderId}</p>
      {/* Hiển thị mã QR */}
      <div className="flex justify-center my-4">
        <QRCode value={paymentUrl} size={200} /> {/* Sử dụng component QRCode từ react-qr-code */}
      </div>

      <div className="text-center">
        <p className="text-lg font-bold">VnPay</p>

        <p className="text-lg font-bold text-blue-600">Số tiền: {amount.toLocaleString()}đ</p>
        <p className="text-red-600 font-bold">Nội dung: {orderId}</p>
      </div>

      <button
        onClick={handleVNPayPayment}
        className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition"
      >
        Thanh toán qua VNPay
      </button>
    </div>
  );
};

export default PaymentPage;
