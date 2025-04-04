import { useLocation , useNavigate } from 'react-router-dom';
import { FaExclamationCircle } from "react-icons/fa";

const PaymentFailure = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const message = searchParams.get('message') || 'Thanh toán không thành công';
    const handleBackToDetails = () => {
        navigate(`/`);  // Điều hướng về trang details với id đơn hàng
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md text-center">
                <FaExclamationCircle className="h-16 w-16 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Thanh toán thất bại</h2>
                <p className="text-gray-600 mt-2">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-medium">Thông báo: <span className="font-semibold text-gray-900">{message}</span></p>
                </div>
                <button
                    onClick={handleBackToDetails}    
                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300" >
                    Thử lại
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure;
