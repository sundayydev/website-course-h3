import { useLocation, useNavigate } from 'react-router-dom';
import { FaExclamationCircle } from "react-icons/fa";

const PaymentFailure = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const reason = searchParams.get('reason');
    const error = searchParams.get('error');
    const responseCode = searchParams.get('vnp_ResponseCode');
    const message = searchParams.get('message');

    // Xác định thông báo dựa trên các tham số
    let displayMessage = message || 'Thanh toán không thành công';
    if (reason === 'cancelled') {
        displayMessage = 'Bạn đã hủy giao dịch thanh toán.';
    } else if (reason === 'failed' && responseCode) {
        displayMessage = `Thanh toán thất bại. Mã lỗi VnPay: ${responseCode}`;
        // Thêm thông tin chi tiết về mã lỗi VnPay (dựa trên tài liệu VnPay)
        switch (responseCode) {
            case '07':
                displayMessage += ' (Giao dịch bị nghi ngờ gian lận)';
                break;
            case '09':
                displayMessage += ' (Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking)';
                break;
            case '10':
                displayMessage += ' (Quá số lần nhập sai mã PIN)';
                break;
            case '11':
                displayMessage += ' (Giao dịch đã hết hạn chờ thanh toán)';
                break;
            case '12':
                displayMessage += ' (Thẻ/Tài khoản bị khóa)';
                break;
            case '13':
                displayMessage += ' (Sai mã OTP)';
                break;
            case '51':
                displayMessage += ' (Tài khoản không đủ số dư)';
                break;
            case '65':
                displayMessage += ' (Quá hạn mức giao dịch trong ngày)';
                break;
            case '75':
                displayMessage += ' (Ngân hàng thanh toán đang bảo trì)';
                break;
            case '79':
                displayMessage += ' (Quá số lần nhập sai mật khẩu)';
                break;
            default:
                displayMessage += ' (Lỗi không xác định từ VnPay)';
        }
    } else if (error) {
        switch (error) {
            case 'MissingOrderId':
                displayMessage = 'Không tìm thấy mã đơn hàng trong phản hồi.';
                break;
            case 'InvalidOrderId':
                displayMessage = 'Mã đơn hàng không hợp lệ.';
                break;
            case 'OrderNotFound':
                displayMessage = 'Không tìm thấy đơn hàng trong hệ thống.';
                break;
            case 'InvalidSignature':
                displayMessage = 'Chữ ký không hợp lệ. Giao dịch không được xác thực.';
                break;
            case 'MissingSignature':
                displayMessage = 'Phản hồi không chứa chữ ký xác thực.';
                break;
            default:
                displayMessage = `Lỗi: ${error}`;
        }
    }

    const handleBackToDetails = () => {
        navigate(`/`);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md text-center">
                <FaExclamationCircle className="h-16 w-16 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Thanh toán thất bại</h2>
                <p className="text-gray-600 mt-2">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-medium">Thông báo: <span className="font-semibold text-gray-900">{displayMessage}</span></p>
                </div>
                <button
                    onClick={handleBackToDetails}
                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure;