import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { BsCheck2Circle } from "react-icons/bs";

const PaymentSuccess = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get('vnp_Amount');
    const orderInfo = searchParams.get('vnp_OrderInfo');
    const responseCode = searchParams.get('vnp_ResponseCode');

    const handleBackToDetails = () => {
        navigate(`/`);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md text-center">
                <BsCheck2Circle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Thanh toán thành công!</h2>
                <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua hàng.</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-medium">Mã đơn hàng: <span className="font-semibold text-gray-900">{id}</span></p>
                    {amount && <p className="text-gray-700">Số tiền: <span className="font-semibold text-green-600">{parseInt(amount) / 100} VND</span></p>}
                    {orderInfo && <p className="text-gray-700"><span className="font-semibold text-gray-900">{orderInfo}</span></p>}
                </div>
                <button
                    onClick={handleBackToDetails}
                    className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Quay lại trang chi tiết
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;