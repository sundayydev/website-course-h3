import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { BsCheck2Circle } from "react-icons/bs";

const PaymentSuccess = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get('vnp_Amount');
    const orderInfo = searchParams.get('vnp_OrderInfo');

    const handleBackToDetails = () => {
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
