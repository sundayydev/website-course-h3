import { useState } from 'react';
// import QRCode from 'react-qr-code';

const PaymentPage = () => {
  const [order] = useState({
    bank: 'MbBank',
    accountNumber: '0346609715',
    accountName: 'Le Huu Duy Hoang',
    amount: 1399000,
    orderId: 'DHKMQG',
  });

  const handleVNPayPayment = () => {
    window.location.href = `https://sandbox.vnpayment.vn/paymentv2/?orderId=${order.orderId}&amount=${order.amount}`;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-20 justify-center ">
      <h2 className="text-xl font-semibold text-center text-red-500">Quét mã QR để thanh toán</h2>
      <p className="text-sm text-center text-gray-600 mt-2">
        Mở app ngân hàng và quét mã QR. Đảm bảo nội dung chuyển khoản là
        <span className="font-bold text-red-600"> {order.orderId}</span>.
      </p>

      {/* <div className="flex justify-center my-4">
        <QRCode value={order.orderId} size={150} />
      </div> */}

      <div className="text-center">
        <p className="text-lg font-bold">{order.bank}</p>
        <p className="text-gray-700">Số tài khoản: {order.accountNumber}</p>
        <p className="text-gray-700">Tên tài khoản: {order.accountName}</p>
        <p className="text-lg font-semibold text-blue-600">
          Số tiền: {order.amount.toLocaleString()}đ
        </p>
        <p className="text-red-600 font-bold">Nội dung: {order.orderId}</p>
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
